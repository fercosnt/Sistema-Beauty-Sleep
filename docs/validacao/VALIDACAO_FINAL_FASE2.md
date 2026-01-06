# Validação Final - Fase 2

Este documento contém o checklist de validação para todas as funcionalidades implementadas na Fase 2.

## 13.0 Testes e Validação

### 13.1 Testar Modal de Polissonografia com pelo menos 3 exames diferentes

**Status:** ⏳ Pendente  
**Responsável:** QA/Desenvolvedor  
**Arquivo:** `app/pacientes/components/ModalDetalhesExame.tsx`

**Checklist:**
- [ ] Abrir modal de polissonografia (tipo 1) com exame que tenha IDO completo
- [ ] Verificar se todos os gráficos são exibidos corretamente:
  - [ ] Gauge Chart de IDO
  - [ ] Histograma de SpO2
  - [ ] Histograma de BPM
  - [ ] Risk Bar de oximetria
- [ ] Verificar se dados de oximetria estão corretos:
  - [ ] SpO2 mínima, média, máxima
  - [ ] Tempo com SpO2 < 90%
  - [ ] Número de dessaturações
  - [ ] Eventos de hipoxemia
- [ ] Verificar se dados de frequência cardíaca estão corretos:
  - [ ] BPM mínimo, médio, máximo
- [ ] Verificar se dados de sono estão corretos:
  - [ ] Tempo de sono
  - [ ] Eficiência do sono
- [ ] Testar com exame que tenha fibrilação atrial detectada
- [ ] Testar com exame que tenha SpO2 crítico (< 80%)
- [ ] Verificar se botão de download PDF funciona
- [ ] Verificar responsividade em mobile

**Como testar:**
1. Acessar `/pacientes/[id]`
2. Ir para a tab "Exames"
3. Clicar em um exame do tipo "Polissonografia" (tipo 1)
4. Verificar todos os dados exibidos

**Exames de teste sugeridos:**
- Exame com IDO normal (< 5)
- Exame com IDO moderado (5-15)
- Exame com IDO severo (> 15)
- Exame com SpO2 crítico
- Exame com fibrilação atrial

---

### 13.2 Testar Modal de Ronco com pelo menos 3 exames diferentes

**Status:** ⏳ Pendente  
**Responsável:** QA/Desenvolvedor  
**Arquivo:** `app/pacientes/components/ModalDetalhesExame.tsx`

**Checklist:**
- [ ] Abrir modal de ronco (tipo 0) com exame que tenha score de ronco
- [ ] Verificar se gráfico de score de ronco é exibido corretamente
- [ ] Verificar se dados de ronco estão corretos:
  - [ ] Score de ronco calculado
  - [ ] Percentual de silêncio
  - [ ] Percentual de ronco baixo
  - [ ] Percentual de ronco médio
  - [ ] Percentual de ronco alto
  - [ ] Duração total de ronco
- [ ] Verificar se histograma de ronco é exibido (se disponível)
- [ ] Testar com exame que tenha score alto (> 50)
- [ ] Testar com exame que tenha score baixo (< 20)
- [ ] Testar com exame que tenha score médio (20-50)
- [ ] Verificar se botão de download PDF funciona
- [ ] Verificar responsividade em mobile

**Como testar:**
1. Acessar `/pacientes/[id]`
2. Ir para a tab "Exames"
3. Clicar em um exame do tipo "Ronco" (tipo 0)
4. Verificar todos os dados exibidos

**Exames de teste sugeridos:**
- Exame com score de ronco baixo (< 20)
- Exame com score de ronco médio (20-50)
- Exame com score de ronco alto (> 50)

---

### 13.3 Testar todos os 13 gráficos de evolução com paciente real

**Status:** ⏳ Pendente  
**Responsável:** QA/Desenvolvedor  
**Arquivo:** `app/pacientes/[id]/components/TabEvolucao.tsx`

**Checklist:**
- [ ] Acessar tab "Evolução" de um paciente com múltiplos exames
- [ ] Verificar se todos os 13 gráficos são exibidos corretamente:
  1. [ ] Score de Ronco (tipo 0)
  2. [ ] IDO (tipo 1)
  3. [ ] Tempo com SpO2 < 90% (tipo 1)
  4. [ ] SpO2 Mínima (tipo 1)
  5. [ ] SpO2 Média (tipo 1)
  6. [ ] SpO2 Máxima (tipo 1)
  7. [ ] Número de Dessaturações (tipo 1)
  8. [ ] Número de Eventos de Hipoxemia (tipo 1)
  9. [ ] Tempo Total em Hipoxemia (tipo 1)
  10. [ ] Carga Hipóxica (tipo 1)
  11. [ ] Frequência Cardíaca Mínima (tipo 1)
  12. [ ] Frequência Cardíaca Média (tipo 1)
  13. [ ] Frequência Cardíaca Máxima (tipo 1)
