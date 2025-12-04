# 🔄 Como Executar Sincronização Manual

## ⚠️ Importante

O cron job `sync-biologix-daily` roda **automaticamente no servidor Supabase** todos os dias às **10h BRT (13h UTC)**.

**NÃO depende do seu computador estar ligado!** Ele roda no servidor da Supabase.

---

## 🚀 Executar Sincronização Manualmente

Se você precisa sincronizar os dados agora (sem esperar o horário agendado), há 3 formas:

### Opção 1: Via Supabase Dashboard (Mais Fácil) ⭐

1. **Acesse o Dashboard:**
   ```
   https://supabase.com/dashboard/project/[seu-project-id]/functions
   ```

2. **Encontre a função `sync-biologix`**

3. **Clique em "Invoke" ou "Test"**

4. **Execute a função**

5. **Aguarde alguns minutos e verifique os logs**

---

### Opção 2: Via SQL Editor (Recomendado)

1. **Acesse SQL Editor no Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/[seu-project-id]/sql
   ```

2. **Execute este SQL:**
   ```sql
   -- Executar sincronização manualmente
   SELECT
     net.http_post(
       url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
       headers := jsonb_build_object(
         'Content-Type', 'application/json',
         'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
       ),
       body := jsonb_build_object('time', now()),
       timeout_milliseconds := 300000 -- 5 minutos
     ) as request_id;
   ```

3. **Anote o `request_id` retornado**

4. **Verifique a resposta (aguarde 1-2 minutos):**
   ```sql
   -- Substitua [request_id] pelo valor retornado
   SELECT 
     id,
     status_code,
     content,
     created,
     error_msg
   FROM net._http_response 
   WHERE id = [request_id];
   ```

---

### Opção 3: Via Supabase CLI

```bash
# Executar a Edge Function diretamente
npx supabase functions invoke sync-biologix \
  --project-ref [seu-project-id] \
  --body '{"time": "now"}'
```

**Ou usando curl:**
```bash
curl -X POST \
  'https://[seu-project-id].supabase.co/functions/v1/sync-biologix' \
  -H 'Authorization: Bearer [sua-anon-key]' \
  -H 'Content-Type: application/json' \
  -d '{"time": "now"}'
```

---

## 📊 Verificar Status da Sincronização

### 1. Monitorar via Script

```bash
npm run monitor
# ou
npx tsx scripts/monitor-sync-logs.ts
```

Este script mostra:
- Última execução
- Estatísticas de exames sincronizados
- Erros (se houver)
- Próxima execução automática

### 2. Verificar Logs no Dashboard

1. Acesse: `https://supabase.com/dashboard/project/[project-id]/functions/sync-biologix/logs`
2. Filtre por data/hora recente
3. Veja os logs de execução

### 3. Verificar no Banco de Dados

```sql
-- Ver últimos exames sincronizados
SELECT 
  id,
  biologix_exam_id,
  data_exame,
  created_at,
  paciente_id
FROM exames
ORDER BY created_at DESC
LIMIT 10;

-- Ver quando foi a última sincronização (última resposta HTTP)
SELECT 
  id,
  status_code,
  created,
  content
FROM net._http_response
WHERE url LIKE '%sync-biologix%'
ORDER BY created DESC
LIMIT 1;
```

---

## 🔍 Troubleshooting

### Sincronização não executou hoje

**Possíveis causas:**
1. Cron job está desativado
2. Edge Function retornou erro
3. Secrets não configurados corretamente

**Soluções:**

1. **Verificar se cron job está ativo:**
   ```sql
   SELECT 
     jobid,
     jobname,
     active,
     schedule
   FROM cron.job
   WHERE jobname = 'sync-biologix-daily';
   ```
   
   Se `active = false`, reative:
   ```sql
   SELECT cron.alter_job(
     job_id := (SELECT jobid FROM cron.job WHERE jobname = 'sync-biologix-daily'),
     active := true
   );
   ```

2. **Verificar últimas execuções:**
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

3. **Verificar secrets:**
   ```sql
   SELECT name FROM vault.decrypted_secrets 
   WHERE name IN ('project_url', 'anon_key');
   ```
   
   Se faltar algum, configure:
   ```sql
   -- Substitua [valor] pelos valores corretos
   INSERT INTO vault.secrets (name, secret)
   VALUES ('project_url', '[sua-url-do-projeto]')
   ON CONFLICT (name) DO UPDATE SET secret = EXCLUDED.secret;
   ```

### Erro ao executar manualmente

**Se receber erro 401/403:**
- Verifique se os secrets estão configurados
- Verifique se a anon key está correta

**Se receber timeout:**
- A sincronização pode estar demorando mais que 5 minutos
- Aumente o timeout ou verifique se há muitos exames para processar

---

## ⏰ Próxima Execução Automática

O cron job executará automaticamente **todos os dias às 10h BRT (13h UTC)**.

Para ver quando será a próxima execução, execute:
```bash
npm run monitor
```

---

## 📝 Notas Importantes

- ✅ O cron job **não depende do seu computador estar ligado**
- ✅ Ele roda no servidor Supabase
- ✅ Executa todos os dias às 10h BRT automaticamente
- ✅ Você pode executar manualmente quando necessário
- ⚠️ Não execute múltiplas vezes simultaneamente (pode causar conflitos)

---

**Criado em:** 2025-12-04

