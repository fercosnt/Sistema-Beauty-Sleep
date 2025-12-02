# 🚀 Guia: Deploy em Staging

## 10.2 - Deploy em Staging

**Data:** 2025-12-02  
**Status:** 📋 Guia criado - Pronto para execução

---

## 📋 Checklist de Deploy em Staging

### 10.2.1 - Criar conta Vercel e linkar repositório

**Passo a passo:**

1. **Acesse Vercel:**
   - Vá para https://vercel.com
   - Faça login com GitHub/GitLab/Bitbucket

2. **Importar projeto:**
   - Clique em "Add New Project"
   - Selecione o repositório do Beauty Sleep
   - Vercel detectará automaticamente Next.js

3. **Configurar projeto:**
   - Framework Preset: Next.js
   - Root Directory: `./` (raiz do projeto)
   - Build Command: `npm run build`
   - Output Directory: `.next` (automático)
   - Install Command: `npm install`

**Status:** ⏳ Ação manual necessária

---

### 10.2.2 - Configurar variáveis de ambiente no Vercel (staging Supabase)

**Passo a passo:**

1. **Acesse Vercel Dashboard:**
   - Vá para o projeto
   - Settings → Environment Variables

2. **Adicionar variáveis para ambiente "Preview" (staging):**

```
NEXT_PUBLIC_SUPABASE_URL=https://[staging-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[staging-service-role-key]
NEXT_PUBLIC_SITE_URL=https://[projeto]-[hash].vercel.app
```

**Como obter valores:**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Dashboard → Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Dashboard → Settings → API → anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard → Settings → API → service_role key (secreto)

**⚠️ IMPORTANTE:**
- Marque como "Preview" environment (para staging)
- Não marque como "Production" ainda
- `SUPABASE_SERVICE_ROLE_KEY` deve ser marcado como "Sensitive"

**Status:** ⏳ Ação manual necessária

---

### 10.2.3 - Configurar Supabase Auth para staging

**Passo a passo:**

1. **Acesse Supabase Dashboard (projeto staging):**
   - Authentication → URL Configuration

2. **Configurar URLs:**

```
Site URL: https://[projeto]-[hash].vercel.app

Redirect URLs (adicionar todas):
  - https://[projeto]-[hash].vercel.app/auth/callback
  - https://[projeto]-[hash].vercel.app/dashboard
  - https://[projeto]-[hash].vercel.app/*
```

**Nota:** O Vercel gerará uma URL única para cada preview deployment.

**Status:** ⏳ Ação manual necessária

---

### 10.2.4 - Deploy para staging

**Opção 1: Via Vercel Dashboard (Recomendado)**

1. Após configurar variáveis de ambiente
2. Clique em "Deploy" ou faça push para branch
3. Vercel fará deploy automaticamente

**Opção 2: Via CLI**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Link projeto
vercel link

# Deploy para preview (staging)
vercel
```

**Status:** ⏳ Ação manual necessária

---

### 10.2.5 - Verificar deployment

**Checklist:**

- [ ] Visitar URL staging: https://[projeto]-[hash].vercel.app
- [ ] Página carrega sem erros
- [ ] Não há erros no console do navegador
- [ ] Verificar logs no Vercel Dashboard

**Verificações básicas:**
- [ ] Homepage redireciona para /login
- [ ] Página de login aparece
- [ ] Build foi bem-sucedido (sem erros)

**Status:** ⏳ Ação manual necessária

---

### 10.2.6 - Executar smoke tests no ambiente staging

**Testes rápidos:**

1. **Teste de Login:**
   - [ ] Acessar /login
   - [ ] Preencher credenciais
   - [ ] Login bem-sucedido
   - [ ] Redireciona para /dashboard

2. **Teste de Dashboard:**
   - [ ] Dashboard carrega
   - [ ] KPIs aparecem (ou "--" para recepção)
   - [ ] Navegação funciona

3. **Teste de Pacientes:**
   - [ ] Lista de pacientes carrega
   - [ ] Busca funciona
   - [ ] Navegação para perfil funciona

**Status:** ⏳ Ação manual necessária

---

### 10.2.7 - Testar todos os fluxos críticos

**Fluxos a testar:**

1. **Login → Dashboard:**
   - [ ] Login funciona
   - [ ] Dashboard carrega corretamente
   - [ ] Navegação funciona

2. **Criar Paciente:**
   - [ ] Botão "Novo Paciente" visível
   - [ ] Modal abre
   - [ ] Formulário funciona
   - [ ] Validações funcionam
   - [ ] Paciente criado com sucesso
   - [ ] Aparece na lista

3. **Criar Sessão:**
   - [ ] Acessar perfil do paciente
   - [ ] Botão "Nova Sessão" funciona
   - [ ] Modal abre
   - [ ] Formulário funciona
   - [ ] Sessão criada com sucesso
   - [ ] Status muda para "ativo" (se era "lead")

4. **Visualizar Dashboard:**
   - [ ] KPIs corretos
   - [ ] Gráficos renderizam
   - [ ] Ações pendentes aparecem

**Status:** ⏳ Ação manual necessária

---

### 10.2.8 - Compartilhar URL staging com stakeholders

**Após verificação bem-sucedida:**

- [ ] Compartilhar URL staging com stakeholders
- [ ] Solicitar feedback
- [ ] Documentar feedback recebido

**URL exemplo:**
```
https://beauty-sleep-[hash].vercel.app
```

**Status:** ⏳ Ação manual necessária

---

### 10.2.9 - Coletar feedback e corrigir issues

**Processo:**

1. **Coletar feedback:**
   - [ ] Documentar issues encontrados
   - [ ] Priorizar correções
   - [ ] Corrigir issues críticos

2. **Re-deploy se necessário:**
   - [ ] Corrigir código
   - [ ] Fazer novo deploy
   - [ ] Verificar correções

**Status:** ⏳ Ação manual necessária

---

## 📋 Resumo do Processo

1. ⏳ Criar conta Vercel e importar projeto
2. ⏳ Configurar variáveis de ambiente
3. ⏳ Configurar Supabase Auth URLs
4. ⏳ Fazer deploy
5. ⏳ Verificar deployment
6. ⏳ Executar smoke tests
7. ⏳ Testar fluxos críticos
8. ⏳ Compartilhar com stakeholders
9. ⏳ Coletar feedback e corrigir

---

## ⚠️ Pontos de Atenção

- ✅ Usar projeto Supabase **staging** (não produção)
- ✅ Variáveis de ambiente corretas para staging
- ✅ URLs de redirect configuradas corretamente
- ✅ Edge Function secrets configurados no Supabase staging
- ✅ Testar todos os fluxos antes de compartilhar

---

## 📝 Notas

- O Vercel cria uma URL única para cada preview deployment
- Após aprovação dos stakeholders, pode-se fazer deploy em produção
- Sempre testar em staging antes de produção

---

**Guia criado em:** 2025-12-02  
**Próximo passo:** Seguir o checklist acima para fazer deploy

