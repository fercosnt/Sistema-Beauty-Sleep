# 🚀 Como Fazer Deploy da Edge Function Atualizada

## ⚠️ Importante

A Edge Function `sync-biologix` foi atualizada com melhorias para lidar com rate limiting (erro 429). 

**Você precisa fazer o deploy manualmente via CLI** para aplicar as mudanças.

---

## 📋 Pré-requisitos

1. **Supabase CLI instalado:**
   ```bash
   npm install -g supabase
   ```

2. **Login no Supabase:**
   ```bash
   npx supabase login
   ```

3. **Linkar o projeto:**
   ```bash
   npx supabase link --project-ref qigbblypwkgflwnrrhzg
   ```

---

## 🔧 Deploy da Edge Function

### Passo 1: Navegar até a pasta da função

```bash
cd supabase/functions/sync-biologix
```

### Passo 2: Fazer deploy

```bash
npx supabase functions deploy sync-biologix --project-ref qigbblypwkgflwnrrhzg
```

**Ou, se já estiver linkado:**

```bash
npx supabase functions deploy sync-biologix
```

### Passo 3: Verificar se o deploy foi bem-sucedido

Você verá uma mensagem como:
```
Deployed Function sync-biologix (v24)
```

---

## ✅ Verificar Deploy

### Via Dashboard:

1. Acesse: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions
2. Clique em `sync-biologix`
3. Verifique que a versão aumentou (ex: v23 → v24)
4. Status deve estar como **ACTIVE**

### Via CLI:

```bash
npx supabase functions list --project-ref qigbblypwkgflwnrrhzg
```

---

## 🧪 Testar a Função Atualizada

Após o deploy, teste executando manualmente:

### Via SQL (no Supabase SQL Editor):

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

### Via Dashboard:

1. Acesse: Functions → sync-biologix
2. Clique em **"Invoke function"**
3. Verifique os logs

---

## 📊 Monitorar Execução

### Ver Logs:

```bash
npx supabase functions logs sync-biologix --project-ref qigbblypwkgflwnrrhzg
```

### Ou via Dashboard:

https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/functions/sync-biologix/logs

---

## 🎯 O Que Mudou na Nova Versão

### Melhorias Implementadas:

1. ✅ **Tratamento de Rate Limiting (429)**:
   - Aguarda 60 segundos quando detecta erro 429
   - Retry automático após aguardar

2. ✅ **Delay Entre Requisições**:
   - Delay de 1 segundo entre páginas de resultados
   - Reduz frequência de requisições

3. ✅ **Retry Logic Melhorado**:
   - Aguarda mais tempo em caso de rate limiting
   - Backoff exponencial para outros erros

4. ✅ **Logs Melhorados**:
   - Logs mostram progresso da paginação
   - Facilita identificar problemas

---

## 🔍 Troubleshooting

### Erro: "Function deploy failed"

**Possíveis causas:**
1. Não está linkado ao projeto
   - Solução: `npx supabase link --project-ref qigbblypwkgflwnrrhzg`

2. Não fez login
   - Solução: `npx supabase login`

3. Caminho incorreto
   - Solução: Execute de dentro de `supabase/functions/sync-biologix`

### Erro: "Missing environment variables"

**Os secrets já devem estar configurados**, mas verifique:

```bash
# Ver secrets configurados
npx supabase secrets list --project-ref qigbblypwkgflwnrrhzg
```

Se faltar algum, configure:
```bash
npx supabase secrets set BIOLOGIX_USERNAME=[valor] --project-ref qigbblypwkgflwnrrhzg
npx supabase secrets set BIOLOGIX_PASSWORD=[valor] --project-ref qigbblypwkgflwnrrhzg
npx supabase secrets set BIOLOGIX_SOURCE=100 --project-ref qigbblypwkgflwnrrhzg
npx supabase secrets set BIOLOGIX_PARTNER_ID=[valor] --project-ref qigbblypwkgflwnrrhzg
```

---

## ✅ Checklist

Antes de considerar o deploy completo:

- [ ] Supabase CLI instalado e logado
- [ ] Projeto linkado (`npx supabase link`)
- [ ] Deploy executado com sucesso
- [ ] Versão aumentou no Dashboard
- [ ] Status está ACTIVE
- [ ] Testou executar manualmente
- [ ] Logs mostram execução correta

---

**Documentação criada em:** 2025-12-04

