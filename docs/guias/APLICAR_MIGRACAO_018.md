# 📋 Como Aplicar a Migração 018 - Limpeza Automática de Alertas

A migração 018 cria a função `cleanup_resolved_alerts()` que deleta automaticamente alertas resolvidos há mais de 3 dias.

## 🚀 Método 1: Via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Copie e cole o conteúdo completo do arquivo `supabase/migrations/018_cleanup_resolved_alerts.sql`
6. Clique em **Run** ou pressione `Ctrl+Enter`
7. Verifique se não há erros na execução

## 🔧 Método 2: Via Supabase CLI

Se você tem o Supabase CLI configurado:

```powershell
# Certifique-se de estar linkado ao projeto
npx supabase link --project-ref [seu-project-ref]

# Aplicar a migração
npx supabase db push
```

## ✅ Verificar se a Migração Foi Aplicada

Execute este SQL no SQL Editor para verificar:

```sql
-- Verificar se a função existe
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'cleanup_resolved_alerts';

-- Verificar se o cron job foi criado
SELECT 
  jobid,
  jobname,
  schedule,
  active
FROM cron.job
WHERE jobname = 'cleanup-resolved-alerts-daily';
```

Se ambos retornarem resultados, a migração foi aplicada com sucesso! ✅

## 🧪 Testar a Função

Após aplicar a migração, você pode testar executando:

```powershell
npx tsx scripts/test/test-cleanup-alertas.ts
```

Ou testar diretamente no SQL Editor:

```sql
-- Executar a função manualmente
SELECT * FROM cleanup_resolved_alerts();
```

Isso retornará o número de alertas deletados.

## 📝 Notas Importantes

- A função deleta apenas alertas com `status = 'resolvido'` e `resolvido_em` há mais de 3 dias
- O cron job executa automaticamente todos os dias às 2h UTC (23h BRT do dia anterior)
- Alertas pendentes nunca são deletados por esta função

