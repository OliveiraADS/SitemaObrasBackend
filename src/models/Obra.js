const mongoose = require('mongoose');

// Schema da Obra
const obraSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome da obra é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
  },
  responsavel: {
    type: String,
    required: [true, 'Responsável é obrigatório'],
    trim: true,
    maxlength: [80, 'Nome do responsável deve ter no máximo 80 caracteres']
  },
  dataInicio: {
    type: Date,
    required: [true, 'Data de início é obrigatória']
  },
  dataFim: {
    type: Date,
    required: [true, 'Data de fim é obrigatória'],
    validate: {
      validator: function(value) {
        // Validar se data fim é maior que data início
        return value > this.dataInicio;
      },
      message: 'Data de fim deve ser posterior à data de início'
    }
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
  descricao: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    trim: true,
    maxlength: [500, 'Descrição deve ter no máximo 500 caracteres']
  },
  foto: {
    type: String, // Vai armazenar o caminho da imagem ou base64
    default: null
  },
  status: {
    type: String,
    enum: ['planejada', 'em_andamento', 'concluida', 'pausada'],
    default: 'planejada'
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Criar índices para otimizar consultas
obraSchema.index({ nome: 1 });
obraSchema.index({ responsavel: 1 });
obraSchema.index({ status: 1 });

// Método para calcular duração da obra em dias
obraSchema.methods.calcularDuracao = function() {
  const diffTime = Math.abs(this.dataFim - this.dataInicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

module.exports = mongoose.model('Obra', obraSchema);