/**
 * Rotas relacionadas a locadores
 *
 * POST /api/locadores - Recebe o formulário e salva no banco
 */

const express = require('express');
const crypto = require('crypto');
const { getDb } = require('../db');
const { validarEmail, validarPlaca, validarTelefone } = require('../utils/validacoes');

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

// Dados do locador logado
router.get('/me', async (req, res) => {
  try {
    if (!req.session || !req.session.locadorId) {
      return res.status(401).json({ sucesso: false, erro: 'Não autorizado.' });
    }
    const { pool } = getDb();
    const result = await pool.query(
      `SELECT razao_social, nome_fantasia, cnpj, email, telefone, whatsapp,
              endereco, cidade, estado, cep, area_atuacao, horario_atendimento
       FROM locadores
       WHERE id = $1 AND ativo = 1`,
      [req.session.locadorId]
    );
    const locador = result.rows[0] || null;
    if (!locador) {
      return res.status(404).json({ sucesso: false, erro: 'Locador não encontrado.' });
    }
    res.json({ sucesso: true, dados: locador });
  } catch (err) {
    console.error('Erro ao buscar dados do locador:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao carregar dados. Tente novamente.' });
  }
});

// Atualizar dados básicos do locador logado
router.put('/me', async (req, res) => {
  try {
    if (!req.session || !req.session.locadorId) {
      return res.status(401).json({ sucesso: false, erro: 'Não autorizado.' });
    }
    const {
      razao_social,
      nome_fantasia,
      email,
      telefone,
      whatsapp,
      endereco,
      cidade,
      estado,
      cep,
      area_atuacao,
      horario_atendimento
    } = req.body;

    if (!razao_social || !email || !telefone || !whatsapp || !endereco || !cidade || !estado || !cep) {
      return res.status(400).json({ sucesso: false, erro: 'Preencha todos os campos obrigatórios.' });
    }

    if (!validarEmail(email)) {
      return res.status(400).json({ sucesso: false, erro: 'E-mail inválido.' });
    }
    if (!validarTelefone(telefone) || !validarTelefone(whatsapp)) {
      return res.status(400).json({ sucesso: false, erro: 'Telefone ou WhatsApp inválido.' });
    }

    const { pool } = getDb();
    await pool.query(
      `UPDATE locadores
       SET razao_social = $1,
           nome_fantasia = $2,
           email = $3,
           telefone = $4,
           whatsapp = $5,
           endereco = $6,
           cidade = $7,
           estado = $8,
           cep = $9,
           area_atuacao = $10,
           horario_atendimento = $11
       WHERE id = $12 AND ativo = 1`,
      [
        razao_social,
        nome_fantasia || null,
        email,
        telefone,
        whatsapp,
        endereco,
        cidade,
        estado.toUpperCase(),
        cep.replace(/\D/g, ''),
        area_atuacao || null,
        horario_atendimento || null,
        req.session.locadorId
      ]
    );

    // Atualiza nome em sessão para saudação
    req.session.locadorNome = razao_social;

    res.json({ sucesso: true, mensagem: 'Cadastro atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar locador:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar cadastro. Tente novamente.' });
  }
});

// "Excluir" conta do locador logado (soft delete)
router.delete('/me', async (req, res) => {
  try {
    if (!req.session || !req.session.locadorId) {
      return res.status(401).json({ sucesso: false, erro: 'Não autorizado.' });
    }
    const { pool } = getDb();

    const locadorId = req.session.locadorId;

    // Marca locador como inativo
    await pool.query('UPDATE locadores SET ativo = 0 WHERE id = $1', [locadorId]);
    // Deixa veículos indisponíveis
    await pool.query('UPDATE veiculos SET disponivel = 0 WHERE locador_id = $1', [locadorId]);

    req.session.destroy(() => {
      res.json({ sucesso: true, mensagem: 'Sua conta foi desativada. Obrigado por ter utilizado o Locadora App.' });
    });
  } catch (err) {
    console.error('Erro ao desativar conta de locador:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao excluir conta. Tente novamente.' });
  }
});

module.exports = router;
