# 📦 Instruções: Deploy no Vercel

## Setup Inicial do Vercel

### ⚠️ IMPORTANTE: Repositório GitHub de Outra Pessoa

Se o repositório GitHub pertence a outra pessoa, veja: `docs/deploy/GUIA_VERCEL_GITHUB_OUTRA_PESSOA.md`

**Opções rápidas:**
1. **Pedir para ser adicionado como colaborador no GitHub** (recomendado)
2. **Deploy manual via CLI** (não precisa acesso ao GitHub)

---

### 1. Criar Conta Vercel

1. Acesse: https://vercel.com
2. Clique em "Sign Up"
3. Escolha método de autenticação (GitHub recomendado)
4. Complete o cadastro

### 2. Importar Projeto

**Se você tem acesso ao repositório GitHub:**

1. No Dashboard do Vercel, clique em **"Add New Project"**
2. Conecte seu repositório Git (GitHub/GitLab/Bitbucket)
3. Selecione o repositório: `Sistema-Beauty-Sleep-main`
4. Vercel detectará automaticamente:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

**Se você NÃO tem acesso ao repositório GitHub:**

Use deploy manual via CLI (veja seção "Deploy Manual" abaixo ou `GUIA_VERCEL_GITHUB_OUTRA_PESSOA.md`)

### 3. Configuração do Projeto

**Framework Preset:** Next.js (auto-detectado)

**Build Settings:**
```
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

**Node.js Version:** 18.x ou superior (auto-detectado)

---

## Configuração de Ambiente (Staging)

### Passo 1: Configurar Variáveis de Ambiente

1. No projeto Vercel, vá em **Settings** → **Environment Variables**
2. Adicione as seguintes variáveis para ambiente **Preview**:

| Nome | Valor | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[staging-project-id].supabase.co` | Preview |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `[staging-anon-key]` | Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | `[staging-service-role-key]` | Preview |

**⚠️ IMPORTANTE:**
- Marque `SUPABASE_SERVICE_ROLE_KEY` como **"Sensitive"**
- Use ambiente **Preview** para staging
- Não use **Production** até ter aprovação

### Passo 2: Obter Valores do Supabase

**Para Staging:**

1. Acesse Supabase Dashboard (projeto staging)
2. Vá em **Settings** → **API**
3. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ secreto)

---

## Configuração do Supabase Auth (Staging)

### Passo 1: Configurar URLs

1. Acesse Supabase Dashboard (projeto staging)
2. Vá em **Authentication** → **URL Configuration**

### Passo 2: Adicionar URLs

Após fazer o primeiro deploy, você receberá uma URL do Vercel como:
```
https://beauty-sleep-[hash].vercel.app
```

**Configurar no Supabase:**

```
Site URL: https://beauty-sleep-[hash].vercel.app

Redirect URLs (adicionar uma por vez):
  https://beauty-sleep-[hash].vercel.app/auth/callback
  https://beauty-sleep-[hash].vercel.app/dashboard
  https://beauty-sleep-[hash].vercel.app/*
```

**Nota:** Você pode usar wildcard `*` para aceitar qualquer sub-rota.

---

## Deploy

### Opção 1: Deploy Automático (Git Push)

1. Após configurar variáveis de ambiente
2. Faça push para o repositório:
   ```bash
   git push origin main
   ```
3. Vercel fará deploy automaticamente

### Opção 2: Deploy Manual (Vercel CLI)

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Login
vercel login

# Link projeto (primeira vez)
vercel link

# Deploy para preview (staging)
vercel

# Para produção (apenas após aprovação)
vercel --prod
```

---

## Verificação Pós-Deploy

### Checklist Rápido:

- [ ] Visitar URL do deployment
- [ ] Verificar que não há erros na página
- [ ] Testar login
- [ ] Verificar logs no Vercel Dashboard

### Verificar Logs:

1. Vercel Dashboard → Projeto → **Deployments**
2. Clique no deployment mais recente
3. Aba **"Functions"** ou **"Logs"**
4. Verifique se há erros

---

## URLs de Exemplo

### Staging (Preview):
```
https://beauty-sleep-git-main-[hash].vercel.app
```

### Produção (após aprovação):
```
https://beauty-sleep.vercel.app
```

---

## Troubleshooting

### Erro: "Missing environment variables"
**Solução:** Verificar se todas as variáveis foram configuradas no Vercel Dashboard

### Erro: "Invalid redirect URL"
**Solução:** Adicionar URL do Vercel nas Redirect URLs do Supabase Auth

### Build falha
**Solução:** 
- Verificar logs no Vercel Dashboard
- Testar build local: `npm run build`
- Verificar erros de TypeScript

---

**Documentação criada em:** 2025-12-02

