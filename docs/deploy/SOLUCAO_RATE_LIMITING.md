# 🔧 Solução para Rate Limiting (Erro 429)

## ⚠️ Problema

A API Biologix retornou erro **429 (Too Many Requests)**, indicando que muitas requisições foram feitas em pouco tempo.

**Erro:**
```
"Failed to get exams: 429 {\"_class\":\"com.biologix.springbase.core.error.TooManyRequestsException\",\"error\":\"tooManyRequests\"}"
```

## ✅ Solução Aplicada

Foram implementadas melhorias no código para lidar com rate limiting:

### 1. **Detecção e Tratamento de Erro 429**
- Quando detecta erro 429, aguarda **60 segundos** antes de tentar novamente
- Retry automático após aguardar

### 2. **Delay Entre Requisições de Paginação**
- Adicionado delay de **1 segundo** entre cada página de resultados
- Reduz a frequência de requisições e previne rate limiting

### 3. **Melhoria no Retry Logic**
- Em caso de rate limiting, aguarda mais tempo (60s + backoff exponencial)
- Para outros erros, mantém o backoff exponencial normal

### 4. **Logs Melhorados**
- Logs mostram progresso da paginação
- Facilita identificar onde está travando

---

## 🚀 Próximos Passos

### 1. Fazer Deploy da Edge Function Atualizada

**Via Supabase Dashboard:**
1. Acesse: https://supabase.com/dashboard/project/[project-id]/functions
2. Clique em `sync-biologix`
3. Vá em "Deploy" ou use a versão mais recente do código

**Via CLI:**
```bash
npx supabase functions deploy sync-biologix --project-ref [seu-project-id]
```

### 2. Executar Sincronização Novamente

Após o deploy, execute a sincronização manualmente:

**Via SQL:**
```sql
SELECT
  net.http_post(
    url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')
    ),
    body := jsonb_build_object('time', now()),
    timeout_milliseconds := 600000 -- 10 minutos (aumentado porque pode demorar mais agora)
  ) as request_id;
```

### 3. Monitorar Execução

Execute para ver o progresso:
```bash
npm run monitor
```

Ou verifique os logs no Dashboard:
```
https://supabase.com/dashboard/project/[project-id]/functions/sync-biologix/logs
```

---

## 📊 O Que Esperar

### Antes (sem tratamento de rate limiting):
- ❌ Falha imediata ao receber erro 429
- ❌ Muitas requisições rápidas causam bloqueio
- ❌ Sincronização interrompida

### Agora (com melhorias):
- ✅ Aguarda 60 segundos ao receber erro 429
- ✅ Delay de 1 segundo entre páginas (reduz frequência)
- ✅ Retry automático após aguardar
- ✅ Sincronização completa mesmo com rate limiting

**Tempo estimado:**
- Com rate limiting: pode demorar mais (adiciona ~1 segundo por página + 60s se houver bloqueio)
- Mas completa a sincronização com sucesso!

---

## ⏰ Recomendação

**Se o rate limiting continuar ocorrendo:**

1. **Aumentar delay entre páginas:**
   - Atualmente: 1 segundo
   - Pode aumentar para 2-3 segundos se necessário

2. **Executar em horários de menor tráfego:**
   - O cron job já está configurado para 10h BRT (manhã)
   - Pode funcionar melhor nesse horário

3. **Contatar Biologix:**
   - Se o problema persistir, pode ser necessário aumentar o limite de rate da sua conta
   - Verificar se há limites específicos no seu plano

---

## 🔍 Verificar se Funcionou

Após executar a sincronização:

```sql
-- Ver últimos exames sincronizados
SELECT 
  id,
  biologix_exam_id,
  data_exame,
  created_at
FROM exames
ORDER BY created_at DESC
LIMIT 10;

-- Ver última resposta HTTP (deve ter status 200 agora)
SELECT 
  status_code,
  created,
  content
FROM net._http_response
ORDER BY created DESC
LIMIT 1;
```

Se `status_code = 200` e `content.success = true`, funcionou! ✅

---

**Atualizado em:** 2025-12-04

