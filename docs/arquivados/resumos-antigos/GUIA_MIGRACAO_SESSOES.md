# 📋 Guia de Migração Manual de Sessões

**Versão:** 1.0  
**Data:** 27 de Novembro de 2025  
**Objetivo:** Orientar a equipe na migração manual de sessões históricas do sistema antigo para o Beauty Sleep System

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Como Usar o Modal Nova Sessão](#como-usar-o-modal-nova-sessão)
3. [Campos Obrigatórios e Opcionais](#campos-obrigatórios-e-opcionais)
4. [Como Escolher Protocolos (Tags)](#como-escolher-protocolos-tags)
5. [Template de Planilha para Organização](#template-de-planilha-para-organização)
6. [Agenda de Treinamento](#agenda-de-treinamento)
7. [Dúvidas Frequentes](#dúvidas-frequentes)

---

## 🎯 Visão Geral

Este guia foi criado para auxiliar a equipe na migração manual de sessões históricas de pacientes para o Beauty Sleep System. A migração deve ser feita através do **Modal Nova Sessão**, disponível no perfil de cada paciente.

### Objetivos da Migração

- ✅ Registrar todas as sessões históricas de pacientes no sistema
- ✅ Manter a integridade dos dados (contadores, datas, protocolos)
- ✅ Garantir rastreabilidade (quem registrou cada sessão)
- ✅ Atualizar automaticamente o status do paciente (Lead → Ativo)

### Quem Pode Fazer a Migração

- ✅ **Admin**: Pode registrar sessões para qualquer paciente
- ✅ **Equipe**: Pode registrar sessões para qualquer paciente
- ❌ **Recepção**: Não pode registrar sessões (apenas visualizar)

---

## 📝 Como Usar o Modal Nova Sessão

### Passo 1: Acessar o Perfil do Paciente

1. Acesse a página **Pacientes** no menu lateral
2. Busque o paciente pelo nome, CPF ou telefone
3. Clique no paciente para abrir o perfil completo
4. Na aba **Sessões**, clique no botão **"Nova Sessão"** (canto superior direito)

### Passo 2: Preencher os Dados da Sessão

O modal será aberto com os seguintes campos:

1. **Data da Sessão** (obrigatório)
   - Selecione a data em que a sessão foi realizada
   - Use o calendário ou digite no formato DD/MM/AAAA

2. **Contador Inicial** (obrigatório)
   - Digite o número do contador no início da sessão
   - Apenas números inteiros

3. **Contador Final** (obrigatório)
   - Digite o número do contador no final da sessão
   - Deve ser maior que o contador inicial

4. **Protocolo** (opcional)
   - Selecione uma ou mais tags que representam o protocolo usado
   - Veja a seção [Como Escolher Protocolos](#como-escolher-protocolos-tags) para mais detalhes

5. **Observações** (opcional)
   - Adicione qualquer observação relevante sobre a sessão
   - Exemplos: "Paciente relatou melhora", "Sessão interrompida por 10 minutos", etc.

### Passo 3: Verificar e Salvar

1. Verifique se os **Pulsos Utilizados** estão corretos (calculado automaticamente: Final - Inicial)
2. Revise todos os dados preenchidos
3. Clique em **"Salvar Sessão"**
4. Aguarde a confirmação de sucesso

### Passo 4: Verificar Resultado

Após salvar:
- ✅ A sessão aparecerá na tabela de sessões
- ✅ O contador de **Sessões Utilizadas** será atualizado automaticamente
- ✅ Se o paciente estava como **Lead**, o status mudará automaticamente para **Ativo**

---

## 📋 Campos Obrigatórios e Opcionais

### Campos Obrigatórios

| Campo | Tipo | Descrição | Validação |
|-------|------|-----------|-----------|
| **Data da Sessão** | Data | Data em que a sessão foi realizada | Deve ser uma data válida (não pode ser futura) |
| **Contador Inicial** | Número | Número do contador no início da sessão | Número inteiro positivo |
| **Contador Final** | Número | Número do contador no final da sessão | Número inteiro positivo, deve ser maior que o inicial |

**⚠️ Importante:** O sistema calcula automaticamente os **Pulsos Utilizados** (Contador Final - Contador Inicial). Certifique-se de que os valores estão corretos antes de salvar.

### Campos Opcionais

| Campo | Tipo | Descrição | Quando Usar |
|-------|------|-----------|-------------|
| **Protocolo** | Tags (múltipla escolha) | Protocolo(s) utilizado(s) na sessão | Quando houver registro do protocolo usado |
| **Observações** | Texto | Notas adicionais sobre a sessão | Para registrar informações relevantes que não cabem nos outros campos |

**💡 Dica:** Mesmo sendo opcionais, é recomendado preencher o **Protocolo** sempre que possível, pois ajuda na análise de eficácia dos tratamentos.

---

## 🏷️ Como Escolher Protocolos (Tags)

### Tags Disponíveis

O sistema possui as seguintes tags de protocolo:

| Tag | Cor | Descrição | Quando Usar |
|-----|-----|-----------|-------------|
| **Atropina** | Azul | Protocolo com atropina | Quando o protocolo incluiu aplicação de atropina |
| **Vonau** | Verde | Protocolo com Vonau | Quando o protocolo incluiu aplicação de Vonau |
| **Nasal** | Amarelo | Protocolo nasal | Quando o tratamento foi aplicado na região nasal |
| **Palato** | Laranja | Protocolo no palato | Quando o tratamento foi aplicado no palato |
| **Língua** | Vermelho | Protocolo na língua | Quando o tratamento foi aplicado na língua |
| **Combinado** | Roxo | Protocolo combinado | Quando múltiplos protocolos foram usados na mesma sessão |

### Como Selecionar Protocolos

1. **Seleção Única**: Se apenas um protocolo foi usado, selecione apenas uma tag
   - Exemplo: Apenas tratamento nasal → selecione apenas **Nasal**

2. **Seleção Múltipla**: Se múltiplos protocolos foram usados na mesma sessão:
   - Opção 1: Selecione todas as tags individuais usadas
     - Exemplo: Tratamento nasal + palato → selecione **Nasal** e **Palato**
   - Opção 2: Se foi um protocolo combinado específico, selecione **Combinado**

3. **Sem Protocolo Registrado**: Se não houver informação sobre o protocolo usado:
   - Deixe o campo vazio (é opcional)

### Exemplos Práticos

**Exemplo 1: Sessão Simples**
- **Protocolo:** Nasal
- **Descrição:** Apenas tratamento na região nasal

**Exemplo 2: Sessão Combinada**
- **Protocolo:** Nasal + Palato
- **Descrição:** Tratamento em duas regiões na mesma sessão

**Exemplo 3: Protocolo com Medicamento**
- **Protocolo:** Atropina + Nasal
- **Descrição:** Tratamento nasal com aplicação prévia de atropina

**Exemplo 4: Protocolo Combinado Genérico**
- **Protocolo:** Combinado
- **Descrição:** Quando não há detalhes específicos, mas sabe-se que foi um protocolo combinado

---

## 📊 Template de Planilha para Organização

Antes de começar a migração, recomendamos organizar os dados em uma planilha. Use o template abaixo:

### Template Markdown (para referência)

```markdown
| ID Paciente | Nome | Data Sessão | Contador Inicial | Contador Final | Pulsos | Protocolo | Observações | Status |
|-------------|------|-------------|-------------------|----------------|--------|-----------|-------------|--------|
|             |      |             |                   |                |        |           |             |        |
```

### Template Excel/Google Sheets

Crie uma planilha com as seguintes colunas:

| Coluna | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| **ID Paciente** | Texto | ID do paciente no sistema | `a32e7296-4033-4b7f-a650-3ea0dcfe8ae2` |
| **Nome** | Texto | Nome completo do paciente | João Silva |
| **Data Sessão** | Data | Data da sessão (DD/MM/AAAA) | 15/11/2025 |
| **Contador Inicial** | Número | Contador no início | 1000 |
| **Contador Final** | Número | Contador no final | 1500 |
| **Pulsos Utilizados** | Número | Calculado automaticamente | 500 |
| **Protocolo** | Texto | Tags separadas por vírgula | Nasal, Palato |
| **Observações** | Texto | Notas adicionais | Paciente relatou melhora |
| **Status** | Texto | Status da migração | Pendente / Concluído / Erro |

### Checklist de Validação

Antes de inserir cada sessão, verifique:

- [ ] Data da sessão está correta (não é futura)
- [ ] Contador inicial é menor que contador final
- [ ] Pulsos utilizados = Contador final - Contador inicial
- [ ] Protocolo está correto (se aplicável)
- [ ] Observações estão completas (se houver)

### Dicas de Organização

1. **Agrupe por Paciente**: Organize as sessões por paciente para facilitar a migração
2. **Ordene por Data**: Ordene as sessões por data (mais antigas primeiro)
3. **Valide Antes de Inserir**: Revise os dados antes de inserir no sistema
4. **Mantenha Backup**: Mantenha uma cópia da planilha original como backup

---

## 🎓 Agenda de Treinamento

### Sessão de Treinamento (30 minutos)

#### Etapa 1: Apresentação (5 minutos)

- **Objetivo**: Explicar o propósito da migração
- **Conteúdo**:
  - Por que estamos migrando as sessões?
  - Qual é o objetivo final?
  - Quais são os benefícios?

#### Etapa 2: Demonstração (10 minutos)

- **Objetivo**: Mostrar como usar o Modal Nova Sessão
- **Conteúdo**:
  - Acessar o perfil do paciente
  - Abrir o modal "Nova Sessão"
  - Preencher cada campo (com exemplos práticos)
  - Explicar validações e mensagens de erro
  - Mostrar como verificar se a sessão foi salva corretamente

#### Etapa 3: Prática Supervisionada (10 minutos)

- **Objetivo**: Permitir que a equipe pratique com supervisão
- **Conteúdo**:
  - Cada membro da equipe registra 1-2 sessões de teste
  - Instrutor observa e corrige erros
  - Responde dúvidas em tempo real

#### Etapa 4: Q&A e Encerramento (5 minutos)

- **Objetivo**: Esclarecer dúvidas finais
- **Conteúdo**:
  - Perguntas e respostas
  - Compartilhar contato para suporte
  - Definir cronograma de migração

### Materiais Necessários

- ✅ Computador com acesso ao sistema
- ✅ Lista de pacientes para migração
- ✅ Dados históricos das sessões (planilha ou sistema antigo)
- ✅ Este guia impresso ou digital

### Contato para Suporte

Durante a migração, em caso de dúvidas ou problemas:

- **Canal**: [Definir canal de comunicação - Slack/WhatsApp/Email]
- **Horário**: [Definir horário de suporte]
- **Contato**: [Definir pessoa responsável]

### Checklist Pós-Treinamento

Após o treinamento, certifique-se de que a equipe:

- [ ] Entende como acessar o modal "Nova Sessão"
- [ ] Sabe preencher todos os campos corretamente
- [ ] Conhece as tags de protocolo disponíveis
- [ ] Sabe validar os dados antes de salvar
- [ ] Sabe onde buscar ajuda em caso de dúvidas

---

## 📅 Cronograma Sugerido de Migração

### Semana 1: Preparação

- **Dia 1-2**: Organizar dados históricos em planilha
- **Dia 3**: Treinamento da equipe (30 min)
- **Dia 4-5**: Migração piloto (10-20 pacientes)

### Semana 2-3: Migração em Lote

- **Lote 1**: Pacientes ativos (prioridade alta)
- **Lote 2**: Pacientes finalizados
- **Lote 3**: Pacientes inativos (se necessário)

### Meta Diária

- **Meta**: 20-30 sessões por dia por pessoa
- **Tempo estimado**: 2-3 minutos por sessão
- **Total estimado**: [Calcular baseado no número total de sessões]

---

## ❓ Dúvidas Frequentes

### 1. O que fazer se não tenho o contador inicial/final?

**Resposta:** Se não houver registro dos contadores, você pode:
- Deixar os campos vazios (mas são obrigatórios)
- **Recomendação**: Entre em contato com o suporte para verificar se há outra fonte de dados

### 2. Posso registrar sessões futuras?

**Resposta:** Não. O sistema não permite registrar sessões com data futura. Apenas sessões já realizadas podem ser registradas.

### 3. O que acontece se eu errar o contador?

**Resposta:** Você pode editar a sessão depois (se tiver permissão de Admin/Equipe). No entanto, é melhor validar antes de salvar para evitar retrabalho.

### 4. Posso registrar múltiplas sessões do mesmo dia?

**Resposta:** Sim, você pode registrar quantas sessões forem necessárias, mesmo que sejam do mesmo dia. O sistema permite múltiplas sessões por paciente por data.

### 5. O que fazer se não sei qual protocolo foi usado?

**Resposta:** O campo Protocolo é opcional. Se não houver informação, deixe o campo vazio. É melhor não registrar informação incorreta.

### 6. Como saber se a migração está completa?

**Resposta:** Compare o número de sessões registradas no sistema com o número de sessões históricas. O sistema também mostra o total de sessões utilizadas no resumo do paciente.

### 7. Posso deletar uma sessão se registrar errado?

**Resposta:** Apenas usuários Admin podem deletar sessões. Se você não for Admin, entre em contato com o administrador do sistema.

### 8. O que acontece se eu registrar uma sessão para um paciente Lead?

**Resposta:** O sistema automaticamente muda o status do paciente de **Lead** para **Ativo** quando a primeira sessão é registrada. Isso é feito automaticamente pelo sistema.

---

## ✅ Checklist Final

Antes de considerar a migração completa, verifique:

- [ ] Todas as sessões históricas foram registradas
- [ ] Dados validados (contadores, datas, protocolos)
- [ ] Status dos pacientes atualizados corretamente
- [ ] Observações importantes foram registradas
- [ ] Equipe treinada e confortável com o processo
- [ ] Documentação de suporte disponível

---

## 📞 Suporte

Para dúvidas ou problemas durante a migração:

- **Email**: [definir email de suporte]
- **Telefone**: [definir telefone de suporte]
- **Horário**: [definir horário de atendimento]

---

**Última atualização:** 27 de Novembro de 2025  
**Versão do documento:** 1.0

