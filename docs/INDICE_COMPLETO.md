# 📚 Índice Completo da Documentação

Navegação rápida por toda a documentação do sistema.

## 🗺️ Mapa de Navegação

```
docs/
├── README.md                    # Documentação principal
├── INDICE_COMPLETO.md          # Este arquivo
├── ESTRUTURA_DOCUMENTACAO.md   # Estrutura da documentação
│
├── guias/                       # Guias práticos
│   ├── README.md               # Índice de guias
│   ├── setup/                  # Configuração inicial
│   ├── deploy/                 # Deploy e publicação
│   ├── migrations/             # Aplicação de migrations
│   └── troubleshooting/        # Resolução de problemas
│
├── guia-usuario/               # Guias para usuários finais
│   ├── GUIA_ADMINISTRADOR.md
│   ├── GUIA_EQUIPE_DENTISTAS.md
│   ├── GUIA_RECEPCAO.md
│   └── FAQ.md
│
├── deploy/                     # Documentação de deploy
│   ├── CHECKLIST_PRE_DEPLOY.md
│   ├── GUIA_DEPLOY_PRODUCAO.md
│   └── ...
│
├── validacao/                  # Validação e testes
│   ├── VALIDACAO_FINAL_FASE2.md
│   └── RESULTADOS_TESTES.md
│
├── relatorios/                 # Relatórios técnicos
│   └── ...
│
├── resumos/                    # Resumos de tarefas
│   └── ...
│
└── arquivados/                 # Documentação antiga
    ├── testes-antigos/
    └── relatorios-antigos/
```

---

## 🚀 Início Rápido

### Para Desenvolvedores

1. **[Configurar Ambiente](guias/setup/CONFIGURAR_ENV_LOCAL.md)**
2. **[Aplicar Migrations](guias/migrations/)**
3. **[Fazer Deploy](guias/deploy/GUIA_DEPLOY_PRODUCAO.md)**

### Para Usuários

1. **[Guia do Administrador](guia-usuario/GUIA_ADMINISTRADOR.md)**
2. **[Guia da Equipe](guia-usuario/GUIA_EQUIPE_DENTISTAS.md)**
3. **[Guia da Recepção](guia-usuario/GUIA_RECEPCAO.md)**

---

## 📖 Categorias Principais

### 🔧 Guias Técnicos

#### Setup e Configuração
- [Configurar .env.local](guias/setup/CONFIGURAR_ENV_LOCAL.md)
- [Configurar API Biologix](guias/setup/CONFIGURACAO_BIOLOGIX.md)
- [Configurar Supabase Auth](guias/setup/GUIA_CONFIGURACAO_SUPABASE_AUTH.md)
- [Criar Usuário de Teste](guias/setup/GUIA_CRIAR_USUARIO_TESTE.md)

#### Deploy
- [Deploy em Produção](guias/deploy/GUIA_DEPLOY_PRODUCAO.md)
- [Deploy de Edge Functions](guias/deploy/DEPLOY_EDGE_FUNCTION.md)
- [Deploy da função check-alerts](guias/deploy/DEPLOY_CHECK_ALERTS_FUNCTION.md)
- [Checklist de Deploy](deploy/CHECKLIST_PRE_DEPLOY.md)

#### Migrations
- [Aplicar Migration 014 (Alertas)](guias/migrations/APLICAR_MIGRATION_014_ALERTAS.md)
- [Aplicar Migration 018](guias/migrations/APLICAR_MIGRACAO_018.md)

#### Troubleshooting
- [Problemas de Sincronização](guias/troubleshooting/TROUBLESHOOTING_SYNC_EXAMES.md)
- [Problemas com Edge Functions](guias/troubleshooting/TROUBLESHOOTING_EDGE_FUNCTION.md)
- [Corrigir .env.local](guias/troubleshooting/CORRECAO_ENV_LOCAL_SEGURO.md)

---

### 📋 Documentação de Processos

#### Deploy
- [Checklist Pré-Deploy](deploy/CHECKLIST_PRE_DEPLOY.md)
- [Configurações de Ambiente](deploy/CONFIGURACOES_AMBIENTE.md)
- [Guia de Handoff](deploy/GUIA_HANDOFF.md)
- [Monitoramento](deploy/GUIA_MONITORAMENTO.md)

#### Validação
- [Validação Final Fase 2](validacao/VALIDACAO_FINAL_FASE2.md)
- [Como Executar Validação](guias/COMO_EXECUTAR_VALIDACAO.md)
- [Resultados de Testes](validacao/RESULTADOS_TESTES.md)

---

### 👥 Guias de Usuário

- [Guia do Administrador](guia-usuario/GUIA_ADMINISTRADOR.md)
- [Guia da Equipe](guia-usuario/GUIA_EQUIPE_DENTISTAS.md)
- [Guia da Recepção](guia-usuario/GUIA_RECEPCAO.md)
- [FAQ](guia-usuario/FAQ.md)

---

### 📊 Relatórios e Análises

- [Relatório Completo Biologix](relatorios/RELATORIO_COMPLETO_BIOLOGIX.md)
- [Relatório de Verificação](relatorios/RELATORIO_VERIFICACAO_SISTEMA.md)
- [Análise API Biologix](analise/ANALISE_API_BIOLOGIX_FILTRO_STATUS.md)

---

### 📝 Resumos e Status

- [Status de Tarefas](resumos/STATUS_TAREFAS.md)
- [Resumo de Correções](resumos/RESUMO_CORRECOES_BIOLOGIX.md)
- [Resumo de Tarefas Completas](resumos/RESUMO_TASKS_COMPLETAS.md)

---

## 🔍 Busca por Tarefa

### "Preciso configurar o ambiente"
→ [Guias de Setup](guias/setup/)

### "Preciso fazer deploy"
→ [Guias de Deploy](guias/deploy/)

### "Preciso aplicar uma migration"
→ [Guias de Migrations](guias/migrations/)

### "Estou com um erro"
→ [Troubleshooting](guias/troubleshooting/)

### "Preciso entender como usar o sistema"
→ [Guias de Usuário](guia-usuario/)

### "Preciso validar/testar"
→ [Validação](validacao/)

---

## 📚 Documentação Externa

### Scripts
- [Índice de Scripts](../../scripts/README.md)
- [Scripts de Banco de Dados](../../scripts/db/README.md)

### Código
- [PRD Fase 2](../../prd-beauty-sleep-fase2.md)
- [Tasks Fase 2](../../tasks-beauty-sleep-fase2.md)

---

## 🗄️ Documentação Arquivada

Documentação antiga que foi movida para referência histórica:

- [Testes Antigos](arquivados/testes-antigos/)
- [Relatórios Antigos](arquivados/relatorios-antigos/)

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte os [Guias de Troubleshooting](guias/troubleshooting/)
2. Verifique o [FAQ](guia-usuario/FAQ.md)
3. Consulte os [Relatórios](relatorios/) para contexto histórico

---

**Última atualização:** 2025-01-XX

