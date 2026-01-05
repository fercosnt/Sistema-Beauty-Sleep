# Tasks: Beauty Sleep Sistema - Fase 2

> **PRD Referência**: [prd-beauty-sleep-fase2.md](./prd-beauty-sleep-fase2.md)
> **Data**: 28/12/2025

---

## Relevant Files

### Arquivos a Criar
- `supabase/migrations/012_alertas.sql` - Schema da tabela de alertas
- `supabase/functions/check-alerts/index.ts` - Edge Function para cron job de alertas
- `supabase/functions/check-alerts/deno.json` - Configuração Deno da Edge Function
- `app/alertas/page.tsx` - Página de listagem de alertas
- `app/alertas/components/AlertasList.tsx` - Componente de lista de alertas
- `app/alertas/components/AlertaCard.tsx` - Card individual de alerta
- `app/alertas/components/AlertasFilters.tsx` - Filtros da página de alertas
- `components/ui/NotificationCenter.tsx` - Centro de notificações no header
- `components/ui/NotificationBadge.tsx` - Badge de contagem de alertas
- `components/ui/GaugeChart.tsx` - Componente de gauge circular reutilizável
- `components/ui/HistogramChart.tsx` - Componente de histograma horizontal
- `components/ui/RiskBar.tsx` - Barra de risco cardiovascular
- `lib/utils/alertas.ts` - Funções utilitárias de alertas
- `lib/utils/comparacao-exames.ts` - Funções de cálculo de % melhora

### Arquivos a Modificar
- `app/pacientes/components/ModalDetalhesExame.tsx` - Redesign completo do modal
- `app/pacientes/[id]/components/TabEvolucao.tsx` - Novos gráficos e comparações
- `app/dashboard/components/DashboardRonco.tsx` - Adicionar Casos Críticos
- `app/dashboard/components/DashboardApneia.tsx` - Adicionar Top 10 Melhorias
- `components/ui/Header.tsx` - Adicionar NotificationCenter
- `components/ui/Sidebar.tsx` - Link para /alertas
- `supabase/functions/sync-biologix/index.ts` - Trigger de alertas críticos

### Arquivos de Teste (a criar se necessário)
- `__tests__/utils/comparacao-exames.test.ts` - Testes para cálculos de comparação
- `__tests__/utils/alertas.test.ts` - Testes para funções de alertas

---

## Notes

- Unit tests devem ser colocados junto aos arquivos que testam
- Use `npm test` para rodar os testes
- Use `npx supabase db push` para aplicar migrations
- Use `npx supabase functions deploy check-alerts` para deploy da Edge Function
- Consulte o PRD para detalhes de cada requisito funcional

---

## Instructions for Completing Tasks

**IMPORTANTE:** Ao completar cada tarefa, marque-a como concluída mudando `- [ ]` para `- [x]`. Isso ajuda a acompanhar o progresso.

Exemplo:
- `- [ ] 1.1 Verificar campo` → `- [x] 1.1 Verificar campo` (após completar)

Atualize o arquivo após completar cada sub-tarefa, não apenas após completar uma tarefa pai.

---

## Tasks

### Fase 2.1: Interface do Modal de Exames

- [x] **0.0 Criar branch de feature**
  - [x] 0.1 Criar e fazer checkout da branch `feature/fase2-melhorias`

- [x] **1.0 Verificar campos disponíveis no banco de dados**
  - [x] 1.1 Verificar na tabela `exames` se existem os campos de tempo: `hora_inicio`, `hora_fim`, `duracao_total`, `duracao_valida`
  - [x] 1.2 Verificar campos de condições da noite: `consumo_alcool`, `congestao_nasal`, `sedativos`, `placa_bruxismo`, `marcapasso`
  - [x] 1.3 Verificar campos de tratamentos: `cpap`, `aparelho_avanco`, `terapia_posicional`, `oxigenio`, `suporte_ventilatorio`
  - [x] 1.4 Verificar campos de ficha médica: `medicamentos`, `sintomas`, `doencas_associadas`
  - [x] 1.5 Verificar campos de oximetria: `spo2_min`, `spo2_avg`, `spo2_max`, `tempo_spo2_90`, `num_dessaturacoes`, `ido`, `ido_sono`
  - [x] 1.6 Verificar campos de hipoxemia: `num_eventos_hipoxemia`, `tempo_hipoxemia`, `carga_hipoxica`
  - [x] 1.7 Verificar campos de frequência cardíaca: `bpm_min`, `bpm_medio`, `bpm_max`
  - [x] 1.8 Verificar campos de sono estimado: `tempo_sono`, `tempo_dormir`, `tempo_acordado`, `eficiencia_sono`
  - [x] 1.9 Documentar campos faltantes e criar migration se necessário
  > **Migration criada:** `013_add_exam_extended_fields.sql` com todos os campos faltantes
  > **sync-biologix atualizado** para popular os novos campos

