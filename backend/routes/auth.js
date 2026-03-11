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

module.exports = router;
module.exports.requerLocadorLogado = requerLocadorLogado;
