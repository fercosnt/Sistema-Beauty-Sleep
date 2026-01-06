# 📚 Guias do Sistema

Índice completo de todos os guias disponíveis, organizados por categoria.

## 🗂️ Estrutura

```
docs/guias/
├── setup/              # Configuração inicial e setup
├── deploy/             # Deploy e publicação
├── migrations/         # Aplicação de migrations
├── troubleshooting/    # Resolução de problemas
├── desenvolvimento/    # Desenvolvimento e código
├── testes/            # Testes e validação
└── manutencao/        # Manutenção e monitoramento
```

---

## 🚀 Setup e Configuração (`setup/`)

Guias para configurar o ambiente de desenvolvimento e produção.

### Configuração Inicial
- **[CONFIGURAR_ENV_LOCAL.md](setup/CONFIGURAR_ENV_LOCAL.md)** - Como configurar variáveis de ambiente
- **[CONFIGURACAO_BIOLOGIX.md](setup/CONFIGURACAO_BIOLOGIX.md)** - Configurar integração com API Biologix
- **[GUIA_CONFIGURACAO_SUPABASE_AUTH.md](setup/GUIA_CONFIGURACAO_SUPABASE_AUTH.md)** - Configurar autenticação Supabase
- **[GUIA_SELECAO_PROJETO_SUPABASE.md](setup/GUIA_SELECAO_PROJETO_SUPABASE.md)** - Selecionar projeto Supabase correto

### Credenciais e Testes
- **[CONFIGURAR_CREDENCIAIS_TESTE.md](setup/CONFIGURAR_CREDENCIAIS_TESTE.md)** - Configurar credenciais para testes
- **[GUIA_CRIAR_USUARIO_TESTE.md](setup/GUIA_CRIAR_USUARIO_TESTE.md)** - Criar usuários de teste

---

## 🚢 Deploy (`deploy/`)

Guias para fazer deploy do sistema.

### Edge Functions
- **[DEPLOY_EDGE_FUNCTION.md](deploy/DEPLOY_EDGE_FUNCTION.md)** - Deploy de Edge Functions
- **[DEPLOY_CHECK_ALERTS_FUNCTION.md](deploy/DEPLOY_CHECK_ALERTS_FUNCTION.md)** - Deploy da função check-alerts
- **[GUIA_DEPLOY_EDGE_FUNCTION.md](deploy/GUIA_DEPLOY_EDGE_FUNCTION.md)** - Guia completo de deploy

### Produção e Staging
- **[GUIA_DEPLOY_PRODUCAO.md](deploy/GUIA_DEPLOY_PRODUCAO.md)** - Deploy em produção
- **[INSTRUCOES_DEPLOY_RAPIDO.md](deploy/INSTRUCOES_DEPLOY_RAPIDO.md)** - Deploy rápido
- **[DEPLOY_CHECKLIST.md](deploy/DEPLOY_CHECKLIST.md)** - Checklist de deploy

### Cron Jobs
- **[SETUP_CRON_SECRETS.md](deploy/SETUP_CRON_SECRETS.md)** - Configurar secrets para cron jobs
- **[CRON_JOB_MONITORAMENTO.md](deploy/CRON_JOB_MONITORAMENTO.md)** - Monitorar cron jobs

---

## 🔄 Migrations (`migrations/`)

Guias para aplicar migrations no banco de dados.

- **[APLICAR_MIGRATION_014_ALERTAS.md](migrations/APLICAR_MIGRATION_014_ALERTAS.md)** - Aplicar migration da tabela alertas
- **[APLICAR_MIGRACAO_018.md](migrations/APLICAR_MIGRACAO_018.md)** - Aplicar migration 018 (cleanup de alertas)

---

## 🔧 Troubleshooting (`troubleshooting/`)

Guias para resolver problemas comuns.

### Problemas de Sincronização
- **[TROUBLESHOOTING_SYNC_EXAMES.md](troubleshooting/TROUBLESHOOTING_SYNC_EXAMES.md)** - Problemas na sincronização de exames
- **[TROUBLESHOOTING_EDGE_FUNCTION.md](troubleshooting/TROUBLESHOOTING_EDGE_FUNCTION.md)** - Problemas com Edge Functions

