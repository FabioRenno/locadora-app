/**
 * Rotas relacionadas a motoristas
 * POST /api/motoristas - Recebe o formulário e salva no banco
 */

const express = require('express');
const crypto = require('crypto');
const { getDb } = require('../db');
const { 
  validarEmail, validarTelefone, validarCpfBasico, 
  limparNaoNumeros, textoValido, validarSenha 
} = require('../utils/validacoes');

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

    if (!textoValido(nome_completo) || !cpf || !textoValido(rg) || !data_nascimento || !email || !telefone || !whatsapp ||
        !textoValido(numero_cnh) || !textoValido(categoria_cnh) || !validade_cnh || !textoValido(cidade) || !textoValido(estado) || !senha) {
      return res.status(400).json({ sucesso: false, erro: 'Preencha todos os campos obrigatórios.' });
    }

    if (!validarEmail(email)) return res.status(400).json({ sucesso: false, erro: 'E-mail inválido.' });
    if (!validarCpfBasico(cpf)) return res.status(400).json({ sucesso: false, erro: 'CPF inválido.' });
    if (!validarTelefone(telefone)) return res.status(400).json({ sucesso: false, erro: 'Telefone inválido.' });
    if (!validarTelefone(whatsapp)) return res.status(400).json({ sucesso: false, erro: 'WhatsApp inválido.' });
    if (!validarSenha(senha)) return res.status(400).json({ sucesso: false, erro: 'A senha deve ter pelo menos 6 caracteres.' });

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
        limparNaoNumeros(cpf),
        rg,
        data_nascimento,
        email,
        limparNaoNumeros(telefone),
        limparNaoNumeros(whatsapp),
        numero_cnh,
        categoria_cnh,
        earValue,
        validade_cnh,
        cidade,
        estado.toUpperCase(),
        endereco || null,
        cep ? limparNaoNumeros(cep) : null,
        apps_que_usa || null,
        senha_hash
      ]
    );

    res.status(201).json({ sucesso: true, mensagem: 'Motorista cadastrado com sucesso.' });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ sucesso: false, erro: 'Este CPF ou e-mail já está cadastrado.' });
    }
    console.error('Erro ao cadastrar motorista:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao cadastrar. Tente novamente.' });
  }
});

module.exports = router;