- [ ] Verificar se filtro de data funciona (all, 6 meses, 12 meses)
- [ ] Verificar se gráficos mostram dados corretos
- [ ] Verificar se cores estão corretas para cada métrica
- [ ] Verificar se tooltips funcionam corretamente
- [ ] Verificar responsividade em mobile

**Como testar:**
1. Acessar `/pacientes/[id]`
2. Ir para a tab "Evolução"
3. Selecionar cada métrica no dropdown
4. Verificar se o gráfico é exibido corretamente
5. Testar filtros de data

**Paciente de teste sugerido:**
- Paciente com pelo menos 5 exames de cada tipo (ronco e polissonografia)
- Paciente com dados variados (melhorias e pioras)

---

### 13.4 Testar comparações primeiro/último e pior/melhor com paciente real

**Status:** ⏳ Pendente  
**Responsável:** QA/Desenvolvedor  
**Arquivo:** `app/pacientes/[id]/components/TabEvolucao.tsx` e `ComparacaoExames.tsx`

**Checklist:**
- [ ] Verificar se card de comparação é exibido
- [ ] Verificar comparação primeiro vs último exame:
  - [ ] IDO primeiro vs último
  - [ ] Score Ronco primeiro vs último (se aplicável)
  - [ ] SpO2 Médio primeiro vs último (se aplicável)
  - [ ] Cálculo de mudança percentual correto
  - [ ] Indicador visual de melhora/piora (verde/vermelho)
- [ ] Verificar comparação pior vs melhor:
  - [ ] IDO pior vs melhor
  - [ ] Score Ronco pior vs melhor (se aplicável)
  - [ ] SpO2 Médio pior vs melhor (se aplicável)
  - [ ] Cálculo de mudança percentual correto
  - [ ] Indicador visual de melhora/piora (verde/vermelho)
- [ ] Verificar se badge "Respondendo ao tratamento" aparece quando melhora ≥ 20%
- [ ] Verificar se badge "Não respondendo" aparece quando melhora < 20% após 5+ sessões
- [ ] Testar com paciente que melhorou significativamente
- [ ] Testar com paciente que piorou
- [ ] Testar com paciente sem dados suficientes

**Como testar:**
1. Acessar `/pacientes/[id]`
2. Ir para a tab "Evolução"
3. Verificar card de comparação na parte inferior
4. Verificar se todos os cálculos estão corretos

---

### 13.5 Testar geração de alertas críticos via sync

**Status:** ⏳ Pendente  
**Responsável:** QA/Desenvolvedor  
**Arquivo:** `supabase/functions/sync-biologix/index.ts`

**Checklist:**
- [ ] Verificar se alertas são gerados quando SpO2 < 80%:
  - [ ] Alerta é criado na tabela `alertas`
  - [ ] Tipo: `critico`
  - [ ] Urgência: `alta`
  - [ ] Mensagem contém valor de SpO2
  - [ ] `exame_id` está vinculado corretamente
  - [ ] `paciente_id` está vinculado corretamente
- [ ] Verificar se alertas são gerados quando fibrilação atrial é detectada:
  - [ ] Alerta é criado na tabela `alertas`
  - [ ] Tipo: `critico`
  - [ ] Urgência: `alta`
  - [ ] Mensagem indica fibrilação atrial
  - [ ] `exame_id` está vinculado corretamente
  - [ ] `paciente_id` está vinculado corretamente
- [ ] Verificar se alertas não são duplicados (mesmo exame não gera múltiplos alertas)
- [ ] Testar manualmente executando a função `sync-biologix`
- [ ] Verificar logs da função para confirmar criação de alertas

**Como testar:**
1. Executar função `sync-biologix` manualmente via Supabase Dashboard
2. Verificar tabela `alertas` para novos alertas críticos
3. Verificar se alertas aparecem no centro de notificações
4. Verificar se alertas aparecem na página `/alertas`

