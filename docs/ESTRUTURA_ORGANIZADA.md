# 📁 Estrutura Organizada do Projeto

Documentação completa da estrutura organizada de arquivos do projeto.

## 🗂️ Visão Geral

```
projeto/
├── app/                    # Aplicação Next.js
├── components/            # Componentes React
├── docs/                  # Documentação
│   ├── guias/            # Guias organizados por categoria
│   ├── deploy/           # Documentação de deploy
│   ├── validacao/        # Validação e testes
│   └── arquivados/       # Documentação antiga
├── scripts/              # Scripts organizados
│   ├── db/              # Scripts SQL
│   ├── test/            # Scripts de teste
│   ├── deploy/          # Scripts de deploy
│   └── utils/           # Scripts utilitários
├── supabase/            # Configuração Supabase
│   ├── migrations/      # Migrations oficiais
│   └── functions/      # Edge Functions
└── tasks/               # Arquivos de tarefas
```

---

## 📚 Documentação (`docs/`)

### Guias (`docs/guias/`)

Organizados por categoria para fácil navegação:

#### 🚀 Setup (`setup/`)
- Configuração inicial do ambiente
- Configuração de APIs e credenciais
- Setup de usuários de teste

#### 🚢 Deploy (`deploy/`)
- Deploy em produção
- Deploy de Edge Functions
- Configuração de cron jobs
- Checklists de deploy

#### 🔄 Migrations (`migrations/`)
- Aplicação de migrations
- Guias passo a passo

#### 🔧 Troubleshooting (`troubleshooting/`)
- Resolução de problemas
- Correções comuns
- Guias de debug

#### 💻 Desenvolvimento (`desenvolvimento/`)
- Guias de desenvolvimento
- Migração de dados
- Atualização de componentes

#### 🧪 Testes (`testes/`)
- Execução de validação
- Testes de proteção
- Testes de usabilidade

#### 🔧 Manutenção (`manutencao/`)
- Monitoramento
- Limpeza de arquivos
- Lista de scripts

**Ver:** [docs/guias/README.md](guias/README.md)

---

## 🗄️ Scripts (`scripts/`)

### Scripts SQL (`scripts/db/`)

Organizados por função:

#### Migrations (`migrations/`)
- Scripts para aplicar migrations manualmente

#### Verificação (`verificacao/`)
- Verificar estrutura do banco
- Verificar dados e integridade

#### Debug (`debug/`)
- Scripts temporários de debug
- ⚠️ Podem ser removidos após resolução

#### Testes (`testes/`)
- Criar/limpar dados de teste
- Scripts de teste SQL

#### Manutenção (`manutencao/`)
- Operações rotineiras
- Configuração de secrets

**Ver:** [scripts/db/README.md](../scripts/db/README.md)

### Scripts TypeScript/JavaScript

#### Testes (`scripts/test/`)
- Testes de alertas
- Testes de validação
- Testes de API
- Verificações de sistema

**Ver:** [scripts/test/README.md](../scripts/test/README.md)

#### Deploy (`scripts/deploy/`)
- Preparar deploy
- Verificar readiness
- Gerar checklists

**Ver:** [scripts/deploy/README.md](../scripts/deploy/README.md)

#### Utilitários (`scripts/utils/`)
- Sincronização
- Gerenciamento de usuários
- Configuração
- Utilitários diversos

**Ver:** [scripts/utils/README.md](../scripts/utils/README.md)

---

## 📋 Migrations (`supabase/migrations/`)

Migrations oficiais numeradas sequencialmente:

- `001_initial_schema.sql` - Schema inicial
- `002_functions.sql` - Funções do banco
- `003_triggers.sql` - Triggers
- `004_rls_policies.sql` - Políticas RLS
- ... (até 018)

**⚠️ IMPORTANTE:** Não modifique migrations existentes. Crie novas migrations para alterações.

---

## 🔍 Como Navegar

### Por Tarefa

**"Preciso configurar o ambiente"**
→ `docs/guias/setup/`

**"Preciso fazer deploy"**
→ `docs/guias/deploy/` ou `scripts/deploy/`

**"Preciso aplicar uma migration"**
→ `docs/guias/migrations/` ou `scripts/db/migrations/`

**"Estou com um erro"**
→ `docs/guias/troubleshooting/`

**"Preciso testar algo"**
→ `scripts/test/` ou `docs/guias/testes/`

**"Preciso verificar o banco"**
→ `scripts/db/verificacao/`

---

### Por Tipo de Arquivo

**Scripts SQL:**
→ `scripts/db/` (organizados por categoria)

**Scripts TypeScript:**
→ `scripts/test/`, `scripts/deploy/`, `scripts/utils/`

**Guias:**
→ `docs/guias/` (organizados por categoria)

**Migrations:**
→ `supabase/migrations/` (numeradas sequencialmente)

---

## 📝 Convenções

### Nomenclatura de Arquivos

- **Migrations:** `NNN_descricao.sql` (número sequencial)
- **Scripts SQL:** `acao-objeto.sql` (ex: `verificar-tabela-alertas.sql`)
- **Scripts TS:** `acao-objeto.ts` (ex: `test-alertas-criticos.ts`)
- **Guias:** `TIPO_DESCRICAO.md` (ex: `GUIA_DEPLOY_PRODUCAO.md`)

### Organização

- Sempre coloque arquivos na pasta apropriada
- Use READMEs para documentar cada categoria
- Mantenha estrutura consistente

---

## 🔗 Links Úteis

- [Índice Completo da Documentação](INDICE_COMPLETO.md)
- [README Principal](README.md)
- [Estrutura da Documentação](ESTRUTURA_DOCUMENTACAO.md)

---

**Última atualização:** 2025-01-XX

