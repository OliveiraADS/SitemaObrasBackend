const mongoose = require('mongoose');

// Função para conectar ao MongoDB
const connectDB = async () => {
  try {
    // URL de conexão com o MongoDB (local)
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sistema_obras';
    
    // Conectar ao MongoDB (sem as opções deprecated)
    await mongoose.connect(mongoURI);

    console.log('✅ MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar com MongoDB:', error.message);
    // Encerra o processo se não conseguir conectar
    process.exit(1);
  }
};

module.exports = connectDB;