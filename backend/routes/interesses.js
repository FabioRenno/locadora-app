/**
 * Rotas de manifestação de interesse
 *
 * POST /api/interesses    - Motorista manifesta interesse (logado)
 * GET  /api/interesses    - Locador vê interesses dos seus veículos (logado)
 */

const express = require('express');
const { getDb } = require('../db');
const { requerLocadorLogado } = require('./auth');
const { enviarEmailInteresse, enviarEmailDesistencia } = require('../email');

const router = express.Router();

// Middleware: exige motorista logado
function requerMotoristaLogado(req, res, next) {
  if (req.session && req.session.motoristaId) {
    next();
  } else {
    res.status(401).json({ erro: 'Faça login como motorista para manifestar interesse.' });
  }
}

// POST /api/interesses - Motorista manifesta interesse em um veículo
router.post('/', requerMotoristaLogado, (req, res) => {
  try {
    const { db, save } = getDb();
    const motoristaId = req.session.motoristaId;
    const { veiculo_id } = req.body;

    if (!veiculo_id) {
      return res.status(400).json({ erro: 'Informe o veículo.' });
    }

    const veiculoId = parseInt(veiculo_id, 10);
    if (isNaN(veiculoId)) {
      return res.status(400).json({ erro: 'ID do veículo inválido.' });
    }

    // Verifica se o veículo existe
    const checkVeiculo = db.prepare('SELECT id FROM veiculos WHERE id = ?');
    checkVeiculo.bind([veiculoId]);
    if (!checkVeiculo.step()) {
      checkVeiculo.free();
      return res.status(404).json({ erro: 'Veículo não encontrado.' });
    }
    checkVeiculo.free();

    // Verifica se já manifestou interesse
    const checkDuplicado = db.prepare(
      'SELECT id FROM interesses WHERE motorista_id = ? AND veiculo_id = ?'
    );
    checkDuplicado.bind([motoristaId, veiculoId]);
    if (checkDuplicado.step()) {
      checkDuplicado.free();
      return res.status(400).json({ erro: 'Você já manifestou interesse neste veículo.' });
    }
    checkDuplicado.free();

    db.run(
      'INSERT INTO interesses (motorista_id, veiculo_id) VALUES (?, ?)',
      [motoristaId, veiculoId]
    );
    save();

    // Busca dados para notificar o locador por e-mail
    const infoStmt = db.prepare(`
      SELECT v.marca, v.modelo, v.placa, l.email as locador_email,
             m.nome_completo, m.whatsapp, m.email as motorista_email, m.cpf
      FROM veiculos v
      JOIN locadores l ON v.locador_id = l.id
      JOIN motoristas m ON m.id = ?
      WHERE v.id = ?
    `);
    infoStmt.bind([motoristaId, veiculoId]);
    let locadorEmail = null;
    let veiculoInfo = null;
    let motoristaInfo = null;
    if (infoStmt.step()) {
      const row = infoStmt.getAsObject();
      locadorEmail = row.locador_email;
      veiculoInfo = { marca: row.marca, modelo: row.modelo, placa: row.placa };
      motoristaInfo = {
        nome_completo: row.nome_completo,
        whatsapp: row.whatsapp,
        email: row.motorista_email,
        cpf: row.cpf
      };
    }
    infoStmt.free();

    if (locadorEmail && veiculoInfo && motoristaInfo) {
      enviarEmailInteresse(locadorEmail, { veiculo: veiculoInfo, motorista: motoristaInfo }).catch(() => {});
    }

    res.status(201).json({ sucesso: true, mensagem: 'Interesse registrado! O locador entrará em contato.' });
  } catch (err) {
    console.error('Erro ao registrar interesse:', err);
    res.status(500).json({ erro: 'Erro ao registrar interesse.' });
  }
});

// GET /api/interesses/meus - Motorista vê seus interesses
router.get('/meus', requerMotoristaLogado, (req, res) => {
  try {
    const { db } = getDb();
    const motoristaId = req.session.motoristaId;

    const stmt = db.prepare(`
      SELECT
        i.id,
        i.criado_em,
        v.id as veiculo_id,
        v.marca as veiculo_marca,
        v.modelo as veiculo_modelo,
        v.placa as veiculo_placa,
        v.ano as veiculo_ano,
        v.preco_semanal as veiculo_preco_semanal,
        l.razao_social as locador_nome,
        l.whatsapp as locador_whatsapp
      FROM interesses i
      JOIN veiculos v ON i.veiculo_id = v.id
      JOIN locadores l ON v.locador_id = l.id
      WHERE i.motorista_id = ?
      ORDER BY i.criado_em DESC
    `);
    stmt.bind([motoristaId]);

    const interesses = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      interesses.push({
        id: row.id,
        criado_em: row.criado_em,
        veiculo: {
          id: row.veiculo_id,
          marca: row.veiculo_marca,
          modelo: row.veiculo_modelo,
          placa: row.veiculo_placa,
          ano: row.veiculo_ano,
          preco_semanal: row.veiculo_preco_semanal
        },
        locador: {
          razao_social: row.locador_nome,
          whatsapp: row.locador_whatsapp
        }
      });
    }
    stmt.free();

    res.json(interesses);
  } catch (err) {
    console.error('Erro ao listar interesses do motorista:', err);
    res.status(500).json({ erro: 'Erro ao listar interesses.' });
  }
});

