const { Sequelize } = require('sequelize');
const path = require('path');

/**
 * CONFIGURAÇÃO DO BANCO DE DADOS
 * Configura o Sequelize para usar SQLite como banco de dados local.
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'), // Caminho para o arquivo do banco
  logging: false, // Oculta queries SQL no terminal
});

module.exports = sequelize;
