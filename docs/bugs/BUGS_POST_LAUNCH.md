# 📋 Bugs Médios e Baixos - Para Correção Pós-Lançamento

## 9.6.5 - Document medium/low bugs for post-launch fixes

**Data:** 2025-12-02  
**Status:** ✅ Documentado

---

## 🟡 Bugs de MÉDIA PRIORIDADE

### BUG-007: Documentar requisitos de variáveis de ambiente para testes
**Prioridade:** 🟡 Média  
**Status:** 📝 Documentar

**Descrição:**
- Melhorar documentação sobre variáveis de ambiente necessárias
- Adicionar valores padrão para desenvolvimento
- Criar guia de configuração

**Arquivo:** Criar `docs/TESTING.md` ou adicionar ao `README.md`

**Estimativa:** 1 hora

---

### BUG-008: Padronizar mensagens de erro de duplicação
**Prioridade:** 🟡 Média  
**Status:** 📝 Para pós-lançamento

**Descrição:**
- Padronizar todas as mensagens de erro de duplicação
- Melhorar feedback visual
- Adicionar sugestões de correção

**Arquivo:** `app/pacientes/components/ModalNovoPaciente.tsx`

**Estimativa:** 1-2 horas

---

### BUG-009: Expandir cobertura de testes de permissões
**Prioridade:** 🟡 Média  
**Status:** 📝 Para pós-lançamento

**Descrição:**
- Adicionar mais cenários de teste
- Testar casos edge
- Melhorar assertions

**Arquivo:** `__tests__/e2e/permissions.spec.ts`

**Estimativa:** 3-4 horas

---

### BUG-010: Revisar ocultação completa de valores no dashboard Recepção
**Prioridade:** 🟡 Média  
**Status:** 📝 Para pós-lançamento

**Descrição:**
- Revisar todos os componentes do dashboard
- Garantir que todos os valores numéricos sejam ocultos
- Adicionar testes mais abrangentes

**Arquivos:** `app/dashboard/components/*.tsx`

**Estimativa:** 2-3 horas

---

## 🟢 Bugs de BAIXA PRIORIDADE (Backlog)

### BUG-011: Melhorar mensagens de erro em testes
**Prioridade:** 🟢 Baixa  
**Status:** 📝 Backlog

**Descrição:**
- Tornar mensagens de erro mais descritivas
- Facilitar debug de testes

**Arquivos:** `__tests__/**/*.spec.ts`

**Estimativa:** 2-3 horas

---

### BUG-012: Otimizar timeouts em testes
**Prioridade:** 🟢 Baixa  
**Status:** 📝 Backlog

**Descrição:**
- Otimizar timeouts para execução mais rápida
- Manter estabilidade dos testes

**Arquivos:** `__tests__/**/*.spec.ts`

**Estimativa:** 1-2 horas

---

## 📊 Resumo

**Total documentado:** 6 bugs  
**Média prioridade:** 4 bugs  
**Baixa prioridade:** 2 bugs

**Total estimado:** ~10-15 horas de trabalho

---

**Documentação criada em:** 2025-12-02  
**Revisar após lançamento:** [Data]

