# PRD: Beauty Sleep Treatment System - Sistema Base (v2.1)

> **Última atualização**: 23/11/2025
> **Versão**: 2.1 (completa + melhorias)
> **Status**: Pronto para aprovação e desenvolvimento

---

## 1. Introduction/Overview

O **Beauty Sleep Treatment System** é uma plataforma web de gestão clínica desenvolvida para a clínica Beauty Smile, destinada a rastrear e otimizar tratamentos a laser (Fotona LightWalker) para pacientes com ronco e apneia do sono.

### Problema
Atualmente, a clínica enfrenta desafios significativos na gestão de dados de pacientes:
- **Dados fragmentados**: Resultados de exames do sono (Biologix) separados dos registros de sessões de tratamento (Airtable)
- **Visão limitada**: Impossível correlacionar evolução dos exames com número/tipo de sessões realizadas
- **Revisão manual demorada**: 5+ minutos para revisar histórico completo de cada paciente
- **Perda de insights**: Padrões de resposta ao tratamento não são identificados
- **Decisões baseadas em memória**: Falta de dados consolidados para decisões clínicas
- **Gestão de leads ineficiente**: Leads que fazem exame mas não fecham tratamento são perdidos
- **Sem controle de pacotes**: Impossível rastrear sessões compradas vs. utilizadas
- **Manutenção não estruturada**: Pacientes finalizados não são chamados para retorno preventivo

### Solução
Uma plataforma web moderna que:
- Sincroniza automaticamente dados de exames da API Biologix
- Consolida exames + sessões de tratamento em um único perfil de paciente
- **Gerencia todo o ciclo**: Lead → Paciente → Tratamento → Finalizado → Manutenção
- **Rastreia sessões**: Compradas, adicionadas, utilizadas e disponíveis
- **Organiza com tags**: Protocolos clínicos (Atropina, Vonau, Nasal) e categorias personalizadas
- **Centraliza ações**: Widget de ações pendentes para priorizar trabalho diário
- Oferece dashboards visuais para análise de eficácia e conversão de leads
- Permite registro rápido de sessões com contadores de pulsos do laser
- Fornece gráficos de evolução temporal para todas as métricas clínicas

### Goal
**Consolidar todos os dados de pacientes em uma única plataforma**, permitindo que dentistas e recepcionistas visualizem a evolução completa do tratamento, convertam leads em pacientes, rastreiem adesão ao tratamento, e garantam follow-up estruturado de manutenção, **reduzindo o tempo de revisão de pacientes de 5 minutos para 30 segundos e aumentando a taxa de conversão de leads**.

---

## 2. Goals

### Primary Goals
1. **Consolidação de Dados**: Unificar dados de exames Biologix e sessões de tratamento em um único banco de dados relacional (Supabase)
2. **Gestão do Ciclo Completo**: Rastrear pacientes desde Lead até Manutenção (4 status)
3. **Conversão de Leads**: Identificar e priorizar leads que fizeram exame mas não fecharam tratamento
4. **Controle de Sessões**: Rastrear sessões compradas, adicionadas e disponíveis para cada paciente
5. **Eficiência Operacional**: Reduzir tempo de revisão de paciente de 5 minutos para 30 segundos
6. **Insights Clínicos**: Identificar padrões de resposta ao tratamento através de visualizações gráficas e métricas agregadas

### Secondary Goals
1. **Automação**: Eliminar entrada manual de dados de exames através de sincronização automática diária
2. **Rastreabilidade Total**: Garantir que 100% das sessões sejam registradas com histórico de edições
3. **Manutenção Preventiva**: Alertar automaticamente pacientes finalizados para retorno em 6 meses
4. **Organização com Tags**: Categorizar pacientes por protocolos (Atropina, Vonau, Nasal, etc.)
5. **Migração Segura**: Transferir com sucesso 175 pacientes e 479 exames históricos do Airtable para Supabase
6. **Acessibilidade Multi-role**: Sistema acessível para Admin, Equipe e Recepção com permissões adequadas

### Success Metrics
- ✅ **100% dos exames Biologix** sincronizados automaticamente (zero entrada manual)
- ✅ **Taxa de conversão Lead → Paciente ≥ 60%** (medido através do sistema)
- ✅ **Tempo médio de revisão de paciente < 1 minuto**
- ✅ **100% das sessões** de tratamento registradas no sistema
- ✅ **Adesão média ao tratamento ≥ 80%** (sessões realizadas / sessões compradas)
- ✅ **100% de pacientes finalizados** contatados para manutenção em 6 meses
- ✅ **5-10 usuários ativos** (dentistas + recepção) usando o sistema diariamente
- ✅ **Zero perda de dados** na migração Airtable → Supabase
- ✅ **Identificação visual** de padrões de melhora/piora em < 10 segundos

---

## 3. User Stories

### Admin - Pré-cadastro de Paciente/Lead
**Como** administrador
**Eu quero** pré-cadastrar um paciente ou lead antes do primeiro exame
**Para que** eu possa liberar a autorização no Biologix e rastrear todos desde o início

**Critérios de Aceitação:**
- Formulário de pré-cadastro com campos: CPF (obrigatório), Nome, Status (Lead/Paciente)
- Se status = Paciente, campo "Sessões Compradas" aparece (opcional inicialmente)
- CPF é validado e formatado automaticamente (000.000.000-00)
- Sistema previne duplicatas (CPF único)
- Após primeiro exame sincronizado, exame é vinculado pelo CPF

### Admin - Gestão de Sessões Compradas
**Como** administrador
**Eu quero** registrar quantas sessões o paciente comprou e adicionar mais se necessário
**Para que** eu possa rastrear adesão ao tratamento e saldo de sessões disponíveis

**Critérios de Aceitação:**
- Campo "Sessões Compradas" no cadastro inicial do paciente
- Botão "Adicionar Sessões" permite incrementar (ex: paciente comprou pacote extra)
- Perfil do paciente mostra: Compradas + Adicionadas - Utilizadas = Disponíveis
- Badge de alerta se Disponíveis = 0 ou < 2

### Recepção - Visualização de Ações Pendentes
**Como** recepcionista
**Eu quero** ver um widget de ações pendentes no dashboard
**Para que** eu possa priorizar follow-up de leads, manutenção e pacientes sem sessão

**Critérios de Aceitação:**
- Widget "Ações Pendentes" mostra 4 tipos:
  1. **Leads para Follow-up**: Fizeram exame há 7+ dias, não fecharam (quantidade + lista clicável)
  2. **Manutenção Pendente**: Pacientes finalizados há 6+ meses, não contatados (quantidade + lista)
  3. **Sem Sessão há >21 dias**: Pacientes ativos sem sessão recente (quantidade + lista)
  4. **Completando Pacote**: Pacientes com 1-2 sessões restantes (quantidade + lista)
- Cada item da lista é clicável e leva ao perfil do paciente
- Recepção pode visualizar mas NÃO criar/editar sessões

### Dentista - Mudança de Status de Paciente
**Como** dentista
**Eu quero** mudar o status de um Lead para Paciente quando ele fechar o tratamento
**Para que** o sistema rastreie corretamente a jornada do paciente

**Critérios de Aceitação:**
- Dropdown de status no perfil: Lead / Ativo / Finalizado / Inativo
- Ao mudar para "Ativo", sistema registra data de fechamento (data da primeira sessão)
- Ao mudar para "Finalizado", sistema calcula próxima manutenção (última sessão + 6 meses)
- Ao mudar para "Inativo", campo obrigatório "Motivo" aparece (ex: Desistiu, Mudou de cidade)
- Histórico de mudanças de status é salvo automaticamente

### Dentista/Admin - Gestão de Tags
**Como** dentista ou admin
**Eu quero** criar e atribuir tags aos pacientes
**Para que** eu possa organizar por protocolos clínicos e categorias personalizadas

**Critérios de Aceitação:**
- Interface para criar tags com: Nome, Cor (hex picker)
- Tags pré-criadas: "Protocolo Nasal", "Atropina", "Vonau"
- No perfil do paciente, dropdown multi-select para atribuir tags
- Filtro na lista de pacientes por tags
- Tags aparecem como badges coloridos no card/linha do paciente

### Dentista - Histórico Completo de Paciente
**Como** dentista
**Eu quero** ver o histórico completo de mudanças de status do paciente
**Para que** eu possa entender a jornada e tempo em cada etapa

**Critérios de Aceitação:**
- Tab "Histórico" no perfil mostra timeline de mudanças de status
- Cada item mostra: Data, De → Para, Quem fez a mudança, Motivo (se inativo)
- Métricas calculadas: Dias como Lead, Dias em tratamento, Taxa de adesão

### Dentista/Admin - Edição de Sessão com Histórico
**Como** dentista ou admin
**Eu quero** editar uma sessão que criei (ex: correção de contador digitado errado)
**Para que** os dados estejam corretos e haja rastreabilidade

**Critérios de Aceitação:**
- Botão "Editar" aparece em sessões criadas pelo usuário logado (ou para admin em todas)
- Ao salvar edição, versão anterior é salva em `sessoes_history`
- Indicador visual mostra que sessão foi editada (ícone de lápis + tooltip "Editada em DD/MM/AAAA")
- Membros da equipe NÃO podem editar sessões de outros (apenas admin)

### Admin - Busca Global de Pacientes
**Como** admin
**Eu quero** buscar pacientes por CPF, nome ou telefone em um único campo
**Para que** eu encontre rapidamente qualquer paciente sem trocar de filtro

**Critérios de Aceitação:**
- Campo de busca no header/topo da lista de pacientes
- Busca em tempo real (debounced 300ms)
- Aceita: nome parcial (case-insensitive), CPF (com ou sem máscara), telefone (com ou sem máscara)
- Resultados destacam o termo buscado (highlight)

### Dashboard - Visualização de Conversão de Leads
**Como** admin ou dentista
**Eu quero** visualizar métricas de conversão de leads em pacientes
**Para que** eu possa medir eficácia do follow-up e identificar oportunidades

**Critérios de Aceitação:**
- Dashboard "Aba Geral" mostra KPI: "Taxa de Conversão Lead → Paciente (%)"
- Lista de "Leads Recentes" (últimos 30 dias) com: Nome, Data do Exame, Dias sem fechar
- Indicador visual de "urgência": < 7 dias (verde), 7-14 dias (amarelo), 14+ dias (vermelho)
- Clicar em lead abre perfil para análise

### Sistema - Sincronização com Vinculação por CPF
**Como** sistema
**Eu quero** vincular exames sincronizados do Biologix a pacientes pré-cadastrados via CPF
**Para que** leads e pacientes pré-cadastrados recebam automaticamente seus exames

**Critérios de Aceitação:**
- Ao sincronizar exame, sistema busca paciente por CPF (do campo `patient.birthDate` ou outro campo)
- Se encontrar paciente pré-cadastrado, vincula exame a ele
- Se não encontrar, cria novo paciente com biologix_id
- Log de sincronização mostra: novos pacientes vs exames vinculados a existentes

### Dentista - Análise de Tempo Médio de Tratamento
**Como** dentista
**Eu quero** ver o tempo médio de tratamento por severidade inicial
**Para que** eu possa estimar duração ao conversar com novos pacientes

**Critérios de Aceitação:**
- Dashboard mostra métrica: "Tempo Médio de Tratamento (dias)"
- Segmentado por severidade inicial de ronco: Leve / Moderado / Significativo / Severo
- Ex: "Ronco Leve: 45 dias (média de 3 sessões)"
- Tooltip explica cálculo: Dias entre primeira e última sessão

### Dentista - Indicador de Adesão ao Tratamento
**Como** dentista
**Eu quero** ver % de adesão ao tratamento de cada paciente
**Para que** eu possa identificar quem está "sumindo" e intervir precocemente

**Critérios de Aceitação:**
- Badge de adesão no perfil: Verde (≥80%), Amarelo (50-79%), Vermelho (<50%)
- Cálculo: (Sessões Realizadas / Sessões Compradas) × 100%
- Lista de pacientes filtrável por "Baixa Adesão" (<50%)
- Widget de ações pendentes inclui pacientes com baixa adesão e >60 dias desde fechamento

---

## 4. Functional Requirements

### 4.1 Autenticação e Autorização

**FR-AUTH-001**: O sistema deve usar Supabase Auth para autenticação de usuários

**FR-AUTH-002**: Três roles devem ser suportados: "admin", "equipe" e "recepcao"

**FR-AUTH-003**: **Permissões Admin:**
- Criar, editar, visualizar e deletar todos os dados
- Criar, editar e desativar usuários (todos os roles)
- Editar qualquer sessão (mesmo de outros usuários)
- Ver logs de auditoria

**FR-AUTH-004**: **Permissões Equipe (Dentistas):**
- Visualizar todos os dados (pacientes, exames, sessões)
- Criar sessões, notas, tags
- Editar sessões criadas por si mesmo (não de outros)
- Mudar status de pacientes
- Adicionar sessões compradas
- NÃO deletar registros
- NÃO criar/gerenciar usuários

**FR-AUTH-005**: **Permissões Recepção:**
- Visualizar dashboard (métricas agregadas)
- Visualizar widget de ações pendentes
- Visualizar lista de pacientes (dados básicos)
- Visualizar perfil de paciente (exames, histórico, status)
- NÃO visualizar detalhes de sessões (valores de contadores)
- NÃO criar/editar sessões
- NÃO criar/editar notas clínicas
- NÃO deletar registros

