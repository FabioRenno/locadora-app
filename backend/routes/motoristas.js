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

// Dados do motorista logado
router.get('/me', async (req, res) => {
  try {
    if (!req.session || !req.session.motoristaId) {
      return res.status(401).json({ sucesso: false, erro: 'Não autorizado.' });
    }
    const { pool } = getDb();
    const result = await pool.query(
      `SELECT nome_completo, cpf, rg, data_nascimento, email, telefone, whatsapp,
              numero_cnh, categoria_cnh, ear, validade_cnh, cidade, estado,
              endereco, cep, apps_que_usa
       FROM motoristas
       WHERE id = $1 AND ativo = 1`,
      [req.session.motoristaId]
    );
    const motorista = result.rows[0] || null;
    if (!motorista) {
      return res.status(404).json({ sucesso: false, erro: 'Motorista não encontrado.' });
    }
    res.json({ sucesso: true, dados: motorista });
  } catch (err) {
    console.error('Erro ao buscar dados do motorista:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao carregar dados. Tente novamente.' });
  }
});

// Atualizar dados básicos do motorista logado
router.put('/me', async (req, res) => {
  try {
    if (!req.session || !req.session.motoristaId) {
      return res.status(401).json({ sucesso: false, erro: 'Não autorizado.' });
    }

    const {
      nome_completo, cpf, rg, data_nascimento, email, telefone, whatsapp,
      numero_cnh, categoria_cnh, ear, validade_cnh, cidade, estado,
      endereco, cep, apps_que_usa
    } = req.body;

    if (!textoValido(nome_completo) || !cpf || !textoValido(rg) || !data_nascimento || !email ||
        !telefone || !whatsapp || !textoValido(numero_cnh) || !textoValido(categoria_cnh) ||
        !validade_cnh || !textoValido(cidade) || !textoValido(estado)) {
      return res.status(400).json({ sucesso: false, erro: 'Preencha todos os campos obrigatórios.' });
    }

    if (!validarEmail(email)) return res.status(400).json({ sucesso: false, erro: 'E-mail inválido.' });
    if (!validarCpfBasico(cpf)) return res.status(400).json({ sucesso: false, erro: 'CPF inválido.' });
    if (!validarTelefone(telefone)) return res.status(400).json({ sucesso: false, erro: 'Telefone inválido.' });
    if (!validarTelefone(whatsapp)) return res.status(400).json({ sucesso: false, erro: 'WhatsApp inválido.' });

    const earValue = (ear === 'sim' || ear === 1 || ear === '1') ? 1 : 0;

    const { pool } = getDb();
    await pool.query(
      `UPDATE motoristas SET
         nome_completo = $1,
         cpf = $2,
         rg = $3,
         data_nascimento = $4,
         email = $5,
         telefone = $6,
         whatsapp = $7,
         numero_cnh = $8,
         categoria_cnh = $9,
         ear = $10,
         validade_cnh = $11,
         cidade = $12,
         estado = $13,
         endereco = $14,
         cep = $15,
         apps_que_usa = $16
       WHERE id = $17 AND ativo = 1`,
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
        req.session.motoristaId
      ]
    );

    req.session.motoristaNome = nome_completo;

    res.json({ sucesso: true, mensagem: 'Cadastro atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar motorista:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao atualizar cadastro. Tente novamente.' });
  }
});

// "Excluir" conta do motorista logado (soft delete)
router.delete('/me', async (req, res) => {
  try {
    if (!req.session || !req.session.motoristaId) {
      return res.status(401).json({ sucesso: false, erro: 'Não autorizado.' });
    }
    const { pool } = getDb();
    const motoristaId = req.session.motoristaId;

    // Marca motorista como inativo
    await pool.query('UPDATE motoristas SET ativo = 0 WHERE id = $1', [motoristaId]);
    // Remove interesses associados
    await pool.query('DELETE FROM interesses WHERE motorista_id = $1', [motoristaId]);

    req.session.destroy(() => {
      res.json({ sucesso: true, mensagem: 'Sua conta foi desativada. Obrigado por ter utilizado o Locadora App.' });
    });
  } catch (err) {
    console.error('Erro ao desativar conta de motorista:', err);
    res.status(500).json({ sucesso: false, erro: 'Erro ao excluir conta. Tente novamente.' });
  }
});

module.exports = router;
