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

function requerMotoristaLogado(req, res, next) {
  if (req.session && req.session.motoristaId) {
    next();
  } else {
    res.status(401).json({ erro: 'Faça login como motorista para manifestar interesse.' });
  }
}

router.post('/', requerMotoristaLogado, async (req, res) => {
  try {
    const { pool } = getDb();
    const motoristaId = req.session.motoristaId;
    const { veiculo_id } = req.body;

    if (!veiculo_id) {
      return res.status(400).json({ erro: 'Informe o veículo.' });
    }

    const veiculoId = parseInt(veiculo_id, 10);
    if (isNaN(veiculoId)) {
      return res.status(400).json({ erro: 'ID do veículo inválido.' });
    }

    const veiculoResult = await pool.query('SELECT id FROM veiculos WHERE id = $1', [veiculoId]);
    if (veiculoResult.rows.length === 0) {
      return res.status(404).json({ erro: 'Veículo não encontrado.' });
    }

    const duplicadoResult = await pool.query(
      'SELECT id FROM interesses WHERE motorista_id = $1 AND veiculo_id = $2',
      [motoristaId, veiculoId]
    );
    if (duplicadoResult.rows.length > 0) {
      return res.status(400).json({ erro: 'Você já manifestou interesse neste veículo.' });
    }

    await pool.query(
      'INSERT INTO interesses (motorista_id, veiculo_id) VALUES ($1, $2)',
      [motoristaId, veiculoId]
    );

    const infoResult = await pool.query(
      `SELECT v.marca, v.modelo, v.placa, l.email as locador_email,
              m.nome_completo, m.whatsapp, m.email as motorista_email, m.cpf
       FROM veiculos v
       JOIN locadores l ON v.locador_id = l.id
       JOIN motoristas m ON m.id = $1
       WHERE v.id = $2`,
      [motoristaId, veiculoId]
    );
    const row = infoResult.rows[0];
    if (row) {
      enviarEmailInteresse(row.locador_email, {
        veiculo: { marca: row.marca, modelo: row.modelo, placa: row.placa },
        motorista: {
          nome_completo: row.nome_completo,
          whatsapp: row.whatsapp,
          email: row.motorista_email,
          cpf: row.cpf
        }
      }).catch(() => {});
    }

    res.status(201).json({ sucesso: true, mensagem: 'Interesse registrado! O locador entrará em contato.' });
  } catch (err) {
    console.error('Erro ao registrar interesse:', err);
    res.status(500).json({ erro: 'Erro ao registrar interesse.' });
  }
});

router.get('/meus', requerMotoristaLogado, async (req, res) => {
  try {
    const { pool } = getDb();
    const motoristaId = req.session.motoristaId;

    const result = await pool.query(
      `SELECT
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
       WHERE i.motorista_id = $1
       ORDER BY i.criado_em DESC`,
      [motoristaId]
    );

    const interesses = result.rows.map(row => ({
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
    }));

    res.json(interesses);
  } catch (err) {
    console.error('Erro ao listar interesses do motorista:', err);
    res.status(500).json({ erro: 'Erro ao listar interesses.' });
  }
});

router.delete('/:id', requerMotoristaLogado, async (req, res) => {
  try {
    const { pool } = getDb();
    const motoristaId = req.session.motoristaId;
    const id = parseInt(req.params.id, 10);
    const { motivo } = req.body || {};

    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido.' });
    }

    const checkResult = await pool.query(
      `SELECT i.id, v.id as veiculo_id, v.marca, v.modelo, v.placa,
              l.email as locador_email, m.nome_completo as motorista_nome
       FROM interesses i
       JOIN veiculos v ON i.veiculo_id = v.id
       JOIN locadores l ON v.locador_id = l.id
       JOIN motoristas m ON i.motorista_id = m.id
       WHERE i.id = $1 AND i.motorista_id = $2`,
      [id, motoristaId]
    );
    const row = checkResult.rows[0];

    if (!row) {
      return res.status(404).json({ erro: 'Interesse não encontrado ou não pertence a você.' });
    }

    await pool.query('DELETE FROM interesses WHERE id = $1 AND motorista_id = $2', [id, motoristaId]);

    if (row.locador_email) {
      enviarEmailDesistencia(row.locador_email, {
        veiculo: { marca: row.marca, modelo: row.modelo, placa: row.placa },
        motorista: { nome_completo: row.motorista_nome },
        motivo: motivo || 'outro'
      }).catch(() => {});
    }

    res.json({ sucesso: true, mensagem: 'Interesse removido.' });
  } catch (err) {
    console.error('Erro ao remover interesse:', err);
    res.status(500).json({ erro: 'Erro ao remover interesse.' });
  }
});

router.get('/', requerLocadorLogado, async (req, res) => {
  try {
    const { pool } = getDb();
    const locadorId = req.session.locadorId;

    const result = await pool.query(
      `SELECT
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
       WHERE v.locador_id = $1
       ORDER BY i.criado_em DESC`,
      [locadorId]
    );

    const interesses = result.rows.map(row => ({
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
    }));

    res.json(interesses);
  } catch (err) {
    console.error('Erro ao listar interesses:', err);
    res.status(500).json({ erro: 'Erro ao listar interesses.' });
  }
});

module.exports = router;
