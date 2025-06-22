const mongoose = require('mongoose');

// Schema da Fiscalização
const fiscalizacaoSchema = new mongoose.Schema({
  data: {
    type: Date,
    required: [true, 'Data da fiscalização é obrigatória'],
    default: Date.now
  },
  status: {
    type: String,
    required: [true, 'Status é obrigatório'],
    enum: {
      values: ['aprovada', 'reprovada', 'pendente', 'em_analise'],
      message: 'Status deve ser: aprovada, reprovada, pendente ou em_analise'
    },
    default: 'pendente'
  },
  observacoes: {
    type: String,
    required: [true, 'Observações são obrigatórias'],
    trim: true,
    maxlength: [1000, 'Observações devem ter no máximo 1000 caracteres']
  },
  localizacao: {
    latitude: {
      type: Number,
      required: [true, 'Latitude é obrigatória'],
      min: [-90, 'Latitude deve estar entre -90 e 90'],
      max: [90, 'Latitude deve estar entre -90 e 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude é obrigatória'],
      min: [-180, 'Longitude deve estar entre -180 e 180'],
      max: [180, 'Longitude deve estar entre -180 e 180']
    }
  },
  foto: {
    type: String, // Caminho da imagem ou base64
    default: null
  },
  // Referência à obra (relacionamento)
  obra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Obra',
    required: [true, 'ID da obra é obrigatório']
  },
  fiscal: {
    type: String,
    required: [true, 'Nome do fiscal é obrigatório'],
    trim: true,
    maxlength: [80, 'Nome do fiscal deve ter no máximo 80 caracteres']
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Criar índices para otimizar consultas
fiscalizacaoSchema.index({ obra: 1 });
fiscalizacaoSchema.index({ status: 1 });
fiscalizacaoSchema.index({ data: -1 }); // -1 para ordem decrescente (mais recentes primeiro)

// Método para verificar se fiscalização está vencida
fiscalizacaoSchema.methods.estaVencida = function() {
  const hoje = new Date();
  const diffTime = hoje - this.data;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Considera vencida se passou mais de 30 dias e ainda está pendente
  return diffDays > 30 && this.status === 'pendente';
};

module.exports = mongoose.model('Fiscalizacao', fiscalizacaoSchema);