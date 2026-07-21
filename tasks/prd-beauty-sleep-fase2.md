# PRD: Beauty Sleep Sistema - Fase 2

> **Versão**: 1.0
> **Data**: 27/12/2025
> **Status**: Aprovado para Implementação

---

## 1. Introduction/Overview

### Problema
O Sistema Beauty Sleep está funcional, mas a equipe médica enfrenta dificuldades para:
1. **Visualizar exames completos** - O modal atual não mostra todas as métricas disponíveis no PDF do Biologix
2. **Acompanhar evolução** - A tab Evolução só mostra Score de Ronco, sem outras métricas importantes
3. **Comparar resultados** - Não há comparação automática entre primeiro/último ou pior/melhor exame
4. **Receber alertas proativos** - A equipe precisa acessar o dashboard manualmente para ver casos críticos

### Solução
Implementar melhorias em 3 categorias, na seguinte ordem de prioridade:
1. **Interface do Modal de Exames** - Redesign similar ao PDF Biologix
2. **Tab Evolução** - Novos gráficos e comparações com % de melhora
3. **Sistema de Alertas** - Notificações proativas para casos críticos

### Objetivo Principal
Melhorar a visualização de evolução do paciente, permitindo que a equipe médica analise rapidamente o progresso do tratamento com métricas comparativas.

---

## 2. Goals

| ID | Objetivo | Métrica de Sucesso |
|----|----------|-------------------|
| G1 | Exibir todas as métricas do exame Biologix no modal | 100% das métricas do PDF disponíveis no sistema |
| G2 | Permitir comparação de evolução entre exames | Visualização de % melhora primeiro→último e pior→melhor |
| G3 | Expandir gráficos de evolução temporal | 13 métricas com gráficos (vs. 1 atual) |
| G4 | Alertar equipe sobre casos críticos | Notificação proativa para 13 tipos de alertas |
| G5 | Reduzir tempo de análise de evolução | Redução de 50% no tempo de revisão de paciente |

---

## 3. User Stories

### US-01: Visualização Completa do Exame
**Como** membro da equipe médica
**Eu quero** ver todas as métricas do exame de polissonografia no modal de detalhes
**Para que** eu não precise abrir o PDF do Biologix separadamente

**Critérios de Aceite:**
- Modal exibe: cabeçalho (início, fim, tempo total/válido)
- Modal exibe: condições na noite do exame
- Modal exibe: ficha médica (peso, altura, IMC, sintomas)
- Modal exibe: resultado principal com gauges visuais (IDO, SpO2<90%)
- Modal exibe: oximetria completa com histograma
- Modal exibe: carga hipóxica com barra de risco cardiovascular
- Modal exibe: frequência cardíaca com histograma
- Modal exibe: sono estimado (tempo total, eficiência)
- Modal exibe: análise de ronco com gauges (silêncio/baixo/médio/alto)

### US-02: Visualização do Exame de Ronco
**Como** membro da equipe médica
**Eu quero** ver detalhes completos do exame de ronco
**Para que** eu possa avaliar a intensidade e distribuição do ronco

**Critérios de Aceite:**
- Modal exibe: tempo de gravação, tempo com ronco total
- Modal exibe: tempo com ronco baixo, médio e alto (min e %)
- Modal exibe: gauges circulares para silêncio/baixo/médio/alto

### US-03: Comparação de Evolução
**Como** membro da equipe médica
**Eu quero** ver a comparação entre primeiro e último exame do paciente
**Para que** eu possa avaliar rapidamente a eficácia do tratamento

**Critérios de Aceite:**
- Tabela "Primeiro vs Último Exame" com: IDO, SpO2 min, SpO2<90%, Score Ronco, Carga Hipóxica
- Cada métrica mostra: valor primeiro, valor último, variação absoluta, % de melhora
- Indicador visual: verde (melhora), amarelo (igual), vermelho (piora)

### US-04: Comparação Pior vs Melhor
**Como** membro da equipe médica
**Eu quero** ver a comparação entre pior e melhor exame do paciente
**Para que** eu entenda a amplitude de variação nos resultados

**Critérios de Aceite:**
- Tabela "Pior vs Melhor Exame" com mesmas métricas
- Definição de "pior" e "melhor" baseada em IDO (principal métrica)
- Mesmos indicadores visuais da comparação primeiro/último