// DELETE /api/interesses/:id - Motorista desfaz interesse
router.delete('/:id', requerMotoristaLogado, async (req, res) => {
  try {
    const { db, save } = getDb();
    const motoristaId = req.session.motoristaId;
    const id = parseInt(req.params.id, 10);
    const { motivo } = req.body || {};

    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const checkStmt = db.prepare(`
      SELECT i.id, v.id as veiculo_id, v.marca, v.modelo, v.placa,
             l.email as locador_email, m.nome_completo as motorista_nome
      FROM interesses i
      JOIN veiculos v ON i.veiculo_id = v.id
      JOIN locadores l ON v.locador_id = l.id
      JOIN motoristas m ON i.motorista_id = m.id
      WHERE i.id = ? AND i.motorista_id = ?
    `);
    checkStmt.bind([id, motoristaId]);
    let row = null;
    if (checkStmt.step()) row = checkStmt.getAsObject();
    checkStmt.free();

    if (!row) {
      return res.status(404).json({ erro: 'Interesse não encontrado ou não pertence a você.' });
    }

    db.run('DELETE FROM interesses WHERE id = ? AND motorista_id = ?', [id, motoristaId]);
    save();

    const veiculoInfo = { marca: row.marca, modelo: row.modelo, placa: row.placa };
    const motoristaInfo = { nome_completo: row.motorista_nome };
    if (row.locador_email) {
      enviarEmailDesistencia(row.locador_email, {
        veiculo: veiculoInfo,
        motorista: motoristaInfo,
        motivo: motivo || 'outro'
      }).catch(() => {});
    }

    res.json({ sucesso: true, mensagem: 'Interesse removido.' });
  } catch (err) {
    console.error('Erro ao remover interesse:', err);
    res.status(500).json({ erro: 'Erro ao remover interesse.' });
  }
});

// GET /api/interesses - Locador vê interesses nos seus veículos
router.get('/', requerLocadorLogado, (req, res) => {
  try {
    const { db } = getDb();
    const locadorId = req.session.locadorId;

    const stmt = db.prepare(`
      SELECT
        i.id,
        i.criado_em,
        v.id as veiculo_id,
        v.marca as veiculo_marca,
        v.modelo as veiculo_modelo,
        v.placa as veiculo_placa,
        m.id as motorista_id,
        m.nome_completo as motorista_nome,
        m.cpf as motorista_cpf,
        m.rg as motorista_rg,
        m.data_nascimento as motorista_data_nascimento,
        m.email as motorista_email,
        m.telefone as motorista_telefone,
        m.whatsapp as motorista_whatsapp,
        m.numero_cnh as motorista_numero_cnh,
        m.categoria_cnh as motorista_categoria_cnh,
        m.validade_cnh as motorista_validade_cnh,
        m.cidade as motorista_cidade,
        m.estado as motorista_estado,
        m.endereco as motorista_endereco,
        m.cep as motorista_cep
      FROM interesses i
      JOIN veiculos v ON i.veiculo_id = v.id
      JOIN motoristas m ON i.motorista_id = m.id
      WHERE v.locador_id = ?
      ORDER BY i.criado_em DESC
    `);
    stmt.bind([locadorId]);

    const interesses = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      interesses.push({
        id: row.id,
        criado_em: row.criado_em,
        veiculo: {
          id: row.veiculo_id,
          marca: row.veiculo_marca,
          modelo: row.veiculo_modelo,
          placa: row.veiculo_placa
        },
        motorista: {
          id: row.motorista_id,
          nome_completo: row.motorista_nome,
          cpf: row.motorista_cpf,
          rg: row.motorista_rg,
          data_nascimento: row.motorista_data_nascimento,
          email: row.motorista_email,
          telefone: row.motorista_telefone,
          whatsapp: row.motorista_whatsapp,
          numero_cnh: row.motorista_numero_cnh,
          categoria_cnh: row.motorista_categoria_cnh,
          validade_cnh: row.motorista_validade_cnh,
          cidade: row.motorista_cidade,
          estado: row.motorista_estado,
          endereco: row.motorista_endereco,
          cep: row.motorista_cep
        }
      });
    }
    stmt.free();

    res.json(interesses);
  } catch (err) {
    console.error('Erro ao listar interesses:', err);
    res.status(500).json({ erro: 'Erro ao listar interesses.' });
  }
});

module.exports = router;