**Script de teste:**
```sql
-- Verificar alertas críticos criados nas últimas 24h
SELECT 
  id,
  tipo,
  urgencia,
  titulo,
  mensagem,
  paciente_id,
  exame_id,
  created_at
FROM alertas
WHERE tipo = 'critico'
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

### 13.6 Testar geração de alertas de manutenção via cron

**Status:** ⏳ Pendente  
**Responsável:** QA/Desenvolvedor  
**Arquivo:** `supabase/functions/generate-alerts/index.ts` (se existir) ou triggers SQL

**Checklist:**
- [ ] Verificar se alertas são gerados para pacientes sem sessão há > 7 dias:
  - [ ] Alerta é criado na tabela `alertas`
  - [ ] Tipo: `followup`
  - [ ] Urgência: `media` ou `baixa`
  - [ ] Mensagem indica dias sem sessão
  - [ ] `paciente_id` está vinculado corretamente
- [ ] Verificar se alertas são gerados para pacientes sem sessão há > 21 dias:
  - [ ] Alerta é criado na tabela `alertas`
  - [ ] Tipo: `followup`
  - [ ] Urgência: `alta`
  - [ ] Mensagem indica dias sem sessão
- [ ] Verificar se alertas não são duplicados
- [ ] Verificar se cron job está configurado corretamente
- [ ] Testar manualmente executando a função de geração de alertas

**Como testar:**
1. Verificar se cron job está ativo no Supabase Dashboard
2. Aguardar execução do cron ou executar manualmente
3. Verificar tabela `alertas` para novos alertas de manutenção
4. Verificar se alertas aparecem no centro de notificações
5. Verificar se alertas aparecem na página `/alertas`

**Script de teste:**
```sql
-- Verificar alertas de manutenção criados nas últimas 24h
SELECT 
  id,
  tipo,
  urgencia,
  titulo,
  mensagem,
  paciente_id,
  created_at
FROM alertas
WHERE tipo IN ('followup', 'manutencao')
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

### 13.7 Testar centro de notificações no header

**Status:** ⏳ Pendente  
**Responsável:** QA/Desenvolvedor  
**Arquivo:** `components/ui/NotificationCenter.tsx` e `components/ui/Header.tsx`

**Checklist:**
- [ ] Verificar se ícone de notificação aparece no header
- [ ] Verificar se badge com contagem aparece quando há alertas pendentes
- [ ] Verificar se cor do badge muda baseado na urgência máxima:
  - [ ] Vermelho para urgência alta
  - [ ] Amarelo para urgência média
  - [ ] Verde para urgência baixa
- [ ] Verificar se dropdown abre ao clicar no ícone
- [ ] Verificar se últimos 5 alertas são exibidos
- [ ] Verificar se preview de cada alerta mostra:
  - [ ] Tipo do alerta
  - [ ] Título
  - [ ] Tempo relativo (ex: "15h atrás")
- [ ] Verificar se botão "Marcar como Visualizado" funciona
- [ ] Verificar se link "Ver Todos" redireciona para `/alertas`
- [ ] Verificar se contagem é atualizada após marcar como visualizado
- [ ] Verificar se funciona em todas as páginas (dashboard, pacientes, alertas, etc.)
- [ ] Verificar responsividade em mobile

**Como testar:**
1. Criar alguns alertas de teste (usar script `scripts/test/criar-alerta-teste.ts`)
2. Acessar qualquer página do sistema
3. Verificar se ícone de notificação aparece no header
4. Clicar no ícone e verificar dropdown
5. Testar ações de marcar como visualizado

---

### 13.8 Testar página de alertas com filtros

**Status:** ⏳ Pendente  
**Responsável:** QA/Desenvolvedor  
**Arquivo:** `app/alertas/page.tsx` e componentes relacionados

**Checklist:**
- [ ] Verificar se página `/alertas` carrega corretamente
- [ ] Verificar se todos os alertas são exibidos
- [ ] Verificar se filtros funcionam:
  - [ ] Filtro por tipo (Crítico, Manutenção, Follow-up)
  - [ ] Filtro por urgência (Alta, Média, Baixa)
  - [ ] Filtro por status (Pendente, Resolvido, Ignorado)
- [ ] Verificar se contador de filtros ativos aparece
- [ ] Verificar se botão "Limpar" funciona
- [ ] Verificar se cards de alerta mostram todas as informações:
  - [ ] Tipo com ícone
  - [ ] Título
  - [ ] Mensagem
  - [ ] Urgência com cor
  - [ ] Status
  - [ ] Paciente (se aplicável)
  - [ ] Tempo relativo
- [ ] Verificar se botão "Ver Paciente" funciona
- [ ] Verificar se botão "Marcar como Resolvido" funciona
- [ ] Verificar se seleção múltipla funciona:
  - [ ] Checkbox individual
  - [ ] "Selecionar todos os pendentes"
  - [ ] Barra de ações em lote
  - [ ] Botão "Resolver Selecionados"
- [ ] Verificar se paginação funciona (se houver mais de 20 alertas)
- [ ] Verificar responsividade em mobile

**Como testar:**
1. Acessar `/alertas`
2. Testar cada filtro individualmente
3. Testar combinações de filtros
4. Testar ações individuais e em lote
5. Verificar paginação

---

### 13.9 Verificar responsividade em mobile

**Status:** ⏳ Pendente  
**Responsável:** QA/Desenvolvedor  

