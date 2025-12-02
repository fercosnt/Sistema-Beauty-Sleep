# 🚀 Instruções Rápidas: Deploy da Edge Function Corrigida

## ✅ A forma mais fácil: Dashboard do Supabase

### Passo 1: Acessar o Dashboard
1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. No menu lateral, clique em **Edge Functions**

### Passo 2: Fazer Deploy
1. Encontre a função **sync-biologix**
2. Clique nos **3 pontinhos** (⋯) ao lado do nome
3. Selecione **Redeploy** ou **Deploy**

**OU** se você tem o código no Git:
- Vá em **Edge Functions** → **Sync with Git**
- Faça commit e push das alterações
- O deploy será automático

---

## 🔑 Alternativa: Usar Access Token (CLI)

### Passo 1: Obter Access Token

1. Acesse: https://supabase.com/dashboard/account/tokens
2. Clique em **Generate new token**
3. Dê um nome (ex: "deploy-cli")
4. **Copie o token** gerado (você só verá uma vez!)

### Passo 2: Configurar e fazer deploy

**No PowerShell:**
```powershell
# Definir o token como variável de ambiente
$env:SUPABASE_ACCESS_TOKEN="COLE_SEU_TOKEN_AQUI"

# Fazer deploy
npx supabase functions deploy sync-biologix
```

**OU em uma linha só:**
```powershell
$env:SUPABASE_ACCESS_TOKEN="seu_token"; npx supabase functions deploy sync-biologix
```

---

## 📝 Verificar se o Deploy Funcionou

### 1. Verificar no Dashboard
- Edge Functions → sync-biologix
- Status deve estar **"Active"**
- Versão deve ter aumentado

### 2. Verificar Logs
- Clique em **sync-biologix**
- Vá na aba **Logs**
- Procure por mensagens recentes

### 3. Testar Manualmente (Opcional)
- No Dashboard, clique em **Invoke Function**
- Ou aguarde a próxima execução automática (amanhã às 10h BRT)

---

## ⚠️ Importante: Secrets

Os secrets já estão configurados, mas se precisar verificar:

1. No Dashboard, vá em **Edge Functions** → **Secrets**
2. Verifique se estão configurados:
   - `BIOLOGIX_USERNAME`
   - `BIOLOGIX_PASSWORD`
   - `BIOLOGIX_SOURCE`
   - `BIOLOGIX_PARTNER_ID`

---

## ✅ Pronto!

Depois do deploy:
- ✅ A próxima sincronização automática (amanhã às 10h) usará a versão corrigida
- ✅ Pacientes serão vinculados por `biologix_id` primeiro
- ✅ Novos pacientes sempre terão `biologix_id` preenchido
- ✅ Pacientes existentes serão atualizados automaticamente

---

**💡 Dica:** Se você já fez commit das alterações, o deploy pelo Dashboard é instantâneo! 🎯

