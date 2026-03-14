/**
 * Rotas relacionadas a veículos
 *
 * GET  /api/veiculos      - Lista todos os veículos (público)
 * GET  /api/veiculos/meus - Lista veículos do locador logado
 * POST /api/veiculos      - Adiciona veículo (locador logado)
 * PUT  /api/veiculos/:id  - Atualiza veículo (dono)
 * DELETE /api/veiculos/:id - Remove veículo (dono)
 */

const express = require('express');
const { getDb } = require('../db');
const { requerLocadorLogado } = require('./auth');
const { validarPlaca, contemApenasNumeros, textoValido } = require('../utils/validacoes');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { pool } = getDb();
    const result = await pool.query(`
      SELECT v.*, l.razao_social as locador_nome
      FROM veiculos v
      JOIN locadores l ON v.locador_id = l.id
      ORDER BY v.criado_em DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar veículos:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar veículos.' });
  }
});

router.get('/meus', requerLocadorLogado, async (req, res) => {
  try {
    const { pool } = getDb();
    const locadorId = req.session.locadorId;
    const result = await pool.query(
      'SELECT * FROM veiculos WHERE locador_id = $1 ORDER BY criado_em DESC',
      [locadorId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar meus veículos:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao listar veículos.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { pool } = getDb();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ sucesso: false, erro: 'ID inválido.' });
    }
    const result = await pool.query(
      `SELECT v.*, l.razao_social as locador_nome, l.whatsapp as locador_whatsapp
       FROM veiculos v
       JOIN locadores l ON v.locador_id = l.id
       WHERE v.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Veículo não encontrado.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar veículo:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao buscar veículo.' });
  }
});

router.post('/', requerLocadorLogado, async (req, res) => {
  try {
    const { pool } = getDb();
    const locadorId = req.session.locadorId;
    const {
      marca, modelo, ano, placa, cor,
      preco_diaria, preco_semanal, valor_caucao,
      responsabilidade_manutencao, local_retirada,
      foto_url, disponivel, observacoes
    } = req.body;

    if (
      !textoValido(marca) || !textoValido(modelo) || !ano || !textoValido(placa) || !textoValido(cor) ||
      preco_semanal === undefined || preco_semanal === '' || valor_caucao === undefined || valor_caucao === '' ||
      !textoValido(responsabilidade_manutencao) || !textoValido(local_retirada)
    ) {
      return res.status(400).json({ sucesso: false, erro: 'Preencha todos os campos obrigatórios.' });
    }

    if (!validarPlaca(placa)) return res.status(400).json({ sucesso: false, erro: 'Placa inválida.' });
    if (!contemApenasNumeros(ano)) return res.status(400).json({ sucesso: false, erro: 'Ano inválido.' });

    const disponivelInt = disponivel === true || disponivel === '1' || disponivel === 'sim' ? 1 : 0;

    await pool.query(
      `INSERT INTO veiculos (
        locador_id, marca, modelo, ano, placa, cor,
        preco_diaria, preco_semanal, valor_caucao, responsabilidade_manutencao,
        local_retirada, foto_url, disponivel, observacoes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        locadorId,
        marca.trim(),
        modelo.trim(),
        parseInt(ano, 10),
        placa.trim().toUpperCase(),
        cor.trim(),
        preco_diaria ? parseFloat(preco_diaria) : null,
        parseFloat(preco_semanal),
        parseFloat(valor_caucao),
        responsabilidade_manutencao,
        local_retirada.trim(),
        foto_url ? foto_url.trim() : null,
        disponivelInt,
        observacoes ? observacoes.trim() : null
      ]
    );

    res.status(201).json({ sucesso: true, mensagem: 'Veículo cadastrado com sucesso.' });
  } catch (err) {
    console.error('Erro ao cadastrar veículo:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao cadastrar veículo.' });
  }
});

router.put('/:id', requerLocadorLogado, async (req, res) => {
  try {
    const { pool } = getDb();
    const locadorId = req.session.locadorId;
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ sucesso: false, erro: 'ID inválido.' });
    }

    const checkResult = await pool.query(
      'SELECT id FROM veiculos WHERE id = $1 AND locador_id = $2',
      [id, locadorId]
    );
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Veículo não encontrado ou você não tem permissão.' });
    }

    const {
      marca, modelo, ano, placa, cor,
      preco_diaria, preco_semanal, valor_caucao,
      responsabilidade_manutencao, local_retirada,
      foto_url, disponivel, observacoes
    } = req.body;

    if (
      !textoValido(marca) || !textoValido(modelo) || !ano || !textoValido(placa) || !textoValido(cor) ||
      preco_semanal === undefined || preco_semanal === '' || valor_caucao === undefined || valor_caucao === '' ||
      !textoValido(responsabilidade_manutencao) || !textoValido(local_retirada)
    ) {
      return res.status(400).json({ sucesso: false, erro: 'Preencha todos os campos obrigatórios.' });
    }

    if (!validarPlaca(placa)) return res.status(400).json({ sucesso: false, erro: 'Placa inválida.' });
    if (!contemApenasNumeros(ano)) return res.status(400).json({ sucesso: false, erro: 'Ano inválido.' });

    const disponivelInt = disponivel === true || disponivel === '1' || disponivel === 'sim' ? 1 : 0;

    await pool.query(
      `UPDATE veiculos SET
        marca = $1, modelo = $2, ano = $3, placa = $4, cor = $5,
        preco_diaria = $6, preco_semanal = $7, valor_caucao = $8,
        responsabilidade_manutencao = $9, local_retirada = $10,
        foto_url = $11, disponivel = $12, observacoes = $13
      WHERE id = $14 AND locador_id = $15`,
      [
        marca.trim(),
        modelo.trim(),
        parseInt(ano, 10),
        placa.trim().toUpperCase(),
        cor.trim(),
        preco_diaria ? parseFloat(preco_diaria) : null,
        parseFloat(preco_semanal),
        parseFloat(valor_caucao),
        responsabilidade_manutencao,
        local_retirada.trim(),
        foto_url ? foto_url.trim() : null,
        disponivelInt,
        observacoes ? observacoes.trim() : null,
        id,
        locadorId
      ]
    );

    res.json({ sucesso: true, mensagem: 'Veículo atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar veículo:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar veículo.' });
  }
});

router.delete('/:id', requerLocadorLogado, async (req, res) => {
  try {
    const { pool } = getDb();
    const locadorId = req.session.locadorId;
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ sucesso: false, erro: 'ID inválido.' });
    }

    const result = await pool.query(
      'DELETE FROM veiculos WHERE id = $1 AND locador_id = $2',
      [id, locadorId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ sucesso: false, erro: 'Veículo não encontrado ou você não tem permissão.' });
    }

    res.json({ sucesso: true, mensagem: 'Veículo removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover veículo:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao remover veículo.' });
  }
});

module.exports = router;
