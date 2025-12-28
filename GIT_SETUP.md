# 🚀 Guia Rápido: Enviar para o GitHub

## Passo a Passo Simplificado

### 1. Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `namoro-em-niveis`
3. Descrição: "Presente romântico com estética de jogo retrô"
4. Escolha **Public** ou **Private**
5. **NÃO** marque "Initialize with README"
6. Clique em **"Create repository"**

### 2. No Terminal (na pasta do projeto)

```bash
# 1. Inicializar Git (se ainda não foi feito)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Fazer o primeiro commit
git commit -m "Initial commit: Namoro em Níveis"

# 4. Renomear branch para main (se necessário)
git branch -M main

# 5. Adicionar o repositório remoto
# SUBSTITUA SEU_USUARIO pelo seu username do GitHub
git remote add origin https://github.com/SEU_USUARIO/namoro-em-niveis.git

# 6. Enviar para o GitHub
git push -u origin main
```

### 3. Se Pedir Autenticação

**Opção A: Personal Access Token (Recomendado)**

1. Vá em: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. Nome: `namoro-em-niveis-token`
4. Selecione: `repo` (acesso completo)
5. Clique em **"Generate token"**
6. **COPIE O TOKEN** (você não verá novamente!)
7. Quando o Git pedir senha, use o **TOKEN** (não sua senha)

**Opção B: SSH (Alternativa)**

```bash
# Usar SSH em vez de HTTPS
git remote set-url origin git@github.com:SEU_USUARIO/namoro-em-niveis.git
```

### 4. Verificar se Funcionou

Acesse: `https://github.com/SEU_USUARIO/namoro-em-niveis`

Você deve ver todos os arquivos do projeto lá!

---

## 📦 Próximos Passos: Publicar Online

### Opção 1: Vercel (Mais Fácil)

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Selecione `namoro-em-niveis`
5. Clique em **"Deploy"**
6. Pronto! Seu site estará online em segundos

### Opção 2: Netlify

1. Acesse: https://netlify.com
2. Faça login com GitHub
3. Clique em **"Add new site"** → **"Import an existing project"**
4. Selecione `namoro-em-niveis`
5. Configurações:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Clique em **"Deploy site"**

---

## ✅ Checklist

- [ ] Repositório criado no GitHub
- [ ] Git inicializado no projeto
- [ ] Arquivos adicionados (`git add .`)
- [ ] Primeiro commit feito
- [ ] Repositório remoto adicionado
- [ ] Código enviado para o GitHub (`git push`)
- [ ] Site publicado (Vercel/Netlify)

---

## 🆘 Problemas Comuns

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/namoro-em-niveis.git
```

### Erro: "failed to push"
```bash
# Verificar se está autenticado
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Tentar novamente
git push -u origin main
```

### Erro: "authentication failed"
- Use um Personal Access Token em vez da senha
- Ou configure SSH keys

---

**Dica**: Depois de publicar, compartilhe o link com a pessoa especial! 💝

