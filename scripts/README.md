# Scripts do Sistema

Índice completo de todos os scripts disponíveis, organizados por tipo e função.

## 📁 Estrutura

```
scripts/
├── db/              # Scripts SQL de banco de dados
│   ├── migrations/  # Aplicação de migrations
│   ├── verificacao/ # Verificações de estrutura
│   ├── debug/       # Scripts temporários de debug
│   ├── testes/      # Scripts de teste SQL
│   └── manutencao/  # Manutenção rotineira
├── test/            # Scripts de teste TypeScript/JavaScript
├── deploy/          # Scripts de deploy
├── utils/           # Scripts utilitários
└── data/            # Dados e CSVs
```

---

## 🗄️ Scripts de Banco de Dados (`db/`)

Ver **[scripts/db/README.md](db/README.md)** para documentação completa.

### Categorias

- **Migrations** - Aplicar migrations manualmente
- **Verificação** - Verificar estrutura e dados
- **Debug** - Scripts temporários (podem ser removidos)
- **Testes** - Criar/limpar dados de teste
- **Manutenção** - Operações rotineiras

---

## 🧪 Scripts de Teste (`test/`)

Scripts TypeScript/JavaScript para testes e validação.

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
- `test-biologix-api.ps1` - Testar API Biologix (PowerShell)
- `test-biologix-api.sh` - Testar API Biologix (Shell)
- `test-biologix-sync-complete.ts` - Testar sincronização completa
- `diagnostico-sync-exames.ts` - Diagnosticar problemas de sincronização

### Testes de Sistema
- `verify-system.ts` - Verificar sistema completo
- `verify-alertas-table.ts` - Verificar tabela de alertas
- `verify-test-user.ts` - Verificar usuário de teste
- `validate-migration.ts` - Validar migration
- `validate-sessions-migration.ts` - Validar migration de sessões

---

## 🚀 Scripts de Deploy (`deploy/`)

Scripts para preparar e fazer deploy.

- `prepare-production-deploy.ts` - Preparar deploy de produção
- `prepare-production-deploy.sh` - Preparar deploy (Shell)
- `check-deploy-readiness.ts` - Verificar se está pronto para deploy
- `generate-deploy-checklist.ts` - Gerar checklist de deploy

---

## 🔧 Scripts Utilitários (`utils/`)

Ver **[scripts/utils/README.md](utils/README.md)** para documentação completa.

Scripts auxiliares para operações diversas:
- Sincronização (invoke-sync, migrate, monitor)
- Usuários (create, delete, fix)
- Configuração (setup, apply)
- Utilitários diversos

---

## 📊 Scripts de Dados (`data/`)

Diretório com dados e CSVs.

- `data/airtable/` - Dados exportados do Airtable
- `data/invalid/` - Dados inválidos encontrados
- `data/validation/` - Relatórios de validação

---

## 📝 Como Executar

### Scripts TypeScript/JavaScript

```bash
# Com tsx (recomendado)
npx tsx scripts/nome-do-script.ts

# Com node (se for .js)
node scripts/nome-do-script.js
```

### Scripts SQL

Execute no **Supabase SQL Editor**:
1. Acesse https://supabase.com/dashboard
2. Vá em SQL Editor
3. Cole o conteúdo do arquivo .sql
4. Execute

### Scripts PowerShell

```powershell
.\scripts\nome-do-script.ps1
```

---

## 🔍 Busca Rápida

**Preciso testar alertas:**
→ `scripts/test/test-alertas-*.ts`

**Preciso verificar o banco:**
→ `scripts/db/verificacao/`

**Preciso fazer deploy:**
→ `scripts/deploy/`

**Preciso sincronizar dados:**
→ `scripts/utils/invoke-sync-biologix.ts` ou `scripts/utils/migrate-from-airtable.ts`

**Preciso scripts utilitários:**
→ `scripts/utils/`

---

## 📚 Documentação Relacionada

- [Guias de Setup](../../docs/guias/setup/)
- [Guias de Deploy](../../docs/guias/deploy/)
- [Scripts de Banco de Dados](db/README.md)

---

## ⚠️ Notas Importantes

- Sempre verifique variáveis de ambiente antes de executar scripts
- Faça backup antes de executar scripts que modificam dados
- Scripts em `db/debug/` são temporários e podem ser removidos
- Use scripts de teste apenas em ambiente de desenvolvimento
