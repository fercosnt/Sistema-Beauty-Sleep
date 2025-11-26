# Scripts Úteis

Este diretório contém scripts úteis para o projeto Beauty Sleep.

## 📋 Scripts Disponíveis

### Teste da API Biologix
- `test-biologix-api.ps1` - Script PowerShell para Windows
- `test-biologix-api.sh` - Script Bash para Linux/Mac
- `test-biologix-api.js` - Script Node.js
- `README_TESTE_API.md` - Documentação completa dos scripts de teste

### Configuração de Secrets
- `setup-cron-secrets.ts` - Script TypeScript para configurar secrets do cron job
- `setup-cron-secrets.sql` - Template SQL para configuração manual
- `apply-cron-secrets.ts` - Script alternativo para aplicar secrets
- `apply-cron-secrets-mcp.ts` - Script usando MCP

## 📚 Documentação

Consulte `README_TESTE_API.md` para instruções detalhadas sobre como usar os scripts de teste da API Biologix.

## ⚠️ Importante

- **Nunca commite credenciais reais no Git!**
- Use variáveis de ambiente ou arquivos `.env.local` para desenvolvimento
- Use Supabase Secrets para produção

