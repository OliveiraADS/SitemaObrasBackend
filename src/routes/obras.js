const express = require('express');
const router = express.Router();
const obraController = require('../controllers/obraController');
const upload = require('../config/multer');

// @route   GET /api/obras
// @desc    Listar todas as obras
// @access  Public
router.get('/', obraController.listarTodas);

// @route   POST /api/obras
// @desc    Criar nova obra
// @access  Public
// upload.single('foto') - aceita um arquivo com o campo 'foto'
router.post('/', upload.single('foto'), obraController.criar);

// @route   GET /api/obras/:id
// @desc    Buscar obra por ID
// @access  Public
router.get('/:id', obraController.buscarPorId);

// @route   PUT /api/obras/:id
// @desc    Atualizar obra
// @access  Public
router.put('/:id', upload.single('foto'), obraController.atualizar);

// @route   DELETE /api/obras/:id
// @desc    Deletar obra
// @access  Public
router.delete('/:id', obraController.deletar);

// @route   GET /api/obras/:id/fiscalizacoes
// @desc    Listar fiscalizações de uma obra específica
// @access  Public
router.get('/:id/fiscalizacoes', obraController.listarFiscalizacoes);

// @route   POST /api/obras/:id/enviar-email
// @desc    Enviar detalhes da obra por email
// @access  Public
router.post('/:id/enviar-email', obraController.enviarPorEmail);

module.exports = router;