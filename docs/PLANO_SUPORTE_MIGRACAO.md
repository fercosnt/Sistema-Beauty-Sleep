# 📞 Plano de Suporte durante Migração Manual de Sessões

**Versão:** 1.0  
**Data:** 27 de Novembro de 2025  
**Objetivo:** Estabelecer estratégia de suporte e monitoramento durante a migração manual de sessões

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Day 1: Monitoramento e Suporte em Tempo Real](#day-1-monitoramento-e-suporte-em-tempo-real)
3. [Day 2-3: Verificação de Progresso](#day-2-3-verificação-de-progresso)
4. [Day 4-5: Verificação de Qualidade de Dados](#day-4-5-verificação-de-qualidade-de-dados)
5. [Day 6-7: Finalização](#day-6-7-finalização)
6. [Day 8: Validação](#day-8-validação)
7. [Métricas e KPIs](#métricas-e-kpis)
8. [Canais de Comunicação](#canais-de-comunicação)

---

## 🎯 Visão Geral

Este plano estabelece a estratégia de suporte durante os 8 dias da migração manual de sessões. O objetivo é garantir que a equipe tenha suporte adequado, que o progresso seja monitorado e que a qualidade dos dados seja mantida.

### Responsabilidades

- **Equipe de Suporte**: Monitorar uso, responder dúvidas, verificar qualidade
- **Equipe de Migração**: Registrar sessões seguindo o guia de migração
- **Admin**: Resolver problemas técnicos, validar dados finais

### Cronograma

| Dia | Foco | Atividade Principal |
|-----|------|---------------------|
| **Day 1** | Suporte em tempo real | Monitorar uso, responder dúvidas imediatamente |
| **Day 2-3** | Verificar progresso | Contar sessões registradas, identificar gargalos |
| **Day 4-5** | Verificar qualidade | Spot check de dados, corrigir erros |
| **Day 6-7** | Finalização | Completar sessões restantes |
| **Day 8** | Validação | Validar todos os dados (ver tarefa 8.3) |

---

## 📅 Day 1: Monitoramento e Suporte em Tempo Real

### Objetivos

- ✅ Garantir que a equipe entende como usar o sistema
- ✅ Responder dúvidas imediatamente
- ✅ Identificar problemas técnicos rapidamente
- ✅ Estabelecer ritmo de trabalho

### Atividades

#### 1. Monitoramento de Uso

**Canais de Monitoramento:**
- ✅ **Slack/WhatsApp**: Canal dedicado para dúvidas da migração
- ✅ **Sistema**: Verificar logs de criação de sessões em tempo real
- ✅ **Dashboard**: Monitorar contador de sessões criadas

**Métricas a Monitorar:**
- Número de sessões criadas por hora
- Número de erros/erros por usuário
- Tempo médio para criar uma sessão
- Taxa de sucesso (sessões criadas / tentativas)

#### 2. Resposta a Dúvidas em Tempo Real

**Tipos de Dúvidas Esperadas:**
- Como acessar o modal "Nova Sessão"?
- O que fazer se não tenho o contador inicial/final?
- Qual protocolo escolher?
- Como corrigir um erro?

**Estratégia de Resposta:**
- ✅ **Resposta Imediata**: Responder em até 5 minutos durante horário comercial
- ✅ **Documentação Rápida**: Criar FAQ dinâmico com dúvidas frequentes
- ✅ **Sessão de Ajuda**: Se muitas dúvidas similares, fazer sessão rápida (10 min)

#### 3. Identificação de Problemas Técnicos

**Problemas a Identificar:**
- Erros de permissão (RLS)
- Erros de validação
- Problemas de performance
- Bugs no sistema

**Ação Imediata:**
- ✅ Registrar problema em log de issues
- ✅ Priorizar correção (crítico/alto/médio/baixo)
- ✅ Comunicar à equipe se houver workaround

#### 4. Estabelecer Ritmo de Trabalho

**Meta para Day 1:**
- ✅ Cada membro da equipe registra pelo menos 5-10 sessões
- ✅ Identificar membros que precisam de mais treinamento
- ✅ Estabelecer meta diária realista

### Checklist Day 1

- [ ] Canal de comunicação criado e equipe adicionada
- [ ] Monitoramento de logs configurado
- [ ] Primeira dúvida respondida em até 5 minutos
- [ ] Problemas técnicos identificados e registrados
- [ ] Meta de sessões para Day 1 estabelecida
- [ ] FAQ dinâmico criado com primeiras dúvidas

### Relatório Day 1 (ao final do dia)

**Template:**
```
Day 1 - Relatório de Suporte
=============================

📊 Métricas:
- Sessões registradas: [X]
- Erros encontrados: [Y]
- Tempo médio por sessão: [Z] minutos
- Taxa de sucesso: [%]

❓ Dúvidas Respondidas:
- Total: [N]
- Principais temas: [lista]

🐛 Problemas Técnicos:
- [Lista de problemas e status]

✅ Ações Tomadas:
- [Lista de ações]

📝 Próximos Passos:
- [Lista de ações para Day 2]
```

---

## 📊 Day 2-3: Verificação de Progresso

### Objetivos

- ✅ Verificar quantas sessões foram registradas
- ✅ Identificar gargalos e bloqueios
- ✅ Ajustar estratégia se necessário
- ✅ Motivar equipe com progresso

### Atividades

#### 1. Verificar Progresso (Day 2)

**Query SQL para Verificar:**
```sql
-- Total de sessões registradas
SELECT COUNT(*) as total_sessoes FROM sessoes;

-- Sessões por usuário
SELECT 
  u.nome,
  COUNT(s.id) as sessoes_registradas
FROM users u
LEFT JOIN sessoes s ON s.user_id = u.id
WHERE u.role IN ('admin', 'equipe')
GROUP BY u.id, u.nome
ORDER BY sessoes_registradas DESC;

-- Sessões por dia
SELECT 
  DATE(created_at) as data,
  COUNT(*) as sessoes_registradas
FROM sessoes
GROUP BY DATE(created_at)
ORDER BY data DESC;

-- Pacientes com mais sessões registradas
SELECT 
  p.nome,
  COUNT(s.id) as total_sessoes
FROM pacientes p
LEFT JOIN sessoes s ON s.paciente_id = p.id
GROUP BY p.id, p.nome
ORDER BY total_sessoes DESC
LIMIT 10;
```

**Análise:**
- ✅ Comparar com meta estabelecida
- ✅ Identificar usuários com baixa produtividade
- ✅ Identificar pacientes com muitas sessões pendentes

#### 2. Identificar Gargalos (Day 2-3)

**Gargalos Comuns:**
- Dados históricos incompletos (falta contadores)
- Dúvidas sobre protocolos
- Problemas técnicos recorrentes
- Falta de motivação da equipe

**Ações:**
- ✅ Criar sessão de esclarecimento (15 min) se necessário
- ✅ Fornecer dados alternativos se disponíveis
- ✅ Corrigir problemas técnicos identificados
- ✅ Implementar gamificação (leaderboard) se necessário

#### 3. Ajustar Estratégia (Day 3)

**Se Progresso Estiver Abaixo do Esperado:**
- ✅ Revisar meta diária (pode estar muito alta)
- ✅ Identificar causas raiz (dados, treinamento, técnico)
- ✅ Ajustar cronograma se necessário

**Se Progresso Estiver Acima do Esperado:**
- ✅ Aumentar meta diária
- ✅ Antecipar cronograma se possível
- ✅ Reconhecer equipe pelo bom trabalho

#### 4. Motivar Equipe (Day 2-3)

**Estratégias de Motivação:**
- ✅ Compartilhar progresso diário (ex: "Hoje registramos X sessões!")
- ✅ Criar leaderboard (quem registrou mais sessões)
- ✅ Celebrar marcos (ex: "50% concluído! 🎉")
- ✅ Reconhecer membros da equipe que se destacam

### Checklist Day 2-3

- [ ] Queries SQL executadas e progresso calculado
- [ ] Relatório de progresso compartilhado com equipe
- [ ] Gargalos identificados e ações definidas
- [ ] Estratégia ajustada se necessário
- [ ] Equipe motivada com progresso

### Relatório Day 2-3 (ao final de cada dia)

**Template:**
```
Day [2/3] - Relatório de Progresso
===================================

📊 Progresso:
- Sessões registradas hoje: [X]
- Total acumulado: [Y]
- Meta do dia: [Z]
- % da meta alcançada: [%]

👥 Performance por Usuário:
- [Tabela com usuário e sessões registradas]

🔍 Gargalos Identificados:
- [Lista de gargalos e ações]

✅ Ações Tomadas:
- [Lista de ações]

📈 Próximos Passos:
- [Lista de ações para próximo dia]
```

---

## 🔍 Day 4-5: Verificação de Qualidade de Dados

### Objetivos

- ✅ Verificar qualidade dos dados inseridos
- ✅ Identificar e corrigir erros
- ✅ Garantir consistência dos dados
- ✅ Validar integridade referencial

### Atividades

#### 1. Spot Check de Dados (Day 4)

**Amostragem:**
- ✅ Selecionar 20-30 sessões aleatórias
- ✅ Verificar: Data, Contadores, Protocolo, Observações
- ✅ Comparar com dados históricos (se disponíveis)

**Query SQL para Spot Check:**
```sql
-- Selecionar sessões aleatórias para verificação
SELECT 
  s.id,
  p.nome as paciente,
  s.data_sessao,
  s.contador_pulsos_inicial,
  s.contador_pulsos_final,
  (s.contador_pulsos_final - s.contador_pulsos_inicial) as pulsos_calculados,
  s.protocolo,
  s.observacoes,
  u.nome as criado_por,
  s.created_at
FROM sessoes s
JOIN pacientes p ON p.id = s.paciente_id
JOIN users u ON u.id = s.user_id
ORDER BY RANDOM()
LIMIT 30;
```

**Verificações:**
- ✅ Data da sessão é válida (não futura)
- ✅ Contador final > contador inicial
- ✅ Pulsos calculados corretamente
- ✅ Protocolo faz sentido (se preenchido)
- ✅ Observações são legíveis (se preenchidas)

#### 2. Verificar Erros Comuns (Day 4)

**Erros a Verificar:**
```sql
-- Sessões com contador final <= inicial (ERRO CRÍTICO)
SELECT 
  s.id,
  p.nome as paciente,
  s.contador_pulsos_inicial,
  s.contador_pulsos_final,
  (s.contador_pulsos_final - s.contador_pulsos_inicial) as pulsos
FROM sessoes s
JOIN pacientes p ON p.id = s.paciente_id
WHERE s.contador_pulsos_final <= s.contador_pulsos_inicial;

-- Sessões com data futura (ERRO)
SELECT 
  s.id,
  p.nome as paciente,
  s.data_sessao,
  CURRENT_DATE as hoje
FROM sessoes s
JOIN pacientes p ON p.id = s.paciente_id
WHERE s.data_sessao > CURRENT_DATE;

-- Sessões sem protocolo (AVISO - não é erro, mas pode ser incompleto)
SELECT 
  COUNT(*) as sessoes_sem_protocolo
FROM sessoes
WHERE protocolo IS NULL OR array_length(protocolo, 1) = 0;
```

#### 3. Corrigir Erros Identificados (Day 4-5)

**Processo de Correção:**
1. ✅ Identificar erro
2. ✅ Contatar usuário que criou a sessão
3. ✅ Explicar o erro
4. ✅ Corrigir manualmente (Admin) ou pedir para usuário corrigir
5. ✅ Verificar correção

**Priorização:**
- 🔴 **Crítico**: Contador final <= inicial (corrigir imediatamente)
- 🟡 **Alto**: Data futura (corrigir no mesmo dia)
- 🟢 **Médio**: Sem protocolo (informar usuário, não é obrigatório)

#### 4. Validar Integridade Referencial (Day 5)

**Verificações:**
```sql
-- Verificar se todas as sessões têm paciente válido
SELECT COUNT(*) as sessoes_sem_paciente
FROM sessoes s
LEFT JOIN pacientes p ON p.id = s.paciente_id
WHERE p.id IS NULL;

-- Verificar se todas as sessões têm usuário válido
SELECT COUNT(*) as sessoes_sem_usuario
FROM sessoes s
LEFT JOIN users u ON u.id = s.user_id
WHERE u.id IS NULL;

-- Verificar se sessoes_utilizadas está correto
SELECT 
  p.id,
  p.nome,
  p.sessoes_utilizadas as campo_paciente,
  COUNT(s.id) as contagem_real
FROM pacientes p
LEFT JOIN sessoes s ON s.paciente_id = p.id
GROUP BY p.id, p.nome, p.sessoes_utilizadas
HAVING p.sessoes_utilizadas != COUNT(s.id);
```

### Checklist Day 4-5

- [ ] 20-30 sessões verificadas manualmente
- [ ] Erros críticos identificados e corrigidos
- [ ] Erros comuns verificados via SQL
- [ ] Integridade referencial validada
- [ ] Relatório de qualidade gerado

### Relatório Day 4-5 (ao final de cada dia)

**Template:**
```
Day [4/5] - Relatório de Qualidade
==================================

🔍 Verificação de Qualidade:
- Sessões verificadas: [X]
- Erros encontrados: [Y]
- Erros corrigidos: [Z]
- Taxa de erro: [%]

❌ Erros Críticos:
- [Lista de erros críticos e status]

⚠️ Avisos:
- [Lista de avisos]

✅ Ações de Correção:
- [Lista de correções realizadas]

📝 Recomendações:
- [Recomendações para equipe]
```

---

## 🏁 Day 6-7: Finalização

### Objetivos

- ✅ Completar sessões restantes
- ✅ Garantir que todos os pacientes importantes foram migrados
- ✅ Motivar equipe para finalizar
- ✅ Preparar para validação final

### Atividades

#### 1. Identificar Sessões Restantes (Day 6)

**Query SQL:**
```sql
-- Pacientes com poucas ou nenhuma sessão registrada
SELECT 
  p.id,
  p.nome,
  p.status,
  COUNT(s.id) as sessoes_registradas,
  p.sessoes_compradas as sessoes_esperadas
FROM pacientes p
LEFT JOIN sessoes s ON s.paciente_id = p.id
WHERE p.status IN ('ativo', 'finalizado')
GROUP BY p.id, p.nome, p.status, p.sessoes_compradas
HAVING COUNT(s.id) < p.sessoes_compradas
ORDER BY (p.sessoes_compradas - COUNT(s.id)) DESC;
```

**Priorização:**
- 🔴 **Alta**: Pacientes ativos com muitas sessões faltando
- 🟡 **Média**: Pacientes finalizados com algumas sessões faltando
- 🟢 **Baixa**: Pacientes inativos ou leads

#### 2. Final Push (Day 6-7)

**Estratégias:**
- ✅ Criar lista de pacientes prioritários
- ✅ Distribuir pacientes entre equipe
- ✅ Estabelecer meta diária mais alta
- ✅ Aumentar frequência de check-ins

**Gamificação (Opcional):**
- ✅ Leaderboard diário
- ✅ Prêmio para quem completar mais sessões
- ✅ Celebração de marcos (75%, 90%, 100%)

#### 3. Verificar Completude (Day 7)

**Verificações:**
```sql
-- Total de sessões registradas vs esperado
SELECT 
  COUNT(*) as total_sessoes_registradas,
  (SELECT SUM(sessoes_compradas) FROM pacientes WHERE status IN ('ativo', 'finalizado')) as total_esperado,
  ROUND(
    (COUNT(*)::numeric / NULLIF((SELECT SUM(sessoes_compradas) FROM pacientes WHERE status IN ('ativo', 'finalizado')), 0)) * 100,
    2
  ) as percentual_completo
FROM sessoes;

-- Pacientes com todas as sessões registradas
SELECT 
  COUNT(*) as pacientes_completos
FROM (
  SELECT 
    p.id,
    COUNT(s.id) as sessoes_registradas,
    p.sessoes_compradas
  FROM pacientes p
  LEFT JOIN sessoes s ON s.paciente_id = p.id
  WHERE p.status IN ('ativo', 'finalizado')
  GROUP BY p.id, p.sessoes_compradas
  HAVING COUNT(s.id) >= p.sessoes_compradas
) completos;
```

#### 4. Preparar para Validação (Day 7)

**Preparação:**
- ✅ Documentar sessões que não puderam ser migradas (com motivo)
- ✅ Criar lista de pacientes que precisam de atenção especial
- ✅ Preparar queries SQL para validação (Day 8)

### Checklist Day 6-7

- [ ] Lista de pacientes prioritários criada
- [ ] Sessões restantes identificadas
- [ ] Meta diária aumentada
- [ ] Equipe motivada para finalizar
- [ ] Preparação para validação concluída

### Relatório Day 6-7 (ao final de cada dia)

**Template:**
```
Day [6/7] - Relatório de Finalização
=====================================

📊 Progresso:
- Sessões registradas hoje: [X]
- Total acumulado: [Y]
- Sessões restantes: [Z]
- % completo: [%]

🎯 Pacientes Prioritários:
- [Lista de pacientes com mais sessões faltando]

✅ Ações Realizadas:
- [Lista de ações]

📝 Preparação para Validação:
- [Lista de preparações]
```

---

## ✅ Day 8: Validação

### Objetivos

- ✅ Validar todos os dados inseridos
- ✅ Verificar integridade dos dados
- ✅ Gerar relatório de validação
- ✅ Documentar problemas encontrados

### Atividades

**Nota:** As atividades detalhadas de validação estão na tarefa 8.3. Este dia serve como preparação e execução inicial da validação.

#### 1. Executar Validações (ver tarefa 8.3)

- ✅ Contar total de sessões
- ✅ Comparar com esperado
- ✅ Verificar outliers
- ✅ Verificar dados faltantes
- ✅ Validar cálculos automáticos
- ✅ Spot check de pacientes

#### 2. Gerar Relatório de Validação

- ✅ Documentar todas as validações
- ✅ Listar problemas encontrados
- ✅ Criar plano de correção (se necessário)

### Checklist Day 8

- [ ] Todas as validações executadas (ver 8.3)
- [ ] Relatório de validação gerado
- [ ] Problemas documentados
- [ ] Plano de correção criado (se necessário)

---

## 📈 Métricas e KPIs

### Métricas Diárias

| Métrica | Descrição | Meta |
|---------|-----------|------|
| **Sessões Registradas** | Total de sessões criadas no dia | Variável por dia |
| **Taxa de Sucesso** | % de tentativas que resultaram em sessão criada | >95% |
| **Tempo Médio** | Tempo médio para criar uma sessão | <3 minutos |
| **Taxa de Erro** | % de sessões com erros críticos | <2% |
| **Cobertura** | % de pacientes com sessões migradas | >90% |

### KPIs Finais (Day 8)

- ✅ Total de sessões migradas vs esperado
- ✅ Taxa de erro geral
- ✅ Cobertura de pacientes
- ✅ Qualidade dos dados (spot check)

---

## 📞 Canais de Comunicação

### Durante a Migração

**Canal Principal:**
- **Slack/WhatsApp**: [Definir canal]
- **Horário de Suporte**: [Definir horário]
- **Tempo de Resposta**: <5 minutos durante horário comercial

**Escalação:**
- **Nível 1**: Equipe de suporte (dúvidas gerais)
- **Nível 2**: Admin técnico (problemas técnicos)
- **Nível 3**: Desenvolvedor (bugs críticos)

### Relatórios

- **Frequência**: Diária (ao final de cada dia)
- **Formato**: Markdown/PDF
- **Destinatários**: Equipe de migração, Admin, Stakeholders

---

## ✅ Checklist Geral

### Antes de Iniciar (Day 0)

- [ ] Canal de comunicação criado
- [ ] Equipe adicionada ao canal
- [ ] Guia de migração compartilhado
- [ ] Treinamento realizado
- [ ] Monitoramento configurado

### Durante a Migração (Day 1-7)

- [ ] Relatórios diários gerados
- [ ] Dúvidas respondidas em tempo real
- [ ] Problemas técnicos resolvidos
- [ ] Progresso monitorado
- [ ] Qualidade verificada

### Após a Migração (Day 8)

- [ ] Validação completa executada
- [ ] Relatório final gerado
- [ ] Problemas documentados
- [ ] Equipe reconhecida pelo trabalho

---

**Última atualização:** 27 de Novembro de 2025  
**Versão do documento:** 1.0

