/**
 * Rotas relacionadas a locadores
 * 
 * POST /api/locadores - Recebe o formulário e salva no banco
 */

const express = require('express');
const crypto = require('crypto');
const { getDb } = require('../db');

const router = express.Router();

/**
 * Gera um hash da senha usando crypto (módulo nativo do Node).
 * NUNCA guardamos senha em texto puro no banco.
 */
function hashSenha(senha) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(senha, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// POST /api/locadores - Cadastra um novo locador
router.post('/', (req, res) => {
  try {
    const { db, save } = getDb();

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
      senha
    } = req.body;

    // Validação básica dos campos obrigatórios
    if (!razao_social || !cnpj || !email || !telefone || !whatsapp || !endereco || !cidade || !estado || !cep || !senha) {
      return res.status(400).send('Preencha todos os campos obrigatórios.');
    }

    const senha_hash = hashSenha(senha);

    db.run(
      `INSERT INTO locadores (
        razao_social, nome_fantasia, cnpj, email, telefone, whatsapp,
        endereco, cidade, estado, cep, area_atuacao, horario_atendimento, senha_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        razao_social,
        nome_fantasia || null,
        cnpj.replace(/\D/g, ''), // Remove caracteres não numéricos
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

    save(); // Salva o banco em arquivo

    // Redireciona para a página inicial com mensagem de sucesso
    res.redirect('/?cadastro=ok');
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(400).send('Este CNPJ ou e-mail já está cadastrado.');
    }
    console.error('Erro ao cadastrar locador:', err);
    res.status(500).send('Erro ao cadastrar. Tente novamente.');
  }
});

module.exports = router;
