/**
 * Rotas de autenticação (login, logout)
 * 
 * O locador faz login com e-mail e senha.
 * Usamos sessão para "lembrar" que ele está logado.
 */

const express = require('express');
const crypto = require('crypto');
const path = require('path');
const { getDb } = require('../db');
const { enviarEmailRecuperacao } = require('../email');

const router = express.Router();
const frontendPath = path.join(__dirname, '..', '..', 'frontend');

/**
 * Verifica se a senha informada corresponde ao hash armazenado
 */
function verificarSenha(senhaDigitada, senhaHashArmazenada) {
  const [salt, hash] = senhaHashArmazenada.split(':');
  const hashCalculado = crypto.pbkdf2Sync(senhaDigitada, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashCalculado;
}

/**
 * Middleware: exige que o locador esteja logado.
 * Se não estiver, redireciona para a página de login.
 */
function requerLocadorLogado(req, res, next) {
  if (req.session && req.session.locadorId) {
    next();
  } else {
    res.redirect('/login-locador?erro=entrar');
  }
}

// GET /login-locador - Exibe a página de login (ou redireciona se já logado)
router.get('/login-locador', (req, res) => {
  if (req.session && req.session.locadorId) {
    return res.redirect('/painel-locador');
  }
  res.sendFile(path.join(frontendPath, 'login-locador.html'));
});

// POST /api/login - Login do locador
router.post('/api/login', (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.redirect('/login-locador?erro=campos');
    }

    const { db } = getDb();
    const stmt = db.prepare('SELECT id, razao_social, senha_hash FROM locadores WHERE email = ?');
    stmt.bind([email.trim()]);

    let locador = null;
    if (stmt.step()) {
      locador = stmt.getAsObject();
    }
    stmt.free();

    if (!locador || !verificarSenha(senha, locador.senha_hash)) {
      return res.redirect('/login-locador?erro=credenciais');
    }

    req.session.locadorId = locador.id;
    req.session.locadorNome = locador.razao_social;

    res.redirect('/painel-locador');
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.redirect('/login-locador?erro=servidor');
  }
});

// GET /api/session - Retorna o tipo e nome do usuário logado (para o frontend exibir)
router.get('/api/session', (req, res) => {
  if (req.session && req.session.motoristaId) {
    return res.json({ logado: true, tipo: 'motorista', nome: req.session.motoristaNome || 'Motorista' });
  }
  if (req.session && req.session.locadorId) {
    return res.json({ logado: true, tipo: 'locador', nome: req.session.locadorNome || 'Locador' });
  }
  res.json({ logado: false, tipo: null, nome: null });
});

// GET /api/logout - Encerra a sessão
router.get('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// GET /painel-locador - Painel do locador (área restrita)
router.get('/painel-locador', requerLocadorLogado, (req, res) => {
  res.sendFile(path.join(frontendPath, 'painel-locador.html'));
});

/** Motorista */
function requerMotoristaLogado(req, res, next) {
  if (req.session && req.session.motoristaId) {
    next();
  } else {
    res.redirect('/login-motorista?erro=entrar');
  }
}

router.get('/login-motorista', (req, res) => {
  if (req.session && req.session.motoristaId) {
    return res.redirect('/painel-motorista');
  }
  res.sendFile(path.join(frontendPath, 'login-motorista.html'));
});

router.post('/api/login-motorista', (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.redirect('/login-motorista?erro=campos');
    }

    const { db } = getDb();
    const stmt = db.prepare('SELECT id, nome_completo, senha_hash FROM motoristas WHERE email = ?');
    stmt.bind([email.trim()]);

    let motorista = null;
    if (stmt.step()) motorista = stmt.getAsObject();
    stmt.free();

    if (!motorista || !verificarSenha(senha, motorista.senha_hash)) {
      return res.redirect('/login-motorista?erro=credenciais');
    }

    req.session.motoristaId = motorista.id;
    req.session.motoristaNome = motorista.nome_completo;

    res.redirect('/painel-motorista');
  } catch (err) {
    console.error('Erro ao fazer login motorista:', err);
    res.redirect('/login-motorista?erro=servidor');
  }
});

