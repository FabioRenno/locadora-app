/**
 * Rotas relacionadas a locadores
 *
 * POST /api/locadores - Recebe o formulário e salva no banco
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

const { validarEmail, validarPlaca } = require('../utils/validacoes');

router.post('/', async (req, res) => {
  try {
    const { pool } = getDb();
    const {
      razao_social,
      nome_fantasia,
      cnpj,
      email,
      telefone,
      whatsapp,
      endereco,
      cidade,
      estado,
      cep,
      area_atuacao,
      horario_atendimento,
      senha,
      placa // Adicionando campo placa caso exista na requisição
    } = req.body;

    // Checa campos obrigatórios (adicionando placa caso seja obrigatória)
    if (!razao_social || !cnpj || !email || !telefone || !whatsapp || !endereco || !cidade || !estado || !cep || !senha /*|| !placa*/) {
      return res.status(400).send('Preencha todos os campos obrigatórios.');
    }

    // Validação de e-mail
    if (!validarEmail(email)) {
      return res.status(400).json({ sucesso: false, erro: 'E-mail inválido.' });
    }

    // Validação de placa, se campo existir na requisição (modifique a obrigatoriedade conforme necessário)
    if (placa && !validarPlaca(placa)) {
      return res.status(400).send('Placa inválida.');
  }

    const senha_hash = hashSenha(senha);
    await pool.query(
      `INSERT INTO locadores (
        razao_social, nome_fantasia, cnpj, email, telefone, whatsapp,
        endereco, cidade, estado, cep, area_atuacao, horario_atendimento, senha_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        razao_social,
        nome_fantasia || null,
        cnpj.replace(/\D/g, ''),
        email,
        telefone,
        whatsapp,
        endereco,
        cidade,
        estado.toUpperCase(),
        cep.replace(/\D/g, ''),
        area_atuacao || null,
        horario_atendimento || null,
        senha_hash
      ]
    );

    res.redirect('/?cadastro=ok');
  } catch (err) {
    if (err.code === '23505') {
      return res.status(201).json({ sucesso: true, mensagem: 'Cadastro realizado com sucesso!' });
    }
    console.error('Erro ao cadastrar locador:', err);
    res.status(500).send('Erro ao cadastrar. Tente novamente.');
  }
});

module.exports = router;
