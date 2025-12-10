# Checklist de Deploy em Produção

**Gerado em:** 2025-01-27

## ⚠️ IMPORTANTE: Antes de Começar

- [ ] Obter aprovação explícita dos stakeholders
- [ ] Revisar guia completo: `docs/deploy/GUIA_DEPLOY_PRODUCAO.md`
- [ ] Verificar que todas as Fases 1-9 estão completas

## Pré-Deploy

### Verificações Técnicas

- [ ] Executar verificação: `npm run deploy:check`
- [ ] Verificar branch atual (recomendado: main)
- [ ] Verificar que não há mudanças não commitadas
- [ ] Executar build: `npm run build`
- [ ] Verificar que build foi bem-sucedido
- [ ] Executar testes: `npm test`
- [ ] Verificar que todos os testes passaram

### Configuração de Ambiente

- [ ] Configurar variáveis de ambiente no Vercel Dashboard:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_SITE_URL`

- [ ] Configurar Supabase Auth no Dashboard:
  - [ ] Site URL: `https://[production-domain].com`
  - [ ] Redirect URLs:
    - [ ] `https://[production-domain].com/auth/callback`
    - [ ] `https://[production-domain].com/dashboard`

### Backup

- [ ] Criar backup do banco de dados no Supabase Dashboard
- [ ] Verificar que backup foi criado com sucesso
- [ ] Documentar data/hora do backup

## Deploy

- [ ] Fazer deploy: `vercel --prod` ou via Vercel Dashboard
- [ ] Verificar deployment no Vercel Dashboard
- [ ] Aguardar build completar (verificar logs)
- [ ] Verificar que deployment está "Ready"

## Pós-Deploy - Verificações Imediatas

- [ ] Visitar URL de produção
- [ ] Verificar que página carrega sem erros
- [ ] Verificar console do navegador (sem erros críticos)
- [ ] Verificar logs do Vercel (sem erros 500)
- [ ] Verificar logs do Supabase (sem erros críticos)

## Pós-Deploy - Testes de Funcionalidade

- [ ] Testar Login:
  - [ ] Login com credenciais válidas funciona
  - [ ] Erro exibido para credenciais inválidas
  - [ ] Redireciona para /dashboard após login

- [ ] Testar Dashboard:
  - [ ] Dashboard carrega corretamente
  - [ ] KPIs aparecem (ou "--" para recepção)
  - [ ] Navegação funciona

- [ ] Testar Criar Paciente:
  - [ ] Botão "Novo Paciente" visível (Admin/Equipe)
  - [ ] Modal abre corretamente
  - [ ] Formulário funciona
  - [ ] Validações funcionam
  - [ ] Paciente criado com sucesso

- [ ] Testar Criar Sessão:
  - [ ] Acessar perfil do paciente
  - [ ] Botão "Nova Sessão" funciona
  - [ ] Modal abre corretamente
  - [ ] Sessão criada com sucesso
  - [ ] Status muda para "ativo" (se era "lead")

- [ ] Testar Busca Global:
  - [ ] Busca por CPF funciona
  - [ ] Busca por nome funciona
  - [ ] Busca por telefone funciona

- [ ] Testar Proteção de Rotas:
  - [ ] Admin: pode acessar /usuarios, /logs
  - [ ] Equipe: NÃO pode acessar /usuarios, /logs
  - [ ] Recepção: NÃO pode acessar /usuarios, /logs
  - [ ] Recepção: Dashboard mostra "--" para valores

## Pós-Deploy - Verificações Adicionais

- [ ] Verificar sync-biologix cron job:
  - [ ] Verificar configuração no Supabase
  - [ ] Testar execução manual
  - [ ] Verificar logs no dia seguinte às 10h BRT

- [ ] Monitorar erros nas primeiras 24 horas:
  - [ ] Verificar logs do Vercel a cada 2-4 horas
  - [ ] Verificar logs do Supabase a cada 2-4 horas
- [ ] Documentar problemas encontrados
  - [ ] Corrigir erros críticos imediatamente

## Monitoramento Pós-Deploy

- [ ] Dia 1: Monitoramento intensivo
  - [ ] Verificar logs a cada 2-4 horas
  - [ ] Coletar feedback dos usuários
  - [ ] Documentar problemas

- [ ] Semana 1: Check-ins diários
  - [ ] Check-in às 9h e 17h
  - [ ] Correções rápidas de problemas urgentes

- [ ] Semana 2: Revisão de analytics
  - [ ] Revisar métricas de uso
  - [ ] Identificar padrões
  - [ ] Criar relatório semanal

- [ ] Semana 3: Coletar feedback
  - [ ] Enviar pesquisa de satisfação
  - [ ] Agendar reuniões com usuários-chave
  - [ ] Documentar sugestões

- [ ] Semana 4: Criar roadmap Fase 2
  - [ ] Analisar todas as métricas
  - [ ] Criar documento de roadmap
  - [ ] Priorizar features

## Handoff

- [ ] Agendar reunião de handoff com stakeholders
- [ ] Preparar apresentação de métricas finais
- [ ] Revisar critérios de sucesso
- [ ] Discutir próximos passos (Fase 2 PRD)
- [ ] Celebrar lançamento! 🎉

---

**Guia completo:** `docs/deploy/GUIA_DEPLOY_PRODUCAO.md`  
**Guia de monitoramento:** `docs/deploy/GUIA_MONITORAMENTO.md`  
**Guia de handoff:** `docs/deploy/GUIA_HANDOFF.md`

**Comandos úteis:**
- `npm run deploy:check` - Verificar prontidão para deploy
- `npm run deploy:prepare` - Preparar ambiente para deploy
- `npm run build` - Executar build
- `npm test` - Executar testes