**Checklist:**
- [ ] Modal de polissonografia responsivo
- [ ] Modal de ronco responsivo
- [ ] Gráficos de evolução responsivos
- [ ] Página de alertas responsiva
- [ ] Centro de notificações responsivo
- [ ] Filtros de alertas responsivos
- [ ] Cards de alerta responsivos
- [ ] Sidebar colapsável em mobile
- [ ] Header responsivo
- [ ] Navegação mobile funcional

**Como testar:**
1. Abrir DevTools (F12)
2. Ativar modo responsivo (Ctrl+Shift+M)
3. Testar em diferentes tamanhos de tela:
   - [ ] Mobile (375px)
   - [ ] Tablet (768px)
   - [ ] Desktop (1024px+)
4. Testar todas as funcionalidades em cada tamanho

---

### 13.10 Verificar permissões por role (admin vs equipe vs recepção)

**Status:** ⏳ Pendente  
**Responsável:** QA/Desenvolvedor  

**Checklist:**
- [ ] **Admin:**
  - [ ] Pode ver todos os alertas
  - [ ] Pode resolver qualquer alerta
  - [ ] Pode ver página de alertas
  - [ ] Pode ver centro de notificações
  - [ ] Pode ver todos os pacientes
  - [ ] Pode ver todos os exames
- [ ] **Equipe:**
  - [ ] Pode ver alertas relacionados aos seus pacientes
  - [ ] Pode resolver alertas dos seus pacientes
  - [ ] Pode ver página de alertas
  - [ ] Pode ver centro de notificações
  - [ ] Pode ver pacientes atribuídos
- [ ] **Recepção:**
  - [ ] Pode ver alertas de follow-up
  - [ ] Pode ver centro de notificações
  - [ ] Pode ver lista de pacientes
  - [ ] Não pode resolver alertas críticos

**Como testar:**
1. Criar usuários de teste com diferentes roles
2. Fazer login com cada role
3. Verificar acesso a cada funcionalidade
4. Verificar se restrições estão funcionando

---

### 13.11 Criar PR para revisão

**Status:** ⏳ Pendente  
**Responsável:** Desenvolvedor  

**Checklist:**
- [ ] Criar branch para PR
- [ ] Commitar todas as mudanças
- [ ] Criar PR no GitHub/GitLab
- [ ] Adicionar descrição detalhada do PR
- [ ] Listar todas as funcionalidades implementadas
- [ ] Adicionar screenshots (se aplicável)
- [ ] Solicitar revisão

**Template de PR:**
```markdown
## Descrição
Implementação completa do sistema de alertas e notificações (Fase 2)

## Funcionalidades Implementadas
- [x] Centro de notificações no header
- [x] Página de alertas com filtros
- [x] Geração de alertas críticos via sync
- [x] Geração de alertas de manutenção via cron
- [x] Modal de polissonografia melhorado
- [x] Modal de ronco melhorado
- [x] 13 gráficos de evolução
- [x] Comparações primeiro/último e pior/melhor

## Testes Realizados
- [x] Testes manuais de todas as funcionalidades
- [x] Verificação de responsividade
- [x] Verificação de permissões

## Screenshots
[Adicionar screenshots]

## Checklist
- [x] Código revisado
- [x] Testes passando
- [x] Documentação atualizada
```

---

### 13.12 Merge após aprovação

**Status:** ⏳ Pendente  
**Responsável:** Tech Lead/Desenvolvedor  

**Checklist:**
- [ ] PR aprovado por pelo menos 1 revisor
- [ ] Todos os comentários resolvidos
- [ ] Testes CI/CD passando
- [ ] Merge para branch principal
- [ ] Deploy para staging (se aplicável)
- [ ] Verificação pós-deploy
- [ ] Deploy para produção (se aplicável)

---

## Scripts de Apoio

### Script para criar alertas de teste
```bash
npx tsx scripts/test/criar-alerta-teste.ts
```

### Script para verificar sistema
```bash
npx tsx scripts/test/verify-system.ts
```

### Query SQL para verificar alertas
```sql
-- Ver todos os alertas
SELECT * FROM alertas ORDER BY created_at DESC LIMIT 20;

-- Ver alertas por tipo
SELECT tipo, COUNT(*) FROM alertas GROUP BY tipo;

-- Ver alertas por urgência
SELECT urgencia, COUNT(*) FROM alertas GROUP BY urgencia;

-- Ver alertas por status
SELECT status, COUNT(*) FROM alertas GROUP BY status;
```

---

## Notas Finais

- Todas as tarefas devem ser testadas em ambiente de desenvolvimento antes de merge
- Documentar quaisquer problemas encontrados
- Atualizar este documento conforme os testes forem realizados
- Manter comunicação com o time sobre o progresso dos testes

