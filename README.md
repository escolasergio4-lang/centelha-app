# Centelha Pedagógica - Modernizada com Groq

Uma aplicação moderna para gerar ideias pedagógicas criativas para professores, agora utilizando a API Groq para performance superior.

## 🚀 Novidades da Modernização

- **API Groq**: Migração de OpenAI para Groq com modelo Llama 3.1 70B
- **Performance**: Respostas até 10x mais rápidas
- **Código Organizado**: Arquitetura modular com service layer
- **Type Safety**: TypeScript completo com interfaces tipadas
- **Environment Variables**: Suporte para configuração via ambiente

## 🛠️ Stack Tecnológico

- **Next.js 16.1.1** - Framework React com App Router
- **React 19.2.3** - Biblioteca de UI moderna
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS v4** - Sistema de design utilitário
- **Groq SDK** - Cliente oficial da API Groq
- **Lucide React** - Ícones modernos

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Chave API da Groq (obtenha em [console.groq.com](https://console.groq.com))

## 🚀 Instalação e Configuração

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd centelha-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure sua chave API Groq**
   
   **Opção A: Variável de Ambiente (Recomendado)**
   ```bash
   # Copie o arquivo .env.local
   cp .env.local.example .env.local
   
   # Edite o arquivo com sua chave
   # NEXT_PUBLIC_GROQ_API_KEY=gsk_your_key_here
   ```
   
   **Opção B: Interface da Aplicação**
   - Inicie a aplicação
   - Clique no ícone de engrenagem (⚙️)
   - Insira sua chave API Groq

4. **Inicie o desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🔧 Configuração da API Groq

### Obtendo sua Chave API

1. Acesse [console.groq.com](https://console.groq.com)
2. Crie sua conta gratuita
3. Vá para a seção API Keys
4. Copie sua chave (formato: `gsk_...`)

### Modelos Disponíveis

A aplicação utiliza o modelo `llama-3.1-70b-versatile` por padrão, oferecendo:
- **Alta Performance**: Respostas rápidas e coerentes
- **Grande Contexto**: Janela de contexto de 128K tokens
- **Custo Eficiente**: Preço competitivo por token

## 🏗️ Estrutura do Projeto

```
centelha-app/
├── app/
│   ├── page.tsx              # Página principal da aplicação
│   ├── layout.tsx            # Layout raiz
│   └── globals.css           # Estilos globais
├── lib/
│   └── groq-service.ts       # Service layer da API Groq
├── public/                   # Assets estáticos
├── .env.local               # Variáveis de ambiente
├── package.json             # Dependências e scripts
└── README.md               # Este arquivo
```

## 📝 Uso da Aplicação

1. **Preencha o formulário:**
   - **Tema**: O que você quer ensinar (ex: Frações, Guerra Fria)
   - **Nível**: Fundamental I, Fundamental II, Ensino Médio ou EJA
   - **Ano/Série**: Selecione o ano específico
   - **Disciplina**: Escolha entre 15 disciplinas disponíveis

2. **Clique em "Acender Centelha"** para gerar uma ideia criativa

3. **Use o resultado:**
   - Visualize o tipo de atividade (Aula, Projeto ou Oficina)
   - Leia a centelha criativa
   - Clique em "Criar Plano Completo" para acessar o planejador

## 🎯 Funcionalidades

### Geração de Ideias
- **15 Disciplinas**: Artes, Biologia, História, Matemática, etc.
- **4 Níveis de Ensino**: Fundamental I/II, Médio, EJA
- **Formato Estruturado**: JSON com título, tipo e centelha
- **Prompt Otimizado**: Respostas começam com "Que tal..."

### Interface Moderna
- **Design Responsivo**: Funciona em desktop e mobile
- **Animações Suaves**: Transições e feedback visual
- **Acessibilidade**: Semântica HTML e navegação por teclado
- **PWA Ready**: Instalável como aplicativo

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código ESLint
```

## 🚀 Build e Deploy

### Build de Produção
```bash
npm run build
npm run start
```

### Deploy na Vercel (Recomendado)
1. Conecte seu repositório à Vercel
2. Configure a variável de ambiente `NEXT_PUBLIC_GROQ_API_KEY`
3. Deploy automático

## 🐛 Troubleshooting

### Erro: "Chave API inválida"
- Verifique se sua chave Groq está correta
- Confirme se não há espaços em branco
- Teste sua chave na documentação Groq

### Erro: "Resposta vazia da API"
- Verifique sua conexão com a internet
- Confirme se o modelo está disponível
- Tente novamente após alguns segundos

### Performance Lenta
- O modelo Llama 3.1 70b é rápido, mas pode ter picos
- Considere usar `mixtral-8x7b-32768` para respostas mais rápidas

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para detalhes.

## 🙏 Agradecimentos

- **Groq** pela API de alta performance
- **Next.js** pelo framework excelente
- **Escola Sérgio** pelo apoio e patrocínio

---

**© 2026 Escola Sérgio • Apoio Docente**