- [x] **2.0 Redesign do Modal de Detalhes do Exame - Polissonografia**
  - [x] 2.1 Criar componente `GaugeChart.tsx` para gauges circulares (IDO, SpO2)
  - [x] 2.2 Criar componente `HistogramChart.tsx` para histogramas horizontais
  - [x] 2.3 Criar componente `RiskBar.tsx` para barra de risco cardiovascular
  - [x] 2.4 Refatorar `ModalDetalhesExame.tsx` - Seção 1: Cabeçalho do exame (início, fim, tempo total/válido)
  - [x] 2.5 Refatorar `ModalDetalhesExame.tsx` - Seção 2: Condições na noite do exame (checkboxes)
  - [x] 2.6 Refatorar `ModalDetalhesExame.tsx` - Seção 3: Tratamentos na noite do exame
  - [x] 2.7 Refatorar `ModalDetalhesExame.tsx` - Seção 4: Ficha médica (peso, altura, IMC, medicamentos, sintomas, doenças)
  - [x] 2.8 Refatorar `ModalDetalhesExame.tsx` - Seção 5: Resultado principal com gauges (IDO e SpO2<90%)
  - [x] 2.9 Refatorar `ModalDetalhesExame.tsx` - Seção 6: Oximetria completa com histograma SpO2
  - [x] 2.10 Refatorar `ModalDetalhesExame.tsx` - Seção 7: Carga hipóxica com barra de risco
  - [x] 2.11 Refatorar `ModalDetalhesExame.tsx` - Seção 8: Frequência cardíaca com histograma
  - [x] 2.12 Refatorar `ModalDetalhesExame.tsx` - Seção 9: Sono estimado (tempo, eficiência)
  - [x] 2.13 Refatorar `ModalDetalhesExame.tsx` - Seção 10: Análise de ronco com gauges (silêncio/baixo/médio/alto)
  - [ ] 2.14 Testar modal de polissonografia com dados reais

- [x] **3.0 Redesign do Modal de Detalhes do Exame - Ronco**
  - [x] 3.1 Criar variante do modal para exame tipo Ronco (integrado no mesmo componente)
  - [x] 3.2 Implementar cabeçalho do exame (início, fim, tempo total/válido)
  - [x] 3.3 Implementar seção de condições e tratamentos
  - [x] 3.4 Implementar seção de ficha médica
  - [x] 3.5 Implementar análise de ronco detalhada (tempo gravação, tempo ronco total/baixo/médio/alto)
  - [x] 3.6 Implementar gauges circulares para intensidade do ronco (silêncio/baixo/médio/alto)
  - [ ] 3.7 Testar modal de ronco com dados reais

---

### Fase 2.2: Tab Evolução

