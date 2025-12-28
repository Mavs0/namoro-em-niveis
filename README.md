# 🎮 Namoro em Níveis

Um mini site one-page de presente romântico com estética de jogo retrô (pixel art), criado com Next.js, TypeScript e Tailwind CSS.

## 🎯 Sobre o Projeto

"Namoro em Níveis" é uma aplicação front-end que representa um relacionamento como níveis de um jogo, com foco emocional, visual retrô e interações leves. Cada nível representa uma fase do relacionamento, desde o primeiro encontro até o futuro juntos.

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Button, Card, Progress)
- **PixiJS** (sprites pixel art, corações animados, partículas)
- **Google Fonts** (Press Start 2P + Inter)

## 📦 Instalação

1. Clone o repositório ou navegue até a pasta do projeto:
```bash
cd present
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🚀 Como Publicar no GitHub

### Passo 1: Criar um Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito e selecione **"New repository"**
3. Preencha:
   - **Repository name**: `namoro-em-niveis` (ou o nome que preferir)
   - **Description**: "Um mini site one-page de presente romântico com estética de jogo retrô"
   - **Visibility**: Escolha **Public** ou **Private**
   - **NÃO** marque "Initialize this repository with a README" (já temos um)
4. Clique em **"Create repository"**

### Passo 2: Inicializar Git no Projeto (se ainda não foi feito)

Abra o terminal na pasta do projeto e execute:

```bash
# Inicializar o repositório Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit: Namoro em Níveis - projeto completo"
```

### Passo 3: Conectar com o Repositório Remoto

```bash
# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/namoro-em-niveis.git

# Ou se preferir usar SSH:
# git remote add origin git@github.com:SEU_USUARIO/namoro-em-niveis.git

# Verificar se foi adicionado corretamente
git remote -v
```

### Passo 4: Enviar para o GitHub

```bash
# Enviar o código para o GitHub (branch main)
git branch -M main
git push -u origin main
```

Se pedir autenticação:
- **HTTPS**: Use um Personal Access Token (não sua senha)
- **SSH**: Certifique-se de ter configurado suas chaves SSH

### Passo 5: Criar Personal Access Token (se necessário)

Se estiver usando HTTPS e o GitHub pedir autenticação:

1. Vá em **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Clique em **"Generate new token (classic)"**
3. Dê um nome e selecione os escopos: `repo` (acesso completo aos repositórios)
4. Clique em **"Generate token"**
5. **Copie o token** (você não verá ele novamente!)
6. Use esse token como senha quando o Git pedir credenciais

## 🌐 Publicar no Vercel (Recomendado)

A forma mais fácil de publicar um projeto Next.js é usando a Vercel:

### Opção 1: Via Interface Web

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub
2. Clique em **"Add New Project"**
3. Selecione o repositório `namoro-em-niveis`
4. A Vercel detectará automaticamente que é um projeto Next.js
5. Clique em **"Deploy"**
6. Pronto! Seu site estará online em alguns segundos

### Opção 2: Via CLI

```bash
# Instalar a CLI da Vercel globalmente
npm install -g vercel

# No diretório do projeto, executar:
vercel

# Seguir as instruções no terminal
```

## 📁 Estrutura do Projeto

```
present/
├── app/
│   ├── page.tsx          # Página principal
│   ├── layout.tsx        # Layout raiz
│   └── globals.css       # Estilos globais
├── components/
│   ├── ui/               # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── progress.tsx
│   ├── GameStart.tsx     # Tela inicial
│   ├── Hud.tsx           # HUD do jogo
│   ├── LevelCard.tsx     # Card de nível
│   ├── PixiHeart.tsx     # Corações animados
│   └── Boss.tsx          # Boss fight
├── lib/
│   └── utils.ts          # Utilitários
├── public/               # Arquivos estáticos
│   └── sprites/          # Sprites pixel art (opcional)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Personalização

### Cores

As cores podem ser alteradas em `tailwind.config.ts` e `app/globals.css`:

- **Fundo**: `#1B1F3B`
- **Azul retrô**: `#4D6AFF`
- **Rosa pixel**: `#FF7AA2`
- **Amarelo XP**: `#FFD166`
- **Branco**: `#F5F5F5`

### Textos e Níveis

Os textos e níveis podem ser personalizados diretamente em `app/page.tsx`, no array `levels`.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 🎮 Funcionalidades

- ✅ Tela inicial com animação
- ✅ HUD com corações e barra de XP
- ✅ Sistema de níveis com diferentes status
- ✅ Animações com PixiJS
- ✅ Boss fight simbólico
- ✅ Tela final emocional
- ✅ Design responsivo (mobile-first)
- ✅ Estética pixel art retrô

## 📄 Licença

Este projeto foi criado como um presente pessoal. Sinta-se livre para usar e modificar como desejar!

## 💝 Créditos

Criado com ❤️ usando Next.js, TypeScript e muito carinho.

---

**Dica**: Após fazer o deploy, compartilhe o link com a pessoa especial! 🎁