**FR-AUTH-006**: Row Level Security (RLS) deve ser implementado em todas as tabelas com políticas específicas por role

**FR-AUTH-007**: Sessões devem expirar após 7 dias de inatividade

**FR-AUTH-008**: Tela de login deve usar o Admin Theme (Deep Blue #00109E)

### 4.2 Sincronização com Biologix API

**FR-SYNC-001**: Uma Supabase Edge Function (`sync-biologix`) deve executar diariamente às 10h00 BRT

**FR-SYNC-002**: A função deve autenticar com a API Biologix usando credenciais armazenadas em variáveis de ambiente

**FR-SYNC-003**: A função deve renovar o token automaticamente se expirado (7 dias)

**FR-SYNC-004**: A função deve buscar todos os exames do centro credenciado (partnerId: `4798042LW`)

**FR-SYNC-005**: Apenas exames com status=6 (DONE) devem ser processados

**FR-SYNC-006**: Para cada exame, o sistema deve:
1. Buscar paciente existente por CPF (extraído dos dados do Biologix)
2. Se encontrar, vincular exame ao paciente existente
3. Se não encontrar, criar novo paciente com biologix_id

**FR-SYNC-007**: Para cada exame, o sistema deve fazer upsert na tabela `exames` usando `biologix_exam_id` como chave única

**FR-SYNC-008**: O sistema deve calcular automaticamente:
- `score_ronco` = `(ronco_baixo_pct × 1 + ronco_medio_pct × 2 + ronco_alto_pct × 3) / 3`
- `pdf_url` = `https://api.biologixsleep.com/v2/exams/{examKey}/files/report.pdf`

**FR-SYNC-009**: Logs de sincronização devem incluir: timestamp, total de exames processados, novos pacientes criados, exames vinculados a pacientes existentes, erros

**FR-SYNC-010**: Se a sincronização falhar, deve tentar novamente com backoff exponencial (3 tentativas)

### 4.3 Gestão de Pacientes

**FR-PAT-001**: Sistema deve suportar 4 status de paciente:
- **Lead**: Fez exame, não fechou tratamento (sem sessões compradas)
- **Ativo**: Fechou tratamento, está em tratamento
- **Finalizado**: Completou tratamento, aguardando manutenção
- **Inativo**: Desistiu, cancelou ou outro motivo (com campo "motivo_inativo")

**FR-PAT-002**: Pré-cadastro de paciente deve permitir:
- CPF (obrigatório, validado e formatado)
- Nome (obrigatório)
- Status inicial: Lead ou Ativo (dropdown)
- Se status = Ativo, campo "Sessões Compradas" (opcional)
- Email, Telefone (opcionais)

**FR-PAT-003**: CPF deve ser validado (algoritmo padrão) e formatado (000.000.000-00)

**FR-PAT-004**: Sistema deve prevenir duplicatas: CPF único por paciente

**FR-PAT-005**: Campo "Sessões Compradas" permite registro inicial ao fechar tratamento

**FR-PAT-006**: Botão "Adicionar Sessões" no perfil permite incrementar sessões (ex: paciente comprou pacote adicional)

**FR-PAT-007**: Sistema calcula automaticamente:
- **Sessões Utilizadas**: COUNT de sessões na tabela `sessoes`
- **Sessões Disponíveis**: `(sessoes_compradas + sessoes_adicionadas) - sessoes_utilizadas`

**FR-PAT-008**: Ao mudar status de Lead → Ativo manualmente, sistema permite inserir sessões compradas

**FR-PAT-009**: Ao criar primeira sessão de um Lead, sistema automaticamente muda status para Ativo e registra `data_fechamento` (data da sessão)

**FR-PAT-010**: Ao mudar status para Finalizado, sistema calcula `proxima_manutencao` = última sessão + 6 meses

**FR-PAT-011**: Ao mudar status para Inativo, campo "Motivo" é obrigatório (textarea)

**FR-PAT-012**: Mudanças de status são registradas automaticamente em `paciente_status_history` com: data, status_anterior, status_novo, user_id, motivo

**FR-PAT-013**: Campo `observacoes_gerais` (textarea livre) no perfil do paciente, editável a qualquer momento

### 4.4 Sistema de Tags

**FR-TAG-001**: Admin e Equipe podem criar tags com: Nome (texto), Cor (hex, ex: #FF5733)

**FR-TAG-002**: Tags pré-criadas no setup inicial: "Protocolo Nasal" (#35BFAD), "Atropina" (#00109E), "Vonau" (#BB965B)

**FR-TAG-003**: Interface de gestão de tags permite: Criar, Editar nome/cor, Deletar (se não em uso)

**FR-TAG-004**: No perfil do paciente, dropdown multi-select permite atribuir/remover tags

**FR-TAG-005**: Tags aparecem como badges coloridos no card e perfil do paciente

**FR-TAG-006**: Lista de pacientes permite filtro por tags (multi-select)

### 4.5 Busca Global

**FR-SEARCH-001**: Campo de busca global no topo da lista de pacientes

**FR-SEARCH-002**: Busca em tempo real (debounced 300ms) por:
- Nome (case-insensitive, match parcial)
- CPF (com ou sem máscara: 12345678900 ou 123.456.789-00)
- Telefone (com ou sem máscara)

**FR-SEARCH-003**: Resultados destacam termo buscado (highlight)

**FR-SEARCH-004**: Acessível para todos os roles

### 4.6 Logs de Auditoria

**FR-AUDIT-001**: Sistema registra em `audit_log` as seguintes ações:
- Criação/edição/deleção de paciente
- Criação/edição/deleção de sessão
- Mudança de status de paciente
- Criação/deleção de usuário (admin)
- Adição de sessões compradas

**FR-AUDIT-002**: Cada log contém: timestamp, user_id, ação, tabela, registro_id, dados_alterados (jsonb)

**FR-AUDIT-003**: Apenas Admin pode visualizar logs de auditoria (página dedicada)

### 4.7 Dashboard - Aba Geral

**FR-DASH-G-001**: Dashboard deve mostrar 5 KPI cards no topo:
- Total de Pacientes Ativos (status=Ativo)
- Total de Exames (histórico completo)
- Total de Sessões
- Taxa de Conversão Lead → Paciente (%)
- Adesão Média ao Tratamento (%)

**FR-DASH-G-002**: Widget "Ações Pendentes" com 4 seções (clicáveis):
1. **Leads para Follow-up** (badge vermelho): Leads com exame há 7+ dias
2. **Manutenção Pendente** (badge amarelo): Pacientes finalizados há 6+ meses, não contatados
3. **Sem Sessão há >21 dias** (badge laranja): Pacientes ativos sem sessão recente
4. **Completando Pacote** (badge azul): Pacientes com 1-2 sessões restantes

**FR-DASH-G-003**: Lista dos 10 exames mais recentes com: nome do paciente, status do paciente, data, tipo (Ronco/Sono), principais métricas

**FR-DASH-G-004**: Seção "Leads Recentes" mostra últimos 10 leads com: Nome, Data do Exame, Dias sem fechar, Badge de urgência

**FR-DASH-G-005**: Todos os usuários (Admin, Equipe, Recepção) veem o dashboard, mas Recepção não vê valores de contadores de sessões

### 4.8 Dashboard - Aba Ronco

**FR-DASH-R-001**: Aba Ronco deve mostrar métricas:
- Total de Exames de Ronco
- Melhora Média de Score (%)
- % de Pacientes Respondendo (melhora > 20%)
- Tempo Médio de Tratamento (dias)

**FR-DASH-R-002**: Gráfico de distribuição por severidade (último exame):
- Leve (0-20)
- Moderado (21-40)
- Significativo (41-60)
- Severo (61-100)

**FR-DASH-R-003**: Lista dos Top 10 pacientes com maior melhora (primeiro vs. último exame)

**FR-DASH-R-004**: Gráfico de tendência mostrando Score Ronco médio com filtro de período: 3m / 6m / 1a / Tudo

**FR-DASH-R-005**: Métrica "Tempo Médio de Tratamento" segmentada por severidade inicial

**FR-DASH-R-006**: Todos os gráficos devem usar cores do Admin Theme

### 4.9 Dashboard - Aba Apneia

**FR-DASH-A-001**: Aba Apneia deve mostrar métricas:
- Total de Exames do Sono
- Melhora Média de IDO (pontos)
- Pacientes com SpO2 < 80% (crítico)
- Casos de Fibrilação Atrial detectados

**FR-DASH-A-002**: Gráfico de distribuição por categoria de IDO (último exame):
- Normal (IDO < 5)
- Leve (5-14)
- Moderado (15-29)
- Acentuado (≥ 30)

**FR-DASH-A-003**: Lista de pacientes com SpO2 mínimo < 80% (casos críticos) - clicável

**FR-DASH-A-004**: Lista de pacientes com fibrilação atrial detectada - clicável

**FR-DASH-A-005**: Gráfico de tendência de IDO médio com filtro de período: 3m / 6m / 1a / Tudo

**FR-DASH-A-006**: Métricas adicionais: Carga Hipóxica média, Eficiência do Sono média, SpO2 médio

### 4.10 Lista de Pacientes

**FR-PAT-LIST-001**: Página de lista deve mostrar todos os pacientes em uma tabela com colunas:
- Status (badge colorido: Lead/Ativo/Finalizado/Inativo)
- Nome
- CPF (mascarado)
- Tags (badges coloridos)
- Idade
- Total de Exames
- Total de Sessões
- Sessões Disponíveis (se Ativo)
- Último Exame (data)
- Adesão (% - se Ativo)
- Melhora (%)

**FR-PAT-LIST-002**: Lista deve ser paginada (20 pacientes por página)

**FR-PAT-LIST-003**: Busca global filtra a lista em tempo real

**FR-PAT-LIST-004**: Filtros:
- Status (Todos/Lead/Ativo/Finalizado/Inativo)
- Sexo (Todos/M/F)
- Tags (multi-select)
- Adesão (Todos/Alta ≥80%/Média 50-79%/Baixa <50%)
- Melhora (Todos/Melhorando >20%/Estável/Piorando)

**FR-PAT-LIST-005**: Clicar em uma linha deve navegar para o perfil do paciente

**FR-PAT-LIST-006**: Badge de "Novo" para pacientes com primeiro exame há < 30 dias

### 4.11 Perfil de Paciente - Header

**FR-PROF-H-001**: Header deve exibir:
- Nome, Idade, Sexo, CPF (mascarado), Status (badge)
- Email (com link mailto:), Telefone (com botão WhatsApp)
- Data de Nascimento, Altura, Peso Atual

**FR-PROF-H-002**: Botão "WhatsApp" abre WhatsApp Web com número pré-preenchido: `https://wa.me/55{telefone}`

**FR-PROF-H-003**: Tags do paciente aparecem como badges coloridos abaixo do nome

**FR-PROF-H-004**: Dropdown de status permite mudança (Admin e Equipe) com validações:
- Lead → Ativo: Permite inserir sessões compradas
- Ativo → Finalizado: Calcula próxima manutenção
- Qualquer → Inativo: Campo "Motivo" obrigatório

**FR-PROF-H-005**: Resumo de tratamento (cards) deve mostrar:
- Total de Exames, Total de Sessões
- Primeiro Exame (data), Último Exame (data), Última Sessão (data)
- **Se Ativo**: Sessões Compradas, Sessões Adicionadas, Sessões Utilizadas, **Sessões Disponíveis**
- **Se Finalizado**: Próxima Manutenção (data calculada), Status de Contato (Sim/Não)
- Melhora Geral (%), Adesão ao Tratamento (%)

**FR-PROF-H-006**: Badge de adesão: Verde (≥80%), Amarelo (50-79%), Vermelho (<50%)

**FR-PROF-H-007**: Quick Actions (botões fixos):
- "Nova Sessão" (apenas Admin e Equipe)
- "Finalizar Tratamento" (muda status para Finalizado)
- "Adicionar Nota"

**FR-PROF-H-008**: Campo "Observações Gerais" (textarea editável) abaixo dos cards de resumo

### 4.12 Perfil de Paciente - Tab Exames

**FR-PROF-E-001**: Lista todos os exames do paciente em ordem cronológica decrescente

**FR-PROF-E-002**: Filtro permite selecionar: Todos / Teste do Ronco / Exame do Sono

**FR-PROF-E-003**: Cada card de exame mostra:
- Data, Tipo, Duração, Status do Biologix
- Principais métricas: IDO, Score Ronco, SpO2 mín, Eficiência do Sono
- Botão "Ver Detalhes" (modal) e "Baixar PDF"

**FR-PROF-E-004**: Modal de detalhes do exame deve replicar o layout do PDF Biologix com todas as seções:
- Condições da noite, Tratamentos, Registro médico
- Resultados (IDO, Score, SpO2, FC)
- Gráficos/tabelas de Oximetria, FC, Ronco
- Cardiologia (Fibrilação Atrial)
- Feedback do paciente pós-exame

### 4.13 Perfil de Paciente - Tab Sessões

**FR-PROF-S-001**: Lista todas as sessões de tratamento em ordem cronológica decrescente

**FR-PROF-S-002**: Cada card de sessão mostra:
- Data, Peso
- Er:YAG: Pulsos disparados (final - inicial) - **NÃO mostra energia em mJ**
- Nd:YAG: Pulsos disparados (final - inicial) - **NÃO mostra energia em mJ**
- Observações
- Criado por (nome do usuário)
- Ícone de "Editado" se foi modificado (tooltip mostra data da última edição)

**FR-PROF-S-003**: **Recepção NÃO vê** esta tab (permissão negada)

**FR-PROF-S-004**: Botão "Nova Sessão" abre modal com campos:
- Data (date picker, padrão: hoje, não permite futura)
- Peso (kg, range 30-300)
- **Er:YAG Pulso Inicial** (número inteiro)
- **Er:YAG Pulso Final** (número inteiro, deve ser ≥ inicial)
- **Nd:YAG Pulso Inicial** (número inteiro)
- **Nd:YAG Pulso Final** (número inteiro, deve ser ≥ inicial)
- Observações (textarea, opcional)

**FR-PROF-S-005**: Validações:
- Data não pode ser futura
- Pulso final deve ser >= pulso inicial
- Peso deve estar entre 30-300 kg
- Pelo menos um par de pulsos (Er:YAG ou Nd:YAG) deve ser preenchido

**FR-PROF-S-006**: Ao salvar, sessão é associada ao paciente e ao usuário que criou (`created_by`)

**FR-PROF-S-007**: Se paciente for Lead e esta for a primeira sessão, status muda automaticamente para Ativo e `data_fechamento` é preenchida

**FR-PROF-S-008**: Botão "Editar" aparece apenas para:
- Sessões criadas pelo usuário logado (Equipe)
- Todas as sessões (Admin)

**FR-PROF-S-009**: Ao editar sessão, versão anterior é salva em `sessoes_history` antes de atualizar

**FR-PROF-S-010**: Histórico de edição pode ser visualizado (Admin apenas) em modal "Ver Histórico"

### 4.14 Perfil de Paciente - Tab Evolução

**FR-PROF-EV-001**: Dropdown permite selecionar métrica para visualizar:
- Score Ronco
- IDO (Índice de Dessaturação de Oxigênio)
- SpO2 Mínimo
- SpO2 Médio
- Eficiência do Sono (%)
- FC Máxima (BPM)
- Tempo com SpO2 < 90%
- Carga Hipóxica

**FR-PROF-EV-002**: Gráfico de linha mostra evolução da métrica ao longo do tempo

**FR-PROF-EV-003**: Sessões de tratamento aparecem como marcadores verticais (linha pontilhada) no gráfico

**FR-PROF-EV-004**: Tooltip ao passar o mouse mostra valores exatos + data

**FR-PROF-EV-005**: Filtro de período: 3 meses / 6 meses / 1 ano / Tudo

**FR-PROF-EV-006**: Tabela de comparação abaixo do gráfico mostra:
- Primeiro Exame: valor + data
- Último Exame: valor + data
- Mudança Absoluta (ex: -15 pontos)
- Mudança Percentual (ex: -45%)
- Indicador visual: verde (melhora > 20%), amarelo (estável -20% a +20%), vermelho (piora > 20%)

**FR-PROF-EV-007**: Se o paciente tiver < 2 exames, mostrar mensagem "Dados insuficientes para análise de evolução"

### 4.15 Perfil de Paciente - Tab Peso

**FR-PROF-P-001**: Gráfico de linha mostra evolução de peso ao longo do tempo

**FR-PROF-P-002**: Dados de peso vêm de duas fontes (combinadas):
- Campo `peso_kg` dos exames
- Campo `peso_kg` das sessões de tratamento

**FR-PROF-P-003**: Calcular e exibir IMC (Índice de Massa Corporal):
- `IMC = peso_kg / (altura_m²)`
- Mostrar categoria: Abaixo do Peso (<18.5) / Normal (18.5-24.9) / Sobrepeso (25-29.9) / Obesidade (≥30)

**FR-PROF-P-004**: Tabela mostra histórico completo: Data, Peso (kg), IMC, Categoria, Fonte (Exame/Sessão)

### 4.16 Perfil de Paciente - Tab Notas

**FR-PROF-N-001**: Lista todas as notas do paciente em ordem cronológica decrescente

**FR-PROF-N-002**: Cada nota mostra: texto, autor, data/hora de criação

**FR-PROF-N-003**: Campo de texto (textarea) permite adicionar nova nota

**FR-PROF-N-004**: Botão "Salvar Nota" adiciona nota associada ao paciente e ao usuário logado

**FR-PROF-N-005**: Notas não podem ser editadas após criação (apenas visualização)

**FR-PROF-N-006**: Admins podem deletar notas

**FR-PROF-N-007**: **Recepção NÃO pode** criar ou visualizar notas (permissão negada)

### 4.17 Perfil de Paciente - Tab Histórico de Status

**FR-PROF-HIST-001**: Timeline mostra todas as mudanças de status do paciente

**FR-PROF-HIST-002**: Cada item mostra:
- Data da mudança
- De → Para (ex: "Lead → Ativo")
- Quem fez a mudança (nome do usuário)
- Motivo (se mudou para Inativo)

**FR-PROF-HIST-003**: Métricas calculadas exibidas no topo da tab:
- Dias como Lead (se aplicável)
- Dias em Tratamento Ativo (se aplicável)
- Dias desde Finalização (se aplicável)

### 4.18 Migração de Dados

**FR-MIG-001**: Script de migração deve exportar dados do Airtable para CSV:
- Tabela "Pacientes": 175 registros
- Tabela "Exames": 479 registros
- **Sessões NÃO migradas automaticamente** (serão inseridas manualmente pela equipe)

**FR-MIG-002**: Script de transformação deve mapear campos Airtable → Supabase:
- Converter datas do formato Airtable para ISO 8601
- Mapear IDs relacionais (paciente_id)
- Normalizar CPF (remover máscara, validar)
- Normalizar campos de texto (trim, uppercase onde apropriado)
- Definir status inicial como "Ativo" (ou "Lead" se sem sessões)

**FR-MIG-003**: Script de validação deve verificar:
- Todos os pacientes foram migrados (175)
- Todos os exames foram migrados e associados corretamente (479)
- Nenhum dado foi perdido (contagem de registros)
- Integridade referencial (todos os exame.paciente_id existem em pacientes)
- CPFs são únicos e válidos

**FR-MIG-004**: Backup do Airtable deve ser mantido por 30 dias após migração bem-sucedida

**FR-MIG-005**: Relatório de migração deve documentar: total migrado, erros encontrados, ações corretivas

### 4.19 Design e UI/UX

**FR-UI-001**: Sistema deve usar Admin Theme do Beauty Smile Design System:
- Primary Color: #00109E (Deep Blue)
- Accent Color: #35BFAD (Turquoise)
- Tipografia: Montserrat (headings), Inter (body)

**FR-UI-002**: Layout deve incluir:
- Sidebar fixa à esquerda com navegação principal
- Header com logo, busca global, nome do usuário, logout
- Área de conteúdo principal responsiva

**FR-UI-003**: Componentes devem usar a biblioteca Beauty Smile:
- Buttons, Cards, Inputs, Dialogs, Tables, Badges do design system
- Cores, espaçamentos e tipografia conforme design principles

**FR-UI-004**: Cores de status de paciente (badges):
- **Lead**: Azul (#3B82F6)
- **Ativo**: Verde (#10B981)
- **Finalizado**: Roxo (#8B5CF6)
- **Inativo**: Cinza (#6B7280)

**FR-UI-005**: Interface deve ser responsiva:
- Desktop (1024px+): Layout com sidebar fixa
- Tablet (768-1023px): Sidebar colapsável
- Mobile (< 768px): Menu hambúrguer

**FR-UI-006**: Feedback visual para ações:
- Loading spinners durante requisições
- Toast notifications para sucesso/erro
- Estados desabilitados para botões durante processamento

**FR-UI-007**: Tour guiado (primeiro login):
- Biblioteca: Shepherd.js
- 5 passos: Dashboard → Lista → Perfil → Nova Sessão → Ações Pendentes
- Opção "Pular" e "Não mostrar novamente"

**FR-UI-008**: Validação de CPF visual:
- Campo formata automaticamente enquanto digita (000.000.000-00)
- Ícone de check verde se válido, X vermelho se inválido
- Mensagem de erro se duplicado

---

## 5. Non-Goals (Out of Scope)

Explicitamente **NÃO** fazem parte deste MVP:

❌ **Sistema de Alertas Inteligentes Automáticos**: Alertas são manuais via widget de ações pendentes. Alertas automáticos por email/SMS serão feitos em PRD separado (Fase 2)

❌ **Análise de IA com Claude API**: Análise automática de exames, sugestões clínicas, comparação com histórico (será feito em PRD separado - Fase 2)

❌ **Criação de Autorizações de Exame via API Biologix**: Sistema não cria autorizações no Biologix automaticamente (feito manualmente na interface Biologix por enquanto). Investigar com Biologix se API existe.

❌ **Portal do Paciente**: Interface para pacientes visualizarem seus próprios exames

❌ **Aplicativo Mobile Nativo**: App iOS/Android (web responsivo é suficiente por enquanto)

❌ **Integração com WhatsApp/SMS para envio automático**: Apenas botão para abrir WhatsApp Web

❌ **Integração com Google Calendar**: Agendamento de sessões

❌ **Webhooks em tempo real da Biologix**: Sincronização é diária por polling (10h00 BRT)

❌ **Exportação de Dados para Excel/CSV**: Não há funcionalidade de export neste MVP

❌ **Multi-idioma**: Sistema será apenas em Português

❌ **Multi-clínica/White-label**: Sistema é exclusivo para Beauty Smile

❌ **Análise Preditiva com ML**: Estimativa de sessões necessárias baseada em machine learning

❌ **Geração Automática de Relatórios PDF**: Apenas link para PDF do Biologix

❌ **Fotos Antes/Depois**: Upload de imagens (requer Supabase Storage - futuro)

❌ **Relatórios Financeiros**: Valor pago, receita, etc.

---

## 6. Design Considerations

### Admin Theme
- Sistema usa o tema **Admin (Deep Blue #00109E)** do Beauty Smile Design System
- Interface profissional, autoritativa, com alto contraste para leitura de dados clínicos
- Sidebar escura (#00109E) com navegação principal
- Background claro (#F8F9FA) para área de conteúdo
- **NÃO usar glass morphism** (reservado para tema público)

### Componentes de UI
Utilizar componentes do Beauty Smile Design System:
- **Button**: Variantes primary (Deep Blue), secondary, ghost
- **Card**: Container padrão para seções
- **Table**: Listas de pacientes, exames, sessões
- **Input**: Campos de formulário com validação visual
- **Dialog/Modal**: Registro de sessões, detalhes de exame, edição de tags
- **Badge**: Status de pacientes (Lead/Ativo/Finalizado/Inativo), tags, categorias de IDO
- **Alert**: Mensagens de sucesso/erro (toast)
- **Dropdown**: Multi-select para tags, filtros

### Cores de Badges de Status
- **Lead**: `bg-blue-500 text-white` (#3B82F6)
- **Ativo**: `bg-green-500 text-white` (#10B981)
- **Finalizado**: `bg-purple-500 text-white` (#8B5CF6)
- **Inativo**: `bg-gray-500 text-white` (#6B7280)

### Cores de Badges de Adesão
- **Alta (≥80%)**: `bg-green-100 text-green-800 border-green-500`
- **Média (50-79%)**: `bg-yellow-100 text-yellow-800 border-yellow-500`
- **Baixa (<50%)**: `bg-red-100 text-red-800 border-red-500`

### Widget "Ações Pendentes"
- 4 cards com ícones:
  1. **Leads**: Ícone de usuário + badge vermelho com quantidade
  2. **Manutenção**: Ícone de calendário + badge amarelo
  3. **Sem Sessão**: Ícone de alerta + badge laranja
  4. **Completando**: Ícone de check + badge azul
- Cada card clicável expande lista abaixo
- Lista mostra nome, métrica relevante (ex: "Há 15 dias"), botão "Ver Perfil"

### Gráficos e Visualizações
- **Biblioteca**: Recharts (integra bem com React e Tailwind)
- **Tipos de gráfico**:
  - Line Chart: Evolução temporal de métricas
  - Bar Chart: Distribuição por categorias (IDO, Score, Status)
  - Donut Chart: Proporções (% de pacientes respondendo, conversão)
- **Cores dos gráficos**:
  - Série principal: #00109E (Deep Blue)
  - Série secundária: #35BFAD (Turquoise)
  - Positivo/Melhora: #10B981 (Green)
  - Negativo/Piora: #EF4444 (Red)
  - Neutro/Estável: #F59E0B (Yellow)
  - Lead: #3B82F6 (Blue)
  - Finalizado: #8B5CF6 (Purple)
  - Inativo: #6B7280 (Gray)

### Tour Guiado (Shepherd.js)
- **Passo 1 (Dashboard)**: "Bem-vindo! Aqui você vê métricas gerais e ações pendentes."
- **Passo 2 (Lista)**: "Busque pacientes por nome, CPF ou telefone. Filtre por status e tags."
- **Passo 3 (Perfil)**: "Veja histórico completo: exames, sessões, evolução e notas."
- **Passo 4 (Nova Sessão)**: "Registre sessões em segundos: preencha contadores de pulso e pronto!"
- **Passo 5 (Ações)**: "Priorize seu dia: leads para follow-up, manutenções, pacientes sem sessão."
- Botões: "Anterior", "Próximo", "Pular Tour"
- Checkbox: "Não mostrar novamente" (salva em localStorage)

### Validação de CPF
- Input com máscara automática: `___.___.___-__`
- Validação em tempo real (algoritmo padrão):
  - Ícone check verde se válido
  - Ícone X vermelho se inválido
  - Mensagem "CPF inválido" abaixo do campo
- Verificação de duplicata ao perder foco (onBlur):
  - Mensagem "CPF já cadastrado" se duplicado
  - Link para perfil existente

### Responsividade
- **Desktop (1024px+)**: Sidebar fixa, tabelas completas, gráficos lado a lado
- **Tablet (768-1023px)**: Sidebar colapsável, tabelas scrolláveis, gráficos empilhados
- **Mobile (< 768px)**: Menu hambúrguer, cards em coluna única, gráficos simplificados

### Acessibilidade
- Contraste mínimo WCAG AA (4.5:1) para texto
- Estados de foco visíveis em elementos interativos (outline turquoise)
- Labels ARIA para screen readers
- Navegação por teclado funcional
- Alt text para ícones importantes

---

## 7. Technical Considerations

### Stack Tecnológico

**Frontend:**
- **Framework**: Next.js 14 (App Router)
- **Linguagem**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **Componentes**: Beauty Smile Design System + Radix UI
- **Gráficos**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Tour**: Shepherd.js
- **State**: React Context API (suficiente para MVP)
- **Deploy**: Vercel (free tier)

**Backend:**
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth com RLS
- **Edge Functions**: Supabase Edge Functions (Deno runtime)
- **Cron Jobs**: Supabase pg_cron
- **Storage**: Supabase Storage (não usado neste MVP)

**Integrações:**
- **Biologix API**: REST API (v2)

### Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  Next.js 14 App (Vercel) - Admin Theme                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │Pacientes │  │ Perfil  │  │  Tags    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  Roles: Admin, Equipe, Recepção                            │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTPS (Supabase JS Client + RLS)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Cloud                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  PostgreSQL + RLS (Row Level Security)                 │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │ │
│  │  │pacientes │ │  exames  │ │ sessoes  │ │   tags   │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │ │
│  │  ┌──────────┐ ┌─────────────┐ ┌──────────────────┐   │ │
│  │  │  notas   │ │ audit_log   │ │ status_history   │   │ │
│  │  └──────────┘ └─────────────┘ └──────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Supabase Auth (JWT tokens, 3 roles)                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Edge Functions (Deno)                                 │ │
│  │  ┌──────────────────┐                                  │ │
│  │  │ sync-biologix    │  (Cron: diariamente 10h BRT)    │ │
│  │  │ - Auth Biologix  │                                  │ │
│  │  │ - Fetch exams    │                                  │ │
│  │  │ - Match by CPF   │                                  │ │
│  │  │ - Upsert DB      │                                  │ │
│  │  └──────────────────┘                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS (REST API)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Biologix API (External)                         │
│  POST /v2/sessions/open                                     │
│  GET  /v2/partners/{partnerId}/exams                        │
│  GET  /v2/exams/{examKey}/files/report.pdf                  │
└─────────────────────────────────────────────────────────────┘
```

### Schema do Banco de Dados (PostgreSQL)

**Tabela: `pacientes`**
```sql
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  biologix_id TEXT UNIQUE, -- Pode ser NULL se pré-cadastrado
  cpf TEXT UNIQUE NOT NULL, -- Obrigatório, validado
  nome TEXT NOT NULL,
  sexo TEXT CHECK (sexo IN ('m', 'f', 'o')),
  email TEXT,
  telefone TEXT,
  data_nascimento DATE,
  altura_cm INTEGER,

  -- Status e Tratamento
  status TEXT CHECK (status IN ('lead', 'ativo', 'finalizado', 'inativo')) NOT NULL DEFAULT 'lead',
  motivo_inativo TEXT, -- Se status = inativo
  data_fechamento DATE, -- Data da primeira sessão (Lead → Ativo)

  -- Sessões
  sessoes_compradas INTEGER DEFAULT 0,
  sessoes_adicionadas INTEGER DEFAULT 0,
  -- sessoes_utilizadas é COUNT(sessoes) via query

  -- Manutenção
  proxima_manutencao DATE, -- Última sessão + 6 meses
  manutencao_contatado BOOLEAN DEFAULT FALSE,

  -- Outras Info
  observacoes_gerais TEXT, -- Campo livre editável

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_pacientes_cpf ON pacientes(cpf);
CREATE INDEX idx_pacientes_status ON pacientes(status);
CREATE INDEX idx_pacientes_biologix_id ON pacientes(biologix_id);

-- Função para validar CPF
CREATE OR REPLACE FUNCTION validar_cpf(cpf TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  numeros TEXT;
  soma INT;
  resto INT;
  dig1 INT;
  dig2 INT;
BEGIN
  -- Remove máscara
  numeros := REGEXP_REPLACE(cpf, '[^0-9]', '', 'g');

  -- Verifica tamanho
  IF LENGTH(numeros) != 11 THEN
    RETURN FALSE;
  END IF;

  -- Verifica sequências inválidas (111.111.111-11, etc.)
  IF numeros IN ('00000000000', '11111111111', '22222222222', '33333333333',
                 '44444444444', '55555555555', '66666666666', '77777777777',
                 '88888888888', '99999999999') THEN
    RETURN FALSE;
  END IF;

  -- Calcula primeiro dígito verificador
  soma := 0;
  FOR i IN 1..9 LOOP
    soma := soma + CAST(SUBSTRING(numeros, i, 1) AS INT) * (11 - i);
  END LOOP;
  resto := (soma * 10) % 11;
  dig1 := CASE WHEN resto = 10 THEN 0 ELSE resto END;

  -- Calcula segundo dígito verificador
  soma := 0;
  FOR i IN 1..10 LOOP
    soma := soma + CAST(SUBSTRING(numeros, i, 1) AS INT) * (12 - i);
  END LOOP;
  resto := (soma * 10) % 11;
  dig2 := CASE WHEN resto = 10 THEN 0 ELSE resto END;

  -- Verifica dígitos
  RETURN dig1 = CAST(SUBSTRING(numeros, 10, 1) AS INT)
     AND dig2 = CAST(SUBSTRING(numeros, 11, 1) AS INT);
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar CPF antes de inserir/atualizar
CREATE OR REPLACE FUNCTION trigger_validar_cpf()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT validar_cpf(NEW.cpf) THEN
    RAISE EXCEPTION 'CPF inválido: %', NEW.cpf;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validar_cpf_trigger
  BEFORE INSERT OR UPDATE ON pacientes
  FOR EACH ROW EXECUTE FUNCTION trigger_validar_cpf();
```

**Tabela: `tags`**
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT UNIQUE NOT NULL,
  cor TEXT NOT NULL, -- Hex color, ex: #FF5733
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags pré-criadas
INSERT INTO tags (nome, cor) VALUES
  ('Protocolo Nasal', '#35BFAD'),
  ('Atropina', '#00109E'),
  ('Vonau', '#BB965B');
```

**Tabela: `paciente_tags` (many-to-many)**
```sql
CREATE TABLE paciente_tags (
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (paciente_id, tag_id)
);

CREATE INDEX idx_paciente_tags_paciente ON paciente_tags(paciente_id);
CREATE INDEX idx_paciente_tags_tag ON paciente_tags(tag_id);
```

**Tabela: `paciente_status_history`**
```sql
CREATE TABLE paciente_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  motivo TEXT, -- Se mudou para inativo
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_status_history_paciente ON paciente_status_history(paciente_id);

-- Trigger para registrar mudanças de status
CREATE OR REPLACE FUNCTION trigger_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') OR (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO paciente_status_history (paciente_id, status_anterior, status_novo, motivo, changed_by)
    VALUES (
      NEW.id,
      CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.status END,
      NEW.status,
      NEW.motivo_inativo,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER status_history_trigger
  AFTER INSERT OR UPDATE ON pacientes
  FOR EACH ROW EXECUTE FUNCTION trigger_status_history();
```

**Tabela: `exames`** (sem alterações significativas, apenas ajuste de cálculo de score)
```sql
CREATE TABLE exames (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  biologix_exam_id TEXT UNIQUE NOT NULL,
  exam_key TEXT NOT NULL,
  tipo INTEGER CHECK (tipo IN (0, 1)), -- 0=Ronco, 1=Sono
  data_exame TIMESTAMPTZ NOT NULL,
  duracao_seg INTEGER,

  -- Dados do paciente no momento do exame
  peso_kg DECIMAL(5,2),
  altura_cm INTEGER,
  condicoes TEXT[],
  sintomas TEXT[],
  doencas TEXT[],
  medicamentos TEXT[],

  -- Ronco
  ronco_duracao_seg INTEGER,
  ronco_silencio_pct DECIMAL(5,2),
  ronco_baixo_pct DECIMAL(5,2),
  ronco_medio_pct DECIMAL(5,2),
  ronco_alto_pct DECIMAL(5,2),
  score_ronco DECIMAL(5,2), -- Calculado: (baixo × 1 + medio × 2 + alto × 3) / 3

  -- Oximetria
  ido DECIMAL(5,2),
  ido_dormindo DECIMAL(5,2),
  ido_categoria INTEGER,
  carga_hipoxica DECIMAL(8,2),
  spo2_min INTEGER,
  spo2_medio INTEGER,
  spo2_max INTEGER,
  tempo_spo2_90_seg INTEGER,
  tempo_spo2_80_seg INTEGER,
  bpm_min INTEGER,
  bpm_medio INTEGER,
  bpm_max INTEGER,
  latencia_sono_seg INTEGER,
  duracao_sono_seg INTEGER,
  eficiencia_sono_pct DECIMAL(5,2),
  tempo_acordado_seg INTEGER,
  eventos_hipoxemia INTEGER,
  duracao_hipoxemia_seg INTEGER,

  -- Cardiologia
  fibrilacao_atrial INTEGER,

  -- Pós-exame
  qualidade_sono TEXT,
  comparacao_sono TEXT,
  comentarios_pos TEXT,
  data_respostas_pos TIMESTAMPTZ,

  -- Metadados
  aparelho_serial TEXT,
  celular TEXT,
  modelo_celular TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Computed column para PDF URL
ALTER TABLE exames ADD COLUMN pdf_url TEXT
  GENERATED ALWAYS AS (
    'https://api.biologixsleep.com/v2/exams/' || exam_key || '/files/report.pdf'
  ) STORED;

-- Índices
CREATE INDEX idx_exames_paciente ON exames(paciente_id);
CREATE INDEX idx_exames_data ON exames(data_exame DESC);
```

**Tabela: `sessoes`** (removido campos de energia, apenas contadores)
```sql
CREATE TABLE sessoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  data_sessao DATE NOT NULL,
  peso_kg DECIMAL(5,2),

  -- Er:YAG (apenas contadores)
  eryag_pulso_inicial INTEGER,
  eryag_pulso_final INTEGER,

  -- Nd:YAG (apenas contadores)
  ndyag_pulso_inicial INTEGER,
  ndyag_pulso_final INTEGER,

  observacoes TEXT,

  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Flag de edição
  editada BOOLEAN DEFAULT FALSE,
  editada_em TIMESTAMPTZ
);

CREATE INDEX idx_sessoes_paciente ON sessoes(paciente_id);
CREATE INDEX idx_sessoes_data ON sessoes(data_sessao DESC);

-- Trigger para marcar como editada
CREATE OR REPLACE FUNCTION trigger_marcar_editada()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.editada := TRUE;
    NEW.editada_em := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER marcar_editada_trigger
  BEFORE UPDATE ON sessoes
  FOR EACH ROW EXECUTE FUNCTION trigger_marcar_editada();

-- Trigger para mudar status de Lead → Ativo na primeira sessão
CREATE OR REPLACE FUNCTION trigger_primeira_sessao()
RETURNS TRIGGER AS $$
DECLARE
  paciente_status TEXT;
  sessoes_count INT;
BEGIN
  -- Busca status atual do paciente
  SELECT status INTO paciente_status FROM pacientes WHERE id = NEW.paciente_id;

  -- Conta sessões do paciente
  SELECT COUNT(*) INTO sessoes_count FROM sessoes WHERE paciente_id = NEW.paciente_id;

  -- Se é a primeira sessão e paciente é Lead, muda para Ativo
  IF sessoes_count = 1 AND paciente_status = 'lead' THEN
    UPDATE pacientes
    SET status = 'ativo',
        data_fechamento = NEW.data_sessao
    WHERE id = NEW.paciente_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER primeira_sessao_trigger
  AFTER INSERT ON sessoes
  FOR EACH ROW EXECUTE FUNCTION trigger_primeira_sessao();

-- Trigger para atualizar proxima_manutencao ao inserir sessão
CREATE OR REPLACE FUNCTION trigger_atualizar_manutencao()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pacientes
  SET proxima_manutencao = NEW.data_sessao + INTERVAL '6 months'
  WHERE id = NEW.paciente_id AND status = 'finalizado';

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atualizar_manutencao_trigger
  AFTER INSERT OR UPDATE ON sessoes
  FOR EACH ROW EXECUTE FUNCTION trigger_atualizar_manutencao();
```

**Tabela: `sessoes_history`** (histórico de edições)
```sql
CREATE TABLE sessoes_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sessao_id UUID REFERENCES sessoes(id) ON DELETE CASCADE,
  data_sessao DATE,
  peso_kg DECIMAL(5,2),
  eryag_pulso_inicial INTEGER,
  eryag_pulso_final INTEGER,
  ndyag_pulso_inicial INTEGER,
  ndyag_pulso_final INTEGER,
  observacoes TEXT,
  edited_by UUID REFERENCES auth.users(id),
  edited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para salvar versão anterior ao editar
CREATE OR REPLACE FUNCTION trigger_salvar_versao_anterior()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO sessoes_history (
      sessao_id, data_sessao, peso_kg,
      eryag_pulso_inicial, eryag_pulso_final,
      ndyag_pulso_inicial, ndyag_pulso_final,
      observacoes, edited_by
    ) VALUES (
      OLD.id, OLD.data_sessao, OLD.peso_kg,
      OLD.eryag_pulso_inicial, OLD.eryag_pulso_final,
      OLD.ndyag_pulso_inicial, OLD.ndyag_pulso_final,
      OLD.observacoes, auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER salvar_versao_trigger
  BEFORE UPDATE ON sessoes
  FOR EACH ROW EXECUTE FUNCTION trigger_salvar_versao_anterior();
```

**Tabela: `notas_paciente`**
```sql
CREATE TABLE notas_paciente (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  nota TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notas_paciente ON notas_paciente(paciente_id);
```

**Tabela: `audit_log`**
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  acao TEXT NOT NULL, -- 'create', 'update', 'delete'
  tabela TEXT NOT NULL, -- 'pacientes', 'sessoes', 'users', etc.
  registro_id UUID,
  dados_alterados JSONB, -- Campos modificados
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_tabela ON audit_log(tabela);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
```

**View: `vw_pacientes_resumo`** (atualizada)
```sql
CREATE VIEW vw_pacientes_resumo AS
SELECT
  p.id,
  p.cpf,
  p.nome,
  p.sexo,
  p.status,
  p.data_nascimento,
  EXTRACT(YEAR FROM AGE(p.data_nascimento)) AS idade,
  p.email,
  p.telefone,
  p.altura_cm,
  p.data_fechamento,
  p.proxima_manutencao,
  p.manutencao_contatado,

  -- Tags
  ARRAY_AGG(DISTINCT t.nome) FILTER (WHERE t.nome IS NOT NULL) AS tags,

  -- Contagens
  COUNT(DISTINCT e.id) AS total_exames,
  COUNT(DISTINCT s.id) AS total_sessoes,

  -- Sessões
  p.sessoes_compradas,
  p.sessoes_adicionadas,
  COUNT(DISTINCT s.id) AS sessoes_utilizadas,
  (p.sessoes_compradas + p.sessoes_adicionadas - COUNT(DISTINCT s.id)) AS sessoes_disponiveis,

  -- Adesão
  CASE
    WHEN (p.sessoes_compradas + p.sessoes_adicionadas) > 0
    THEN (COUNT(DISTINCT s.id)::DECIMAL / (p.sessoes_compradas + p.sessoes_adicionadas) * 100)
    ELSE NULL
  END AS adesao_pct,

  -- Datas
  MAX(e.data_exame) AS ultimo_exame_data,
  MAX(s.data_sessao) AS ultima_sessao_data,
  MIN(e.data_exame) AS primeiro_exame_data,
  MIN(s.data_sessao) AS primeira_sessao_data,

  -- Peso atual
  COALESCE(
    (SELECT peso_kg FROM exames WHERE paciente_id = p.id ORDER BY data_exame DESC LIMIT 1),
    (SELECT peso_kg FROM sessoes WHERE paciente_id = p.id ORDER BY data_sessao DESC LIMIT 1)
  ) AS peso_atual_kg,

  -- Métricas de melhora
  (SELECT score_ronco FROM exames WHERE paciente_id = p.id AND score_ronco IS NOT NULL ORDER BY data_exame ASC LIMIT 1) AS primeiro_score_ronco,
  (SELECT score_ronco FROM exames WHERE paciente_id = p.id AND score_ronco IS NOT NULL ORDER BY data_exame DESC LIMIT 1) AS ultimo_score_ronco,

  (SELECT ido FROM exames WHERE paciente_id = p.id AND ido IS NOT NULL ORDER BY data_exame ASC LIMIT 1) AS primeiro_ido,
  (SELECT ido FROM exames WHERE paciente_id = p.id AND ido IS NOT NULL ORDER BY data_exame DESC LIMIT 1) AS ultimo_ido,

  -- % Melhora Score Ronco
  CASE
    WHEN (SELECT score_ronco FROM exames WHERE paciente_id = p.id AND score_ronco IS NOT NULL ORDER BY data_exame ASC LIMIT 1) > 0
    THEN (
      (
        (SELECT score_ronco FROM exames WHERE paciente_id = p.id AND score_ronco IS NOT NULL ORDER BY data_exame ASC LIMIT 1) -
        (SELECT score_ronco FROM exames WHERE paciente_id = p.id AND score_ronco IS NOT NULL ORDER BY data_exame DESC LIMIT 1)
      ) / (SELECT score_ronco FROM exames WHERE paciente_id = p.id AND score_ronco IS NOT NULL ORDER BY data_exame ASC LIMIT 1) * 100
    )
    ELSE NULL
  END AS melhora_score_pct

FROM pacientes p
LEFT JOIN exames e ON e.paciente_id = p.id
LEFT JOIN sessoes s ON s.paciente_id = p.id
LEFT JOIN paciente_tags pt ON pt.paciente_id = p.id
LEFT JOIN tags t ON t.id = pt.tag_id
GROUP BY p.id;
```

**View: `vw_leads_pendentes`**
```sql
CREATE VIEW vw_leads_pendentes AS
SELECT
  p.id,
  p.nome,
  p.cpf,
  p.email,
  p.telefone,
  MAX(e.data_exame) AS data_exame,
  EXTRACT(DAY FROM (NOW() - MAX(e.data_exame))) AS dias_sem_fechar
FROM pacientes p
JOIN exames e ON e.paciente_id = p.id
WHERE p.status = 'lead'
  AND MAX(e.data_exame) < NOW() - INTERVAL '7 days'
GROUP BY p.id
ORDER BY dias_sem_fechar DESC;
```

**View: `vw_acoes_pendentes`**
```sql
CREATE VIEW vw_acoes_pendentes AS
SELECT
  'leads' AS tipo,
  COUNT(*) AS quantidade
FROM vw_leads_pendentes

UNION ALL

SELECT
  'manutencao' AS tipo,
  COUNT(*) AS quantidade
FROM pacientes
WHERE status = 'finalizado'
  AND proxima_manutencao <= NOW()
  AND manutencao_contatado = FALSE

UNION ALL

SELECT
  'sem_sessao' AS tipo,
  COUNT(*) AS quantidade
FROM pacientes p
LEFT JOIN sessoes s ON s.paciente_id = p.id
WHERE p.status = 'ativo'
  AND (MAX(s.data_sessao) < NOW() - INTERVAL '21 days' OR MAX(s.data_sessao) IS NULL)
GROUP BY p.id

UNION ALL

SELECT
  'completando' AS tipo,
  COUNT(*) AS quantidade
FROM vw_pacientes_resumo
WHERE status = 'ativo'
  AND sessoes_disponiveis BETWEEN 1 AND 2;
```

**View: `vw_metricas_globais`** (atualizada)
```sql
CREATE VIEW vw_metricas_globais AS
SELECT
  COUNT(DISTINCT CASE WHEN p.status = 'ativo' THEN p.id END) AS total_pacientes_ativos,
  COUNT(DISTINCT CASE WHEN p.status = 'lead' THEN p.id END) AS total_leads,
  COUNT(DISTINCT e.id) AS total_exames,
  COUNT(DISTINCT s.id) AS total_sessoes,

  -- Taxa de conversão Lead → Paciente
  CASE
    WHEN COUNT(DISTINCT CASE WHEN p.status = 'lead' THEN p.id END) +
         COUNT(DISTINCT CASE WHEN p.status IN ('ativo', 'finalizado') THEN p.id END) > 0
    THEN (
      COUNT(DISTINCT CASE WHEN p.status IN ('ativo', 'finalizado') THEN p.id END)::DECIMAL /
      (COUNT(DISTINCT CASE WHEN p.status = 'lead' THEN p.id END) +
       COUNT(DISTINCT CASE WHEN p.status IN ('ativo', 'finalizado') THEN p.id END)) * 100
    )
    ELSE 0
  END AS taxa_conversao_pct,

  -- Adesão média
  AVG(
    CASE
      WHEN (p.sessoes_compradas + p.sessoes_adicionadas) > 0
      THEN (COUNT(DISTINCT s.id)::DECIMAL / (p.sessoes_compradas + p.sessoes_adicionadas) * 100)
      ELSE NULL
    END
  ) AS adesao_media_pct,

  -- Melhora média
  AVG(
    CASE
      WHEN primeiro.score_ronco > 0
      THEN ((primeiro.score_ronco - ultimo.score_ronco) / primeiro.score_ronco * 100)
      ELSE NULL
    END
  ) AS melhora_media_score_ronco_pct

FROM pacientes p
LEFT JOIN exames e ON e.paciente_id = p.id
LEFT JOIN sessoes s ON s.paciente_id = p.id
LEFT JOIN LATERAL (
  SELECT score_ronco FROM exames WHERE paciente_id = p.id AND score_ronco IS NOT NULL ORDER BY data_exame ASC LIMIT 1
) primeiro ON TRUE
LEFT JOIN LATERAL (
  SELECT score_ronco FROM exames WHERE paciente_id = p.id AND score_ronco IS NOT NULL ORDER BY data_exame DESC LIMIT 1
) ultimo ON TRUE
GROUP BY p.id;
```

### Segurança (Row Level Security)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exames ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_paciente ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE paciente_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE paciente_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Função helper para obter role do usuário
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    auth.jwt() -> 'user_metadata' ->> 'role',
    'none'
  )::TEXT
$$ LANGUAGE SQL SECURITY DEFINER;

-- Políticas para PACIENTES
-- Admin: acesso total
CREATE POLICY "Admin acesso total pacientes" ON pacientes
  FOR ALL
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

-- Equipe: visualização e edição (exceto delete)
CREATE POLICY "Equipe visualiza pacientes" ON pacientes
  FOR SELECT
  USING (get_user_role() = 'equipe');

CREATE POLICY "Equipe edita pacientes" ON pacientes
  FOR UPDATE
  USING (get_user_role() = 'equipe')
  WITH CHECK (get_user_role() = 'equipe');

CREATE POLICY "Equipe cria pacientes" ON pacientes
  FOR INSERT
  WITH CHECK (get_user_role() = 'equipe');

-- Recepção: apenas visualização
CREATE POLICY "Recepcao visualiza pacientes" ON pacientes
  FOR SELECT
  USING (get_user_role() = 'recepcao');

-- Políticas para SESSOES
-- Recepção NÃO tem acesso
CREATE POLICY "Admin acesso total sessoes" ON sessoes
  FOR ALL
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

CREATE POLICY "Equipe visualiza sessoes" ON sessoes
  FOR SELECT
  USING (get_user_role() = 'equipe');

CREATE POLICY "Equipe cria sessoes" ON sessoes
  FOR INSERT
  WITH CHECK (get_user_role() = 'equipe');

-- Equipe edita apenas suas próprias sessões
CREATE POLICY "Equipe edita proprias sessoes" ON sessoes
  FOR UPDATE
  USING (get_user_role() = 'equipe' AND created_by = auth.uid())
  WITH CHECK (get_user_role() = 'equipe' AND created_by = auth.uid());

-- Políticas para NOTAS
-- Recepção NÃO tem acesso
CREATE POLICY "Admin acesso total notas" ON notas_paciente
  FOR ALL
  USING (get_user_role() = 'admin')
  WITH CHECK (get_user_role() = 'admin');

CREATE POLICY "Equipe visualiza notas" ON notas_paciente
  FOR SELECT
  USING (get_user_role() = 'equipe');

CREATE POLICY "Equipe cria notas" ON notas_paciente
  FOR INSERT
  WITH CHECK (get_user_role() = 'equipe');

-- Políticas para AUDIT_LOG
-- Apenas Admin visualiza
CREATE POLICY "Admin visualiza audit" ON audit_log
  FOR SELECT
  USING (get_user_role() = 'admin');

-- Políticas similares para outras tabelas...
```

### Edge Function: `sync-biologix`

```typescript
// supabase/functions/sync-biologix/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BIOLOGIX_BASE_URL = 'https://api.biologixsleep.com/v2'

Deno.serve(async (req) => {
  try {
    // 1. Criar cliente Supabase com service key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // 2. Autenticar com Biologix
    const authRes = await fetch(`${BIOLOGIX_BASE_URL}/sessions/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: Deno.env.get('BIOLOGIX_USERNAME'),
        password: Deno.env.get('BIOLOGIX_PASSWORD'),
        source: 100
      })
    })

    if (!authRes.ok) {
      throw new Error('Falha na autenticação Biologix')
    }

    const sessionToken = authRes.headers.get('Bx-Session-Token')
    const { userId } = await authRes.json()

    // 3. Criar Basic Auth
    const authString = btoa(`${userId}:${sessionToken}`)

    // 4. Buscar exames
    const examsRes = await fetch(
      `${BIOLOGIX_BASE_URL}/partners/${Deno.env.get('BIOLOGIX_PARTNER_ID')}/exams`,
      {
        headers: {
          'Authorization': `basic ${authString}`
        }
      }
    )

    if (!examsRes.ok) {
      throw new Error('Falha ao buscar exames')
    }

    const exams = await examsRes.json()

    // 5. Filtrar apenas status=6 (DONE)
    const completedExams = exams.filter((e: any) => e.status === 6)

    let newPatients = 0
    let linkedExams = 0
    let newExams = 0
    const errors: any[] = []

    for (const exam of completedExams) {
      try {
        // 6. Tentar encontrar paciente por CPF
        // (assumindo que CPF está em algum campo do exam.patient)
        const cpf = extractCPF(exam.patient) // Função helper

        let paciente
        if (cpf) {
          const { data: existingPatient } = await supabase
            .from('pacientes')
            .select('id')
            .eq('cpf', cpf)
            .single()

          paciente = existingPatient
        }

        // 7. Se não encontrou por CPF, buscar por biologix_id
        if (!paciente) {
          const { data: byBiologixId } = await supabase
            .from('pacientes')
            .select('id')
            .eq('biologix_id', exam.patientUserId)
            .single()

          paciente = byBiologixId
        }

        // 8. Se não encontrou, criar novo paciente
        if (!paciente) {
          const { data: newPatient, error: patientError } = await supabase
            .from('pacientes')
            .insert({
              biologix_id: exam.patientUserId,
              cpf: cpf || null,
              nome: exam.patient.name,
              sexo: exam.patient.gender,
              email: exam.patient.email,
              telefone: exam.patient.phone,
              data_nascimento: exam.patient.birthDate,
              altura_cm: exam.base?.heightCm,
              status: 'lead' // Paciente novo vindo de exame = lead
            })
            .select('id')
            .single()

          if (patientError) throw patientError

          paciente = newPatient
          newPatients++
        } else {
          linkedExams++
        }

        // 9. Calcular score ronco
        const scoreRonco = calculateSnoringScore(exam.result?.snoring)

        // 10. Upsert exame
        const { error: examError } = await supabase
          .from('exames')
          .upsert({
            paciente_id: paciente.id,
            biologix_exam_id: exam.examId,
            exam_key: exam.examKey,
            tipo: exam.type,
            data_exame: exam.base?.startTime,
            duracao_seg: exam.base?.durationSecs,
            peso_kg: exam.base?.weightKg,
            altura_cm: exam.base?.heightCm,
            condicoes: exam.base?.conditions,
            sintomas: exam.base?.symptoms,
            doencas: exam.base?.illnesses,
            medicamentos: exam.base?.medicines,

            // Ronco
            ronco_duracao_seg: exam.result?.snoring?.snoringDurationSecs,
            ronco_silencio_pct: exam.result?.snoring?.silentDurationPercent,
            ronco_baixo_pct: exam.result?.snoring?.lowDurationPercent,
            ronco_medio_pct: exam.result?.snoring?.mediumDurationPercent,
            ronco_alto_pct: exam.result?.snoring?.highDurationPercent,
            score_ronco: scoreRonco,

            // Oximetria
            ido: exam.result?.oximetry?.odi,
            ido_dormindo: exam.result?.oximetry?.odi,
            ido_categoria: exam.result?.oximetry?.odiCategory,
            carga_hipoxica: exam.result?.oximetry?.hypoxicBurden,
            spo2_min: exam.result?.oximetry?.spO2Min,
            spo2_medio: exam.result?.oximetry?.spO2Avg,
            spo2_max: exam.result?.oximetry?.spO2Max,
            tempo_spo2_90_seg: exam.result?.oximetry?.spO2Under90Secs,
            tempo_spo2_80_seg: exam.result?.oximetry?.spO2Under80Secs,
            bpm_min: exam.result?.oximetry?.hrMin,
            bpm_medio: exam.result?.oximetry?.hrAvg,
            bpm_max: exam.result?.oximetry?.hrMax,
            latencia_sono_seg: exam.result?.oximetry?.sleepLatencySecs,
            duracao_sono_seg: exam.result?.oximetry?.sleepDurationSecs,
            eficiencia_sono_pct: exam.result?.oximetry?.sleepEfficiencyPercent,
            tempo_acordado_seg: exam.result?.oximetry?.wakeTimeAfterSleepSecs,
            eventos_hipoxemia: exam.result?.oximetry?.nbHypoxemiaEvents,
            duracao_hipoxemia_seg: exam.result?.oximetry?.hypoxemiaTotalDurationSecs,

            // Cardiologia
            fibrilacao_atrial: exam.result?.cardiology?.afNotification,

            // Pós-exame
            qualidade_sono: exam.afterQuestions?.sleepQuality,
            comparacao_sono: exam.afterQuestions?.comparison,
            comentarios_pos: exam.afterQuestions?.comments,
            data_respostas_pos: exam.afterQuestions?.answeredAt
          }, { onConflict: 'biologix_exam_id' })

        if (!examError) {
          newExams++
        } else {
          errors.push({ exam: exam.examId, error: examError.message })
        }

      } catch (err) {
        errors.push({ exam: exam.examId, error: (err as Error).message })
      }
    }

    // 11. Retornar resultado
    console.log(`Sincronização concluída:`, {
      totalExames: completedExams.length,
      novosPackentes: newPatients,
      examesVinculados: linkedExams,
      novosExames: newExams,
      erros: errors.length
    })

    return new Response(JSON.stringify({
      success: true,
      totalExames: completedExams.length,
      novosPackentes: newPatients,
      examesVinculados: linkedExams,
      novosExames: newExams,
      erros: errors
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error) {
    console.error('Erro na sincronização:', error)
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error).message
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

// Helper: Calcular Score Ronco
function calculateSnoringScore(snoring: any): number | null {
  if (!snoring) return null

  // Fórmula: (baixo × 1 + medio × 2 + alto × 3) / 3
  const baixo = snoring.lowDurationPercent || 0
  const medio = snoring.mediumDurationPercent || 0
  const alto = snoring.highDurationPercent || 0

  return (baixo * 1 + medio * 2 + alto * 3) / 3
}

// Helper: Extrair CPF dos dados do paciente
// NOTA: Biologix pode não fornecer CPF. Investigar campo correto.
function extractCPF(patient: any): string | null {
  // Tentar extrair de algum campo
  // Pode estar em patient.document, patient.id, ou outro campo
  // Por enquanto, retorna null (ajustar conforme API real)
  return null
}
```

### Variáveis de Ambiente

**Supabase (Edge Function):**
```env
BIOLOGIX_USERNAME=l|DEMO|47349438
BIOLOGIX_PASSWORD=oA6fGc5qaNw4Dhre
BIOLOGIX_PARTNER_ID=4798042LW
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
```

**Next.js (Frontend):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### Deploy

**Frontend (Vercel):**
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático em cada push para `main`

**Backend (Supabase):**
1. Migrations via Supabase CLI: `supabase db push`
2. Edge Functions via CLI: `supabase functions deploy sync-biologix`
3. Configurar cron job via SQL:
```sql
SELECT cron.schedule(
  'sync-biologix-daily',
  '0 10 * * *', -- 10am UTC (7am BRT)
  $$
  SELECT net.http_post(
    url:='https://xxx.supabase.co/functions/v1/sync-biologix',
    headers:='{"Content-Type": "application/json"}'::jsonb
  )
  $$
);
```

**Staging Environment:**
- Branch separado no Supabase: `staging`
- Vercel preview deployments para branches de feature
- Dados de teste isolados

---

## 8. Success Metrics

### Critérios de Sucesso Técnicos
✅ **100% de uptime** durante horário comercial (8h-18h BRT)
✅ **Sincronização diária** executa sem falhas por 30 dias consecutivos
✅ **Zero perda de dados** na migração Airtable → Supabase (validado por contagem de registros)
✅ **Tempo de carregamento** de perfil de paciente < 2 segundos
✅ **Gráficos renderizam** em < 1 segundo (até 50 pontos de dados)

### Critérios de Sucesso de Uso
✅ **5-10 usuários ativos** (Admin + Equipe + Recepção) fazem login pelo menos 3x por semana
✅ **100% das sessões** de tratamento registradas no sistema
✅ **Tempo médio de revisão** de paciente < 1 minuto (medido via analytics)
✅ **3+ notas** adicionadas por semana (indicador de uso ativo)
✅ **Taxa de adesão ao tour** ≥ 70% dos novos usuários completam

### Critérios de Sucesso Clínicos
✅ **Identificação visual** de melhora/piora em < 10 segundos ao abrir perfil
✅ **Comparação primeiro vs. último exame** visível sem cálculos manuais
✅ **Dashboard mostra tendências** de eficácia do tratamento nos últimos 6 meses
✅ **Widget de ações pendentes** identifica automaticamente leads e manutenções

### Critérios de Sucesso de Negócio
✅ **Taxa de conversão Lead → Paciente ≥ 60%**
✅ **Adesão média ao tratamento ≥ 80%** (sessões realizadas / sessões compradas)
✅ **100% de pacientes finalizados** contatados para manutenção em 6 meses
✅ **ROI positivo** em 3 meses (economia de tempo > custo de desenvolvimento)
✅ **Satisfação do usuário** ≥ 8/10 em pesquisa pós-lançamento
✅ **Redução de 80%** no tempo gasto em busca de dados de pacientes

---

## 9. Open Questions

### Questões Técnicas Resolvidas
✅ ~~Fator de conversão de pulsos para energia (mJ)~~ → **RESOLVIDO**: Não converter, apenas registrar contadores
✅ ~~Fórmula de cálculo do Score Ronco~~ → **RESOLVIDO**: `(baixo × 1 + medio × 2 + alto × 3) / 3`
✅ ~~Threshold de "paciente respondendo"~~ → **RESOLVIDO**: 20% de melhora
✅ ~~Frequência de sincronização~~ → **RESOLVIDO**: 10h00 BRT diariamente
✅ ~~Permissões de deleção~~ → **RESOLVIDO**: Apenas Admin pode deletar
✅ ~~Edição de exames~~ → **RESOLVIDO**: Read-only (imutáveis)
✅ ~~Notificações~~ → **RESOLVIDO**: Apenas dashboards (sem notificações in-app)
✅ ~~Exportação de dados~~ → **RESOLVIDO**: Não no MVP
✅ ~~Tour guiado~~ → **RESOLVIDO**: Sim, usar Shepherd.js
✅ ~~Preferências de usuário~~ → **RESOLVIDO**: Não (sem customização)
✅ ~~Modo escuro~~ → **RESOLVIDO**: Não (somente claro)

### Questões Pendentes - Todas Resolvidas ✅ (23/11/2025)

✅ **Campo CPF no Biologix**: **RESOLVIDO**
   - Campo: `patient.username` (não `patient.cpf`)
   - Formato: `l|BR_CPF|03069152864`
   - Extração: Usar regex para extrair apenas números → `REGEX_REPLACE({username}, "[^0-9]", "")`
   - Resultado: `03069152864` (CPF limpo)
   - **Implementação**: Função PostgreSQL `extract_cpf_from_username(text)` na Edge Function

✅ **Biologix API para criar autorizações**: **RESOLVIDO**
   - **Resposta**: Não existe endpoint na API v2 para criar autorizações programaticamente
   - **Solução**: Continuar criando autorizações manualmente na interface web do Biologix
   - **Workflow**: Pré-cadastrar paciente com CPF no sistema → Autorizar exame no Biologix manualmente → Primeiro exame sincronizado será vinculado automaticamente pelo CPF

✅ **Backup de banco de dados**: **RESOLVIDO**
   - **Decisão**: Utilizar sistema nativo de Point-in-Time Recovery do Supabase
   - Snapshots automáticos (incluído no plano Supabase Pro)
   - Retenção: 7 dias
   - **Ação**: Nenhuma ação adicional necessária

✅ **Ambiente de Staging**: **RESOLVIDO**
   - **Decisão**: Configurar branch `staging` no Supabase antes do início do desenvolvimento
   - **Ação**: Admin criará projeto Supabase separado para staging (Semana 1)

✅ **Analytics/Métricas de Uso**: **RESOLVIDO**
   - **Decisão**: Não incluir no MVP (pode ser adicionado posteriormente se necessário)
   - Sistema interno terá poucos usuários (5-10), métricas de uso não são prioritárias
   - **Alternativa**: Usar logs de auditoria interno para rastrear ações dos usuários

---

## 10. Timeline Estimado

### Fase 1: Setup e Migração (Semanas 1-2)
- Configuração Supabase: schemas, migrations, triggers, RLS
- Edge Function: sync-biologix (incluindo vinculação por CPF)
- Funções SQL: validar_cpf, triggers de status, triggers de sessão
- Migração de dados Airtable → Supabase
- Validação de integridade dos dados
- Criação de tags pré-definidas
- **Entregável**: Banco de dados populado e sincronização funcionando

### Fase 2: Autenticação e Layout Base (Semana 3)
- Setup Next.js 14 + Tailwind + Beauty Smile Design System
- Sistema de autenticação (login, logout, proteção de rotas, 3 roles)
- Layout base (sidebar, header, navegação)
- Busca global (header)
- Tour guiado (Shepherd.js)
- **Entregável**: Shell da aplicação com login funcional e tour

### Fase 3: Dashboard e Ações Pendentes (Semana 4)
- Aba Geral: KPIs (incluindo conversão e adesão), exames recentes
- **Widget "Ações Pendentes"**: 4 tipos de alertas (leads, manutenção, sem sessão, completando)
- Aba Ronco: métricas, distribuição, top melhorias, gráfico de tendência com filtro de período
- Aba Apneia: métricas, distribuição IDO, casos críticos, gráfico de tendência
- Tempo médio de tratamento (segmentado)
- **Entregável**: Dashboard completo e funcional

### Fase 4: Gestão de Pacientes (Semana 5)
- Pré-cadastro de paciente (CPF validado)
- Lista de pacientes com busca global e filtros avançados (status, tags, adesão)
- Gestão de tags (CRUD)
- Badge de status, adesão, "Novo"
- **Entregável**: Gestão de pacientes completa

### Fase 5: Perfil de Paciente - Parte 1 (Semana 6)
- Header do perfil (dados, status dropdown, quick actions, observações gerais)
- Botão WhatsApp
- Resumo de tratamento (sessões disponíveis, adesão, manutenção)
- Tab Exames: lista, filtros, modal de detalhes
- Tab Sessões: lista, modal de nova sessão (sem campos de energia)
- Edição de sessão com histórico
- **Entregável**: Visualização e registro de sessões funcionando

### Fase 6: Perfil de Paciente - Parte 2 (Semana 7)
- Tab Evolução: gráficos interativos com filtro de período, comparação primeiro vs. último
- Tab Peso: gráfico + IMC
- Tab Notas: lista + adicionar nota
- Tab Histórico de Status: timeline de mudanças
- **Entregável**: Perfil de paciente 100% completo

### Fase 7: Features Avançadas (Semana 8)
- Logs de auditoria (página Admin)
- Permissões RLS completas (3 roles)
- Gestão de usuários (Admin)
- Triggers de mudança de status automática (Lead → Ativo ao criar sessão)
- Cálculo automático de próxima manutenção
- **Entregável**: Sistema completo com todas as features

### Fase 8: Migração Manual de Sessões (Semana 9)
- Equipe da clínica registra manualmente sessões históricas
- Acompanhamento e suporte durante registro
- Validação de dados inseridos
- **Entregável**: Histórico completo de sessões no sistema

### Fase 9: Testes e Deploy (Semana 10)
- Testes de integração (fluxos principais)
- Testes de permissões (3 roles)
- Testes de usabilidade com 2-3 usuários de cada role
- Correções de bugs
- Deploy em produção (Vercel + Supabase)
- Documentação de uso (guia para cada role)
- **Entregável**: Sistema em produção

**Total: 10 semanas**

---

## 10.1. Checklist de Validação da Migração Airtable → Supabase

A migração de 175 pacientes e 479 exames é **crítica** e requer validação rigorosa para evitar perda de dados.

### Pré-Migração
- [ ] Backup completo do Airtable exportado (CSV + JSON)
- [ ] Script de migração desenvolvido e testado em ambiente local
- [ ] Mapeamento de campos Airtable → Supabase documentado
- [ ] Ambiente de staging configurado e isolado
- [ ] Dry-run do script executado em staging com sucesso

### Validação Pós-Migração

**Contagem de Registros:**
- [ ] 175 pacientes importados (SELECT COUNT(*) FROM pacientes)
- [ ] 479 exames vinculados corretamente (SELECT COUNT(*) FROM exames)
- [ ] 100% dos CPFs validados e formatados (validar_cpf() retorna TRUE)
- [ ] 100% dos exames linkados aos pacientes corretos pelo biologix_id

**Qualidade dos Dados:**
- [ ] Zero CPFs duplicados (constraint UNIQUE funcionando)
- [ ] Zero pacientes sem biologix_id (campo obrigatório)
- [ ] Tags migradas e associadas corretamente aos pacientes
- [ ] Status de pacientes mapeados (todos começam como "ativo" por padrão)
- [ ] Datas convertidas corretamente (formato UTC, timezone BRT)
- [ ] Peso/altura/IMC recalculados e validados (comparar com Airtable)

**Vinculação de Exames:**
- [ ] Todos os exames têm paciente_id preenchido (não NULL)
- [ ] Primeiro exame de cada paciente tem data correta
- [ ] Score Ronco calculado corretamente para exames do tipo 0
- [ ] IDO calculado corretamente para exames com oximetria

**Validação Manual:**
- [ ] Spot check de 10 pacientes aleatórios (comparar Airtable vs Supabase)
- [ ] Verificar paciente com mais exames (validar ordem cronológica)
- [ ] Verificar paciente com CPF especial (caracteres, formatação)

**Sessões (Não Migradas):**
- [ ] Confirmado: Sessões do Airtable NÃO foram migradas (adicionar manualmente depois)
- [ ] Campos `sessoes_compradas` e `sessoes_adicionadas` zerados para todos

### Critério de Sucesso
✅ **Zero pacientes perdidos** (175 = 175)
✅ **Zero exames perdidos** (479 = 479)
✅ **Zero inconsistências de CPF** (duplicatas, inválidos)
✅ **100% de exames vinculados** a pacientes
✅ **Spot check manual passou** (10/10 pacientes corretos)

---

## 10.2. Estratégia de Testes

Garantir qualidade e estabilidade do sistema através de testes automatizados e manuais.

### Testes Unitários (Jest + Vitest)

**Funções PostgreSQL:**
- [ ] `validar_cpf()` - Valida CPF correto, inválido, formatado, não formatado
- [ ] `extract_cpf_from_username()` - Extrai CPF do formato Biologix
- [ ] `calculate_score_ronco()` - Calcula score corretamente
- [ ] Triggers: `atualizar_sessoes_utilizadas`, `atualizar_status_ao_criar_sessao`
- [ ] Triggers: `calcular_proxima_manutencao`

**Utility Functions (Frontend):**
- [ ] CPF formatting (000.000.000-00)
- [ ] Date conversions (UTC → BRT)
- [ ] IMC calculation
- [ ] Adesão percentage calculation

**Edge Function:**
- [ ] `sync-biologix` com mock da API Biologix
- [ ] Renovação automática de token
- [ ] Vinculação de exames por CPF
- [ ] Tratamento de erros (API offline, token expirado)

**Meta de Cobertura:**
- ✅ **80% de cobertura** de funções críticas (validações, cálculos, triggers)

### Testes de Integração (Playwright)

**Fluxos Principais:**
- [ ] Fluxo completo: Criar paciente → Sync exame → Criar sessão → Ver evolução
- [ ] Pré-cadastro de paciente com CPF → Primeiro exame vincula automaticamente
- [ ] Mudança de status: Lead → Ativo (ao criar primeira sessão)
- [ ] Adicionar sessões compradas → Sessões disponíveis atualiza
- [ ] Criar 10 sessões → Paciente vira "Finalizado" → Calcular próxima manutenção

**Permissões RLS:**
- [ ] Admin pode criar/editar/deletar pacientes e sessões
- [ ] Equipe pode criar/editar (própria) sessão, mas não deletar
- [ ] Recepção pode visualizar, mas não criar/editar/deletar
- [ ] Admin pode ver logs de auditoria, Equipe e Recepção não

**Busca e Filtros:**
- [ ] Busca global funciona com CPF (apenas números)
- [ ] Busca global funciona com nome (case-insensitive)
- [ ] Busca global funciona com telefone
- [ ] Filtros de status (Lead, Ativo, Finalizado, Inativo)
- [ ] Filtros de tags

**Cálculos Automáticos:**
- [ ] Sessões Utilizadas = COUNT de sessões
- [ ] Sessões Disponíveis = (compradas + adicionadas) - utilizadas
- [ ] Adesão = (utilizadas / (compradas + adicionadas)) × 100
- [ ] Badge de alerta se Disponíveis < 2

**Tour Guiado:**
- [ ] Tour completa sem erros para Admin
- [ ] Tour completa sem erros para Equipe
- [ ] Tour completa sem erros para Recepção
- [ ] Botão "Pular Tour" funciona
- [ ] Flag `tour_completed` salva corretamente

### Testes de Aceitação do Usuário (Manual)

**Participantes:**
- [ ] 2 dentistas (role: Equipe) testam criação de paciente e sessões
- [ ] 1 recepcionista (role: Recepção) testa visualização de ações pendentes
- [ ] 1 admin testa gestão de usuários e logs

**Cenários:**
- [ ] Dentista cria paciente, registra 3 sessões, visualiza evolução
- [ ] Recepcionista busca paciente por CPF, vê ações pendentes
- [ ] Admin adiciona novo usuário, vê logs de auditoria
- [ ] Feedback coletado e bugs documentados

### Testes de Performance

**Benchmarks:**
- [ ] Dashboard carrega em **< 2 segundos** (com 200 pacientes)
- [ ] Busca global retorna em **< 500ms**
- [ ] Perfil de paciente carrega em **< 1 segundo**
- [ ] Sync diário processa 500 exames em **< 5 minutos**
- [ ] Gráficos de evolução renderizam em **< 1 segundo**

**Validação:**
- [ ] Indexação correta de `cpf`, `biologix_id`, `created_at`
- [ ] Queries otimizadas (EXPLAIN ANALYZE)
- [ ] Lazy loading de tabs no perfil de paciente
- [ ] Paginação de listas (20 itens por página)

---

## 10.3. Riscos e Mitigações

Identificação proativa de riscos para preparar contingências e evitar surpresas durante o desenvolvimento.

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| **API Biologix muda sem aviso** | Média | Alto | Monitorar changelog mensal, manter versão v2 fixada, alertas de erro na sync, retry automático |
| **Perda de dados na migração** | Baixa | **Crítico** | Checklist de validação rigoroso + backup Airtable permanente + dry-run obrigatório em staging |
| **Token Biologix expira durante sync** | Média | Médio | Renovação automática antes de expirar (dia 6 de 7), retry com exponential backoff, logs detalhados |
| **CPF duplicado no cadastro manual** | Alta | Baixo | Validação UNIQUE no banco + UI mostra erro claro + sugestão de paciente existente |
| **Biologix offline durante sync diária** | Baixa | Médio | Retry automático a cada hora (max 3 tentativas), log de falhas, email de alerta se 3 falhas |
| **Dentistas não adotam o sistema** | Média | **Alto** | Tour guiado obrigatório + treinamento presencial 30min + sessão de feedback semanal (mês 1) |
| **Performance ruim com 500+ pacientes** | Baixa | Médio | Indexação correta + paginação + lazy loading + EXPLAIN ANALYZE em queries críticas |
| **Supabase fica indisponível** | Muito Baixa | Alto | SLA 99.9% do Supabase + monitoramento uptime (UptimeRobot) + plano de contingência (usar Airtable temporariamente) |
| **Sessões históricas não são registradas** | Média | Médio | Semana 9 dedicada exclusivamente a isso + acompanhamento diário + gamificação (meta de X sessões/dia) |
| **CPF não encontrado em exames Biologix** | Baixa | Médio | Pré-cadastro manual com CPF antes de autorizar exame + validação no primeiro sync |
| **Usuários esquecem senha** | Alta | Baixo | Reset de senha via email (Supabase Auth) + Admin pode resetar senha de qualquer usuário |
| **Bugs descobertos após deploy** | Alta | Médio | Testes rigorosos (Semana 10) + ambiente de staging para hotfixes + rollback rápido no Vercel |

### Plano de Contingência Crítico

**Se a migração falhar completamente:**
1. Rollback para Airtable (dados intactos)
2. Revisar script de migração
3. Executar dry-run novamente em staging
4. Reagendar migração para próxima semana

**Se API Biologix mudar e quebrar a sync:**
1. Pausar cron job imediatamente
2. Contatar suporte Biologix
3. Adaptar Edge Function para nova estrutura
4. Testar em staging antes de reativar cron

---

## 11. Fase 2 (Futuro PRD)

Este PRD cobre o **sistema base completo**. Um segundo PRD será criado posteriormente para:

### Fase 2: Alertas Automáticos e IA
- **Sistema de Alertas Inteligentes via Email/SMS**:
  - Alerta de IDO piorado (atual > anterior)
  - Alerta de SpO2 crítico (< 80%)
  - Alerta de fibrilação atrial detectada
  - Alerta de não resposta ao tratamento (< 20% melhora após 5+ sessões)
  - Alerta de eficiência do sono baixa (< 75%)
  - Email/SMS automático para recepção

- **Análise de IA com Claude API**:
  - Análise automática de cada novo exame
  - Comparação com exames anteriores e protocolos similares
  - Sugestões clínicas personalizadas
  - Identificação de attention points
  - Prognóstico (positivo/neutro/negativo)
  - Estimativa de sessões necessárias para meta de melhora

- **Edge Function adicional**: `generate-alerts` (cron diário 10:30am)
- **Integração n8n** (ou migração para Edge Function): Webhook para análise de IA
- **Custo adicional**: ~$5-10/mês (Claude API)

### Fase 3: Integrações e Automações (Futuro)
- WhatsApp Business API para envio automático de lembretes
- Google Calendar para agendamento de sessões
- Export de dados (Excel/CSV/PDF)
- Portal do Paciente (visualizar próprios exames)
- Upload de fotos antes/depois (Supabase Storage)

---

## 12. Conclusão

O **Beauty Sleep Treatment System - Sistema Base v2.0** é uma plataforma completa, focada e executável que cobre **todo o ciclo de vida do paciente** na Beauty Smile.

### Principais Diferenciais da v2.0:

✅ **Gestão Completa do Ciclo**: Lead → Paciente → Tratamento → Finalizado → Manutenção
✅ **Conversão de Leads**: Dashboard e widget dedicados para follow-up estruturado
✅ **Controle de Pacotes**: Rastreamento de sessões compradas, adicionadas e disponíveis
✅ **Adesão ao Tratamento**: Métricas visuais de % de utilização e alertas de baixa adesão
✅ **Manutenção Preventiva**: Cálculo automático e lembretes de retorno em 6 meses
✅ **Tags e Protocolos**: Organização por protocolos clínicos (Atropina, Vonau, Nasal)
✅ **3 Roles**: Admin, Equipe e Recepção com permissões adequadas
✅ **Busca Global**: CPF, nome ou telefone em um único campo
✅ **Rastreabilidade Total**: Histórico de status, edições de sessões e audit logs
✅ **Tour Guiado**: Onboarding interativo para novos usuários

### Benefícios Mensuráveis:

🎯 **Economizam 80% do tempo** na revisão de pacientes (5 min → 30 seg)
🎯 **Aumentam conversão de leads** através de follow-up estruturado (meta: 60%)
🎯 **Melhoram adesão ao tratamento** com visibilidade de sessões disponíveis (meta: 80%)
🎯 **Reduzem perda de pacientes** com alertas de manutenção preventiva (100% de contato)
🎯 **Identificam padrões** de resposta ao tratamento por protocolo e severidade
🎯 **Tomam decisões clínicas** baseadas em dados consolidados e histórico completo
🎯 **Garantem rastreabilidade** completa de todos os tratamentos e mudanças

Com um escopo realista focado no MVP (sem alertas automáticos e IA nesta fase), o projeto é **realizável em 10 semanas** e estabelece uma base sólida para expansões futuras. A escolha do **Admin Theme** garante uma interface profissional e apropriada para uso clínico.

---

## 13. Apêndice: Matriz de Permissões

| Funcionalidade | Admin | Equipe | Recepção |
|---|---|---|---|
| **Dashboard - Visualizar** | ✅ | ✅ | ✅ |
| **Dashboard - Ver valores de contadores** | ✅ | ✅ | ❌ |
| **Widget Ações Pendentes** | ✅ | ✅ | ✅ |
| **Lista de Pacientes - Visualizar** | ✅ | ✅ | ✅ (dados básicos) |
| **Busca Global** | ✅ | ✅ | ✅ |
| **Pré-cadastrar Paciente** | ✅ | ✅ | ❌ |
| **Editar Dados do Paciente** | ✅ | ✅ | ❌ |
| **Deletar Paciente** | ✅ | ❌ | ❌ |
| **Mudar Status de Paciente** | ✅ | ✅ | ❌ |
| **Adicionar Sessões Compradas** | ✅ | ✅ | ❌ |
| **Criar Tags** | ✅ | ✅ | ❌ |
| **Atribuir Tags** | ✅ | ✅ | ❌ |
| **Ver Detalhes de Exames** | ✅ | ✅ | ✅ |
| **Baixar PDF de Exames** | ✅ | ✅ | ❌ |
| **Ver Tab Sessões** | ✅ | ✅ | ❌ |
| **Criar Sessão** | ✅ | ✅ | ❌ |
| **Editar Sessão (própria)** | ✅ | ✅ | ❌ |
| **Editar Sessão (de outros)** | ✅ | ❌ | ❌ |
| **Deletar Sessão** | ✅ | ❌ | ❌ |
| **Ver Histórico de Edições de Sessão** | ✅ | ❌ | ❌ |
| **Ver Tab Notas** | ✅ | ✅ | ❌ |
| **Criar Nota** | ✅ | ✅ | ❌ |
| **Deletar Nota** | ✅ | ❌ | ❌ |
| **Ver Tab Evolução** | ✅ | ✅ | ✅ |
| **Ver Tab Peso** | ✅ | ✅ | ✅ |
| **Ver Tab Histórico de Status** | ✅ | ✅ | ✅ |
| **Editar Observações Gerais** | ✅ | ✅ | ❌ |
| **Criar Usuário** | ✅ | ❌ | ❌ |
| **Editar Usuário** | ✅ | ❌ | ❌ |
| **Desativar Usuário** | ✅ | ❌ | ❌ |
| **Ver Logs de Auditoria** | ✅ | ❌ | ❌ |

---

## 14. Apêndice B: Estrutura do Tour Guiado (Shepherd.js)

O tour guiado é **essencial para garantir adoção** do sistema pelos usuários. Deve ser executado automaticamente no primeiro login e pode ser refazer posteriormente.

### Configuração Geral

**Trigger:**
- Primeira vez que usuário faz login (flag `tour_completed = false` na tabela `users`)
- Pode ser refeito em Configurações de Perfil → "Refazer Tour"

**Biblioteca:** Shepherd.js (https://shepherdjs.dev/)

**Aparência:**
- Tooltips com setas apontando para elementos
- Fundo escurecido (overlay) destacando elemento ativo
- Botões: "Voltar", "Próximo", "Pular Tour"
- Indicador de progresso: "3 de 12"

### Tour para Admin (12 steps)

**Step 1: Boas-vindas**
- **Título:** "Bem-vindo ao Beauty Sleep System! 👋"
- **Conteúdo:** "Este tour rápido (2 minutos) vai te mostrar como gerenciar pacientes, sessões e visualizar relatórios. Você pode pular ou pausar a qualquer momento."
- **Elemento:** Modal centralizado (sem elemento específico)
- **Botões:** "Começar Tour", "Pular Tour"

**Step 2: Dashboard - Visão Geral**
- **Elemento:** Card "Total de Pacientes"
- **Conteúdo:** "Aqui você vê os principais números: total de pacientes, leads para converter, exames realizados e conversão de leads."
- **Botões:** "Voltar", "Próximo" (2/12)

**Step 3: Widget Ações Pendentes**
- **Elemento:** Widget "Ações Pendentes"
- **Conteúdo:** "Este widget mostra as ações mais urgentes: leads sem follow-up, pacientes sem sessão, e quem precisa de manutenção. Clique em qualquer item para ir direto ao paciente."
- **Botões:** "Voltar", "Próximo" (3/12)

**Step 4: Navegação - Pacientes**
- **Elemento:** Sidebar → Link "Pacientes"
- **Conteúdo:** "Aqui você acessa a lista completa de pacientes, pode filtrar por status, tags e adesão."
- **Ação:** Navegar para /pacientes automaticamente após "Próximo"
- **Botões:** "Voltar", "Próximo" (4/12)

**Step 5: Criar Paciente**
- **Elemento:** Botão "Novo Paciente"
- **Conteúdo:** "Para pré-cadastrar um paciente antes do primeiro exame, clique aqui. O CPF é obrigatório e será usado para vincular automaticamente os exames futuros."
- **Botões:** "Voltar", "Próximo" (5/12)

**Step 6: Busca Global**
- **Elemento:** Campo de busca no header
- **Conteúdo:** "Busque qualquer paciente por CPF, nome ou telefone. A busca é instantânea e funciona em qualquer página."
- **Botões:** "Voltar", "Próximo" (6/12)

**Step 7: Perfil de Paciente - Overview**
- **Elemento:** Card de um paciente (clicar automaticamente no primeiro paciente da lista)
- **Conteúdo:** "O perfil mostra tudo sobre o paciente: dados, exames sincronizados automaticamente do Biologix, sessões de tratamento e gráficos de evolução."
- **Ação:** Navegar para /pacientes/[id]
- **Botões:** "Voltar", "Próximo" (7/12)

**Step 8: Criar Sessão**
- **Elemento:** Tab "Sessões" → Botão "Nova Sessão"
- **Conteúdo:** "Registre cada sessão de tratamento aqui: data, protocolos usados e contadores de pulsos (inicial e final). Sessões editadas ficam com histórico de auditoria."
- **Botões:** "Voltar", "Próximo" (8/12)

**Step 9: Tags e Protocolos**
- **Elemento:** Campo "Tags" no header do perfil
- **Conteúdo:** "Use tags para organizar pacientes por protocolos (Atropina, Vonau, Nasal) ou categorias personalizadas. Crie novas tags em Configurações."
- **Botões:** "Voltar", "Próximo" (9/12)

**Step 10: Evolução Temporal**
- **Elemento:** Tab "Evolução"
- **Conteúdo:** "Visualize a evolução dos principais indicadores: IDO, SpO2, ronco. Compare o primeiro exame com o último para ver a melhora percentual."
- **Botões:** "Voltar", "Próximo" (10/12)

**Step 11: Gestão de Usuários**
- **Elemento:** Sidebar → Link "Usuários"
- **Conteúdo:** "Como Admin, você pode criar e gerenciar usuários. Existem 3 roles: Admin (você), Equipe (dentistas) e Recepção (visualização)."
- **Botões:** "Voltar", "Próximo" (11/12)

**Step 12: Encerramento**
- **Título:** "Tudo pronto! 🎉"
- **Conteúdo:** "Você já sabe o básico! Explore as outras abas do dashboard (Ronco, Apneia) e o histórico de status. Se precisar refazer o tour, vá em Configurações de Perfil."
- **Elemento:** Modal centralizado
- **Botões:** "Concluir Tour"
- **Ação:** Salvar `tour_completed = true` no banco

---

### Tour para Equipe (8 steps)

Similar ao Admin, mas **sem** os seguintes steps:
- ❌ Step 11: Gestão de Usuários (Equipe não tem acesso)
- ❌ Menção a "logs de auditoria" ou "histórico de edições de sessão"

**Steps específicos:**
1. Boas-vindas (1/8)
2. Dashboard - Visão Geral (2/8)
3. Widget Ações Pendentes (3/8)
4. Navegação - Pacientes (4/8)
5. Criar Paciente (5/8)
6. Perfil de Paciente - Overview (6/8)
7. Criar Sessão (7/8) - **Nota:** "Você pode editar suas próprias sessões, mas não de outros dentistas"
8. Evolução Temporal (8/8)
9. Encerramento (9/8)

---

### Tour para Recepção (5 steps)

Versão simplificada focada em **visualização** e **ações pendentes**.

**Step 1: Boas-vindas**
- **Título:** "Bem-vindo ao Beauty Sleep System! 👋"
- **Conteúdo:** "Como Recepcionista, você pode visualizar pacientes, buscar por CPF/nome e acompanhar ações pendentes."
- **Botões:** "Começar Tour", "Pular Tour"

**Step 2: Widget Ações Pendentes**
- **Elemento:** Widget "Ações Pendentes"
- **Conteúdo:** "Este widget mostra leads que precisam de follow-up, pacientes sem sessão e manutenções atrasadas. Clique para ver detalhes."
- **Botões:** "Voltar", "Próximo" (2/5)

**Step 3: Busca Global**
- **Elemento:** Campo de busca no header
- **Conteúdo:** "Busque qualquer paciente por CPF, nome ou telefone. A busca é instantânea."
- **Botões:** "Voltar", "Próximo" (3/5)

**Step 4: Perfil de Paciente (Read-only)**
- **Elemento:** Card de um paciente (clicar automaticamente)
- **Conteúdo:** "Você pode visualizar todos os dados do paciente: exames, gráficos de evolução, status. Porém, apenas dentistas e admins podem editar."
- **Ação:** Navegar para /pacientes/[id]
- **Botões:** "Voltar", "Próximo" (4/5)

**Step 5: Encerramento**
- **Título:** "Tudo pronto! 🎉"
- **Conteúdo:** "Agora você sabe como buscar pacientes e acompanhar ações pendentes. Se precisar refazer o tour, vá em Configurações de Perfil."
- **Botões:** "Concluir Tour"
- **Ação:** Salvar `tour_completed = true`

---

### Implementação Técnica

**Tabela `users` - Adicionar campo:**
```sql
ALTER TABLE users ADD COLUMN tour_completed BOOLEAN DEFAULT FALSE;
```

**Componente React:**
```typescript
// components/OnboardingTour.tsx
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

export function OnboardingTour({ role }: { role: 'admin' | 'equipe' | 'recepcao' }) {
  const steps = getTourSteps(role); // Função retorna steps baseado no role

  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
    }
  });

  steps.forEach((step) => tour.addStep(step));

  return tour;
}
```

**Trigger no primeiro login:**
```typescript
// app/dashboard/page.tsx
useEffect(() => {
  if (!user.tour_completed) {
    const tour = new OnboardingTour({ role: user.role });
    tour.start();

    tour.on('complete', () => {
      // Salvar tour_completed = true
      supabase.from('users').update({ tour_completed: true }).eq('id', user.id);
    });
  }
}, [user]);
```

**Refazer Tour (Configurações de Perfil):**
- Botão "Refazer Tour Guiado"
- Chama `tour.start()` novamente (não altera `tour_completed`)

---

**Próximos Passos:**
1. ✅ Revisão e aprovação deste PRD v2.0 pelos stakeholders
2. ✅ Definir respostas para Open Questions (campo CPF no Biologix, API de autorizações) - **CONCLUÍDO**
3. ⏭️ Setup de ambiente de Staging no Supabase
4. ⏭️ Início do desenvolvimento (Fase 1: Setup e Migração)
5. ⏭️ Criação do PRD da Fase 2 (Alertas Automáticos e IA) após MVP em produção

---

**Aprovações:**

- [ ] Aprovado por: _____________________________ Data: ___/___/_____
- [ ] Aprovado por: _____________________________ Data: ___/___/_____
