/**
 * Conexão com o banco SQLite (via sql.js - JavaScript puro, sem compilação)
 * 
 * sql.js funciona em qualquer sistema, sem precisar de Python ou ferramentas de build.
 * O banco fica em memória e é salvo em arquivo após cada alteração.
 */

const path = require('path');
const fs = require('fs');

let _db = null;
let _save = null;

async function initDb() {
  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();

  const dbPath = path.join(__dirname, '..', 'database', 'locadora.db');
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  let db;
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS motoristas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      locador_id INTEGER NOT NULL,
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
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (locador_id) REFERENCES locadores(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS interesses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      motorista_id INTEGER NOT NULL,
      veiculo_id INTEGER NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (motorista_id) REFERENCES motoristas(id),
      FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS locadores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  function save() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }

  _db = db;
  _save = save;

  return { db, save };
}

function getDb() {
  if (!_db) throw new Error('Banco não inicializado. Chame initDb() primeiro.');
  return { db: _db, save: _save };
}

module.exports = { initDb, getDb };
