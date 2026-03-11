/**
 * Reseta (limpa) todos os interesses no banco de dados.
 * Execute: node backend/scripts/reset-interesses.js
 */

const { initDb, getDb } = require('../db');

async function resetar() {
  await initDb();
  const { db, save } = getDb();
  db.run('DELETE FROM interesses');
  const total = db.getRowsModified();
  save();
  console.log(`✓ ${total} interesse(s) removido(s).`);
  process.exit(0);
}

resetar().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
