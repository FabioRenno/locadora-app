const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

/**
 * Servidor principal do sistema Locadora App
 *
 * O que este arquivo faz?
 * 1. Inicializa o banco PostgreSQL (Neon, Render, Railway, etc.)
 * 2. Configura sessões (para login)
 * 3. Cria um servidor web
 * 4. Entrega páginas e processa cadastros, login, etc.
 */

const express = require('express');
const session = require('express-session');
const { initDb } = require('./db');
const locadoresRoutes = require('./routes/locadores');
const motoristasRoutes = require('./routes/motoristas');
const veiculosRoutes = require('./routes/veiculos');
const interessesRoutes = require('./routes/interesses');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendPath = path.join(__dirname, '..', 'frontend');

// Permite ler dados do corpo das requisições (formulários e JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessões: "lembra" que o usuário está logado entre as páginas
app.use(session({
  secret: process.env.SESSION_SECRET || 'locadora-app-segredo-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Rotas de autenticação (login, logout, painel)
app.use(authRoutes);

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Páginas restritas (antes do static para interceptar)
const { requerLocadorLogado, requerMotoristaLogado } = require('./routes/auth');
app.get('/meus-veiculos.html', requerLocadorLogado, (req, res) => {
  res.sendFile(path.join(frontendPath, 'meus-veiculos.html'));
});
app.get('/veiculo-form.html', requerLocadorLogado, (req, res) => {
  res.sendFile(path.join(frontendPath, 'veiculo-form.html'));
});
app.get('/interesses-locador.html', requerLocadorLogado, (req, res) => {
  res.sendFile(path.join(frontendPath, 'interesses-locador.html'));
});

app.get('/interesses-motorista.html', requerMotoristaLogado, (req, res) => {
  res.sendFile(path.join(frontendPath, 'interesses-motorista.html'));
});

app.get('/editar-locador.html', requerLocadorLogado, (req, res) => {
  res.sendFile(path.join(frontendPath, 'editar-locador.html'));
});

app.get('/editar-motorista.html', requerMotoristaLogado, (req, res) => {
  res.sendFile(path.join(frontendPath, 'editar-motorista.html'));
});

// Arquivos públicos (HTML, CSS, imagens) - por último para não sobrescrever rotas
app.use(express.static(frontendPath));

// Rotas da API
app.use('/api/locadores', locadoresRoutes);
app.use('/api/motoristas', motoristasRoutes);
app.use('/api/veiculos', veiculosRoutes);
app.use('/api/interesses', interessesRoutes);

// Inicia o banco e o servidor
async function iniciar() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`\n  Locadora App rodando em http://localhost:${PORT}\n`);
  });
}

iniciar();
