# 🔗 Guia: Conectar Vercel com GitHub de Outra Pessoa

**Problema:** Você precisa fazer deploy no Vercel, mas o repositório GitHub pertence a outra pessoa/conta.

---

## 🎯 Opções Disponíveis

### Opção 1: Colaborador no GitHub (Recomendado)

**Como funciona:** A pessoa que tem o repositório adiciona você como colaborador.

**Passo a passo:**

1. **Peça para a pessoa adicionar você:**
   - A pessoa vai no repositório GitHub
   - Settings → Collaborators → Add people
   - Adiciona seu email/usuário GitHub
   - Você recebe um convite por email

2. **Aceite o convite:**
   - Acesse o email
   - Clique no link de aceitar convite
   - Você terá acesso ao repositório

3. **Conecte no Vercel:**
   - Acesse Vercel Dashboard
   - Add New Project
   - Selecione o repositório (agora aparecerá na lista)
   - Configure e faça deploy

**Vantagens:**
- ✅ Você mantém sua conta Vercel
- ✅ Você pode fazer deploys
- ✅ Permissões controladas pelo dono

---

### Opção 2: Usar a Conta Vercel da Pessoa

**Como funciona:** Você usa a conta Vercel da pessoa que tem o GitHub.

**Passo a passo:**

1. **Peça acesso à conta Vercel:**
   - A pessoa adiciona seu email como membro do time no Vercel
   - Você recebe convite por email
   - Aceita o convite

2. **Acesse a conta:**
   - Faça login no Vercel com sua conta
   - Você verá os projetos do time

3. **Faça deploy:**
   - Selecione o projeto
   - Configure e faça deploy

**Vantagens:**
- ✅ Sem precisar ser colaborador no GitHub
- ✅ Acesso compartilhado ao projeto Vercel

---

### Opção 3: Fork do Repositório

**Como funciona:** Você faz um fork do repositório para sua conta.

**Passo a passo:**

1. **Fazer fork:**
   - Acesse o repositório GitHub
   - Clique em "Fork"
   - O repositório será copiado para sua conta

2. **Conectar no Vercel:**
   - Vercel Dashboard → Add New Project
   - Selecione seu fork
   - Configure e faça deploy

**⚠️ IMPORTANTE:**
- Mudanças no seu fork não afetam o repositório original
- Para atualizar, você precisa fazer sync manualmente
- **Não recomendado para produção**

---

### Opção 4: Deploy Manual via CLI (Sem conexão GitHub)

**Como funciona:** Você faz deploy direto sem conectar GitHub.

**Passo a passo:**

1. **Instalar Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login no Vercel:**
```bash
vercel login
```

3. **Clonar repositório localmente:**
```bash
git clone [url-do-repositorio]
cd [nome-do-projeto]
```

4. **Deploy direto:**
```bash
vercel
```

5. **Configurar variáveis de ambiente:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

**Vantagens:**
- ✅ Não precisa de acesso ao GitHub
- ✅ Funciona mesmo sem conexão GitHub-Vercel

**Desvantagens:**
- ⚠️ Deploy manual (não automático)
- ⚠️ Precisa clonar repositório

---

## 🎯 Recomendação

### Para Desenvolvimento/Staging:
**Use Opção 1 ou 2** - Acesso compartilhado é melhor para equipe

### Para Deploy Temporário/Teste:
**Use Opção 4** - Deploy manual via CLI é rápido

### Para Produção:
**Use Opção 1** - Colaborador no GitHub é mais seguro

---

## 📋 Checklist por Opção

### Opção 1: Colaborador GitHub
- [ ] Pedir para pessoa adicionar como colaborador
- [ ] Aceitar convite por email
- [ ] Verificar acesso ao repositório
- [ ] Conectar no Vercel
- [ ] Fazer deploy

### Opção 2: Membro do Time Vercel
- [ ] Pedir para pessoa adicionar como membro
- [ ] Aceitar convite por email
- [ ] Acessar projetos do time
- [ ] Fazer deploy

### Opção 3: Fork (não recomendado)
- [ ] Fazer fork do repositório
- [ ] Conectar fork no Vercel
- [ ] Fazer deploy
- [ ] Lembrar que é cópia, não original

### Opção 4: Deploy Manual
- [ ] Instalar Vercel CLI
- [ ] Fazer login
- [ ] Clonar repositório
- [ ] Deploy via CLI
- [ ] Configurar variáveis de ambiente

---

## 🔧 Instruções Detalhadas: Opção 1 (Recomendada)

### Passo 1: Pessoa adiciona você no GitHub

**A pessoa faz:**

1. Vai no repositório: `https://github.com/[usuario]/[repositorio]`
2. Settings → Collaborators → Add people
3. Digita seu email/usuário GitHub
4. Seleciona permissão: **Write** (permite push)
5. Envia convite

### Passo 2: Você aceita convite

1. Verifica email (vem de GitHub)
2. Clica em "View invitation"
3. Aceita convite
4. Agora tem acesso ao repositório

### Passo 3: Conectar no Vercel

1. **Acesse Vercel:** https://vercel.com
2. **Login** com sua conta
3. **Add New Project**
4. **Import Git Repository**
5. **Conecte GitHub** (se ainda não conectou)
6. **Selecione o repositório** (agora aparecerá)
7. **Configure projeto:**
   - Framework: Next.js (auto-detectado)
   - Root Directory: `./`
   - Build Command: `npm run build`
8. **Configure variáveis de ambiente** (Settings → Environment Variables)
9. **Deploy!**

---

## 🔧 Instruções Detalhadas: Opção 4 (Deploy Manual)

### Passo 1: Preparar ambiente local

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login no Vercel
vercel login

# 3. Clonar repositório (ou baixar ZIP e extrair)
git clone [url-do-repositorio]
cd [nome-do-projeto]

# 4. Instalar dependências
npm install
```

### Passo 2: Deploy inicial

```bash
# Fazer deploy (será perguntado sobre configurações)
vercel

# Responder perguntas:
# - Link to existing project? (N) - Criar novo
# - Project name? beauty-sleep (ou nome desejado)
# - Directory? ./
# - Override settings? (N)
```

### Passo 3: Configurar variáveis de ambiente

```bash
# Adicionar variáveis uma por uma
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview sensitive

# Para cada uma, digite o valor quando solicitado
```

**Ou via Dashboard:**
- Vercel Dashboard → Projeto → Settings → Environment Variables
- Adicionar manualmente

### Passo 4: Deploy novamente com variáveis

```bash
vercel
```

---

## 📝 Resumo Rápido

**Melhor opção:** Pedir para ser adicionado como **colaborador no GitHub** (Opção 1)

**Opção rápida:** Deploy manual via **Vercel CLI** (Opção 4)

**Evitar:** Fork do repositório (Opção 3) - cria cópia desconectada

---

## ❓ Perguntas Frequentes

**P: Posso conectar Vercel sem acesso ao GitHub?**
R: Sim! Use deploy manual via CLI (Opção 4)

**P: E se eu não tiver acesso ao repositório?**
R: Você precisa pedir acesso ou fazer fork/deploy manual

**P: O deploy manual sincroniza com GitHub?**
R: Não. É deploy manual. Para sincronizar, você precisa acesso ao GitHub.

**P: Posso usar minha conta Vercel com repositório de outra pessoa?**
R: Sim, se você for colaborador no GitHub ou membro do time Vercel

---

**Guia criado em:** 2025-12-02

