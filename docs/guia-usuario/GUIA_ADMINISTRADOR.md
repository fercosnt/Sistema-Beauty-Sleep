# 👑 Guia do Administrador - Beauty Sleep

## 10.4.1 e 10.4.2 - Guia do Administrador

**Versão:** 1.0  
**Data:** 2025-12-02  
**Para:** Usuários com role "Admin"

---

## 📋 Sumário

1. [Acesso ao Sistema](#acesso-ao-sistema)
2. [Gestão de Usuários](#gestão-de-usuários)
3. [Gestão de Tags](#gestão-de-tags)
4. [Logs de Auditoria](#logs-de-auditoria)
5. [Dashboard e Relatórios](#dashboard-e-relatórios)
6. [Perguntas Frequentes](#perguntas-frequentes)

---

## 🔐 Acesso ao Sistema

### Login

1. Acesse a URL do sistema
2. Digite seu email e senha
3. Clique em "Entrar"
4. Você será redirecionado para o Dashboard

### Primeiro Acesso

Na primeira vez que acessar, você verá um **Tour Guiado** que explica todas as funcionalidades. Recomendamos seguir o tour completo.

---

## 👥 Gestão de Usuários

### Criar Novo Usuário

1. **Acesse:** Menu lateral → **Usuários** (apenas Admin)
2. **Clique em:** "Novo Usuário"
3. **Preencha o formulário:**
   - Nome completo
   - Email
   - Role: Admin / Equipe / Recepção
   - Senha (ou marque "Gerar senha automaticamente")
4. **Clique em:** "Criar Usuário"

**Nota:** Se marcar "Gerar senha automaticamente", o usuário receberá um email com link para definir a senha.

---

### Editar Usuário

1. Na lista de usuários, clique em **"Editar"** na linha do usuário
2. Altere os campos desejados:
   - Nome
   - Role
   - Status (Ativo/Inativo)
3. Clique em **"Salvar"**

---

### Desativar Usuário

1. Na lista de usuários, clique em **"Desativar"**
2. Confirme a ação
3. O usuário não conseguirá mais fazer login

**Para reativar:** Clique em **"Ativar"** na lista de usuários.

---

### Resetar Senha

1. Na lista de usuários, clique em **"Resetar Senha"**
2. O usuário receberá um email com link para redefinir a senha

---

### Excluir Usuário (Permanente)

⚠️ **ATENÇÃO:** Esta ação não pode ser desfeita!

1. Na lista de usuários, clique em **"Excluir"**
2. Confirme a exclusão
3. O usuário será removido permanentemente do sistema

**Nota:** Você não pode excluir a si mesmo.

---

## 🏷️ Gestão de Tags

### Criar Nova Tag

1. **Acesse:** Menu lateral → **Configurações** → **Tags**
2. **Clique em:** "Nova Tag"
3. **Preencha:**
   - Nome da tag (ex: "Atropina", "Vonau")
   - Cor (selecione uma cor para identificação visual)
   - Tipo (opcional)
4. **Clique em:** "Criar Tag"

**Tags pré-definidas:**
- Atropina
- Vonau
- Nasal
- Palato
- Língua
- Combinado

---

### Editar Tag

1. Na lista de tags, clique em **"Editar"**
2. Altere nome ou cor
3. Clique em **"Salvar"**

**Nota:** Editar uma tag não afeta os pacientes que já a possuem.

---

### Excluir Tag

⚠️ **ATENÇÃO:** Isso removerá a tag de todos os pacientes!

1. Na lista de tags, clique em **"Excluir"**
2. Confirme a exclusão
3. A tag será removida de todos os pacientes

---

## 📊 Logs de Auditoria

### Acessar Logs

1. **Acesse:** Menu lateral → **Logs** (apenas Admin)
2. Você verá uma lista de todas as ações realizadas no sistema

### Filtrar Logs

Use os filtros para encontrar logs específicos:

- **Por Usuário:** Selecione um usuário específico
- **Por Entidade:** Pacientes, Sessões, Usuários, etc.
- **Por Ação:** INSERT, UPDATE, DELETE
- **Por Data:** Selecione período
- **Busca:** Digite palavras-chave nos detalhes

### O que é Registrado

Todos os logs incluem:
- Data e hora da ação
- Usuário que realizou
- Tipo de ação
- Entidade afetada
- Detalhes da mudança

---

## 📈 Dashboard e Relatórios

### Dashboard Geral

O Dashboard mostra:

- **Total de Pacientes:** Contagem por status
- **Leads para Converter:** Pacientes com status "Lead"
- **Exames Realizados:** Total de exames
- **Taxa de Conversão:** % de leads que viraram ativos
- **Adesão Média:** Média de adesão ao tratamento
- **Tempo Médio de Tratamento:** Por categoria IDO

### Dashboard Ronco

- Score médio de ronco
- Distribuição (baixo/médio/alto)
- Tendência ao longo do tempo
- Top 10 melhorias

### Dashboard Apneia

- IDO médio
- Casos críticos
- SpO2 médio
- Distribuição por categoria

---

## 🔍 Funcionalidades Avançadas

### Busca Global

Pressione `Ctrl+K` (ou `Cmd+K` no Mac) para abrir a busca global.

Busque por:
- CPF (apenas números)
- Nome do paciente
- Telefone

---

### Ações Pendentes

O Dashboard mostra um widget com ações pendentes:

1. **Leads sem follow-up:** Criados há mais de 7 dias
2. **Pacientes sem sessão:** Ativos mas sem sessões registradas
3. **Manutenção atrasada:** Pacientes finalizados com manutenção vencida
4. **Completando tratamento:** Menos de 2 sessões disponíveis

Clique em qualquer item para ver a lista de pacientes.

---

## ❓ Perguntas Frequentes

### Como criar múltiplos usuários?

Atualmente, você precisa criar um por vez. Para criar muitos usuários, recomendamos usar um script ou entrar em contato com suporte.

### Posso mudar o role de um usuário?

Sim! Edite o usuário e altere o role. As permissões serão atualizadas imediatamente.

### Como vejo quem fez uma alteração em um paciente?

Acesse os **Logs de Auditoria** e filtre por entidade "pacientes" e ação "UPDATE".

### Posso restaurar um usuário excluído?

Não. A exclusão é permanente. Se precisar reativar, você precisará criar um novo usuário.

---

## 📞 Suporte

**Contato:** [email ou Slack/WhatsApp]  
**Horário:** [horário de atendimento]

---

**Última atualização:** 2025-12-02

