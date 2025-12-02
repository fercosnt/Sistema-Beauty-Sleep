# 🔧 Configurações de Ambiente Necessárias

## 10.1.5 - Documentar configurações de ambiente necessárias

**Data:** 2025-12-02  
**Status:** ✅ Documentação completa criada

---

## 📋 Variáveis de Ambiente Obrigatórias

### Frontend (Next.js)

#### Variáveis Públicas (NEXT_PUBLIC_*)
```env
# URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co

# Chave pública do Supabase (anon key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

#### Variáveis Privadas (Server-side)
```env
# Chave de serviço do Supabase (service role key)
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

**⚠️ IMPORTANTE:**
- `NEXT_PUBLIC_*` são expostas ao cliente (navegador)
- `SUPABASE_SERVICE_ROLE_KEY` nunca deve ser exposta ao cliente
- Usar apenas no servidor (API routes, Server Components)

---

### Edge Function: sync-biologix

#### Secrets no Supabase Dashboard
Configure os seguintes secrets na Edge Function:

```
BIOLOGIX_USERNAME=[username]
BIOLOGIX_PASSWORD=[password]
BIOLOGIX_SOURCE=[source-number]
BIOLOGIX_PARTNER_ID=[partner-id]
```

**Como configurar:**
1. Acesse Supabase Dashboard → Edge Functions → sync-biologix
2. Vá em "Settings" → "Secrets"
3. Adicione cada secret acima

---

## 🌍 Ambientes

### Desenvolvimento Local

**Arquivo:** `.env.local`

```env
# Supabase (desenvolvimento/staging)
NEXT_PUBLIC_SUPABASE_URL=https://[staging-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[staging-service-role-key]

# Opcional: URL do site local
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Testes (opcional)
TEST_USER_EMAIL=admin@beautysmile.com
TEST_USER_PASSWORD=[senha-teste]
```

---

### Staging

**Onde configurar:** Vercel Dashboard → Project Settings → Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://[staging-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[staging-service-role-key]
NEXT_PUBLIC_SITE_URL=https://[staging-vercel-url].vercel.app
```

**Edge Function Secrets:**
- Configure no Supabase Dashboard (projeto staging)
- Use credenciais de staging da API Biologix

---

### Produção

**Onde configurar:** Vercel Dashboard → Project Settings → Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://[production-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[production-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[production-service-role-key]
NEXT_PUBLIC_SITE_URL=https://[production-domain].com
```

**Edge Function Secrets:**
- Configure no Supabase Dashboard (projeto produção)
- Use credenciais de produção da API Biologix

---

## 🔐 Configuração do Supabase Auth

### URLs de Redirecionamento

Configure no Supabase Dashboard → Authentication → URL Configuration:

**Desenvolvimento:**
```
Site URL: http://localhost:3000
Redirect URLs:
  - http://localhost:3000/auth/callback
  - http://localhost:3000/dashboard
```

**Staging:**
```
Site URL: https://[staging-url].vercel.app
Redirect URLs:
  - https://[staging-url].vercel.app/auth/callback
  - https://[staging-url].vercel.app/dashboard
```

**Produção:**
```
Site URL: https://[production-domain].com
Redirect URLs:
  - https://[production-domain].com/auth/callback
  - https://[production-domain].com/dashboard
```

---

## 📧 Configuração SMTP (Opcional mas Recomendado)

Para envio de emails de convite e reset de senha:

**Onde configurar:** Supabase Dashboard → Settings → Auth → SMTP Settings

**Opções:**
- Gmail (SMTP)
- SendGrid
- AWS SES
- Outros provedores SMTP

**Variáveis necessárias:**
- SMTP Host
- SMTP Port
- SMTP User
- SMTP Password
- From Email
- From Name

**⚠️ NOTA:** Sem SMTP configurado, emails não são enviados automaticamente.

---

## 🗄️ Configuração do Banco de Dados

### Migrations

**Ordem de aplicação:**
1. `001_initial_schema.sql` - Schema inicial
2. `002_functions.sql` (integrado em 004)
3. `003_triggers.sql` - Triggers automáticos
4. `004_rls_policies.sql` - Row Level Security
5. `005_seed_data.sql` - Dados iniciais (tags)
6. `006_fix_proxima_manutencao.sql` - Correção de cálculo

**Como aplicar:**
- Via Supabase Dashboard → SQL Editor
- Via Supabase CLI: `npx supabase db push`

---

### Cron Job

**Configuração:**
- Nome: `sync-biologix-daily`
- Schedule: `0 13 * * *` (10h BRT = 13h UTC)
- Edge Function: `sync-biologix`

**Como verificar:**
```sql
SELECT * FROM cron.job WHERE jobname = 'sync-biologix-daily';
```

---

## ✅ Checklist de Configuração

### Antes do Deploy em Staging

- [ ] Variáveis de ambiente configuradas no Vercel (staging)
- [ ] Supabase Auth URLs configuradas (staging)
- [ ] Edge Function secrets configurados (staging)
- [ ] Migrations aplicadas (staging)
- [ ] Cron job configurado (staging)
- [ ] SMTP configurado (opcional)

### Antes do Deploy em Produção

- [ ] Variáveis de ambiente configuradas no Vercel (produção)
- [ ] Supabase Auth URLs configuradas (produção)
- [ ] Edge Function secrets configurados (produção)
- [ ] Migrations aplicadas (produção)
- [ ] Cron job configurado (produção)
- [ ] SMTP configurado (recomendado)
- [ ] Backup do banco de dados criado

---

## 📝 Exemplo de Arquivo .env.local

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qigbblypwkgflwnrrhzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-anon-key-aqui]
SUPABASE_SERVICE_ROLE_KEY=[sua-service-role-key-aqui]

# Site URL (opcional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Testes (opcional)
TEST_USER_EMAIL=admin@beautysmile.com
TEST_USER_PASSWORD=admin123
```

**⚠️ IMPORTANTE:**
- Nunca commitar arquivo `.env.local` no Git
- Adicionar `.env.local` ao `.gitignore`
- Usar variáveis de ambiente do Vercel em produção

---

**Documentação criada em:** 2025-12-02

