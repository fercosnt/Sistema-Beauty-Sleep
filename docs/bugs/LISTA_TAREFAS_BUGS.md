# ✅ Lista de Tarefas de Bugs - Priorizada

## 9.6.2 - Create task list of bugs (prioritize: critical, high, medium, low)

**Data:** 2025-12-02  
**Status:** ✅ Lista criada e priorizada

---

## 🔴 Prioridade CRÍTICA (Bloqueadores - Corrigir Imediatamente)

### [ ] TASK-001: Adicionar campo ID do Paciente (biologix_id) no ModalNovoPaciente
**Bug:** BUG-002  
**Arquivo:** `app/pacientes/components/ModalNovoPaciente.tsx`

**Descrição:**
- Adicionar campo "ID do Paciente" (biologix_id) no formulário
- Marcar como obrigatório
- Adicionar validação de unicidade
- Adicionar mensagem de erro clara

**Critério de Aceitação:**
- [ ] Campo aparece no formulário
- [ ] Validação de obrigatório funciona
- [ ] Validação de unicidade funciona
- [ ] Teste de integração passa
- [ ] Usuário vê mensagem de erro clara

**Estimativa:** 2-3 horas  
**Prioridade:** 🔴 **CRÍTICA**

---

## 🟠 Prioridade ALTA (Corrigir nas Próximas 2 Semanas)

### [ ] TASK-002: Melhorar validação de CPF - Mensagens de erro mais claras
**Bug:** BUG-003  
**Arquivo:** `app/pacientes/components/ModalNovoPaciente.tsx`

**Descrição:**
- Melhorar visibilidade de mensagens de erro de CPF
- Adicionar validação em tempo real
- Melhorar feedback visual

**Critério de Aceitação:**
- [ ] Mensagem de erro é claramente visível
- [ ] Validação acontece em tempo real
- [ ] Feedback visual é claro
- [ ] Testes passam

**Estimativa:** 1-2 horas  
**Prioridade:** 🟠 **ALTA**

---

### [ ] TASK-003: Setup automático de usuários de teste nos testes E2E
**Bug:** BUG-004  
**Arquivo:** `__tests__/e2e/permissions.spec.ts`

**Descrição:**
- Adicionar criação automática de usuários de teste no `beforeAll`
- Criar usuários se não existirem
- Cleanup após testes no `afterAll`

**Critério de Aceitação:**
- [ ] Usuários são criados automaticamente
- [ ] Testes podem ser executados sem setup manual
- [ ] Cleanup funciona corretamente
- [ ] Testes passam consistentemente

**Estimativa:** 1-2 horas  
**Prioridade:** 🟠 **ALTA**

---

### [ ] TASK-004: Melhorar tratamento de erro quando página fecha no E2E
**Bug:** BUG-005  
**Arquivo:** `__tests__/e2e/complete-flow.spec.ts`

**Descrição:**
- Melhorar tratamento de erro quando página fecha
- Adicionar retry logic
- Melhorar timeouts

**Critério de Aceitação:**
- [ ] Testes são mais robustos
- [ ] Retry funciona quando necessário
- [ ] Timeouts são otimizados
- [ ] Menos falsos positivos/negativos

**Estimativa:** 2-3 horas  
**Prioridade:** 🟠 **ALTA**

---

### [ ] TASK-005: Melhorar sincronização UI-banco para status "finalizado"
**Bug:** BUG-006  
**Arquivos:** `__tests__/e2e/complete-flow.spec.ts`, `app/pacientes/[id]/page.tsx`

**Descrição:**
- Melhorar sincronização entre UI e banco de dados
- Adicionar polling para atualização de status
- Melhorar feedback visual

**Critério de Aceitação:**
- [ ] Status atualiza corretamente na UI
- [ ] Sincronização é consistente
- [ ] Feedback visual é claro
- [ ] Testes passam

**Estimativa:** 2-3 horas  
**Prioridade:** 🟠 **ALTA**

---

