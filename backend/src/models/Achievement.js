const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * MODELO DE CONQUISTAS (Achievements)
 * Define os selos e troféus que os usuários podem ganhar.
 */
const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Achievement;
