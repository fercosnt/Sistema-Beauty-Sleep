# Configuração de Secrets para Cron Job

## ⚠️ IMPORTANTE: Segurança

**NUNCA** commite secrets (chaves API, senhas, tokens) no Git. A migration `006_cron_job_sync_biologix.sql` não contém valores hardcoded por segurança.

## 📋 Pré-requisitos

Antes de configurar os secrets, certifique-se de que você tem:

1. Arquivo `.env.local` configurado com:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   ```

2. Acesso ao Supabase Dashboard do seu projeto

## 🔧 Método 1: Via SQL Editor (Recomendado)

1. **Acesse o Supabase Dashboard:**
   - Vá em: https://supabase.com/dashboard/project/[seu-project-id]/sql/new

2. **Execute os seguintes comandos SQL:**

   ```sql
   -- Substitua [YOUR_PROJECT_URL] pela URL do seu projeto
   SELECT vault.create_secret('https://seu-projeto.supabase.co', 'project_url');
   
   -- Substitua [YOUR_ANON_KEY] pela sua anon key
   SELECT vault.create_secret('sua_anon_key_aqui', 'anon_key');
   ```

3. **Verifique se os secrets foram criados:**

   ```sql
   SELECT name FROM vault.decrypted_secrets 
   WHERE name IN ('project_url', 'anon_key');
   ```

## 🔧 Método 2: Via Script TypeScript

1. **Instale as dependências necessárias** (se ainda não tiver):

   ```bash
   npm install -D tsx dotenv
   ```

2. **Execute o script:**

   ```bash
   npx tsx scripts/setup-cron-secrets.ts
   ```

   O script irá:
   - Ler as variáveis do `.env.local`
   - Configurar os secrets no Supabase Vault automaticamente

## 🔧 Método 3: Via Supabase CLI

Se você já fez login no Supabase CLI:

```bash
# Fazer login (se ainda não fez)
npx supabase login

# Executar SQL diretamente
npx supabase db execute --file scripts/setup-cron-secrets.sql
```

**Nota:** Você precisará editar `scripts/setup-cron-secrets.sql` e substituir `[YOUR_PROJECT_URL]` e `[YOUR_ANON_KEY]` pelos valores reais antes de executar.

## ✅ Verificação

Após configurar os secrets, verifique se o cron job está funcionando:

```sql
-- Verificar se os secrets existem
SELECT name FROM vault.decrypted_secrets 
WHERE name IN ('project_url', 'anon_key');

-- Verificar se o cron job está ativo
SELECT jobid, jobname, schedule, active 
FROM cron.job 
WHERE jobname = 'sync-biologix-daily';

-- Testar manualmente
SELECT
  net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
    ),
    body := jsonb_build_object('time', now()),
    timeout_milliseconds := 300000
  ) as request_id;
```

## 🔒 Onde encontrar os valores

### Project URL
- Dashboard Supabase → Settings → API → Project URL
- Ou no `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`

### Anon Key
- Dashboard Supabase → Settings → API → anon/public key
- Ou no `.env.local`: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Notas Importantes

1. **Os secrets são armazenados no Supabase Vault**, que é seguro e criptografado
2. **A migration não contém valores hardcoded** - você deve configurá-los manualmente
3. **Cada ambiente (staging/production) precisa ter seus próprios secrets configurados**
4. **Se você já configurou os secrets antes**, executar novamente não causará problemas (usando `vault.create_secret`)

## 🐛 Troubleshooting

### Erro: "permission denied for function vault.create_secret"

Certifique-se de estar usando o SQL Editor do Dashboard com permissões de administrador, ou use o `SUPABASE_SERVICE_ROLE_KEY` no script TypeScript.

### Erro: "secret already exists"

Isso é normal se você já configurou antes. Os secrets não serão sobrescritos. Se precisar atualizar, você precisará deletar e recriar:

```sql
-- Deletar secret existente (cuidado!)
DELETE FROM vault.secrets WHERE name = 'project_url';
DELETE FROM vault.secrets WHERE name = 'anon_key';

-- Recriar com novos valores
SELECT vault.create_secret('novo_valor', 'project_url');
SELECT vault.create_secret('novo_valor', 'anon_key');
```

