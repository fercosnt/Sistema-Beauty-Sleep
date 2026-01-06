# 📜 Scripts Disponíveis - Sistema Beauty Sleep

## 🚀 Como Executar

Use sempre `npx tsx` antes do caminho do script:

```powershell
npx tsx scripts/nome-do-script.ts
```

---

## 📋 Scripts Disponíveis

### 1. **Verificação e Testes**

#### `test-biologix-sync-complete.ts`
Verifica a conexão completa com Biologix e status do sistema.

```powershell
npx tsx scripts/test/test-biologix-sync-complete.ts
```

**O que faz:**
- ✅ Verifica status do cron job
- ✅ Verifica últimas execuções
- ✅ Mostra estatísticas de exames e pacientes
- ✅ Lista exames recentes sincronizados

---

#### `test-biologix-connection.ts`
Testa a conexão com a API Biologix.

```powershell
npx tsx scripts/test/test-biologix-connection.ts
```

---

#### `test-biologix-api.js` / `test-biologix-api.ps1` / `test-biologix-api.sh`
Scripts alternativos para testar a API Biologix (JavaScript, PowerShell, Shell).

---

#### `verify-system.ts`
Verifica o sistema completo (migrations, RLS, triggers, etc).

```powershell
npx tsx scripts/test/verify-system.ts
```

---

### 2. **Migração de Dados**

#### `migrate-from-airtable.ts`
Migra dados do Airtable para o Supabase.

```powershell
npx tsx scripts/utils/migrate-from-airtable.ts --env=production
```

**Opções:**
- `--env=staging` - Migra para ambiente de staging
- `--env=production` - Migra para produção

---

#### `validate-migration.ts`
Valida a migração após importar dados.

```powershell
npx tsx scripts/test/validate-migration.ts
```

---

#### `validate-sessions-migration.ts`
Valida a migração de sessões.

```powershell
npx tsx scripts/test/validate-sessions-migration.ts
```

---

### 3. **Configuração do Cron Job**

#### `setup-cron-secrets.ts`
Configura os secrets do cron job no Supabase Vault.

```powershell
npx tsx scripts/utils/setup-cron-secrets.ts
```

**Requer:**
- Arquivo `.env.local` configurado
- Variáveis: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

#### `apply-cron-secrets.ts` / `apply-cron-secrets-mcp.ts`
Aplica secrets do cron job (versões diferentes do script).

```powershell
npx tsx scripts/utils/apply-cron-secrets.ts
```

---

### 4. **Utilitários**

#### `send-daily-update.ts`
Gera mensagem de atualização diária da migração.

```powershell
npx tsx scripts/utils/send-daily-update.ts
```

---

#### `delete-test-users.ts`
Remove usuários de teste (para limpeza).

```powershell
npx tsx scripts/test/delete-test-users.ts
```

**⚠️ Cuidado:** Este script remove dados. Use apenas em desenvolvimento/testes.

---

### 5. **Testes de Ambiente**

#### `test-env-loading.js`
Testa se as variáveis de ambiente estão sendo carregadas corretamente.

```powershell
node scripts/test/test-env-loading.js
```

---

## 📝 Exemplos de Uso

### Verificar Status do Sistema

```powershell
# Verificar conexão Biologix completa
npx tsx scripts/test/test-biologix-sync-complete.ts

# Verificar sistema completo
npx tsx scripts/test/verify-system.ts
```

### Migrar Dados

```powershell
# Migrar do Airtable
npx tsx scripts/utils/migrate-from-airtable.ts --env=production

# Validar migração
npx tsx scripts/test/validate-migration.ts
```

### Configurar Cron Job

```powershell
# Configurar secrets do cron
npx tsx scripts/utils/setup-cron-secrets.ts
```

---

## 🔧 Comandos Supabase CLI

Além dos scripts, você também pode usar comandos do Supabase:

```powershell
# Linkar projeto
npx supabase link --project-ref qigbblypwkgflwnrrhzg

# Deploy Edge Function
npx supabase functions deploy sync-biologix

# Ver logs
npx supabase functions logs sync-biologix

# Listar migrations
npx supabase db remote list
```

---

## 💡 Dicas

1. **Sempre use `npx`** antes dos comandos para usar a versão local instalada
2. **Verifique o `.env.local`** antes de executar scripts que precisam de credenciais
3. **Faça backup** antes de executar scripts que modificam dados
4. **Leia a documentação** de cada script antes de usar

---

## ❓ Problemas Comuns

### "tsx não é reconhecido"
**Solução:** Use `npx tsx` em vez de apenas `tsx`

### "Cannot find module"
**Solução:** Verifique se você está na pasta raiz do projeto

### "Missing environment variables"
**Solução:** Verifique se o arquivo `.env.local` existe e está configurado

---

**Nota:** `nome-do-script.ts` era apenas um exemplo! Use os nomes reais listados acima. 😊

