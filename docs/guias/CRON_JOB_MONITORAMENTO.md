# Monitoramento do Cron Job sync-biologix

## ⚠️ IMPORTANTE: Configurar Secrets Primeiro

**Antes de usar o cron job, você precisa configurar os secrets no Supabase Vault.**

Consulte o arquivo `SETUP_CRON_SECRETS.md` para instruções detalhadas.

## ✅ Cron Job Configurado

O cron job `sync-biologix-daily` foi criado com sucesso e está ativo.

**Configuração:**
- **Nome:** `sync-biologix-daily`
- **Schedule:** `0 13 * * *` (Diariamente às 13:00 UTC = 10:00 BRT)
- **Status:** Ativo
- **Job ID:** 1

## 📊 Como Monitorar o Cron Job

### 1. Verificar Status do Cron Job

Execute no SQL Editor do Supabase:

```sql
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  command
FROM cron.job
WHERE jobname = 'sync-biologix-daily';
```

### 2. Ver Histórico de Execuções

```sql
SELECT 
  runid,
  job_pid,
  status,
  return_message,
  start_time,
  end_time,
  (end_time - start_time) as duration
FROM cron.job_run_details
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily')
ORDER BY start_time DESC
LIMIT 10;
```

**Status possíveis:**
- `succeeded` - Execução bem-sucedida
- `failed` - Execução falhou (ver `return_message` para detalhes)
- `running` - Em execução no momento

### 3. Verificar Respostas HTTP (pg_net)

O cron job usa `pg_net` para fazer chamadas HTTP. Você pode verificar as respostas:

```sql
SELECT 
  id,
  status_code,
  content_type,
  headers,
  content,
  timed_out,
  error_msg,
  created
FROM net._http_response
WHERE created > NOW() - INTERVAL '24 hours'
ORDER BY created DESC
LIMIT 10;
```

### 4. Ver Logs da Edge Function

**Via Dashboard:**
1. Acesse: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions
2. Clique em `sync-biologix`
3. Vá na aba **Logs**
4. Filtre por data/hora da execução do cron

**Via CLI:**
```bash
npx supabase functions logs sync-biologix
```

### 5. Testar Manualmente

Para testar o cron job manualmente sem esperar o horário agendado:

```sql
-- Executar o comando do cron job manualmente
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

Depois verifique a resposta:
```sql
SELECT * FROM net._http_response WHERE id = [request_id];
```

## 🔧 Gerenciar o Cron Job

### Desativar Temporariamente

```sql
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily'),
  active := false
);
```

### Reativar

```sql
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily'),
  active := true
);
```

### Alterar Horário

```sql
-- Alterar para executar às 11h BRT (14h UTC)
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily'),
  schedule := '0 14 * * *'
);
```

### Deletar o Cron Job

```sql
SELECT cron.unschedule('sync-biologix-daily');
```

## ⚠️ Troubleshooting

### Cron Job não está executando

1. Verifique se está ativo:
   ```sql
   SELECT active FROM cron.job WHERE jobname = 'sync-biologix-daily';
   ```

2. Verifique se as extensões estão habilitadas:
   ```sql
   SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'pg_net');
   ```

3. Verifique se os secrets estão no Vault:
   ```sql
   SELECT name FROM vault.decrypted_secrets WHERE name IN ('project_url', 'anon_key');
   ```

### Edge Function retorna erro

1. Verifique os logs da Edge Function (Dashboard ou CLI)
2. Verifique se os secrets da Biologix estão configurados:
   - `BIOLOGIX_USERNAME`
   - `BIOLOGIX_PASSWORD`
   - `BIOLOGIX_SOURCE`
3. Verifique a resposta HTTP:
   ```sql
   SELECT * FROM net._http_response ORDER BY created DESC LIMIT 1;
   ```

### Timeout na execução

O timeout padrão é de 5 minutos (300000ms). Se a sincronização demorar mais, você pode aumentar:

```sql
-- Atualizar o cron job com timeout maior (10 minutos)
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily'),
  command := $$
  SELECT
    net.http_post(
      url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
      ),
      body := jsonb_build_object('time', now()),
      timeout_milliseconds := 600000 -- 10 minutos
    ) as request_id;
  $$
);
```

## 📅 Próxima Execução

O cron job executará automaticamente **todos os dias às 10h BRT (13h UTC)**.

Para verificar quando será a próxima execução, você pode consultar o histórico após a primeira execução automática.

## 📝 Notas Importantes

- O cron job usa `pg_net` para fazer chamadas HTTP assíncronas
- As respostas HTTP são armazenadas na tabela `net._http_response` por 6 horas
- O histórico de execuções do cron está em `cron.job_run_details`
- Os secrets (`project_url` e `anon_key`) estão armazenados no Supabase Vault para segurança
- A Edge Function precisa ter os secrets da Biologix configurados para funcionar corretamente

