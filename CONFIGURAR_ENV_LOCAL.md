# Como Configurar o Arquivo .env.local

O script de migração precisa das credenciais do Supabase para funcionar. Siga estes passos:

## 📋 Passo 1: Criar o arquivo .env.local

Crie um arquivo chamado `.env.local` na raiz do projeto (mesmo nível do `package.json`).

## 📋 Passo 2: Obter as Credenciais do Supabase

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto: `qigbblypwkgflwnrrhzg`
3. Vá em **Settings** → **API**
4. Copie os seguintes valores:

### Project URL
- Encontre em **Project URL**
- Exemplo: `https://qigbblypwkgflwnrrhzg.supabase.co`

### Anon Key
- Encontre em **Project API keys** → **anon** / **public**
- Esta é a chave pública (pode ser exposta no frontend)

### Service Role Key
- Encontre em **Project API keys** → **service_role** / **secret**
- ⚠️ **IMPORTANTE**: Esta chave tem acesso total ao banco (bypass RLS)
- **NUNCA** exponha esta chave publicamente ou no código frontend
- Use apenas em scripts server-side ou Edge Functions

## 📋 Passo 3: Preencher o arquivo .env.local

Copie o conteúdo abaixo e preencha com seus valores reais:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qigbblypwkgflwnrrhzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Biologix API Credentials (opcional para migração)
BIOLOGIX_USERNAME=l|DEMO|47349438
BIOLOGIX_PASSWORD=sua_senha_aqui
BIOLOGIX_SOURCE=100
BIOLOGIX_PARTNER_ID=4798042LW
```

## ✅ Verificar Configuração

Após criar o arquivo, você pode verificar se está correto:

```bash
# Windows PowerShell
Get-Content .env.local

# Linux/Mac
cat .env.local
```

## 🔒 Segurança

- ✅ O arquivo `.env.local` já está no `.gitignore` (não será commitado)
- ✅ Nunca compartilhe o `SUPABASE_SERVICE_ROLE_KEY`
- ✅ Use apenas em scripts server-side
- ✅ Não exponha no código frontend

## 🚀 Próximo Passo

Após configurar o `.env.local`, execute novamente:

```bash
npx tsx scripts/migrate-from-airtable.ts --env=staging
```

