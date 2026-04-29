/**
 * CONTROLLER DE AUTENTICAÇÃO
 * Gerencia o registro, login e recuperação de acesso dos usuários.
 */
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Chave secreta para geração de tokens (em produção deve estar no .env)
const JWT_SECRET = process.env.JWT_SECRET || 'aqua_saude_secret_key_123';

/**
 * Registra um novo usuário com senha criptografada.
 */
exports.register = async (req, res) => {
  try {
    const { nome, email, senha, cpf } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email já cadastrado' });

    const hashedSenha = await bcrypt.hash(senha, 10);
    
    const user = await User.create({
      nome,
      email,
      cpf,
      senha: hashedSenha,
      xp: 0,
      level: 1,
      streak: 0
    });

    res.status(201).json({ message: 'Usuário criado com sucesso!', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(401).json({ message: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recoverPassword = async (req, res) => {
  try {
    const { nome, email, cpf } = req.body;
    
    const user = await User.findOne({ where: { nome, email, cpf } });
    
    if (!user) {
      return res.status(404).json({ message: 'Dados não conferem. Verifique nome, CPF e email.' });
    }

    // Para fins pedagógicos/simplificação como pedido pelo usuário
    // Em um sistema real, enviaríamos um link de reset por email.
    res.json({ 
      message: 'Dados confirmados!', 
      senha_recuperada: 'Sua senha foi resetada para: 123456 (Por segurança, altere após o login)' 
    });

    // Opcional: resetar a senha para o padrão
    user.senha = await bcrypt.hash('123456', 10);
    await user.save();
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Atualiza os dados do perfil do usuário (Nome, Email e Senha).
 * Este método permite que o usuário altere suas informações básicas de identificação.
 * @param {Object} req - Requisição contendo userId, nome, email e/ou senha.
 * @param {Object} res - Resposta informando o sucesso ou erro da operação.
 */
exports.updateProfile = async (req, res) => {
  try {
    const { userId, nome, email, senha } = req.body;
    
    // Busca o usuário pelo ID primário
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Atualiza o nome se o campo não estiver vazio
    if (nome) user.nome = nome;
    
    // Atualiza o email se o campo não estiver vazio
    if (email) user.email = email;

    // Se uma nova senha for fornecida, ela deve ser criptografada (hash)
    // Usamos o bcrypt com custo 10 para garantir a segurança dos dados.
    if (senha) {
      user.senha = await bcrypt.hash(senha, 10);
    }

    // Salva as alterações no banco de dados SQLite
    await user.save();

    // Retorna os dados atualizados para sincronizar o estado do Frontend
    res.json({ 
      message: 'Perfil atualizado com sucesso!',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak
      }
    });
  } catch (error) {
    // Tratamento de erro genérico
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: error.message });
  }
};
