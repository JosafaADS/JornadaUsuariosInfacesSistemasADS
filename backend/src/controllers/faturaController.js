/**
 * CONTROLLER DE FATURAS E CONSUMO
 * Gerencia o upload de faturas e o registro de consumo com lógica de gamificação.
 */
const ocrService = require('../services/ocrService');
const { Consumo, User } = require('../models');

/**
 * Recebe o arquivo da fatura, processa via OCR e retorna os dados extraídos.
 */
exports.uploadFatura = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }

    // Chama o serviço de OCR para extrair dados do PDF
    const data = await ocrService.processSabespPDF(req.file.path);
    
    // Retorna os dados para confirmação do usuário no frontend antes de salvar definitivamente
    res.status(200).json({
      message: 'Fatura processada com sucesso',
      data,
      temp_path: req.file.path
    });
  } catch (error) {
    console.error('Erro no upload/ocr:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Confirma os dados revisados pelo usuário e salva no banco de dados.
 * Inclui lógica de transação para garantir que XP e Consumo sejam salvos juntos.
 */
exports.confirmarConsumo = async (req, res) => {
  // Inicia uma transação no banco de dados (garante integridade: ou salva tudo ou nada)
  const t = await User.sequelize.transaction();
  try {
    const { userId, quantidade_m3, valor, mes_referencia, origem } = req.body;
    
    // Busca o usuário atual
    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // --- LÓGICA DE GAMIFICAÇÃO ---

    // 1. Cálculo de XP Base
    let bonusXP = 10; // XP fixo por registro

    // 2. Bônus por Economia: Se consumo atual for menor que a média do usuário, +100 XP
    const consumosAnteriores = await Consumo.findAll({ where: { userId }, transaction: t });
    if (consumosAnteriores.length > 0) {
      const media = consumosAnteriores.reduce((acc, c) => acc + c.quantidade_m3, 0) / consumosAnteriores.length;
      if (quantidade_m3 < media) {
        bonusXP += 100;
      }
    }

    // 3. Lógica de Streak (Dias consecutivos)
    // Se o último registro foi nos últimos 3 dias, aumenta o streak e dá bônus de 20%
    const hoje = new Date();
    const tresDiasAtras = new Date();
    tresDiasAtras.setDate(hoje.getDate() - 3);

    if (user.lastCheckIn && user.lastCheckIn >= tresDiasAtras) {
      user.streak += 1;
      bonusXP *= 1.2; 
    } else {
      user.streak = 1; // Reseta o contador se demorou muito
    }

    // 4. Atualização do Perfil do Usuário
    user.xp += Math.round(bonusXP);
    user.lastCheckIn = hoje;
    user.level = Math.floor(user.xp / 1000) + 1; // Cada 1000 XP sobe um nível

    await user.save({ transaction: t });

    // 5. Registro do Consumo Histórico
    const novoConsumo = await Consumo.create({
      userId,
      quantidade_m3,
      valor,
      mes_referencia,
      origem
    }, { transaction: t });

    // Finaliza a transação com sucesso
    await t.commit();

    res.status(201).json({
      message: 'Consumo registrado e progresso atualizado!',
      consumo: novoConsumo,
      xp_ganho: Math.round(bonusXP),
      user: {
        xp: user.xp,
        level: user.level,
        streak: user.streak
      }
    });
  } catch (error) {
    // Em caso de erro, desfaz qualquer alteração feita durante a transação
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};
