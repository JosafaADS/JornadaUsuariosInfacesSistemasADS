/**
 * ROTAS DE FATURAS E OCR
 * Define os endpoints para upload de arquivos e processamento de dados.
 */
// Configuração do Multer para upload temporário de arquivos PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nome único para evitar conflitos
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Filtro para garantir que apenas arquivos PDF sejam aceitos
    if (path.extname(file.originalname) !== '.pdf') {
      return cb(new Error('Apenas PDFs são permitidos'));
    }
    cb(null, true);
  }
});

// Endpoint para enviar fatura e processar OCR
router.post('/upload', upload.single('fatura'), faturaController.uploadFatura);

// Endpoint para confirmar os dados revisados pelo usuário
router.post('/confirmar', faturaController.confirmarConsumo);

module.exports = router;
