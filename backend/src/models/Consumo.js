const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * MODELO DE CONSUMO
 * Armazena cada registro de conta de água ou medição manual vinculada a um usuário.
 */
const Consumo = sequelize.define('Consumo', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // Quantidade de água consumida em metros cúbicos (m³)
  quantidade_m3: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // Valor monetário total da fatura (R$)
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // Mês e ano de referência da fatura (ex: 04/2026)
  mes_referencia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Define se o dado veio de um PDF (ocr) ou se foi digitado (manual)
  origem: {
    type: DataTypes.ENUM('manual', 'ocr'),
    defaultValue: 'manual',
  }
});

module.exports = Consumo;
