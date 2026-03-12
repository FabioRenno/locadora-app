/**
 * Exibe o conteúdo do banco locadora.db
 * Execute: node backend/scripts/ver-banco.js
 */

const path = require('path');
const fs = require('fs');

async function ver() {
  const initSqlJs = require('sql.js');
  const dbPath = path.join(__dirname, '..', '..', 'database', 'locadora.db');

  if (!fs.existsSync(dbPath)) {
    console.log('Arquivo locadora.db não existe.');
    return;
  }

  const SQL = await initSqlJs();
  const buf = fs.readFileSync(dbPath);
  const db = new SQL.Database(buf);

  const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");

  if (!tables.length) {
    console.log('Nenhuma tabela encontrada.');
    return;
  }

  console.log('\n=== TABELAS ===');
  for (const t of tables[0].values) console.log('  -', t[0]);

  for (const t of tables[0].values) {
    const name = t[0];
    const rows = db.exec('SELECT * FROM ' + name);

    if (rows[0]) {
      console.log('\n=== ' + name.toUpperCase() + ' (' + rows[0].values.length + ' registro(s)) ===');
      console.log('Colunas:', rows[0].columns.join(', '));

      rows[0].values.forEach((r, i) => {
        const obj = {};
        rows[0].columns.forEach((c, j) => obj[c] = r[j]);
        console.log('\n  [' + (i + 1) + ']', obj);
      });
    }
  }

  db.close();
}

ver().catch(err => console.error(err));
