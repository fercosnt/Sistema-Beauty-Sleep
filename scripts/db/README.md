# Scripts de Banco de Dados

Este diretório contém todos os scripts SQL organizados por categoria.

## 📁 Estrutura

```
scripts/db/
├── migrations/      # Scripts para aplicar migrations manualmente
├── verificacao/    # Scripts para verificar estrutura e dados
├── debug/          # Scripts temporários de debug (podem ser removidos)
├── testes/         # Scripts para testes e limpeza de dados de teste
└── manutencao/     # Scripts de manutenção e operações rotineiras
```

## 📋 Categorias

### 🔄 Migrations (`migrations/`)
Scripts para aplicar migrations manualmente quando necessário.

- `aplicar-migration-013.sql` - Aplicar migration 013 (campos estendidos de exames)

### ✅ Verificação (`verificacao/`)
Scripts para verificar estrutura do banco, dados e integridade.

- `verificar-tabela-alertas.sql` - Verificar estrutura da tabela alertas
- `verificar-campos-exames.sql` - Verificar campos da tabela exames
- `verificar-paciente.sql` - Verificar dados de um paciente
- `verificar-paciente-rapido.sql` - Verificação rápida de paciente
- `verificar-sincronizacao.sql` - Verificar status da sincronização
- `verificar-tudo.sql` - Verificação completa do sistema

### 🐛 Debug (`debug/`)
Scripts temporários criados para debug de problemas específicos. Podem ser removidos após resolução.

**⚠️ ATENÇÃO:** Estes scripts são temporários e podem não ser mais necessários.

- `corrigir-*.sql` - Scripts de correção temporários
- `debug-*.sql` - Scripts de debug
- `solucao-*.sql` - Soluções temporárias
- `verificar-comando-cron.sql` - Verificar comandos de cron
- `verificar-resposta-http.sql` - Verificar respostas HTTP

### 🧪 Testes (`testes/`)
Scripts para criar, limpar e gerenciar dados de teste.

- `delete-test-pacientes.sql` - Deletar pacientes de teste
- `delete-test-pacientes-simple.sql` - Versão simplificada
- `delete-test-users.sql` - Deletar usuários de teste
- `delete-test-users-simple.sql` - Versão simplificada
- `delete-all-test-pacientes.sql` - Deletar todos os pacientes de teste
- `test-cron-manual.sql` - Testar cron job manualmente

### 🔧 Manutenção (`manutencao/`)
Scripts para operações de manutenção rotineiras.

- `setup-cron-secrets.sql` - Configurar secrets para cron jobs
- `executar-sync-manual.sql` - Executar sincronização manualmente

## 🚀 Como Usar

### Aplicar uma Migration

```bash
# No Supabase SQL Editor, execute:
# scripts/db/migrations/aplicar-migration-013.sql
```

### Verificar Estrutura

```bash
# No Supabase SQL Editor, execute:
# scripts/db/verificacao/verificar-tabela-alertas.sql
```

### Limpar Dados de Teste

```bash
# No Supabase SQL Editor, execute:
# scripts/db/testes/delete-test-pacientes.sql
```

## 📝 Notas

- Todos os scripts devem ser executados no **Supabase SQL Editor**
- Sempre faça backup antes de executar scripts de modificação
- Scripts em `debug/` são temporários e podem ser removidos
- Para migrations oficiais, use `supabase/migrations/`

## 🔗 Links Úteis

- [Guia de Migrations](../docs/guias/migrations/)
- [Supabase SQL Editor](https://supabase.com/dashboard)

