# Scripts de Deploy

Scripts para preparar e fazer deploy do sistema.

## 📋 Scripts Disponíveis

- `prepare-production-deploy.ts` - Preparar deploy de produção
- `prepare-production-deploy.sh` - Preparar deploy (Shell)
- `check-deploy-readiness.ts` - Verificar se está pronto para deploy
- `generate-deploy-checklist.ts` - Gerar checklist de deploy

## 🚀 Como Executar

```bash
# Com tsx
npx tsx scripts/deploy/nome-do-script.ts

# Com bash (se for .sh)
bash scripts/deploy/nome-do-script.sh
```

## 📝 Notas

- Execute antes de fazer deploy em produção
- Verifique todas as dependências
- Revise o checklist gerado

