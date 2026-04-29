const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * MODELO DE USUÁRIO
 * Representa o perfil do jogador, acumulando XP, nível e estatísticas.
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Experiência acumulada pelo usuário
  xp: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Nível atual (calculado com base no XP)
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  // Dias consecutivos de uso do sistema
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  // Data do último registro de consumo (para cálculo de streak)
  lastCheckIn: {
    type: DataTypes.DATE,
    allowNull: true,
  }
});

module.exports = User;
