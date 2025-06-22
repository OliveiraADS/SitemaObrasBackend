# 🚧 Sistema de Obras - Backend

> **Backend completo para sistema de cadastro e acompanhamento de obras em andamento**

Projeto desenvolvido para a disciplina de **Análise e Projeto de Sistemas** utilizando Node.js, Express, MongoDB e outras tecnologias modernas.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

---

## 📋 Funcionalidades

- ✅ **CRUD completo** para Obras e Fiscalizações
- ✅ **Upload de imagens** com validação de formato e tamanho
- ✅ **Relacionamento** entre Obras e Fiscalizações
- ✅ **Página web** para visualização de obras com fotos
- ✅ **Envio de emails** com detalhes das obras
- ✅ **API RESTful** com endpoints organizados
- ✅ **Validações robustas** e tratamento de erros
- ✅ **Estrutura modular** seguindo padrão MVC

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express.js** | 4.19+ | Framework web minimalista |
| **MongoDB** | 6.0+ | Banco de dados NoSQL |
| **Mongoose** | 8.4+ | ODM para MongoDB |
| **Multer** | 1.4+ | Middleware para upload de arquivos |
| **Nodemailer** | 6.9+ | Biblioteca para envio de emails |
| **CORS** | 2.8+ | Middleware para Cross-Origin Resource Sharing |

---

## 📁 Estrutura do Projeto

```
sistema-obras-backend/
├── 📁 public/
│   └── foto-obra.html          # Página para visualizar obras
├── 📁 src/
│   ├── 📁 config/
│   │   ├── database.js         # Configuração do MongoDB
│   │   └── multer.js           # Configuração do upload
│   ├── 📁 models/
│   │   ├── Obra.js             # Schema da Obra
│   │   └── Fiscalizacao.js     # Schema da Fiscalização
│   ├── 📁 controllers/
│   │   ├── obraController.js   # Lógica de negócio das obras
│   │   └── fiscalizacaoController.js # Lógica das fiscalizações
│   └── 📁 routes/
│       ├── obras.js            # Rotas das obras
│       └── fiscalizacoes.js    # Rotas das fiscalizações
├── 📁 uploads/                 # Pasta para armazenar imagens
├── 📄 .env                     # Variáveis de ambiente
├── 📄 .gitignore              # Arquivos ignorados pelo Git
├── 📄 app.js                   # Configuração principal da aplicação
├── 📄 package.json             # Dependências e scripts
└── 📄 README.md               # Documentação do projeto
```

---

## ⚙️ Instalação e Configuração

### 📋 **Pré-requisitos**

