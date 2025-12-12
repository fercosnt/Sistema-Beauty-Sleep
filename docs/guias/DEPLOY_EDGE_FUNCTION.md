# Deploy da Edge Function sync-biologix

## ✅ Edge Function já foi deployada!

A Edge Function `sync-biologix` foi deployada com sucesso via MCP do Supabase.

**Status:** ACTIVE  
**Slug:** sync-biologix  
**Versão Atual:** 21 (funcionando perfeitamente!)

## 🔐 Configurar Secrets (OBRIGATÓRIO)

A Edge Function precisa das credenciais configuradas como **Secrets** no Supabase Dashboard.

### Passo a Passo:

1. **Acesse o Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Projeto: `qigbblypwkgflwnrrhzg`

2. **Vá em Edge Functions → Secrets**

3. **Adicione cada secret:**
   - Clique em **"Add new secret"**
   - Configure os seguintes secrets:

   ```
   Nome: BIOLOGIX_USERNAME
   Valor: [seu username da Biologix]
   ```

   ```
   Nome: BIOLOGIX_PASSWORD
   Valor: [sua senha da Biologix]
   ```

   ```
   Nome: BIOLOGIX_SOURCE
   Valor: 100
   ```

   ```
   Nome: BIOLOGIX_PARTNER_ID
   Valor: [seu partner ID - ID do centro fornecido pela Biologix]
   ```

   **Nota:** O Supabase automaticamente fornece `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` para Edge Functions, não é necessário configurá-los.

4. **Salve cada secret** clicando em "Save"

### Ou via CLI (após fazer login):

```bash
# Fazer login primeiro
npx supabase login

# Configurar secrets
# ⚠️ IMPORTANTE: Não inclua aspas ao redor dos valores!
npx supabase secrets set BIOLOGIX_USERNAME=l|DEMO|47349438
npx supabase secrets set BIOLOGIX_PASSWORD=sua_senha_biologix_aqui
npx supabase secrets set BIOLOGIX_SOURCE=100
npx supabase secrets set BIOLOGIX_PARTNER_ID=4798042LW
```

## 🧪 Testar a Edge Function

Após configurar os secrets, você pode testar a função:

### Via Dashboard:
1. Vá em **Edge Functions** → **sync-biologix**
2. Clique em **"Invoke function"**
3. Verifique os logs

### Via CLI:
```bash
npx supabase functions invoke sync-biologix
```

### Via HTTP:
```bash
curl -X POST https://qigbblypwkgflwnrrhzg.supabase.co/functions/v1/sync-biologix \
  -H "Authorization: Bearer [seu_anon_key]"
```

## 📊 Verificar Logs

Para ver os logs da execução:
1. Dashboard → **Edge Functions** → **sync-biologix** → **Logs**
2. Ou via CLI: `npx supabase functions logs sync-biologix`

## ⚠️ Importante

- **Nunca commite credenciais no código!**
- Use apenas Secrets do Supabase para armazenar credenciais
- As credenciais são acessíveis apenas dentro da Edge Function
- Mantenha as credenciais seguras

