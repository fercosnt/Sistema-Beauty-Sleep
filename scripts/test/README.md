# Scripts de Teste

Scripts TypeScript/JavaScript para testes e validação do sistema.

## 📋 Scripts Disponíveis

### Testes de Alertas
- `test-alertas-criticos.ts` - Testar geração de alertas críticos
- `test-alertas-manutencao.ts` - Testar alertas de manutenção
- `test-cleanup-alertas.ts` - Testar limpeza de alertas resolvidos
- `test-todos-alertas.ts` - Executar todos os testes de alertas
- `criar-alerta-teste.ts` - Criar alertas de teste

### Testes de Validação
- `test-validacao-final.ts` - Validação final do sistema
- `test-validacao-completa.ts` - Validação completa
- `test-fase2-completo.ts` - Testes da Fase 2
- `test-fase2-components.ts` - Testes de componentes da Fase 2

### Testes de API e Sincronização
- `test-biologix-connection.ts` - Testar conexão com API Biologix
- `test-biologix-api.js` - Testar API Biologix (JavaScript)
- `test-biologix-sync-complete.ts` - Testar sincronização completa
- `diagnostico-sync-exames.ts` - Diagnosticar problemas de sincronização

### Testes de Sistema
- `verify-system.ts` - Verificar sistema completo
- `verify-alertas-table.ts` - Verificar tabela de alertas
- `verify-test-user.ts` - Verificar usuário de teste
- `validate-migration.ts` - Validar migration
- `validate-sessions-migration.ts` - Validar migration de sessões

## 🚀 Como Executar

```bash
# Com tsx (recomendado)
npx tsx scripts/test/nome-do-script.ts

# Com node (se for .js)
node scripts/test/nome-do-script.js
```

## 📝 Notas

- Certifique-se de ter as variáveis de ambiente configuradas
- Use apenas em ambiente de desenvolvimento
- Alguns scripts podem modificar dados de teste