- [Node.js](https://nodejs.org/) versão 18 ou superior
- [MongoDB Atlas](https://www.mongodb.com/atlas) (banco online - gratuito)
- [Git](https://git-scm.com/) para controle de versão

### 🚀 **Passo a passo**

#### 1. **Clone o repositório**
```bash
git clone <url-do-seu-repositorio>
cd sistema-obras-backend
```

#### 2. **Instale todas as dependências**
```bash
npm install express mongoose multer cors dotenv nodemailer
```

**Ou simplesmente:**
```bash
npm install
```

#### 3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Configuração do servidor
PORT=3000

# Configuração do MongoDB Atlas (online)
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/sistema_obras

# Configuração do email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app

# Ambiente de desenvolvimento
NODE_ENV=development
```

> **💡 Dica:** O MongoDB Atlas já está configurado para aceitar conexões de qualquer IP, então não precisa configurar whitelist de IPs.

#### 4. **Execute o projeto**

> **✅ Vantagem do MongoDB Atlas:** Não precisa instalar nem iniciar MongoDB local!

**Desenvolvimento (com auto-reload):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

#### 5. **Acesse a aplicação**
- **API Base:** `http://localhost:3000/api`
- **Teste:** `http://localhost:3000/api/obras`

---

## 📊 Documentação da API

### **Base URL:** `http://localhost:3000/api`

### 🏗️ **Endpoints - Obras**

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `GET` | `/obras` | Listar todas as obras | - |
| `POST` | `/obras` | Criar nova obra | JSON + Foto (opcional) |
| `GET` | `/obras/:id` | Buscar obra por ID | - |
| `PUT` | `/obras/:id` | Atualizar obra | JSON + Foto (opcional) |
| `DELETE` | `/obras/:id` | Deletar obra | - |
| `GET` | `/obras/:id/fiscalizacoes` | Fiscalizações da obra | - |
| `POST` | `/obras/:id/enviar-email` | Enviar por email | `{"emailDestino": "email@exemplo.com"}` |

### 📋 **Endpoints - Fiscalizações**

| Método | Endpoint | Descrição | Body |
|--------|----------|-----------|------|
| `GET` | `/fiscalizacoes` | Listar todas | - |
| `POST` | `/fiscalizacoes` | Criar fiscalização | JSON + Foto (opcional) |
| `GET` | `/fiscalizacoes/:id` | Buscar por ID | - |
| `PUT` | `/fiscalizacoes/:id` | Atualizar | JSON + Foto (opcional) |
| `DELETE` | `/fiscalizacoes/:id` | Deletar | - |
| `GET` | `/fiscalizacoes/status/:status` | Filtrar por status | - |
| `GET` | `/fiscalizacoes/vencidas` | Listar vencidas | - |

---

## 📝 Exemplos de Uso

### **Criar uma Obra**

**POST** `/api/obras`
```json
{
  "nome": "Construção do Shopping Center",
  "responsavel": "João Silva",
  "dataInicio": "2024-01-15",
  "dataFim": "2024-12-20",
  "localizacao": {
    "latitude": -8.05428,
    "longitude": -34.88109
  },
  "descricao": "Construção de um shopping center com 3 andares",
  "status": "em_andamento"
}
```

### **Criar uma Fiscalização**

**POST** `/api/fiscalizacoes`
```json
{
  "data": "2024-06-21",
  "status": "aprovada",
  "observacoes": "Obra dentro do cronograma, qualidade satisfatória",
  "localizacao": {
    "latitude": -8.05428,
    "longitude": -34.88109
  },
  "obra": "ID_DA_OBRA_AQUI",
  "fiscal": "Maria Santos"
}
```

### **Upload de Imagem**

Para enviar imagens, use `multipart/form-data`:

```javascript
const formData = new FormData();
formData.append('nome', 'Nome da Obra');
formData.append('responsavel', 'João Silva');
formData.append('foto', arquivoImagem); // arquivo de imagem
// ... outros campos

fetch('/api/obras', {
  method: 'POST',
  body: formData
});
```

**Formatos aceitos:** JPEG, JPG, PNG, GIF, WebP  
**Tamanho máximo:** 5MB

---

## 🧪 Testando a API

### **Com Insomnia/Postman**

1. **Importe** a coleção ou crie as requisições manualmente
2. **Configure** a base URL: `http://localhost:3000/api`
3. **Teste** os endpoints seguindo a documentação acima

### **Sequência de testes recomendada:**

1. `GET /api` - Verificar se API está funcionando
2. `POST /api/obras` - Criar uma obra
3. `GET /api/obras` - Listar obras criadas
4. `POST /api/fiscalizacoes` - Criar fiscalização para a obra
5. `GET /api/obras/:id/fiscalizacoes` - Ver fiscalizações da obra
6. `GET http://localhost:3000/foto-obra.html?id=ID_DA_OBRA` - Ver página da obra

---

## 🗃️ Modelos de Dados

### **Obra**
```javascript
{
  nome: String (obrigatório, max: 100),
  responsavel: String (obrigatório, max: 80),
  dataInicio: Date (obrigatório),
  dataFim: Date (obrigatório, > dataInicio),
  localizacao: {
    latitude: Number (-90 a 90),
    longitude: Number (-180 a 180)
  },
  descricao: String (obrigatório, max: 500),
  foto: String (caminho da imagem),
  status: Enum ['planejada', 'em_andamento', 'concluida', 'pausada'],
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

### **Fiscalização**
```javascript
{
  data: Date (obrigatório),
  status: Enum ['aprovada', 'reprovada', 'pendente', 'em_analise'],
  observacoes: String (obrigatório, max: 1000),
  localizacao: {
    latitude: Number (-90 a 90),
    longitude: Number (-180 a 180)
  },
  foto: String (caminho da imagem),
  obra: ObjectId (referência à Obra),
  fiscal: String (obrigatório, max: 80),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

---

## 🔧 Scripts Disponíveis

```bash
# Iniciar em desenvolvimento (com nodemon)
npm run dev

# Iniciar em produção
npm start

# Instalar dependências
npm install
```

---

## 🚀 Deploy

### **Variáveis de ambiente para produção:**

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/sistema_obras
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

### **Plataformas recomendadas:**
- **Heroku** - Fácil deploy
- **Railway** - Moderno e gratuito
- **Render** - Simples e confiável
- **Vercel** - Para projetos Node.js

---

## ⚠️ Resolução de Problemas

### **Erro de conexão com MongoDB**
```bash
# Verificar se a URL do MongoDB Atlas está correta no .env
# Verificar se usuário e senha estão corretos
# O Atlas já aceita conexões de qualquer IP por padrão
```

### **Erro de porta ocupada**
```bash
# Mudar porta no .env
PORT=3001
```

### **Erro de upload de imagem**
- Verificar se pasta `uploads/` existe
- Verificar formato da imagem (JPEG, PNG, etc.)
- Verificar tamanho máximo (5MB)

### **Email não funciona**
- Configurar senha de app do Gmail
- Verificar credenciais no `.env`
- Ativar verificação em 2 etapas

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Deyvid dos Santos Oliveira**
- 🎓 Estudante de **Análise e Projeto de Sistemas**
- 📧 Email: [ddoliveira2000@gmail.com](mailto:ddoliveira2000@gmial.com)

---

## 🙏 Agradecimentos

- Professor da disciplina de Análise e Projeto de Sistemas
- Documentação oficial do [Node.js](https://nodejs.org/), [Express](https://expressjs.com/) e [MongoDB](https://www.mongodb.com/)
- Comunidade open source

---

**⭐ Se este projeto te ajudou, deixe uma estrela no repositório!**

---

*Última atualização: Junho 2024*
