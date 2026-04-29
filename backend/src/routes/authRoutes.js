/**
 * ROTAS DE AUTENTICAÇÃO
 * Define os caminhos para login, cadastro e recuperação de conta.
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); // Criar conta
router.post('/login', authController.login);       // Entrar no sistema
router.post('/recover', authController.recoverPassword); // Ver senha esquecida
router.put('/update', authController.updateProfile);   // Atualizar dados do perfil

module.exports = router;
