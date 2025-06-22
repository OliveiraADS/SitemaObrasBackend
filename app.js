const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

// Importar conexão com banco de dados
const connectDB = require('./src/config/database');

// Importar rotas
const obrasRoutes = require('./src/routes/obras');
const fiscalizacoesRoutes = require('./src/routes/fiscalizacoes');

// Criar aplicação Express
const app = express();

// Conectar ao banco de dados
connectDB();

// Middlewares globais
app.use(cors()); // Permitir requisições de outros domínios
app.use(express.json({ limit: '10mb' })); // Parser JSON com limite de 10MB
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parser URL-encoded

// Servir arquivos estáticos (imagens)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para log de requisições (desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🚧 Sistema de Obras - API Backend',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: {
      api: '/api',
      obras: '/api/obras',
      fiscalizacoes: '/api/fiscalizacoes'
    }
  });
});

// Rota de teste da API
app.get('/api', (req, res) => {
  res.json({
    message: '🚧 API do Sistema de Obras funcionando!',
    version: '1.0.0',
    status: 'OK',
    timestamp: new Date().toISOString(),
    endpoints: {
      obras: '/api/obras',
      fiscalizacoes: '/api/fiscalizacoes'
    }
  });
});

// Rotas principais
app.use('/api/obras', obrasRoutes);
app.use('/api/fiscalizacoes', fiscalizacoesRoutes);

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    availableRoutes: {
      'GET /': 'Página inicial',
      'GET /api': 'Informações da API',
      'GET /api/obras': 'Listar obras',
      'POST /api/obras': 'Criar obra',
      'GET /api/fiscalizacoes': 'Listar fiscalizações',
      'POST /api/fiscalizacoes': 'Criar fiscalização'
    }
  });
});

// Middleware global para tratamento de erros
app.use((error, req, res, next) => {
  console.error('Erro capturado:', error);
  
  // Erro do Multer (upload de arquivo)
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Arquivo muito grande. Máximo permitido: 5MB'
      });
    }
  }
  
  // Erro de validação do MongoDB
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: messages
    });
  }
  
  // Erro de cast do MongoDB (ID inválido)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID inválido'
    });
  }
  
  // Erro padrão
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado!'
  });
});

// ========== INICIALIZAÇÃO DO SERVIDOR ==========

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Inicializar servidor
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Servidor rodando na porta ${PORT}
  📍 URL: http://localhost:${PORT}
  🌐 API Base: http://localhost:${PORT}/api
  📊 Ambiente: ${process.env.NODE_ENV || 'development'}
  ⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}
  `);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

module.exports = app;