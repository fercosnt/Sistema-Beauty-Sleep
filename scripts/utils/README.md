# Scripts Utilitários

Scripts auxiliares para operações diversas do sistema.

## 📋 Scripts Disponíveis

### Sincronização
- `invoke-sync-biologix.ts` - Invocar sincronização manualmente
- `migrate-from-airtable.ts` - Migrar dados do Airtable
- `monitor-sync-logs.ts` - Monitorar logs de sincronização
- `monitor-cron-execution.ts` - Monitorar execução de cron jobs

### Usuários
- `create-test-users.ts` - Criar usuários de teste
- `delete-test-users.ts` - Deletar usuários de teste
- `fix-test-user-id.ts` - Corrigir ID de usuário de teste

### Configuração
- `setup-cron-secrets.ts` - Configurar secrets para cron jobs
- `apply-cron-secrets.ts` - Aplicar secrets de cron
- `apply-cron-secrets-mcp.ts` - Aplicar secrets via MCP
- `test-env-loading.js` - Testar carregamento de variáveis de ambiente

### Utilitários
- `organizar-documentacao.ps1` - Organizar documentação
- `sync-migrations.ps1` - Sincronizar migrations
- `send-daily-update.ts` - Enviar atualização diária

## 🚀 Como Executar

```bash
# TypeScript
npx tsx scripts/utils/nome-do-script.ts

# JavaScript
node scripts/utils/nome-do-script.js

# PowerShell
.\scripts\utils\nome-do-script.ps1

# Shell
bash scripts/utils/nome-do-script.sh
```

## 📝 Notas

- Sempre verifique variáveis de ambiente
- Faça backup antes de executar scripts que modificam dados
- Use com cuidado em produção

