# 👨‍⚕️ Guia da Equipe (Dentistas) - Beauty Sleep

## 10.4.3 e 10.4.4 - Guia da Equipe

**Versão:** 1.0  
**Data:** 2025-12-02  
**Para:** Usuários com role "Equipe" (Dentistas)

---

## 📋 Sumário

1. [Acesso ao Sistema](#acesso-ao-sistema)
2. [Como Criar Paciente](#como-criar-paciente)
3. [Como Registrar Sessão](#como-registrar-sessão)
4. [Como Visualizar Evolução](#como-visualizar-evolução)
5. [Dashboard e Ações Pendentes](#dashboard-e-ações-pendentes)
6. [Perguntas Frequentes](#perguntas-frequentes)

---

## 🔐 Acesso ao Sistema

### Login

1. Acesse a URL do sistema
2. Digite seu email e senha
3. Clique em "Entrar"
4. Você será redirecionado para o Dashboard

### Primeiro Acesso

Na primeira vez, você verá um **Tour Guiado** explicando as funcionalidades. Recomendamos seguir o tour completo.

---

## 👤 Como Criar Paciente

### Passo a Passo

1. **Acesse:** Menu lateral → **Pacientes**
2. **Clique em:** "Novo Paciente" (botão no topo)
3. **Preencha o formulário:**

   **Campos Obrigatórios:**
   - **ID do Paciente** ⭐ (biologix_id - Identificador único)
   - **CPF** ou **Documento Estrangeiro** (um ou outro)
   - **Nome completo**

   **Campos Opcionais:**
   - Email
   - Telefone
   - Data de nascimento
   - Gênero
   - Sessões compradas (se já comprou)

4. **Status inicial:**
   - **Lead:** Paciente ainda não começou tratamento
   - **Ativo:** Paciente já em tratamento (com sessões)

5. **Clique em:** "Salvar Paciente"

### Validações

- ✅ ID do Paciente deve ser único (não pode existir outro com mesmo ID)
- ✅ CPF deve ser válido (se preenchido)
- ✅ Sistema verifica automaticamente se paciente já existe

### Dicas

- Use o **ID do Paciente** (biologix_id) como identificador principal
- CPF é usado apenas para busca e validação
- Se paciente já existe, o sistema mostrará aviso

---

## 📝 Como Registrar Sessão

### Passo a Passo

1. **Acesse o perfil do paciente:**
   - Menu → Pacientes
   - Clique no nome do paciente
   - Ou use busca global (`Ctrl+K`)

2. **Clique em:** "Nova Sessão" (botão no header)

3. **Preencha o formulário:**

   **Campos Obrigatórios:**
   - **Data da Sessão:** Data em que foi realizada
   - **Contador Inicial:** Valor do contador no início
   - **Contador Final:** Valor do contador no final

   **Campos Opcionais:**
   - **Protocolo (Tags):** Selecione um ou mais:
     - Atropina
     - Vonau
     - Nasal
     - Palato
     - Língua
     - Combinado
   - **Observações:** Notas sobre a sessão

4. **Verifique:**
   - Pulsos utilizados: Final - Inicial (calculado automaticamente)
   - Contador Final deve ser maior que Inicial

5. **Clique em:** "Criar Sessão"

### O que Acontece Automaticamente

✅ Sessões utilizadas aumentam  
✅ Status muda de "Lead" para "Ativo" (se for primeira sessão)  
✅ Adesão ao tratamento é recalculada  
✅ Log de auditoria é criado

---

## 📊 Como Visualizar Evolução

### Aba Evolução

1. Acesse o perfil do paciente
2. Clique na aba **"Evolução"**

### Gráficos Disponíveis

1. **IDO ao Longo do Tempo**
   - Mostra evolução do IDO (Índice de Desordem Obstrutiva)
   - Linha temporal

2. **Score de Ronco ao Longo do Tempo**
   - Evolução do score de ronco
   - Comparação entre exames

3. **SpO2 Médio ao Longo do Tempo**
   - Saturação de oxigênio média
   - Monitoramento de oxigenação

4. **FC Média ao Longo do Tempo**
   - Frequência cardíaca média
   - Monitoramento cardiovascular

### Comparação: Primeiro vs Último Exame

O sistema mostra automaticamente:
- Melhoria em % para cada métrica
- Badge "Respondendo ao tratamento" (se melhoria ≥ 20%)
- Badge "Não respondendo" (se melhoria < 20% após 5+ sessões)

### Filtro de Período

- Últimos 6 meses
- Últimos 12 meses
- Todo o período

---

## 📈 Dashboard e Ações Pendentes

### Dashboard Principal

Mostra:
- Total de seus pacientes
- Sessões registradas hoje
- Próximas manutenções

### Widget Ações Pendentes

Mostra pacientes que precisam de atenção:

1. **Leads sem follow-up:** Criados há mais de 7 dias
2. **Pacientes sem sessão:** Ativos mas sem sessões
3. **Manutenção atrasada:** Finalizados com manutenção vencida
4. **Completando tratamento:** Menos de 2 sessões disponíveis

Clique para ver lista e acessar pacientes.

---

## 🏷️ Gestão de Tags

### Adicionar Tag a um Paciente

1. Acesse o perfil do paciente
2. Na seção de Tags (header), clique em **"+ Adicionar Tag"**
3. Selecione a tag desejada
4. Tag será associada ao paciente

### Remover Tag

1. Na seção de Tags, clique no **"X"** na tag
2. Tag será removida do paciente

---

## 📝 Notas Clínicas

### Adicionar Nota

1. Acesse o perfil do paciente
2. Aba **"Notas"**
3. Digite sua nota no campo
4. Clique em **"Salvar"**

### Ver Histórico

- Todas as notas ficam salvas com:
  - Data e hora
  - Autor (quem criou)
  - Conteúdo completo

---

## ✏️ Editar Sessão

### Você pode editar apenas suas próprias sessões

1. Acesse o perfil do paciente
2. Aba **"Sessões"**
3. Clique em **"Editar"** na sessão desejada
4. Altere os campos necessários
5. Clique em **"Salvar"**

### Histórico de Edições

- Admin pode ver histórico completo de edições
- Você pode ver suas próprias alterações

---

## ❓ Perguntas Frequentes

### Posso editar sessão de outro dentista?

Não. Você só pode editar sessões que você criou. Para alterar sessão de outro dentista, peça a um Admin.

### Como saber se paciente está respondendo ao tratamento?

Veja a aba **"Evolução"** e verifique:
- Badge "Respondendo ao tratamento" (melhoria ≥ 20%)
- Gráficos mostrando tendência de melhoria

### O que fazer se contador final for menor que inicial?

Isso indica erro. Não salve a sessão. Verifique os valores e corrija antes de salvar.

### Como registrar protocolo usado?

Ao criar sessão, selecione uma ou mais tags na seção "Protocolo":
- Seleção única: escolha apenas uma tag
- Seleção múltipla: escolha várias tags se necessário

---

## 📞 Suporte

**Contato:** [email ou Slack/WhatsApp]  
**Horário:** [horário de atendimento]

---

**Última atualização:** 2025-12-02

