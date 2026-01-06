# Guia: Deploy da Edge Function check-alerts

Este guia explica como fazer o deploy da Edge Function `check-alerts` no Supabase.

## 📋 Pré-requisitos

- Supabase CLI instalado (`npm install -g supabase`)
- Autenticado no Supabase (`npx supabase login`)
- Projeto linkado (`npx supabase link --project-ref [seu-project-id]`)

## 🚀 Deploy via CLI

### 1. Verificar se está linkado ao projeto

```bash
npx supabase projects list
```

Se não estiver linkado:

```bash
npx supabase link --project-ref [seu-project-id]
```

### 2. Fazer deploy da função

```bash
npx supabase functions deploy check-alerts
```

### 3. Verificar se o deploy foi bem-sucedido

```bash
npx supabase functions list
```

Você deve ver `check-alerts` na lista.

## 🧪 Testar a função manualmente

### Via Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Edge Functions** → **check-alerts**
4. Clique em **Invoke function**
5. Verifique os logs para ver o resultado

### Via CLI

```bash
npx supabase functions invoke check-alerts
```

### Via HTTP (curl)

```bash
curl -X POST https://[seu-project-id].supabase.co/functions/v1/check-alerts \
  -H "Authorization: Bearer [seu-anon-key]" \
  -H "Content-Type: application/json"
```

## ⏰ Configurar Cron Job

A função deve ser executada automaticamente às 8h BRT (11h UTC) diariamente.

### Verificar se o cron job existe

Execute no SQL Editor do Supabase:

```sql
SELECT 
  jobid,
  jobname,
  schedule,
  command,
  active
FROM cron.job
WHERE jobname = 'check-alerts-daily';
```

### Criar cron job (se não existir)

Execute no SQL Editor:

```sql
-- Verificar se a extensão pg_cron está habilitada
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Criar cron job para executar às 8h BRT (11h UTC)
SELECT cron.schedule(
  'check-alerts-daily',
  '0 11 * * *', -- Todos os dias às 11:00 UTC (8:00 BRT)
  $$
  SELECT net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/check-alerts',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
    ),
    body := jsonb_build_object('time', now()),
    timeout_milliseconds := 300000
  ) as request_id;
  $$
);
```

## ✅ Checklist

- [ ] Edge Function deployada
- [ ] Função testada manualmente
- [ ] Cron job configurado
- [ ] Logs verificados após primeira execução automática

## 🔧 Troubleshooting

### Erro: "Function not found"

Certifique-se de que:
1. O arquivo `supabase/functions/check-alerts/index.ts` existe
2. Você está no diretório raiz do projeto
3. O projeto está linkado corretamente

### Erro: "Missing required environment variables"

A função precisa das seguintes variáveis de ambiente (secrets):
- `SUPABASE_URL` (automático)
- `SUPABASE_SERVICE_ROLE_KEY` (automático)

Essas são configuradas automaticamente pelo Supabase, mas você pode verificar:

```bash
npx supabase secrets list
```

### Erro no cron job

Verifique:
1. Se a extensão `pg_cron` está habilitada
2. Se os secrets `project_url` e `anon_key` existem no vault
3. Se o formato do schedule está correto

## 📝 Próximos Passos

Após o deploy bem-sucedido:

1. ✅ Marque a tarefa 10.12 como concluída
2. ✅ Teste a execução manual (tarefa 10.13)
3. ⏭️ Continue com os testes de validação (tarefa 13.0)