router.get('/painel-motorista', requerMotoristaLogado, (req, res) => {
  res.sendFile(path.join(frontendPath, 'painel-motorista.html'));
});

/** Recuperação de senha */
function hashSenha(senha) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(senha, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// POST /api/recuperar-senha - Solicita link de recuperação
router.post('/api/recuperar-senha', async (req, res) => {
  try {
    const { email, tipo } = req.body;
    if (!email || !tipo) {
      return res.status(400).json({ ok: false, erro: 'E-mail e tipo são obrigatórios.' });
    }
    if (tipo !== 'locador' && tipo !== 'motorista') {
      return res.status(400).json({ ok: false, erro: 'Tipo inválido.' });
    }

    const { db, save } = getDb();
    const table = tipo === 'locador' ? 'locadores' : 'motoristas';
    const stmt = db.prepare(`SELECT id FROM ${table} WHERE email = ?`);
    stmt.bind([email.trim()]);
    const existe = stmt.step();
    stmt.free();

    if (!existe) {
      // Mensagem neutra por segurança
      return res.json({ ok: true, mensagem: 'Se o e-mail estiver cadastrado, você receberá um link.' });
    }

    const host = process.env.EMAIL_HOST;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!host || !user || !pass) {
      return res.status(503).json({ ok: false, erro: 'Recuperação por e-mail não configurada. Entre em contato com o suporte.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiraEm = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 horas

    db.run(
      'INSERT INTO tokens_recuperacao (email, token, tipo, expira_em) VALUES (?, ?, ?, ?)',
      [email.trim(), token, tipo, expiraEm]
    );
    save();

    const enviou = await enviarEmailRecuperacao(email.trim(), token, tipo);
    if (!enviou) {
      return res.status(503).json({ ok: false, erro: 'Não foi possível enviar o e-mail. Tente novamente mais tarde.' });
    }

    res.json({ ok: true, mensagem: 'Se o e-mail estiver cadastrado, você receberá um link.' });
  } catch (err) {
    console.error('Erro ao recuperar senha:', err);
    res.status(500).json({ ok: false, erro: 'Erro ao processar. Tente novamente.' });
  }
});

// POST /api/redefinir-senha - Redefine a senha com o token
router.post('/api/redefinir-senha', (req, res) => {
  try {
    const { token, nova_senha } = req.body;
    if (!token || !nova_senha) {
      return res.status(400).json({ ok: false, erro: 'Token e nova senha são obrigatórios.' });
    }
    if (nova_senha.length < 6) {
      return res.status(400).json({ ok: false, erro: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const { db, save } = getDb();

    const stmt = db.prepare(`
      SELECT id, email, tipo, usado FROM tokens_recuperacao
      WHERE token = ? AND usado = 0 AND expira_em > datetime('now')
    `);
    stmt.bind([token]);
    let row = null;
    if (stmt.step()) row = stmt.getAsObject();
    stmt.free();

    if (!row) {
      return res.status(400).json({ ok: false, erro: 'Link inválido ou expirado. Solicite uma nova recuperação de senha.' });
    }

    const senhaHash = hashSenha(nova_senha);
    const table = row.tipo === 'locador' ? 'locadores' : 'motoristas';

    db.run(`UPDATE ${table} SET senha_hash = ? WHERE email = ?`, [senhaHash, row.email]);
    db.run('UPDATE tokens_recuperacao SET usado = 1 WHERE token = ?', [token]);
    save();

    res.json({ ok: true, mensagem: 'Senha alterada com sucesso.' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ ok: false, erro: 'Erro ao processar. Tente novamente.' });
  }
});

module.exports = router;
module.exports.requerLocadorLogado = requerLocadorLogado;
module.exports.requerMotoristaLogado = requerMotoristaLogado;