### Correções
- **[CORRECAO_ENV_LOCAL_SEGURO.md](troubleshooting/CORRECAO_ENV_LOCAL_SEGURO.md)** - Corrigir configuração de .env.local
- **[GUIA_RESOLVER_ERRO_EBUSY_ONEDRIVE.md](troubleshooting/GUIA_RESOLVER_ERRO_EBUSY_ONEDRIVE.md)** - Resolver erro EBUSY no OneDrive
- **[GUIA_RESOLVER_PROBLEMA_NOME_USUARIO.md](troubleshooting/GUIA_RESOLVER_PROBLEMA_NOME_USUARIO.md)** - Resolver problema com nome de usuário

---

## 💻 Desenvolvimento (`desenvolvimento/`)

Guias para desenvolvimento e manutenção de código.

- **[GUIA_EXECUTAR_NPM.md](desenvolvimento/GUIA_EXECUTAR_NPM.md)** - Como executar comandos npm
- **[GUIA_MIGRACAO_AIRTABLE.md](desenvolvimento/GUIA_MIGRACAO_AIRTABLE.md)** - Migrar dados do Airtable
- **[GUIA_ATUALIZAR_MODAL_NOVO_PACIENTE.md](desenvolvimento/GUIA_ATUALIZAR_MODAL_NOVO_PACIENTE.md)** - Atualizar modal de novo paciente

## 🧪 Testes (`testes/`)

Guias para testes e validação.

- **[COMO_EXECUTAR_VALIDACAO.md](testes/COMO_EXECUTAR_VALIDACAO.md)** - Como executar validação
- **[GUIA_TESTE_PROTECAO_ROTAS.md](testes/GUIA_TESTE_PROTECAO_ROTAS.md)** - Testar proteção de rotas
- **[GUIA_TESTES_USABILIDADE.md](testes/GUIA_TESTES_USABILIDADE.md)** - Testes de usabilidade

## 🔧 Manutenção (`manutencao/`)

Guias para manutenção e monitoramento.

- **[GUIA_MONITORAMENTO.md](manutencao/GUIA_MONITORAMENTO.md)** - Monitorar o sistema
- **[SCRIPTS_DISPONIVEIS.md](manutencao/SCRIPTS_DISPONIVEIS.md)** - Lista de scripts disponíveis
- **[LIMPEZA_ARQUIVOS_LOG.md](manutencao/LIMPEZA_ARQUIVOS_LOG.md)** - Limpar arquivos de log

---

## 🔍 Busca Rápida

### Por Tarefa

**Preciso configurar o ambiente:**
→ Veja [Setup e Configuração](#-setup-e-configuração-setup)

**Preciso fazer deploy:**
→ Veja [Deploy](#-deploy-deploy)

**Preciso aplicar uma migration:**
→ Veja [Migrations](#-migrations-migrations)

**Estou com um problema:**
→ Veja [Troubleshooting](#-troubleshooting-troubleshooting)

**Preciso desenvolver/alterar código:**
→ Veja [Desenvolvimento](#-desenvolvimento-desenvolvimento)

**Preciso testar/validar:**
→ Veja [Testes](#-testes-testes)

**Preciso fazer manutenção:**
→ Veja [Manutenção](#-manutencao-manutencao)

---

## 📝 Contribuindo

Ao criar um novo guia:

1. Coloque na pasta apropriada (`setup/`, `deploy/`, `migrations/`, `troubleshooting/`)
2. Use nomes descritivos em UPPERCASE
3. Atualize este README com o novo guia
4. Inclua exemplos práticos e troubleshooting quando relevante

---

## 🔗 Links Relacionados

- [Documentação Principal](../README.md)
- [Scripts de Banco de Dados](../../scripts/db/README.md)
- [Estrutura de Documentação](../ESTRUTURA_DOCUMENTACAO.md)