- [x] **4.0 Implementar Tab Evolução - Gráficos Expandidos**
  - [x] 4.1 Refatorar `TabEvolucao.tsx` para suportar múltiplos gráficos
  - [x] 4.2 Criar seletor de métrica para alternar entre os 13 gráficos
  - [x] 4.3 Implementar gráfico 1: Score de Ronco (já existe, manter)
  - [x] 4.4 Implementar gráfico 2: IDO (/hora)
  - [x] 4.5 Implementar gráfico 3: Tempo com SpO2 < 90% (%)
  - [x] 4.6 Implementar gráfico 4: SpO2 Mínima (%)
  - [x] 4.7 Implementar gráfico 5: SpO2 Média (%)
  - [x] 4.8 Implementar gráfico 6: SpO2 Máxima (%)
  - [x] 4.9 Implementar gráfico 7: Número de Dessaturações (#)
  - [x] 4.10 Implementar gráfico 8: Número de Eventos de Hipoxemia (#)
  - [x] 4.11 Implementar gráfico 9: Tempo Total em Hipoxemia (min)
  - [x] 4.12 Implementar gráfico 10: Carga Hipóxica (%.min/hora)
  - [x] 4.13 Implementar gráfico 11: Frequência Cardíaca Mínima (bpm)
  - [x] 4.14 Implementar gráfico 12: Frequência Cardíaca Média (bpm)
  - [x] 4.15 Implementar gráfico 13: Frequência Cardíaca Máxima (bpm)
  - [x] 4.16 Adicionar marcadores de sessões de tratamento em todos os gráficos
  - [x] 4.17 Implementar filtro de período (6 meses, 12 meses, Todo histórico)
  - [ ] 4.18 Testar gráficos com pacientes que têm múltiplos exames

- [x] **5.0 Implementar Tab Evolução - Comparações de Exames**
  - [x] 5.1 Criar `lib/utils/comparacao-exames.ts` com funções de cálculo
  - [x] 5.2 Implementar função `calcularMelhoraPercentual(valorInicial, valorFinal, menorMelhor)`
  - [x] 5.3 Implementar função `obterPrimeiroUltimoExame(exames)`
  - [x] 5.4 Implementar função `obterPiorMelhorExame(exames)` baseado em IDO
  - [x] 5.5 Criar componente `ComparacaoExames.tsx` para tabelas de comparação
  - [x] 5.6 Implementar tabela "Primeiro vs Último Exame" com 5 métricas
  - [x] 5.7 Implementar tabela "Pior vs Melhor Exame" com 5 métricas
  - [x] 5.8 Adicionar indicadores visuais (verde/amarelo/vermelho) para % melhora
  - [x] 5.9 Integrar componente de comparação na TabEvolucao
  - [x] 5.10 Escrever testes para funções de cálculo
  - [ ] 5.11 Testar comparações com pacientes reais

---

### Fase 2.3: Dashboard

- [x] **6.0 Melhorias no Dashboard - Aba Ronco**
  - [x] 6.1 Criar componente `CasosCriticosRonco.tsx` para tabela de casos críticos
  - [x] 6.2 Implementar query para buscar pacientes com score_ronco > 2
  - [x] 6.3 Implementar tabela com colunas: Nome, Score Ronco, Último Exame, Ação
  - [x] 6.4 Adicionar ordenação por Score Ronco decrescente
  - [x] 6.5 Adicionar link "Ver Paciente" em cada linha
  - [x] 6.6 Integrar componente em `DashboardRonco.tsx`
  - [x] 6.7 Implementar filtros de período dinâmicos (7d, 30d, 60d, 90d, 6m, 1a, personalizado)
  - [ ] 6.8 Testar aba Ronco com dados reais

- [x] **7.0 Melhorias no Dashboard - Aba Apneia**
  - [x] 7.1 Criar componente `TopMelhoriasApneia.tsx` para tabela de top melhorias
  - [x] 7.2 Implementar query para buscar primeiro e último exame por paciente (IDO)
  - [x] 7.3 Calcular % de melhora para cada paciente
  - [x] 7.4 Implementar tabela com colunas: Nome, IDO Inicial, IDO Final, % Melhora
  - [x] 7.5 Adicionar ordenação por % Melhora decrescente, limitado a 10
  - [x] 7.6 Adicionar link "Ver Paciente" em cada linha
  - [x] 7.7 Integrar componente em `DashboardApneia.tsx`
  - [x] 7.8 Implementar filtros de período dinâmicos
  - [ ] 7.9 Testar aba Apneia com dados reais

---

### Fase 2.4: Sistema de Alertas

- [x] **8.0 Criar tabela de Alertas no banco de dados**
  - [x] 8.1 Criar migration `014_alertas.sql`
  - [x] 8.2 Definir tabela `alertas` com campos: id, tipo, urgencia, titulo, mensagem, paciente_id, exame_id, status, resolvido_por, resolvido_em, dados_extras, created_at
  - [x] 8.3 Adicionar constraints CHECK para tipo (critico/manutencao/followup) e urgencia (alta/media/baixa)
  - [x] 8.4 Criar índices para status, tipo, created_at, paciente_id
  - [x] 8.5 Habilitar RLS na tabela
  - [x] 8.6 Criar policy para admin e equipe poderem ver alertas
  - [x] 8.7 Criar policy para admin e equipe poderem atualizar alertas
  - [ ] 8.8 Aplicar migration no Supabase Dashboard (SQL Editor)
  - [ ] 8.9 Verificar tabela criada corretamente

- [x] **9.0 Implementar geração de alertas críticos no Sync Biologix**
  - [x] 9.1 Criar `supabase/functions/sync-biologix/alertas.ts` com funções de criação de alertas
  - [x] 9.2 Implementar função `criarAlertaCritico(tipo, pacienteId, exameId, dados)`
  - [x] 9.3 Modificar `sync-biologix/index.ts` - Após inserir exame, verificar IDO acentuado (categoria = 3)
  - [x] 9.4 Modificar `sync-biologix/index.ts` - Verificar SpO2 crítico (spo2_min < 80%)
  - [x] 9.5 Modificar `sync-biologix/index.ts` - Verificar Fibrilação Atrial (fibrilacao_atrial = 1)
  - [x] 9.6 Modificar `sync-biologix/index.ts` - Buscar exame anterior e verificar piora de IDO
  - [x] 9.7 Modificar `sync-biologix/index.ts` - Buscar exame anterior e verificar piora de Score Ronco
  - [x] 9.8 Modificar `sync-biologix/index.ts` - Verificar eficiência do sono < 75%
  - [ ] 9.9 Testar sync com exame que gera alerta crítico

- [x] **10.0 Criar Edge Function para alertas de manutenção/follow-up**
  - [x] 10.1 Criar pasta `supabase/functions/check-alerts/`
  - [x] 10.2 Criar `index.ts` com lógica principal
  - [x] 10.3 Implementar verificação de manutenção em 7 dias (proxima_manutencao = HOJE + 7)
  - [x] 10.4 Implementar verificação de manutenção atrasada (proxima_manutencao < HOJE)
  - [x] 10.5 Implementar verificação de manutenção muito atrasada (proxima_manutencao < HOJE - 30)
  - [x] 10.6 Implementar verificação de manutenção 6 meses (status='finalizado' + 6 meses)
  - [x] 10.7 Implementar verificação de lead sem contato (status='lead' AND created_at < HOJE - 3)
  - [x] 10.8 Implementar verificação de paciente sem sessão (status='ativo' AND sessoes=0 AND created_at < HOJE - 7)
  - [x] 10.9 Implementar verificação de não resposta ao tratamento (5+ sessões e <20% melhora)
  - [x] 10.10 Evitar duplicação de alertas (verificar se já existe alerta pendente)
  - [x] 10.11 Configurar cron job para executar às 8h BRT (11h UTC)
  - [ ] 10.12 Deploy da Edge Function
  - [ ] 10.13 Testar execução manual da function

- [x] **11.0 Implementar Centro de Notificações no Header**
  - [x] 11.1 Criar componente `NotificationBadge.tsx` com contador
  - [x] 11.2 Criar componente `NotificationCenter.tsx` com dropdown
  - [x] 11.3 Implementar query para buscar alertas pendentes do usuário
  - [x] 11.4 Implementar contagem de alertas por urgência
  - [x] 11.5 Implementar cor do badge baseada na urgência máxima (vermelho > amarelo > verde)
  - [x] 11.6 Implementar dropdown com últimos 5 alertas
  - [x] 11.7 Implementar preview de alerta no dropdown (tipo, título, tempo relativo)
  - [x] 11.8 Adicionar botão "Marcar como Visualizado" em cada alerta
  - [x] 11.9 Adicionar link "Ver todos" para /alertas
  - [x] 11.10 Integrar NotificationCenter em `Header.tsx`
  - [ ] 11.11 Testar notificações com alertas reais

- [ ] **12.0 Criar página de Alertas (/alertas)**
  - [ ] 12.1 Criar `app/alertas/page.tsx` com layout básico
  - [ ] 12.2 Criar componente `AlertasFilters.tsx` com filtros de tipo, urgência, status
  - [ ] 12.3 Criar componente `AlertaCard.tsx` para exibir alerta individual
  - [ ] 12.4 Criar componente `AlertasList.tsx` para lista de alertas
  - [ ] 12.5 Implementar query com filtros e paginação
  - [ ] 12.6 Implementar ação "Ver Paciente" em cada alerta
  - [ ] 12.7 Implementar ação "Marcar como Resolvido" em cada alerta
  - [ ] 12.8 Implementar seleção múltipla e ação em lote "Resolver Selecionados"
  - [ ] 12.9 Adicionar link para /alertas na Sidebar
  - [ ] 12.10 Testar página com diferentes tipos de alertas

---

### Validação Final

- [ ] **13.0 Testes e validação**
  - [ ] 13.1 Testar modal de polissonografia com pelo menos 3 exames diferentes
  - [ ] 13.2 Testar modal de ronco com pelo menos 3 exames diferentes
  - [ ] 13.3 Testar todos os 13 gráficos de evolução com paciente real
  - [ ] 13.4 Testar comparações primeiro/último e pior/melhor com paciente real
  - [ ] 13.5 Testar geração de alertas críticos via sync
  - [ ] 13.6 Testar geração de alertas de manutenção via cron
  - [ ] 13.7 Testar centro de notificações no header
  - [ ] 13.8 Testar página de alertas com filtros
  - [ ] 13.9 Verificar responsividade em mobile
  - [ ] 13.10 Verificar permissões por role (admin vs equipe vs recepção)
  - [ ] 13.11 Criar PR para revisão
  - [ ] 13.12 Merge após aprovação

---

## Progress Tracking

| Fase | Tarefas | Concluídas | % |
|------|---------|------------|---|
| 2.1 - Modal de Exames | 0-3 | 11 | 100% (Tarefa 1 completa) |
| 2.2 - Tab Evolução | 4-5 | 0 | 0% |
| 2.3 - Dashboard | 6-7 | 0 | 0% |
| 2.4 - Alertas | 8-12 | 0 | 0% |
| Validação | 13 | 0 | 0% |
| **Total** | **14** | **11** | **Progresso: Tarefa 1.0 completa** |

## Arquivos Criados/Modificados

### Criados:
- `supabase/migrations/013_add_exam_extended_fields.sql` - Migration com todos os novos campos para Fase 2
- `scripts/verificar-campos-exames.sql` - Script para verificar campos existentes
- `scripts/aplicar-migration-013.sql` - Script para aplicar migration manualmente
- `components/ui/GaugeChart.tsx` - Componente de gauge circular para métricas (IDO, SpO2, Ronco)
- `components/ui/HistogramChart.tsx` - Componente de histograma horizontal para distribuições
- `components/ui/RiskBar.tsx` - Componente de barra de risco cardiovascular

### Modificados:
- `supabase/functions/sync-biologix/index.ts` - Atualizado para popular todos os novos campos (condições, tratamentos, oximetria completa, sono, ronco, cardiologia)
- `app/pacientes/components/ModalDetalhesExame.tsx` - Redesign completo com 11 seções:
  - Seção 1: Cabeçalho do Exame (início, fim, durações)
  - Seção 2: Condições na Noite do Exame (checkboxes)
  - Seção 3: Tratamentos na Noite do Exame (checkboxes)
  - Seção 4: Ficha Médica (peso, altura, IMC, medicamentos, sintomas, doenças)
  - Seção 5: Resultado Principal com Gauges (IDO e SpO2<90%)
  - Seção 6: Oximetria Completa com Histograma SpO2
  - Seção 7: Carga Hipóxica com Barra de Risco
  - Seção 8: Frequência Cardíaca com Histograma
  - Seção 9: Sono Estimado (tempo, eficiência)
  - Seção 10: Análise de Ronco com Gauge e Histograma
  - Seção 11: Cardiologia (Fibrilação Atrial)
