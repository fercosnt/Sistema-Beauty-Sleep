# Guia Rápido: Deploy da Edge Function sync-biologix

## 🔐 Opção 1: Login Interativo (Recomendado)

Execute o comando e siga as instruções na tela:

```bash
npx supabase login
```

Isso vai abrir seu navegador para fazer login. Depois de autenticar, volte ao terminal.

---

## 🔑 Opção 2: Usar Access Token

### Passo 1: Obter Access Token

1. Acesse: https://supabase.com/dashboard/account/tokens
2. Clique em "Generate new token"
3. Dê um nome (ex: "deploy-cli")
4. Copie o token gerado

### Passo 2: Usar o token

**Windows PowerShell:**
```powershell
$env:SUPABASE_ACCESS_TOKEN="seu_token_aqui"
npx supabase functions deploy sync-biologix
```

**Ou definir diretamente no comando:**
```powershell
$env:SUPABASE_ACCESS_TOKEN="seu_token_aqui"; npx supabase functions deploy sync-biologix
```

---

## 🚀 Opção 3: Deploy via Dashboard (Mais Fácil)

Se você já tem a Edge Function no repositório, pode fazer deploy direto pelo Dashboard:

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Edge Functions**
4. Selecione **sync-biologix**
5. Clique em **Deploy** ou **Redeploy**

**OU** use a opção de sincronizar com o repositório Git se estiver conectado.

---

## 📝 Opção 4: Usar MCP (via Cursor/AI)

Se você está usando Cursor com MCP Supabase configurado, podemos fazer o deploy via código. Verifique se o MCP está configurado e funcional.

---

## ✅ Após o Deploy

Verifique se o deploy foi bem-sucedido:

1. **Verificar no Dashboard:**
   - Edge Functions → sync-biologix
   - Status deve estar como "Active"

2. **Testar manualmente:**
   ```bash
   curl -X POST https://[PROJECT_REF].supabase.co/functions/v1/sync-biologix \
     -H "Authorization: Bearer [ANON_KEY]" \
     -H "Content-Type: application/json"
   ```

3. **Verificar logs:**
   - Dashboard → Edge Functions → sync-biologix → Logs
   - Verificar se não há erros

---

## 🔧 Verificar Secrets

Antes do deploy, certifique-se de que todos os secrets estão configurados:

```bash
npx supabase secrets list
```

Secrets necessários:
- `BIOLOGIX_USERNAME`
- `BIOLOGIX_PASSWORD`
- `BIOLOGIX_SOURCE`
- `BIOLOGIX_PARTNER_ID`

Para adicionar/atualizar secrets:
```bash
npx supabase secrets set BIOLOGIX_USERNAME="seu_username"
npx supabase secrets set BIOLOGIX_PASSWORD="sua_senha"
npx supabase secrets set BIOLOGIX_SOURCE="100"
npx supabase secrets set BIOLOGIX_PARTNER_ID="seu_partner_id"
```

---

## 📞 Problemas?

Se encontrar problemas:

1. Verifique se está logado: `npx supabase projects list`
2. Verifique se está no diretório correto do projeto
3. Verifique se tem permissões no projeto
4. Tente usar `--debug` para mais informações:
   ```bash
   npx supabase functions deploy sync-biologix --debug
   ```

---

**Recomendação:** Use a **Opção 3 (Dashboard)** se você já tem acesso - é a forma mais simples e confiável! 🎯

