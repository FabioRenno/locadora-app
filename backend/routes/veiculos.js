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

const router = express.Router();

// GET /api/veiculos - Lista todos os veículos (visível para todos)
router.get('/', (req, res) => {
  try {
    const { db } = getDb();
    const stmt = db.prepare(`
      SELECT v.*, l.razao_social as locador_nome
      FROM veiculos v
      JOIN locadores l ON v.locador_id = l.id
      ORDER BY v.criado_em DESC
    `);
    const veiculos = [];
    while (stmt.step()) {
      veiculos.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(veiculos);
  } catch (err) {
    console.error('Erro ao listar veículos:', err);
    res.status(500).json({ erro: 'Erro ao listar veículos.' });
  }
});

// GET /api/veiculos/meus - Lista veículos do locador logado (exige login)
router.get('/meus', requerLocadorLogado, (req, res) => {
  try {
    const { db } = getDb();
    const locadorId = req.session.locadorId;
    const stmt = db.prepare(
      'SELECT * FROM veiculos WHERE locador_id = ? ORDER BY criado_em DESC'
    );
    stmt.bind([locadorId]);
    const veiculos = [];
    while (stmt.step()) {
      veiculos.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(veiculos);
  } catch (err) {
    console.error('Erro ao listar meus veículos:', err);
    res.status(500).json({ erro: 'Erro ao listar veículos.' });
  }
});

// GET /api/veiculos/:id - Detalhe de um veículo
router.get('/:id', (req, res) => {
  try {
    const { db } = getDb();
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }
    const stmt = db.prepare(`
      SELECT v.*, l.razao_social as locador_nome, l.whatsapp as locador_whatsapp
      FROM veiculos v
      JOIN locadores l ON v.locador_id = l.id
      WHERE v.id = ?
    `);
    stmt.bind([id]);
    if (!stmt.step()) {
      stmt.free();
      return res.status(404).json({ erro: 'Veículo não encontrado.' });
    }
    const veiculo = stmt.getAsObject();
    stmt.free();
    res.json(veiculo);
  } catch (err) {
    console.error('Erro ao buscar veículo:', err);
    res.status(500).json({ erro: 'Erro ao buscar veículo.' });
  }
});

// POST /api/veiculos - Adiciona veículo (somente locador logado)
router.post('/', requerLocadorLogado, (req, res) => {
  try {
    const { db, save } = getDb();
    const locadorId = req.session.locadorId;

    const {
      marca,
      modelo,
      ano,
      placa,
      cor,
      preco_diaria,
      preco_semanal,
      valor_caucao,
      responsabilidade_manutencao,
      local_retirada,
      foto_url,
      disponivel,
      observacoes
    } = req.body;

    if (
      !marca ||
      !modelo ||
      !ano ||
      !placa ||
      !cor ||
      !preco_semanal ||
      valor_caucao === undefined ||
      valor_caucao === '' ||
      !responsabilidade_manutencao ||
      !local_retirada
    ) {
      return res
        .status(400)
        .json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    const disponivelInt = disponivel === true || disponivel === '1' || disponivel === 'sim' ? 1 : 0;

    db.run(
      `INSERT INTO veiculos (
        locador_id, marca, modelo, ano, placa, cor,
        preco_diaria, preco_semanal, valor_caucao, responsabilidade_manutencao,
        local_retirada, foto_url, disponivel, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

    save();
    res.status(201).json({ sucesso: true, mensagem: 'Veículo cadastrado com sucesso.' });
  } catch (err) {
    console.error('Erro ao cadastrar veículo:', err);
    res.status(500).json({ erro: 'Erro ao cadastrar veículo.' });
  }
});

// PUT /api/veiculos/:id - Atualiza veículo (somente o dono)
router.put('/:id', requerLocadorLogado, (req, res) => {
  try {
    const { db, save } = getDb();
    const locadorId = req.session.locadorId;
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    // Verifica se o veículo pertence ao locador
    const check = db.prepare('SELECT id FROM veiculos WHERE id = ? AND locador_id = ?');
    check.bind([id, locadorId]);
    if (!check.step()) {
      check.free();
      return res.status(404).json({ erro: 'Veículo não encontrado ou você não tem permissão.' });
    }
    check.free();

    const {
      marca,
      modelo,
      ano,
      placa,
      cor,
      preco_diaria,
      preco_semanal,
      valor_caucao,
      responsabilidade_manutencao,
      local_retirada,
      foto_url,
      disponivel,
      observacoes
    } = req.body;

    if (
      !marca ||
      !modelo ||
      !ano ||
      !placa ||
      !cor ||
      !preco_semanal ||
      valor_caucao === undefined ||
      valor_caucao === '' ||
      !responsabilidade_manutencao ||
      !local_retirada
    ) {
      return res
        .status(400)
        .json({ erro: 'Preencha todos os campos obrigatórios.' });
    }

    const disponivelInt = disponivel === true || disponivel === '1' || disponivel === 'sim' ? 1 : 0;

    db.run(
      `UPDATE veiculos SET
        marca = ?, modelo = ?, ano = ?, placa = ?, cor = ?,
        preco_diaria = ?, preco_semanal = ?, valor_caucao = ?,
        responsabilidade_manutencao = ?, local_retirada = ?,
        foto_url = ?, disponivel = ?, observacoes = ?
      WHERE id = ? AND locador_id = ?`,
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

    save();
    res.json({ sucesso: true, mensagem: 'Veículo atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar veículo:', err);
    res.status(500).json({ erro: 'Erro ao atualizar veículo.' });
  }
});

// DELETE /api/veiculos/:id - Remove veículo (somente o dono)
router.delete('/:id', requerLocadorLogado, (req, res) => {
  try {
    const { db, save } = getDb();
    const locadorId = req.session.locadorId;
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    db.run('DELETE FROM veiculos WHERE id = ? AND locador_id = ?', [id, locadorId]);

    if (db.getRowsModified() === 0) {
      return res.status(404).json({ erro: 'Veículo não encontrado ou você não tem permissão.' });
    }

    save();
    res.json({ sucesso: true, mensagem: 'Veículo removido com sucesso.' });
  } catch (err) {
    console.error('Erro ao remover veículo:', err);
    res.status(500).json({ erro: 'Erro ao remover veículo.' });
  }
});

module.exports = router;
