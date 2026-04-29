/**
 * SCRIPT DE SEED (Alimentação Inicial)
 * Executa a criação de dados iniciais para teste do sistema.
 * Rode com: node seed.js
 */
const { User, Achievement, sequelize } = require('./src/models');
const bcrypt = require('bcryptjs');

async function seed() {
  // ATENÇÃO: force: true apaga todos os dados existentes antes de recriar
  await sequelize.sync({ force: true });

  const hashedSenha = await bcrypt.hash('123456', 10);
  
  // Criação do usuário administrador/teste
  const user = await User.create({
    id: 'f87a8b6e-4f3d-4c3e-8a7b-2e4d5c6f7a8b',
    nome: 'Usuário Teste',
    email: 'teste@aqua.com',
    cpf: '123.456.789-00',
    senha: hashedSenha,
    xp: 500,
    level: 1,
    streak: 2,
    lastCheckIn: new Date(Date.now() - 86400000) // Ontem
  });

  await Achievement.bulkCreate([
    { nome: 'Eco-Mestre', descricao: 'Economizou mais de 20% no consumo mensal' },
    { nome: 'Primeiro Gole', descricao: 'Registrou sua primeira fatura no sistema' },
    { nome: 'Guardião da Água', descricao: 'Manteve um streak de 7 dias' }
  ]);

  console.log('Seed finalizado com sucesso!');
  process.exit();
}

seed();
