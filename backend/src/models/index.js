const User = require('./User');
const Consumo = require('./Consumo');
const Achievement = require('./Achievement');
const sequelize = require('../config/database');

/**
 * CONFIGURAÇÃO DE ASSOCIAÇÕES (Relacionamentos)
 * Define como as tabelas do banco de dados se conectam entre si.
 */
// Associações
User.hasMany(Consumo, { foreignKey: 'userId' }); // Um Usuário tem muitos registros de consumo
Consumo.belongsTo(User, { foreignKey: 'userId' }); // Cada consumo pertence a um usuário

User.belongsToMany(Achievement, { through: 'UserAchievements' }); // Muitos usuários podem ter muitas conquistas
Achievement.belongsToMany(User, { through: 'UserAchievements' });

module.exports = {
  User,
  Consumo,
  Achievement,
  sequelize
};
