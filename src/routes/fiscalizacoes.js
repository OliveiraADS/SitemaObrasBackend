const express = require('express');
const router = express.Router();
const fiscalizacaoController = require('../controllers/fiscalizacaoController');
const upload = require('../config/multer');


// Listar fiscalizações vencidas
router.get('/vencidas', fiscalizacaoController.listarVencidas);

// Listar fiscalizações por status
router.get('/status/:status', fiscalizacaoController.listarPorStatus);

// ROTAS GERAIS

// Listar todas as fiscalizações
router.get('/', fiscalizacaoController.listarTodas);

// Criar nova fiscalização
router.post('/', upload.single('foto'), fiscalizacaoController.criar);

// Buscar fiscalização por ID
router.get('/:id', fiscalizacaoController.buscarPorId);

// Atualizar fiscalização
router.put('/:id', upload.single('foto'), fiscalizacaoController.atualizar);

// Deletar fiscalização
router.delete('/:id', fiscalizacaoController.deletar);

module.exports = router;