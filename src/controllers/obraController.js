const Obra = require('../models/Obra');
const Fiscalizacao = require('../models/Fiscalizacao');
const nodemailer = require('nodemailer');

// Configurar o transportador de email
const configurarEmail = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// GET /api/obras - Listar todas as obras
const listarTodas = async (req, res) => {
  try {
    const obras = await Obra.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: obras.length,
      data: obras
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar obras',
      error: error.message
    });
  }
};

// POST /api/obras - Criar nova obra
const criar = async (req, res) => {
  try {
    const novaObra = new Obra(req.body);
    
    // Se foi enviado arquivo de imagem
    if (req.file) {
      novaObra.foto = req.file.path;
    }
    
    const obraSalva = await novaObra.save();
    
    res.status(201).json({
      success: true,
      message: 'Obra criada com sucesso!',
      data: obraSalva
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao criar obra',
      error: error.message
    });
  }
};

// GET /api/obras/:id - Buscar obra por ID
const buscarPorId = async (req, res) => {
  try {
    const obra = await Obra.findById(req.params.id);
    
    if (!obra) {
      return res.status(404).json({
        success: false,
        message: 'Obra não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: obra
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar obra',
      error: error.message
    });
  }
};

// PUT /api/obras/:id - Atualizar obra
const atualizar = async (req, res) => {
  try {
    // Se foi enviado arquivo de imagem
    if (req.file) {
      req.body.foto = req.file.path;
    }
    
    const obraAtualizada = await Obra.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!obraAtualizada) {
      return res.status(404).json({
        success: false,
        message: 'Obra não encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Obra atualizada com sucesso!',
      data: obraAtualizada
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar obra',
      error: error.message
    });
  }
};

// DELETE /api/obras/:id - Deletar obra
const deletar = async (req, res) => {
  try {
    const obraDeletada = await Obra.findByIdAndDelete(req.params.id);
    
    if (!obraDeletada) {
      return res.status(404).json({
        success: false,
        message: 'Obra não encontrada'
      });
    }
    
    // Deletar todas as fiscalizações relacionadas
    await Fiscalizacao.deleteMany({ obra: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Obra deletada com sucesso!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar obra',
      error: error.message
    });
  }
};

// GET /api/obras/:id/fiscalizacoes - Listar fiscalizações de uma obra
const listarFiscalizacoes = async (req, res) => {
  try {
    const fiscalizacoes = await Fiscalizacao.find({ obra: req.params.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: fiscalizacoes.length,
      data: fiscalizacoes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar fiscalizações',
      error: error.message
    });
  }
};

// POST /api/obras/:id/enviar-email - Enviar detalhes da obra por email
const enviarPorEmail = async (req, res) => {
  try {
    const { emailDestino } = req.body;
    
    if (!emailDestino) {
      return res.status(400).json({
        success: false,
        message: 'Email de destino é obrigatório'
      });
    }
    
    const obra = await Obra.findById(req.params.id);
    
    if (!obra) {
      return res.status(404).json({
        success: false,
        message: 'Obra não encontrada'
      });
    }
    
    // Configurar transportador de email
    const transporter = configurarEmail();
    
    // Criar link da foto se existir
    const linkFoto = obra.foto ? 
      `http://localhost:3000/foto-obra.html?id=${obra._id}` : 
      'Nenhuma foto cadastrada';
    
    // Conteúdo do email
    const htmlContent = `
      <h2>Detalhes da Obra: ${obra.nome}</h2>
      <p><strong>Responsável:</strong> ${obra.responsavel}</p>
      <p><strong>Data de Início:</strong> ${obra.dataInicio.toLocaleDateString('pt-BR')}</p>
      <p><strong>Data de Fim:</strong> ${obra.dataFim.toLocaleDateString('pt-BR')}</p>
      <p><strong>Status:</strong> ${obra.status}</p>
      <p><strong>Localização:</strong> Lat: ${obra.localizacao.latitude}, Long: ${obra.localizacao.longitude}</p>
      <p><strong>Descrição:</strong> ${obra.descricao}</p>
      <p><strong>Duração:</strong> ${obra.calcularDuracao()} dias</p>
      <p><strong>🖼️ Ver Obra Completa:</strong> <a href="${linkFoto}" target="_blank">Clique aqui para ver a página completa da obra</a></p>
      <hr>
      <p><em>Email enviado automaticamente pelo Sistema de Obras</em></p>
    `;
    
    // Opções do email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailDestino,
      subject: `Detalhes da Obra: ${obra.nome}`,
      html: htmlContent
    };
    
    // Enviar email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso!',
      linkFoto: obra.foto ? linkFoto : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar email',
      error: error.message
    });
  }
};

module.exports = {
  listarTodas,
  criar,
  buscarPorId,
  atualizar,
  deletar,
  listarFiscalizacoes,
  enviarPorEmail
};