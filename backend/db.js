/**
 * Conexão com PostgreSQL (Neon, Render, etc.)
 *
 * Usa DATABASE_URL do ambiente. Compatível com Neon, Railway, Render.
 */

const { Pool } = require('pg');

let _pool = null;

async function initDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL não configurada. Configure no .env (local) ou nas variáveis de ambiente (Neon/Render).'
    );
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  // Ordem das tabelas: locadores e motoristas primeiro (sem FK), depois veiculos, interesses, tokens
  await pool.query(`
    CREATE TABLE IF NOT EXISTS locadores (
      id SERIAL PRIMARY KEY,
      razao_social TEXT NOT NULL,
      nome_fantasia TEXT,
      cnpj TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      telefone TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      endereco TEXT NOT NULL,
      cidade TEXT NOT NULL,
      estado TEXT NOT NULL,
      cep TEXT NOT NULL,
      area_atuacao TEXT,
      horario_atendimento TEXT,
      senha_hash TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS motoristas (
      id SERIAL PRIMARY KEY,
      nome_completo TEXT NOT NULL,
      cpf TEXT NOT NULL UNIQUE,
      rg TEXT NOT NULL,
      data_nascimento TEXT NOT NULL,
      email TEXT NOT NULL,
      telefone TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      numero_cnh TEXT NOT NULL,
      categoria_cnh TEXT NOT NULL,
      ear INTEGER NOT NULL DEFAULT 0,
      validade_cnh TEXT NOT NULL,
      cidade TEXT NOT NULL,
      estado TEXT NOT NULL,
      endereco TEXT,
      cep TEXT,
      apps_que_usa TEXT,
      senha_hash TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id SERIAL PRIMARY KEY,
      locador_id INTEGER NOT NULL REFERENCES locadores(id),
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      ano INTEGER NOT NULL,
      placa TEXT NOT NULL,
      cor TEXT NOT NULL,
      preco_diaria REAL,
      preco_semanal REAL NOT NULL,
      valor_caucao REAL NOT NULL,
      responsabilidade_manutencao TEXT NOT NULL,
      local_retirada TEXT NOT NULL,
      foto_url TEXT,
      disponivel INTEGER NOT NULL DEFAULT 1,
      observacoes TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS interesses (
      id SERIAL PRIMARY KEY,
      motorista_id INTEGER NOT NULL REFERENCES motoristas(id),
      veiculo_id INTEGER NOT NULL REFERENCES veiculos(id),
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tokens_recuperacao (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      tipo TEXT NOT NULL,
      expira_em TIMESTAMP NOT NULL,
      usado INTEGER DEFAULT 0
    )
  `);

  _pool = pool;
  return { pool };
}

function getDb() {
  if (!_pool) throw new Error('Banco não inicializado. Chame initDb() primeiro.');
  return { pool: _pool };
}

module.exports = { initDb, getDb };
