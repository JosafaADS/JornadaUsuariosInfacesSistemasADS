/**
 * PONTO DE ENTRADA DO SERVIDOR (server.js)
 * Inicializa a conexão com o banco de dados e coloca o servidor Express no ar.
 */
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3001;

// Sincroniza o banco de dados e inicia o servidor
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado');
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao sincronizar banco de dados:', err);
});
