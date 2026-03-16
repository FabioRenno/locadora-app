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
const { validarEmail, validarSenha } = require('../utils/validacoes');

const router = express.Router();
const frontendPath = path.join(__dirname, '..', '..', 'frontend');

function verificarSenha(senhaDigitada, senhaHashArmazenada) {
  const [salt, hash] = senhaHashArmazenada.split(':');
  const hashCalculado = crypto.pbkdf2Sync(senhaDigitada, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashCalculado;
}

function requerLocadorLogado(req, res, next) {
  if (req.session && req.session.locadorId) {
    next();
  } else {
    res.redirect('/login-locador?erro=entrar');
  }
}

router.get('/login-locador', (req, res) => {
  if (req.session && req.session.locadorId) {
    return res.redirect('/painel-locador');
  }
  res.sendFile(path.join(frontendPath, 'login-locador.html'));
});

router.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!validarEmail(email) || !senha) {
      return res.status(400).json({ sucesso: false, erro: 'Preencha um e-mail válido e a senha.' });
    }

    const { pool } = getDb();
    const result = await pool.query(
      'SELECT id, razao_social, senha_hash FROM locadores WHERE email = $1 AND ativo = 1',
      [email.trim()]
    );
    const locador = result.rows[0] || null;

    if (!locador || !verificarSenha(senha, locador.senha_hash)) {
      return res.status(401).json({ sucesso: false, erro: 'E-mail ou senha incorretos. Tente novamente.' });
    }

    req.session.locadorId = locador.id;
    req.session.locadorNome = locador.razao_social;
    res.json({ sucesso: true, redirecionar: '/painel-locador' });
  } catch (err) {
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro no servidor. Tente novamente mais tarde.' });
  }
});

router.get('/api/session', (req, res) => {
  if (req.session && req.session.motoristaId) {
    return res.json({ logado: true, tipo: 'motorista', nome: req.session.motoristaNome || 'Motorista' });
  }
  if (req.session && req.session.locadorId) {
    return res.json({ logado: true, tipo: 'locador', nome: req.session.locadorNome || 'Locador' });
  }
  res.json({ logado: false, tipo: null, nome: null });
});

router.get('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

router.get('/painel-locador', requerLocadorLogado, (req, res) => {
  res.sendFile(path.join(frontendPath, 'painel-locador.html'));
});

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

router.post('/api/login-motorista', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!validarEmail(email) || !senha) {
      return res.status(400).json({ sucesso: false, erro: 'Preencha um e-mail válido e a senha.' });
    }

    const { pool } = getDb();
    const result = await pool.query(
      'SELECT id, nome_completo, senha_hash FROM motoristas WHERE email = $1 AND ativo = 1',
      [email.trim()]
    );
    const motorista = result.rows[0] || null;

    if (!motorista || !verificarSenha(senha, motorista.senha_hash)) {
      return res.status(401).json({ sucesso: false, erro: 'E-mail ou senha incorretos. Tente novamente.' });
    }

    req.session.motoristaId = motorista.id;
    req.session.motoristaNome = motorista.nome_completo;
    res.json({ sucesso: true, redirecionar: '/painel-motorista' });
  } catch (err) {
    console.error('Erro ao fazer login motorista:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro no servidor. Tente novamente mais tarde.' });
  }
});

router.get('/painel-motorista', requerMotoristaLogado, (req, res) => {
  res.sendFile(path.join(frontendPath, 'painel-motorista.html'));
});

function hashSenha(senha) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(senha, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

router.post('/api/recuperar-senha', async (req, res) => {
  try {
    const { email, tipo } = req.body;
    if (!validarEmail(email) || !tipo) {
      return res.status(400).json({ ok: false, erro: 'E-mail válido e tipo são obrigatórios.' });
    }
    if (tipo !== 'locador' && tipo !== 'motorista') {
      return res.status(400).json({ ok: false, erro: 'Tipo inválido.' });
    }

    const { pool } = getDb();
    const table = tipo === 'locador' ? 'locadores' : 'motoristas';
    const checkResult = await pool.query(`SELECT id FROM ${table} WHERE email = $1`, [email.trim()]);

    if (checkResult.rows.length === 0) {
      return res.json({ ok: true, mensagem: 'Se o e-mail estiver cadastrado, você receberá um link.' });
    }

    const host = process.env.EMAIL_HOST;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!host || !user || !pass) {
      return res.status(503).json({ ok: false, erro: 'Recuperação por e-mail não configurada. Entre em contato com o suporte.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiraEm = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 horas

    await pool.query(
      'INSERT INTO tokens_recuperacao (email, token, tipo, expira_em) VALUES ($1, $2, $3, $4)',
      [email.trim(), token, tipo, expiraEm]
    );

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

router.post('/api/redefinir-senha', async (req, res) => {
  try {
    const { token, nova_senha } = req.body;
    if (!token || !validarSenha(nova_senha)) {
      return res.status(400).json({ ok: false, erro: 'Token e nova senha (mínimo 6 caracteres) são obrigatórios.' });
    }

    const { pool } = getDb();
    const result = await pool.query(
      `SELECT id, email, tipo, usado FROM tokens_recuperacao
       WHERE token = $1 AND usado = 0 AND expira_em > NOW()`,
      [token]
    );
    const row = result.rows[0] || null;

    if (!row) {
      return res.status(400).json({ ok: false, erro: 'Link inválido ou expirado. Solicite uma nova recuperação de senha.' });
    }

    const senhaHash = hashSenha(nova_senha);
    const table = row.tipo === 'locador' ? 'locadores' : 'motoristas';

    await pool.query(`UPDATE ${table} SET senha_hash = $1 WHERE email = $2`, [senhaHash, row.email]);
    await pool.query('UPDATE tokens_recuperacao SET usado = 1 WHERE token = $1', [token]);

    res.json({ ok: true, mensagem: 'Senha alterada com sucesso.' });
  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ ok: false, erro: 'Erro ao processar. Tente novamente.' });
  }
});

module.exports = router;
module.exports.requerLocadorLogado = requerLocadorLogado;
module.exports.requerMotoristaLogado = requerMotoristaLogado;
