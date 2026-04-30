const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const faturaController = require('../controllers/faturaController');

// Configuração do Multer para upload temporário de arquivos PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Sanitiza o nome do arquivo removendo caracteres especiais e espaços
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${Date.now()}-${sanitizedName}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Filtro para garantir que apenas arquivos PDF sejam aceitos (case-insensitive)
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return cb(new Error('Apenas arquivos PDF são permitidos'));
    }
    cb(null, true);
  }
});

// Endpoint para enviar fatura e processar OCR
router.post('/upload', upload.single('fatura'), faturaController.uploadFatura);

// Endpoint para confirmar os dados revisados pelo usuário
router.post('/confirmar', faturaController.confirmarConsumo);

module.exports = router;