## 🟡 Prioridade MÉDIA (Documentar para Pós-Lançamento)

### [ ] TASK-006: Documentar requisitos de variáveis de ambiente para testes
**Bug:** BUG-007  
**Arquivo:** `README.md` ou `docs/TESTING.md`

**Descrição:**
- Documentar todas as variáveis de ambiente necessárias
- Adicionar valores padrão para desenvolvimento
- Melhorar mensagens de erro

**Estimativa:** 1 hora  
**Prioridade:** 🟡 **MÉDIA**  
**Status:** 📝 Documentar

---

### [ ] TASK-007: Padronizar mensagens de erro de duplicação
**Bug:** BUG-008  
**Arquivo:** `app/pacientes/components/ModalNovoPaciente.tsx`

**Descrição:**
- Padronizar mensagens de erro de duplicação
- Melhorar feedback visual
- Adicionar sugestões de correção

**Estimativa:** 1-2 horas  
**Prioridade:** 🟡 **MÉDIA**  
**Status:** 📝 Para pós-lançamento

---

### [ ] TASK-008: Expandir cobertura de testes de permissões
**Bug:** BUG-009  
**Arquivo:** `__tests__/e2e/permissions.spec.ts`

**Descrição:**
- Adicionar mais cenários de teste
- Melhorar assertions
- Testar casos edge

**Estimativa:** 3-4 horas  
**Prioridade:** 🟡 **MÉDIA**  
**Status:** 📝 Para pós-lançamento

---

### [ ] TASK-009: Revisar e garantir ocultação completa de valores no dashboard Recepção
**Bug:** BUG-010  
**Arquivos:** `app/dashboard/components/*.tsx`

**Descrição:**
- Revisar todos os componentes do dashboard
- Garantir que todos os valores numéricos sejam ocultos para Recepção
- Adicionar testes mais abrangentes

**Estimativa:** 2-3 horas  
**Prioridade:** 🟡 **MÉDIA**  
**Status:** 📝 Para pós-lançamento

---

## 🟢 Prioridade BAIXA (Backlog)

### [ ] TASK-010: Melhorar mensagens de erro em testes
**Bug:** BUG-011  
**Arquivos:** `__tests__/**/*.spec.ts`

**Descrição:**
- Tornar mensagens de erro mais descritivas
- Facilitar debug

**Estimativa:** 2-3 horas  
**Prioridade:** 🟢 **BAIXA**  
**Status:** 📝 Backlog

---

### [ ] TASK-011: Otimizar timeouts em testes
**Bug:** BUG-012  
**Arquivos:** `__tests__/**/*.spec.ts`

**Descrição:**
- Otimizar timeouts para execução mais rápida
- Manter estabilidade

**Estimativa:** 1-2 horas  
**Prioridade:** 🟢 **BAIXA**  
**Status:** 📝 Backlog

---

## 📊 Resumo de Tarefas

### Por Prioridade:
- 🔴 **Crítica:** 1 tarefa
- 🟠 **Alta:** 4 tarefas
- 🟡 **Média:** 4 tarefas (documentar para pós-lançamento)
- 🟢 **Baixa:** 2 tarefas (backlog)

### Por Status:
- 🔴 **Pendente (Corrigir agora):** 5 tarefas
- 📝 **Documentar para depois:** 4 tarefas
- 📝 **Backlog:** 2 tarefas

### Total de Horas Estimadas:
- Crítica + Alta: ~10-13 horas
- Média: ~7-9 horas (pós-lançamento)
- Baixa: ~3-5 horas (backlog)

---

## ✅ Próximos Passos

1. **Corrigir TASK-001 (Crítica)** - Campo ID do Paciente
2. **Corrigir TASK-002 a TASK-005 (Alta)** - Melhorias importantes
3. **Documentar TASK-006 a TASK-009** - Para pós-lançamento
4. **Re-executar todos os testes** - Após correções

---

**Lista criada em:** 2025-12-02  
**Próxima atualização:** Após correções

