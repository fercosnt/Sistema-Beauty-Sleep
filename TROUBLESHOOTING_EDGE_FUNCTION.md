# Troubleshooting Edge Function sync-biologix

## ✅ Status Atual

**Edge Function está funcionando perfeitamente!** Versão 21 retornando status 200.

## 🔍 Problemas Comuns e Soluções

### 1. Erro 500 - "Invalid user identifier"

**Causa:** Secret `BIOLOGIX_USERNAME` configurado incorretamente ou Edge Function precisa ser redeployada.

**Solução:**
1. Verifique o secret no Dashboard: Edge Functions → Secrets → `BIOLOGIX_USERNAME`
2. Deve ser exatamente: `l|DEMO|47349438` (sem espaços extras)
3. Redeploy a Edge Function após configurar secrets:
   ```bash
   npx supabase functions deploy sync-biologix
   ```

### 2. Erro 500 - "incorrectPassword"

**Causa:** Secret `BIOLOGIX_PASSWORD` configurado incorretamente.

**Solução:**
1. Verifique o secret no Dashboard: Edge Functions → Secrets → `BIOLOGIX_PASSWORD`
2. Deve ser exatamente: `oA6fGc5qaNw4Dhre` (sem aspas)
3. ⚠️ **IMPORTANTE:** Não inclua aspas ao configurar secrets via CLI

### 3. Erro 403 - "notAuthorized"

**Causa:** Problema de permissões na conta Biologix ou `BIOLOGIX_PARTNER_ID` incorreto.

**Solução:**
1. Verifique o secret `BIOLOGIX_PARTNER_ID`:
   - Deve ser: `4798042LW` (sem aspas, sem espaços)
   - **NÃO deve conter:** `basic NTQ0ODUxNVJIOmlqR2pFTVdsY1N0NnZFcklLUld3bFZuNTlKTnNpZUhC`
2. Se o problema persistir, pode ser questão de permissões na conta Biologix (contate o suporte)

### 4. Erro 500 - URL incorreta

**Causa:** `BIOLOGIX_PARTNER_ID` estava sendo substituído pelo header Authorization na URL.

**Solução:** ✅ **RESOLVIDO** - Verifique se o secret `BIOLOGIX_PARTNER_ID` contém apenas `4798042LW`

## ✅ Checklist de Verificação

- [x] Secrets configurados corretamente:
  - [x] `BIOLOGIX_USERNAME` = `l|DEMO|47349438`
  - [x] `BIOLOGIX_PASSWORD` = `oA6fGc5qaNw4Dhre`
  - [x] `BIOLOGIX_SOURCE` = `100`
  - [x] `BIOLOGIX_PARTNER_ID` = `4798042LW` ⚠️ **CRÍTICO: Deve ser apenas o ID, não o header Authorization**
- [x] Edge Function versão 21 deployada e funcionando
- [x] Valores dos secrets sem aspas e sem espaços extras

## 📊 Como Verificar se Está Funcionando

### 1. Verificar Logs da Edge Function

1. Acesse: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/logs/edge-functions
2. Filtre por função: `sync-biologix`
3. Verifique o log mais recente:
   - ✅ Status 200 = Funcionando
   - ❌ Status 500 = Verificar logs detalhados

### 2. Verificar Dados Sincronizados

```sql
-- Verificar exames sincronizados
SELECT COUNT(*) as total_exames FROM exames;

-- Verificar pacientes criados
SELECT COUNT(*) as total_pacientes FROM pacientes;

-- Ver últimos exames sincronizados
SELECT 
  e.biologix_exam_id,
  e.status,
  e.data_exame,
  p.nome as paciente_nome
FROM exames e
LEFT JOIN pacientes p ON e.paciente_id = p.id
ORDER BY e.created_at DESC
LIMIT 10;
```

### 3. Testar Manualmente

```sql
-- Testar Edge Function manualmente
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

## 🔧 Como Corrigir Secrets

### Via Dashboard:
1. Acesse: Edge Functions → Secrets
2. Clique nos três pontos ao lado do secret
3. Edite o valor (sem aspas, sem espaços extras)
4. Salve

### Via CLI:
```bash
# ⚠️ IMPORTANTE: Não inclua aspas ao redor dos valores!
npx supabase secrets set BIOLOGIX_USERNAME=l|DEMO|47349438
npx supabase secrets set BIOLOGIX_PASSWORD=oA6fGc5qaNw4Dhre
npx supabase secrets set BIOLOGIX_SOURCE=100
npx supabase secrets set BIOLOGIX_PARTNER_ID=4798042LW
```

## 📝 Logs Importantes para Debug

Se a Edge Function retornar erro, verifique nos logs:

1. **Environment Variables Check:**
   - Deve mostrar valores corretos para todas as variáveis
   - `BIOLOGIX_PARTNER_ID` deve mostrar `4798042LW` (não o header Authorization)

2. **BiologixClient Constructor:**
   - Deve mostrar `partnerId received: 4798042LW`
   - Não deve mostrar erro de validação

3. **Request Details:**
   - URL deve ser: `https://api.biologixsleep.com/v2/partners/4798042LW/exams?offset=0&limit=100`
   - Não deve conter `basic%20NTQ0ODUxNVJIOmlqR2pFTVdsY1N0NnZFcklLUld3bFZuNTlKTnNpZUhC` na URL

## ✅ Status Atual: Funcionando

- ✅ Edge Function versão 21 funcionando (Status 200)
- ✅ 56 exames sincronizados
- ✅ 20 pacientes criados/encontrados
- ✅ Cron job configurado para execução diária às 10h BRT (13h UTC)
