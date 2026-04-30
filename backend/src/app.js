/**
 * CONFIGURAÇÃO DO EXPRESS (app.js)
 * Define middlewares, rotas globais e configurações de segurança/CORS.
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const faturaRoutes = require('./routes/faturaRoutes');
const authRoutes = require('./routes/authRoutes');
const fs = require('fs');

const app = express();

// Garante a existência da pasta para armazenamento de PDFs temporários
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Middlewares globais
app.use(cors()); // Habilita chamadas do frontend
app.use(express.json()); // Habilita parsing de JSON
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve PDFs estáticos

// Definição das rotas principais da API
app.use('/api/fatura', faturaRoutes);
app.use('/api/auth', authRoutes);

// Rota de Perfil do Usuário
// Retorna os dados do usuário e sua lista completa de consumos (para o Histórico)
const { User, Consumo } = require('./models');
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const consumos = await Consumo.findAll({ 
      where: { userId: req.params.id },
      order: [['createdAt', 'ASC']] // Ordena do mais antigo para o mais novo
    });
    res.json({ user, consumos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota de Ranking (Leaderboard)
// Retorna os 10 melhores jogadores baseados no XP acumulado
app.get('/api/ranking', async (req, res) => {
  try {
    const ranking = await User.findAll({
      order: [['xp', 'DESC']], // Ordem decrescente de experiência
      limit: 10,
      attributes: ['nome', 'xp', 'level', 'streak'] // Retorna apenas campos públicos
    });
    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware de tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro detectado:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno no servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;
