# 🔧 Troubleshooting: Exames Não Estão Sendo Inseridos Automaticamente

## 🎯 Problema

Os exames do Biologix não estão sendo sincronizados automaticamente no sistema.

## ⚡ Solução Rápida (Erro Mais Comum)

Se você está vendo o erro:
```
ERROR: cross-database references are not implemented: extensions.net.http_post
```

**Execute este script SQL no Supabase:**
1. Abra: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new
2. Copie e cole o conteúdo de `scripts/db/debug/fix-cron-job.sql`
3. Execute o script

Ou copie e cole diretamente:

```sql
-- Criar função wrapper
CREATE OR REPLACE FUNCTION public.net_http_post(
  url TEXT,
  headers JSONB DEFAULT '{}'::JSONB,
  body JSONB DEFAULT '{}'::JSONB,
  timeout_milliseconds INTEGER DEFAULT 300000
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = extensions, public
AS $$
BEGIN
  RETURN extensions.net.http_post(
    url := url,
    headers := headers,
    body := body,
    timeout_milliseconds := timeout_milliseconds
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.net_http_post(TEXT, JSONB, JSONB, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.net_http_post(TEXT, JSONB, JSONB, INTEGER) TO anon;

-- Atualizar cron job
DO $$
DECLARE
  job_id BIGINT;
BEGIN
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'sync-biologix-daily';
  IF job_id IS NOT NULL THEN
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := $$
        SELECT public.net_http_post(
          url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
          headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')),
          body := jsonb_build_object('time', now()),
          timeout_milliseconds := 300000
        ) as request_id;
      $$
    );
  END IF;
END;
$$;
```

## 🔍 Diagnóstico Rápido

Execute o script de diagnóstico:

```bash
npx tsx scripts/test/diagnostico-sync-exames.ts
```

Este script fornecerá comandos SQL para verificar cada componente do sistema.

## ✅ Verificações Principais

### 1. Cron Job Está Ativo?

Execute no SQL Editor do Supabase:

```sql
SELECT 
  jobid,
  jobname,
  schedule,
  active
FROM cron.job
WHERE jobname = 'sync-biologix-daily';
```

**Se `active = false`**, reative com:

```sql
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily'),
  active := true
);
```

### 2. Última Execução do Cron

```sql
SELECT 
  runid,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily')
ORDER BY start_time DESC
LIMIT 5;
```

**Status possíveis:**
- ✅ `succeeded` - Executou com sucesso
- ❌ `failed` - Falhou (ver `return_message`)
- ⏳ `running` - Em execução

### 3. Secrets do Vault Configurados?

```sql
SELECT name FROM vault.decrypted_secrets 
WHERE name IN ('project_url', 'anon_key');
```

**Se faltar algum secret**, execute:

```bash
npx tsx scripts/utils/setup-cron-secrets.ts
```

Ou configure manualmente:

```sql
SELECT vault.create_secret('project_url', 'https://seu-projeto.supabase.co');
SELECT vault.create_secret('anon_key', 'sua-anon-key');
```

### 4. Secrets da Biologix na Edge Function?

1. Acesse: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions/sync-biologix
2. Vá em **Settings** → **Secrets**
3. Verifique se estão configurados:
   - `BIOLOGIX_USERNAME`
   - `BIOLOGIX_PASSWORD`
   - `BIOLOGIX_SOURCE`
   - `BIOLOGIX_PARTNER_ID`

### 5. Logs da Edge Function

**Via Dashboard:**
1. Acesse: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions/sync-biologix/logs
2. Verifique erros nas últimas execuções

**Via CLI:**
```bash
npx supabase functions logs sync-biologix
```

### 6. Respostas HTTP Recentes

```sql
SELECT 
  id,
  status_code,
  error_msg,
  created
FROM extensions.net._http_response
WHERE created > NOW() - INTERVAL '24 hours'
ORDER BY created DESC
LIMIT 5;
```

**Se não houver resultados**, o cron job pode não estar executando.

## 🔧 Soluções Comuns

### Problema 1: Erro "cross-database references are not implemented"

**Sintoma:** Status `failed` com mensagem: `ERROR: cross-database references are not implemented: extensions.net.http_post`

**Solução:** Execute o script `scripts/db/debug/fix-cron-job.sql` no SQL Editor do Supabase.

Este é o erro mais comum e ocorre quando o `pg_net` foi movido para o schema `extensions`, mas o `pg_cron` não consegue acessar funções de outros schemas diretamente.

### Problema 2: Cron Job Inativo

**Sintoma:** `active = false` na verificação do cron job

**Solução:**
```sql
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily'),
  active := true
);
```

### Problema 2: Secrets Faltando no Vault

**Sintoma:** Query de secrets retorna menos de 2 resultados

**Solução:**
```bash
npx tsx scripts/utils/setup-cron-secrets.ts
```

### Problema 3: Secrets da Biologix Não Configurados

**Sintoma:** Logs da Edge Function mostram erro de autenticação

**Solução:**
1. Acesse Dashboard → Edge Functions → sync-biologix → Settings → Secrets
2. Adicione os secrets necessários:
   - `BIOLOGIX_USERNAME`
   - `BIOLOGIX_PASSWORD`
   - `BIOLOGIX_SOURCE`
   - `BIOLOGIX_PARTNER_ID`

### Problema 4: Extensões Não Instaladas

**Sintoma:** Erro ao executar queries do cron

**Solução:**
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;
```

### Problema 5: Cron Job Executando Mas Sem Resultados

**Sintoma:** Status `succeeded` mas exames não aparecem

**Solução:**
1. Verifique os logs da Edge Function para erros específicos
2. Teste a sincronização manualmente:
   ```bash
   npx supabase functions invoke sync-biologix
   ```
3. Verifique se há exames DONE na API Biologix

## 🧪 Teste Manual da Sincronização

Para testar a sincronização sem esperar o cron:

**Via CLI:**
```bash
npx supabase functions invoke sync-biologix
```

**Via SQL (executa o comando do cron manualmente):**
```sql
SELECT
  extensions.net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
    ),
    body := jsonb_build_object('time', now()),
    timeout_milliseconds := 300000
  ) as request_id;
```

Depois verifique a resposta:
```sql
SELECT * FROM extensions.net._http_response 
WHERE id = [request_id_retornado];
```

## 📊 Verificar Exames Sincronizados

Para ver quantos exames foram sincronizados:

```sql
SELECT 
  COUNT(*) as total_exames,
  COUNT(DISTINCT paciente_id) as total_pacientes,
  MAX(data_exame) as ultimo_exame
FROM exames;
```

## 📚 Documentação Relacionada

- [Monitoramento do Cron Job](CRON_JOB_MONITORAMENTO.md)
- [Executar Sincronização Manual](../deploy/EXECUTAR_SINCRONIZACAO_MANUAL.md)
- [Configuração do Biologix](CONFIGURACAO_BIOLOGIX.md)

## 🆘 Ainda com Problemas?

Se após seguir todos os passos acima o problema persistir:

1. Verifique os logs completos da Edge Function
2. Verifique se a API Biologix está acessível
3. Verifique se há exames com status DONE na API Biologix
4. Entre em contato com o suporte técnico com:
   - Resultado do script de diagnóstico
   - Logs da Edge Function
   - Últimas execuções do cron job

