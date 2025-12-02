# 🏥 Guia da Recepção - Beauty Sleep

## 10.4.5 e 10.4.6 - Guia da Recepção

**Versão:** 1.0  
**Data:** 2025-12-02  
**Para:** Usuários com role "Recepção"

---

## 📋 Sumário

1. [Acesso ao Sistema](#acesso-ao-sistema)
2. [Como Buscar Paciente](#como-buscar-paciente)
3. [Visualizar Ações Pendentes](#visualizar-ações-pendentes)
4. [Identificar Pacientes Prioritários](#identificar-pacientes-prioritários)
5. [Informações Disponíveis](#informações-disponíveis)
6. [Perguntas Frequentes](#perguntas-frequentes)

---

## 🔐 Acesso ao Sistema

### Login

1. Acesse a URL do sistema
2. Digite seu email e senha
3. Clique em "Entrar"
4. Você será redirecionado para o Dashboard

### Primeiro Acesso

Na primeira vez, você verá um **Tour Guiado** simplificado explicando as funcionalidades disponíveis para Recepção.

---

## 🔍 Como Buscar Paciente

### Busca Global (Recomendado)

1. **Pressione:** `Ctrl+K` (ou `Cmd+K` no Mac)
   - Ou clique no campo de busca no header

2. **Digite:**
   - **CPF:** Apenas números (ex: `12345678901`)
   - **Nome:** Nome completo ou parcial (ex: `Maria`)
   - **Telefone:** Número com DDD

3. **Resultados aparecem em tempo real:**
   - Selecione o paciente desejado
   - Você será redirecionado para o perfil

### Busca na Lista de Pacientes

1. Menu lateral → **Pacientes**
2. Use o campo de busca no topo
3. Filtre por status, tags ou adesão (opcional)
4. Clique no paciente para ver perfil completo

---

## 📊 Visualizar Ações Pendentes

### Dashboard - Widget Ações Pendentes

O Dashboard mostra pacientes que precisam de atenção:

### 1. Leads sem Follow-up
- Pacientes criados há mais de 7 dias
- Ainda não começaram tratamento
- **Ação:** Informar equipe para contatar

### 2. Pacientes sem Sessão
- Pacientes ativos mas sem sessões registradas
- Podem precisar agendar primeira sessão
- **Ação:** Verificar agendamento

### 3. Manutenção Atrasada
- Pacientes finalizados com manutenção vencida
- Próxima manutenção já passou
- **Ação:** Agendar retorno/manutenção

### 4. Completando Tratamento
- Menos de 2 sessões disponíveis
- Próximo de finalizar
- **Ação:** Informar sobre próximos passos

### Como Usar

1. Veja os números no Dashboard
2. Clique no card para ver lista de pacientes
3. Acesse o perfil de cada paciente para mais detalhes
4. Identifique ações necessárias

---

## 🎯 Identificar Pacientes Prioritários

### Por Status de Manutenção

**Manutenção Atrasada:**
- Status: Finalizado
- Próxima Manutenção: Data já passou
- **Prioridade:** 🔴 ALTA - Contatar urgente

**Manutenção Próxima:**
- Status: Finalizado
- Próxima Manutenção: Próximos 30 dias
- **Prioridade:** 🟡 MÉDIA - Agendar preventivamente

### Por Tratamento

**Completando Tratamento:**
- Status: Ativo
- Sessões Disponíveis: < 2
- **Prioridade:** 🟡 MÉDIA - Informar sobre finalização

**Sem Sessões:**
- Status: Ativo
- Sessões Utilizadas: 0
- **Prioridade:** 🟢 BAIXA - Verificar agendamento

### Por Tempo sem Contato

**Leads Antigos:**
- Status: Lead
- Criado há: > 7 dias
- **Prioridade:** 🟡 MÉDIA - Verificar interesse

---

## 📋 Informações Disponíveis

### O que Você PODE Ver

✅ **Dados do Paciente:**
- Nome completo
- CPF
- Email
- Telefone
- Data de nascimento
- Status (Lead/Ativo/Finalizado/Inativo)

✅ **Informações de Tratamento:**
- Sessões compradas
- Sessões utilizadas
- Sessões disponíveis
- Próxima manutenção (se finalizado)
- Tags/Protocolos

✅ **Exames:**
- Data do exame
- Tipo (Ronco/Sono)
- Status
- **Nota:** Detalhes completos disponíveis

✅ **Sessões:**
- Data da sessão
- Protocolo usado
- Pulsos utilizados
- Dentista responsável

✅ **Evolução:**
- Gráficos de evolução
- Comparação primeiro vs último exame

✅ **Notas Clínicas:**
- Todas as notas dos dentistas

---

### O que Você NÃO PODE Ver

❌ **Valores Numéricos no Dashboard:**
- KPIs mostram "--" ao invés de números
- Proteção de dados sensíveis

❌ **Valores Específicos em Gráficos:**
- Alguns gráficos podem mostrar "--"

**Nota:** Isso é normal e proposital para proteger informações sensíveis.

---

### O que Você NÃO PODE Fazer

❌ Criar novos pacientes  
❌ Editar dados de pacientes  
❌ Criar ou editar sessões  
❌ Adicionar notas clínicas  
❌ Alterar status de pacientes

**Motivo:** Sua função é visualizar e identificar ações, não fazer alterações.

---

## 📱 Funcionalidades Úteis

### WhatsApp Direto

No perfil do paciente, há um botão de WhatsApp:
- Clique no ícone 📱 ao lado do telefone
- Abre WhatsApp Web com número do paciente
- Útil para contato rápido

### Filtros na Lista

Use filtros para encontrar pacientes específicos:
- Por status
- Por tags/protocolos
- Por adesão ao tratamento
- Por data de cadastro

---

## 🎯 Fluxo de Trabalho Recomendado

### Início do Dia

1. Acesse o Dashboard
2. Verifique ações pendentes
3. Identifique pacientes prioritários
4. Faça lista de contatos/agendamentos

### Durante o Dia

1. Use busca global para acessar pacientes rapidamente
2. Verifique status e próximas ações
3. Identifique pacientes para contato

### Fim do Dia

1. Verifique se ações foram resolvidas
2. Atualize lista de pacientes prioritários para próximo dia

---

## ❓ Perguntas Frequentes

### Por que vejo "--" no Dashboard?

Para proteger dados sensíveis. Recepção tem acesso apenas a informações necessárias para identificar ações pendentes.

### Como sei quando contatar um paciente?

Veja o widget "Ações Pendentes":
- Manutenção atrasada = contato urgente
- Leads antigos = verificar interesse
- Completando tratamento = informar sobre próximos passos

### Posso ver todos os dados do paciente?

Sim, você pode ver:
- Dados pessoais completos
- Histórico de exames
- Histórico de sessões
- Gráficos de evolução
- Notas clínicas

### Posso editar algo?

Não. Você tem apenas visualização. Para alterações, peça a um dentista ou admin.

### Como acesso um paciente pelo telefone?

1. Use busca global (`Ctrl+K`)
2. Digite o número do telefone
3. Selecione o paciente

---

## 📞 Suporte

**Contato:** [email ou Slack/WhatsApp]  
**Horário:** [horário de atendimento]

---

**Última atualização:** 2025-12-02

