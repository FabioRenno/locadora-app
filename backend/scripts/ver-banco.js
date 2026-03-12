/**
 * Lista tabelas e contagem de registros no PostgreSQL.
 * Execute: node backend/scripts/ver-banco.js
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { initDb, getDb } = require('../db');

async function ver() {
  await initDb();
  const { pool } = getDb();

  const tables = ['locadores', 'motoristas', 'veiculos', 'interesses', 'tokens_recuperacao'];
  console.log('\n=== TABELAS ===');

  for (const name of tables) {
    const result = await pool.query(`SELECT COUNT(*) as total FROM ${name}`);
    const total = result.rows[0].total;
    console.log(`  ${name}: ${total} registro(s)`);

    if (parseInt(total) > 0) {
      const cols = await pool.query(`SELECT * FROM ${name} LIMIT 1`);
      console.log('    Colunas:', Object.keys(cols.rows[0]).join(', '));
    }
  }

  console.log('');
  process.exit(0);
}

ver().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
