/**
 * Reseta (limpa) todos os interesses no banco PostgreSQL.
 * Execute: node backend/scripts/reset-interesses.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { initDb, getDb } = require('../db');

async function resetar() {
  await initDb();
  const { pool } = getDb();
  const result = await pool.query('DELETE FROM interesses');
  console.log(`✓ ${result.rowCount} interesse(s) removido(s).`);
  process.exit(0);
}

resetar().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
