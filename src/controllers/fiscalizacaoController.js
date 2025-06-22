const Fiscalizacao = require('../models/Fiscalizacao');
const Obra = require('../models/Obra');

const fiscalizacaoController = {
  // GET /api/fiscalizacoes - Listar todas as fiscalizações
  listarTodas: async (req, res) => {
    try {
      const fiscalizacoes = await Fiscalizacao.find()
        .populate('obra', 'nome responsavel status') // Traz dados da obra relacionada
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
  },

  // POST /api/fiscalizacoes - Criar nova fiscalização
  criar: async (req, res) => {
    try {
      // Verificar se a obra existe
      const obraExiste = await Obra.findById(req.body.obra);
      
      if (!obraExiste) {
        return res.status(404).json({
          success: false,
          message: 'Obra não encontrada'
        });
      }
      
      const novaFiscalizacao = new Fiscalizacao(req.body);
      
      // Se foi enviado arquivo de imagem
      if (req.file) {
        novaFiscalizacao.foto = req.file.path;
      }
      
      const fiscalizacaoSalva = await novaFiscalizacao.save();
      
      // Popular com dados da obra antes de retornar
      await fiscalizacaoSalva.populate('obra', 'nome responsavel status');
      
      res.status(201).json({
        success: true,
        message: 'Fiscalização criada com sucesso!',
        data: fiscalizacaoSalva
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao criar fiscalização',
        error: error.message
      });
    }
  },

  // GET /api/fiscalizacoes/:id - Buscar fiscalização por ID
  buscarPorId: async (req, res) => {
    try {
      const fiscalizacao = await Fiscalizacao.findById(req.params.id)
        .populate('obra', 'nome responsavel status dataInicio dataFim');
      
      if (!fiscalizacao) {
        return res.status(404).json({
          success: false,
          message: 'Fiscalização não encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        data: fiscalizacao
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar fiscalização',
        error: error.message
      });
    }
  },

  // PUT /api/fiscalizacoes/:id - Atualizar fiscalização
  atualizar: async (req, res) => {
    try {
      // Se foi enviado arquivo de imagem
      if (req.file) {
        req.body.foto = req.file.path;
      }
      
      // Se está atualizando a obra, verificar se ela existe
      if (req.body.obra) {
        const obraExiste = await Obra.findById(req.body.obra);
        
        if (!obraExiste) {
          return res.status(404).json({
            success: false,
            message: 'Obra não encontrada'
          });
        }
      }
      
      const fiscalizacaoAtualizada = await Fiscalizacao.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('obra', 'nome responsavel status');
      
      if (!fiscalizacaoAtualizada) {
        return res.status(404).json({
          success: false,
          message: 'Fiscalização não encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Fiscalização atualizada com sucesso!',
        data: fiscalizacaoAtualizada
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erro ao atualizar fiscalização',
        error: error.message
      });
    }
  },

  // DELETE /api/fiscalizacoes/:id - Deletar fiscalização
  deletar: async (req, res) => {
    try {
      const fiscalizacaoDeletada = await Fiscalizacao.findByIdAndDelete(req.params.id);
      
      if (!fiscalizacaoDeletada) {
        return res.status(404).json({
          success: false,
          message: 'Fiscalização não encontrada'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Fiscalização deletada com sucesso!'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao deletar fiscalização',
        error: error.message
      });
    }
  },

  // GET /api/fiscalizacoes/status/:status - Listar fiscalizações por status
  listarPorStatus: async (req, res) => {
    try {
      const { status } = req.params;
      
      // Verificar se o status é válido
      const statusValidos = ['aprovada', 'reprovada', 'pendente', 'em_analise'];
      
      if (!statusValidos.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status inválido. Use: aprovada, reprovada, pendente ou em_analise'
        });
      }
      
      const fiscalizacoes = await Fiscalizacao.find({ status })
        .populate('obra', 'nome responsavel status')
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: fiscalizacoes.length,
        data: fiscalizacoes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar fiscalizações por status',
        error: error.message
      });
    }
  },

  // GET /api/fiscalizacoes/vencidas - Listar fiscalizações vencidas
  listarVencidas: async (req, res) => {
    try {
      const fiscalizacoes = await Fiscalizacao.find({ status: 'pendente' })
        .populate('obra', 'nome responsavel status')
        .sort({ data: 1 }); // Mais antigas primeiro
      
      // Filtrar apenas as vencidas
      const fiscalizacoesVencidas = fiscalizacoes.filter(fiscalizacao => 
        fiscalizacao.estaVencida()
      );
      
      res.status(200).json({
        success: true,
        count: fiscalizacoesVencidas.length,
        data: fiscalizacoesVencidas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar fiscalizações vencidas',
        error: error.message
      });
    }
  }
};

module.exports = fiscalizacaoController;