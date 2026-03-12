/**
 * Rotas relacionadas a motoristas
 * POST /api/motoristas - Recebe o formulário e salva no banco
 */

const express = require('express');
const crypto = require('crypto');
const { getDb } = require('../db');

const router = express.Router();

function hashSenha(senha) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(senha, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

router.post('/', async (req, res) => {
  try {
    const { pool } = getDb();
    const {
      nome_completo, cpf, rg, data_nascimento, email, telefone, whatsapp,
      numero_cnh, categoria_cnh, ear, validade_cnh, cidade, estado,
      endereco, cep, apps_que_usa, senha
    } = req.body;

    if (!nome_completo || !cpf || !rg || !data_nascimento || !email || !telefone || !whatsapp ||
        !numero_cnh || !categoria_cnh || !validade_cnh || !cidade || !estado || !senha) {
      return res.status(400).send('Preencha todos os campos obrigatórios.');
    }

    const senha_hash = hashSenha(senha);
    const earValue = (ear === 'sim' || ear === '1') ? 1 : 0;

    await pool.query(
      `INSERT INTO motoristas (
        nome_completo, cpf, rg, data_nascimento, email, telefone, whatsapp,
        numero_cnh, categoria_cnh, ear, validade_cnh, cidade, estado,
        endereco, cep, apps_que_usa, senha_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
      [
        nome_completo,
        cpf.replace(/\D/g, ''),
        rg,
        data_nascimento,
        email,
        telefone,
        whatsapp,
        numero_cnh,
        categoria_cnh,
        earValue,
        validade_cnh,
        cidade,
        estado.toUpperCase(),
        endereco || null,
        cep ? cep.replace(/\D/g, '') : null,
        apps_que_usa || null,
        senha_hash
      ]
    );

    res.redirect('/?cadastro=motorista');
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).send('Este CPF ou e-mail já está cadastrado.');
    }
    console.error('Erro ao cadastrar motorista:', err);
    res.status(500).send('Erro ao cadastrar. Tente novamente.');
  }
});

module.exports = router;