### US-05: Gráficos de Evolução Expandidos
**Como** membro da equipe médica
**Eu quero** ver gráficos de evolução para múltiplas métricas
**Para que** eu possa acompanhar tendências além do Score de Ronco

**Critérios de Aceite:**
- 13 gráficos disponíveis: Score Ronco, IDO, SpO2<90%, SpO2 min/avg/max, Dessaturações, Hipoxemia, Carga Hipóxica, FC min/avg/max
- Cada gráfico mostra linha temporal com todos os exames
- Marcadores de sessões de tratamento visíveis em todos os gráficos
- Filtro de período disponível

### US-06: Dashboard Ronco - Casos Críticos
**Como** membro da equipe médica
**Eu quero** ver pacientes com ronco alto na aba Ronco do dashboard
**Para que** eu possa priorizar casos que precisam de atenção

**Critérios de Aceite:**
- Tabela "Casos Críticos" com pacientes com score_ronco > 2
- Colunas: Nome, Score Ronco, Último Exame, Ação (link para perfil)

### US-07: Dashboard Apneia - Top Melhorias
**Como** membro da equipe médica
**Eu quero** ver pacientes que mais melhoraram na aba Apneia
**Para que** eu possa identificar casos de sucesso

**Critérios de Aceite:**
- Tabela "Top 10 Melhorias" com comparação primeiro vs último IDO
- Colunas: Nome, IDO Inicial, IDO Final, % Melhora

### US-08: Alertas de Casos Críticos
**Como** membro da equipe médica
**Eu quero** receber alertas quando houver casos críticos
**Para que** eu não dependa de verificar o dashboard manualmente

**Critérios de Aceite:**
- Centro de Notificações no header com badge de contagem
- Alertas críticos: IDO acentuado, SpO2<80%, Fibrilação Atrial, Piora IDO, Piora Ronco
- Alertas de manutenção: 7 dias, atrasada, muito atrasada (>30d), 6 meses pós-tratamento
- Alertas de follow-up: Lead sem contato (>3d), Paciente sem sessão (>7d)
- Página /alertas com listagem completa e filtros

### US-09: Alertas de Resposta ao Tratamento
**Como** membro da equipe médica
**Eu quero** ser alertado quando um paciente não está respondendo ao tratamento
**Para que** eu possa reavaliar o protocolo

**Critérios de Aceite:**
- Alerta quando paciente tem 5+ sessões e <20% de melhora no IDO
- Alerta quando eficiência do sono <75%

---

## 4. Functional Requirements

### FR-1: Modal de Detalhes - Polissonografia

**FR-1.1** O sistema deve exibir o cabeçalho do exame com:
- Data/hora de início e fim
- Tempo total e tempo válido de registro

**FR-1.2** O sistema deve exibir as condições na noite do exame:
- Consumo de álcool, Congestão nasal, Sedativos, Placa de bruxismo, Marcapasso
- Exibir como checkboxes marcados/desmarcados

**FR-1.3** O sistema deve exibir os tratamentos na noite do exame:
- CPAP, Aparelho de avanço mandibular, Terapia posicional, Oxigênio, Suporte ventilatório

**FR-1.4** O sistema deve exibir a ficha médica:
- Peso, Altura, IMC (já calculado)
- Lista de medicamentos
- Sintomas marcados
- Doenças associadas

**FR-1.5** O sistema deve exibir o resultado principal com gauges visuais:
- Gauge circular para IDO (0-60+) com cor baseada na categoria
- Gauge circular para Tempo com SpO2<90% (0-100%)
- Legenda com valores de referência para IDO

**FR-1.6** O sistema deve exibir métricas de oximetria:
- SpO2 mínima, média, máxima
- Tempo com SpO2<90% em minutos e %
- Número de dessaturações
- IDO e IDO durante sono (IDOs)
- Número de eventos de hipoxemia
- Tempo total em hipoxemia

**FR-1.7** O sistema deve exibir histograma de SpO2:
- Barras horizontais por faixa: >95%, 95-93%, 92-90%, 89-87%, 86-84%, 83-81%, 80-78%, <78%

**FR-1.8** O sistema deve exibir carga hipóxica:
- Valor em %.min/hora
- Barra de risco cardiovascular (0 a 300+)

**FR-1.9** O sistema deve exibir frequência cardíaca:
- Mínima, média, máxima em bpm
- Histograma por faixas

**FR-1.10** O sistema deve exibir sono estimado:
- Tempo total de sono
- Tempo para dormir
- Tempo acordado pós-sono
- Eficiência do sono (%)

**FR-1.11** O sistema deve exibir análise de ronco:
- Tempo de gravação, tempo com ronco
- Gauges para silêncio/baixo/médio/alto (%)

### FR-2: Modal de Detalhes - Ronco

**FR-2.1** O sistema deve exibir o cabeçalho igual ao de polissonografia

**FR-2.2** O sistema deve exibir análise de ronco detalhada:
- Tempo de gravação
- Tempo com ronco total (min e %)
- Tempo com ronco baixo (min e %)
- Tempo com ronco médio (min e %)
- Tempo com ronco alto (min e %)

**FR-2.3** O sistema deve exibir gauges circulares:
- Silêncio, Baixo, Médio, Alto com % e cor indicativa

### FR-3: Tab Evolução - Gráficos

**FR-3.1** O sistema deve exibir 13 gráficos de evolução temporal:
1. Score de Ronco (pontos)
2. IDO (/hora)
3. Tempo com SpO2<90% (%)
4. SpO2 Mínima (%)
5. SpO2 Média (%)
6. SpO2 Máxima (%)
7. Número de Dessaturações (#)
8. Número de Eventos de Hipoxemia (#)
9. Tempo Total em Hipoxemia (min)
10. Carga Hipóxica (%.min/hora)
11. Frequência Cardíaca Mínima (bpm)
12. Frequência Cardíaca Média (bpm)
13. Frequência Cardíaca Máxima (bpm)

**FR-3.2** Cada gráfico deve mostrar:
- Linha temporal com pontos para cada exame
- Marcadores verticais para sessões de tratamento
- Tooltip com data e valor ao passar o mouse

**FR-3.3** O sistema deve permitir filtrar por período:
- 6 meses, 12 meses, Todo o histórico

### FR-4: Tab Evolução - Comparações

**FR-4.1** O sistema deve exibir tabela "Primeiro vs Último Exame":
- Métricas: IDO, SpO2 Mínima, SpO2<90%, Score Ronco, Carga Hipóxica
- Colunas: Métrica, Valor Primeiro, Valor Último, Variação, % Melhora

**FR-4.2** O sistema deve exibir tabela "Pior vs Melhor Exame":
- Mesmas métricas e colunas
- "Pior" = exame com maior IDO
- "Melhor" = exame com menor IDO

**FR-4.3** O sistema deve calcular % de melhora:
- Para métricas onde MENOR é melhor: `((inicial - final) / inicial) * 100`
- Para métricas onde MAIOR é melhor: `((final - inicial) / inicial) * 100`

**FR-4.4** O sistema deve exibir indicador visual:
- Verde: melhora > 0%
- Amarelo: melhora = 0%
- Vermelho: piora (melhora < 0%)

### FR-5: Dashboard - Melhorias

**FR-5.1** Aba Ronco - Adicionar tabela "Casos Críticos":
- Filtro: score_ronco > 2
- Colunas: Nome, Score Ronco, Data Último Exame, Botão "Ver Paciente"
- Ordenação: Score Ronco decrescente

**FR-5.2** Aba Apneia - Adicionar tabela "Top 10 Melhorias":
- Comparação primeiro vs último exame por IDO
- Colunas: Nome, IDO Inicial, IDO Final, % Melhora
- Ordenação: % Melhora decrescente
- Limite: 10 registros

**FR-5.3** Filtros de período mais dinâmicos:
- Opções: 7 dias, 30 dias, 60 dias, 90 dias, 6 meses, 1 ano, Personalizado
- Aplicar a todos os gráficos e tabelas da aba

### FR-6: Sistema de Alertas

**FR-6.1** Criar tabela `alertas` no banco de dados:
- Campos: id, tipo, urgencia, titulo, mensagem, paciente_id, exame_id, status, resolvido_por, resolvido_em, dados_extras, created_at
- RLS para admin e equipe

**FR-6.2** Gerar alertas críticos automaticamente no sync Biologix:
- IDO Acentuado: ido_categoria = 3
- SpO2 Crítico: spo2_min < 80%
- Fibrilação Atrial: fibrilacao_atrial = 1
- Piora de IDO: ido_atual > ido_anterior (mesmo paciente)
- Piora de Ronco: score_ronco_atual > score_anterior

**FR-6.3** Gerar alertas de manutenção via cron job diário (8h BRT):
- Manutenção em 7 dias: proxima_manutencao = HOJE + 7
- Manutenção atrasada: proxima_manutencao < HOJE
- Muito atrasada: proxima_manutencao < HOJE - 30
- Manutenção 6 meses: status='finalizado' + 6 meses após updated_at

**FR-6.4** Gerar alertas de follow-up via cron job:
- Lead sem contato: status='lead' AND created_at < HOJE - 3
- Paciente sem sessão: status='ativo' AND sessoes_utilizadas=0 AND created_at < HOJE - 7

**FR-6.5** Gerar alertas de resposta ao tratamento:
- Não resposta: sessoes_utilizadas >= 5 AND melhora_ido < 20%
- Eficiência baixa: eficiencia_sono < 75% no último exame

**FR-6.6** Exibir Centro de Notificações no Header:
- Ícone de sino com badge de contagem
- Cor do badge baseada na urgência máxima (vermelho > amarelo > verde)
- Dropdown com últimos 5 alertas
- Link "Ver todos" para /alertas

**FR-6.7** Criar página /alertas:
- Lista de todos os alertas com paginação
- Filtros: tipo (crítico/manutenção/followup), urgência, status
- Ações: Ver Paciente, Marcar como Resolvido
- Ações em lote: resolver múltiplos

---

## 5. Non-Goals (Out of Scope)

Explicitamente **NÃO** fazem parte desta fase:

- ❌ **Análise de IA com Claude API** - Será feito em fase posterior
- ❌ **Integração WhatsApp Business API** - Fase posterior
- ❌ **Integração Google Calendar** - Fase posterior
- ❌ **Export Excel/CSV/PDF** - Fase posterior
- ❌ **Portal do Paciente** - Fase posterior
- ❌ **Upload de fotos antes/depois** - Fase posterior
- ❌ **Polissonogramas (gráficos de timeline)** - Não incluir no modal
- ❌ **Notificações por email** - Avaliar em fase posterior
- ❌ **Push notifications no browser** - Avaliar em fase posterior

---

## 6. Design Considerations

### Modal de Detalhes do Exame
- Seguir layout similar ao PDF do Biologix
- Usar gauges circulares para IDO, SpO2<90%, e intensidade de ronco
- Cores: Verde (normal), Amarelo (leve), Laranja (moderado), Vermelho (acentuado)
- Histogramas com barras horizontais

### Tab Evolução
- Gráficos com Recharts (já utilizado no sistema)
- Marcadores de sessão como linhas verticais tracejadas
- Tabelas de comparação com cards destacados

### Centro de Notificações
- Posição: Header, lado direito, antes do menu do usuário
- Badge: Círculo vermelho/amarelo/verde com número
- Dropdown: Largura 400px, altura máxima 500px com scroll

### Cores de Urgência
- Alta (crítico): Vermelho (#EF4444)
- Média (manutenção): Amarelo (#F59E0B)
- Baixa (follow-up): Verde (#10B981)

---

## 7. Technical Considerations

### Dados Disponíveis
Os dados adicionais para o modal (condições da noite, ficha médica, etc.) **já vêm do sync Biologix** e estão armazenados na tabela `exames`.

### Campos a Verificar no Banco
Verificar se todos os campos abaixo existem na tabela `exames`:
- `hora_inicio`, `hora_fim`
- `consumo_alcool`, `congestao_nasal`, `sedativos`, `placa_bruxismo`, `marcapasso`
- `cpap`, `aparelho_avanco`, `terapia_posicional`, `oxigenio`, `suporte_ventilatorio`
- `medicamentos`, `sintomas`, `doencas_associadas`
- `spo2_histograma` (JSONB ou campos separados)
- `carga_hipoxica`
- `bpm_histograma` (JSONB ou campos separados)
- `tempo_sono`, `tempo_dormir`, `tempo_acordado`, `eficiencia_sono`

### Nova Tabela: `alertas`
```sql
CREATE TABLE alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('critico', 'manutencao', 'followup')),
  urgencia VARCHAR(10) NOT NULL CHECK (urgencia IN ('alta', 'media', 'baixa')),
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT,
  paciente_id UUID REFERENCES pacientes(id),
  exame_id UUID REFERENCES exames(id),
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'visualizado', 'resolvido')),
  resolvido_por UUID REFERENCES users(id),
  resolvido_em TIMESTAMP,
  dados_extras JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alertas_status ON alertas(status);
CREATE INDEX idx_alertas_tipo ON alertas(tipo);
CREATE INDEX idx_alertas_created ON alertas(created_at DESC);
```

### Modificações no Sync Biologix
Adicionar lógica de geração de alertas críticos após inserir/atualizar exame.

### Nova Edge Function: `check-alerts`
Cron job diário às 8h BRT para alertas de manutenção e follow-up.

### Arquivos a Criar
| Arquivo | Descrição |
|---------|-----------|
| `supabase/migrations/012_alertas.sql` | Schema da tabela de alertas |
| `supabase/functions/check-alerts/index.ts` | Edge Function para cron job |
| `app/alertas/page.tsx` | Página de listagem de alertas |
| `components/ui/NotificationCenter.tsx` | Centro de notificações no header |
| `components/ui/NotificationBadge.tsx` | Badge de contagem |
| `lib/utils/alertas.ts` | Funções utilitárias de alertas |

### Arquivos a Modificar
| Arquivo | Modificação |
|---------|-------------|
| `app/pacientes/components/ModalDetalhesExame.tsx` | Redesign completo |
| `app/pacientes/[id]/components/TabEvolucao.tsx` | Novos gráficos e comparações |
| `app/dashboard/components/DashboardRonco.tsx` | Adicionar Casos Críticos |
| `app/dashboard/components/DashboardApneia.tsx` | Adicionar Top 10 Melhorias |
| `components/ui/Header.tsx` | Adicionar NotificationCenter |
| `components/ui/Sidebar.tsx` | Link para /alertas |
| `supabase/functions/sync-biologix/index.ts` | Trigger de alertas críticos |

---

## 8. Success Metrics

| Métrica | Baseline | Meta | Como Medir |
|---------|----------|------|------------|
| Tempo de análise de evolução | ~5 min | ~2.5 min (-50%) | Observação de uso |
| Métricas disponíveis no modal | ~10 | ~30+ | Contagem de campos |
| Gráficos de evolução | 1 | 13 | Contagem de gráficos |
| Tipos de alertas | 0 | 13 | Contagem de tipos |
| Comparações automáticas | 0 | 2 (primeiro/último, pior/melhor) | Funcionalidade |
| Casos críticos identificados | Manual | Automático | Alertas gerados |

---

## 9. Open Questions

| # | Questão | Status | Resolução |
|---|---------|--------|-----------|
| 1 | Todos os campos de histograma estão disponíveis no sync Biologix? | A verificar | Verificar tabela `exames` |
| 2 | A eficiência do sono está sendo sincronizada? | A verificar | Verificar campo `eficiencia_sono` |
| 3 | Qual o formato do campo de histograma (JSONB ou campos separados)? | A verificar | Verificar schema |
| 4 | Qual horário ideal para o cron job de alertas? | Definido | 8h BRT |
| 5 | Alertas devem gerar notificação sonora no browser? | A definir | Fase posterior (opcional) |

---

## 10. Prioridade de Implementação

### Fase 2.1: Interface do Modal de Exames
1. Verificar campos disponíveis no banco
2. Redesign do ModalDetalhesExame (Polissonografia)
3. Redesign do ModalDetalhesExame (Ronco)
4. Adicionar gauges e histogramas

### Fase 2.2: Tab Evolução
1. Adicionar gráficos de evolução (13 métricas)
2. Implementar comparação Primeiro vs Último
3. Implementar comparação Pior vs Melhor
4. Adicionar cálculo de % melhora

### Fase 2.3: Dashboard
1. Adicionar Casos Críticos na aba Ronco
2. Adicionar Top 10 Melhorias na aba Apneia
3. Implementar filtros de período dinâmicos

### Fase 2.4: Sistema de Alertas
1. Criar tabela `alertas` e RLS
2. Modificar sync-biologix para alertas críticos
3. Criar Edge Function check-alerts
4. Implementar NotificationCenter no Header
5. Criar página /alertas

---

## Changelog

| Data | Versão | Alterações |
|------|--------|------------|
| 27/12/2025 | 1.0 | Versão inicial do PRD |
