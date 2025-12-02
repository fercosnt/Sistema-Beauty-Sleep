# 🐛 Revisão Completa de Bugs Encontrados nos Testes

## 9.6.1 - Review all bugs found in tests (9.1-9.5)

**Data:** 2025-12-02  
**Status:** ✅ Revisão completa realizada

---

## 📊 Resumo Executivo

**Total de bugs identificados:** 12  
**Bugs críticos:** 2  
**Bugs de alta prioridade:** 4  
**Bugs de média prioridade:** 4  
**Bugs de baixa prioridade:** 2

---

## 🔴 Bugs CRÍTICOS (Bloqueadores para Produção)

### BUG-001: SMTP não configurado - Emails não são enviados
**Status:** 🟡 Conhecido, não crítico para produção inicial  
**Encontrado em:** Tasks 7.1.8

**Descrição:**
- Emails de convite/reset de senha não são enviados automaticamente
- Código implementado, mas depende de configuração SMTP no Supabase
- Em desenvolvimento local: emails capturados pelo Inbucket
- Em produção: requer configuração de servidor SMTP

**Impacto:**
- Usuários não recebem emails de convite
- Reset de senha não funciona automaticamente
- Workaround: Admin pode criar senha manualmente

**Solução:**
- ⚠️ **Ação necessária:** Configurar SMTP no Supabase Dashboard
- Documentado em: `GUIA_CONFIGURACAO_SUPABASE_AUTH.md`
- **Esforço:** Baixo (configuração, não código)

**Prioridade:** 🟡 Média (não bloqueia, mas importante para UX)

---

### BUG-002: ModalNovoPaciente falta campo ID do Paciente (biologix_id)
**Status:** 🔴 **CRÍTICO - BLOQUEADOR**  
**Encontrado em:** Tasks 9.2.9, 9.2.10

**Descrição:**
- O modal de criar paciente não tem o campo "ID do Paciente" (biologix_id)
- Testes de integração esperam este campo
- Sistema requer biologix_id como chave única
- Teste `ID do Paciente validation: missing ID → error message` requer este campo

**Impacto:**
- Usuários não podem criar pacientes corretamente
- Sistema pode gerar conflitos de ID
- Testes de integração falham

**Arquivo:** `app/pacientes/components/ModalNovoPaciente.tsx`  
**Solução necessária:**
- Adicionar campo `biologix_id` no formulário
- Adicionar validação de obrigatório
- Adicionar validação de unicidade

**Prioridade:** 🔴 **CRÍTICA - CORRIGIR IMEDIATAMENTE**

---

## 🟠 Bugs de ALTA PRIORIDADE (Problemas Maiores)

### BUG-003: Validação de CPF pode não mostrar mensagem de erro claramente
**Status:** 🟠 Alta prioridade  
**Encontrado em:** Tasks 9.2.9

**Descrição:**
- Teste de validação de CPF tenta múltiplos selectors
- Mensagem de erro pode não estar visível
- Validação funciona, mas UX pode melhorar

**Impacto:**
- Usuários podem não ver mensagens de erro claramente
- Dificulta correção de erros de preenchimento

**Arquivo:** `app/pacientes/components/ModalNovoPaciente.tsx`  
**Solução necessária:**
- Melhorar visibilidade de mensagens de erro
- Adicionar validação em tempo real
- Melhorar feedback visual

**Prioridade:** 🟠 **ALTA**

---

### BUG-004: Testes podem falhar se usuários de teste não existirem
**Status:** 🟠 Alta prioridade  
**Encontrado em:** Tasks 9.4.1-9.4.8

**Descrição:**
- Testes de permissões requerem usuários de teste específicos
- Se usuários não existirem, testes falham
- Requer execução manual do script `create-test-users.ts`

**Impacto:**
- Testes não podem ser executados automaticamente
- Pode causar falhas em CI/CD

**Arquivo:** `__tests__/e2e/permissions.spec.ts`  
**Solução necessária:**
- Adicionar setup automático no `beforeAll`
- Criar usuários de teste automaticamente se não existirem
- Cleanup após testes

**Prioridade:** 🟠 **ALTA**

---

### BUG-005: Testes E2E podem falhar se página fechar inesperadamente
**Status:** 🟠 Alta prioridade  
**Encontrado em:** Tasks 9.3.4

**Descrição:**
- Teste E2E completo pode falhar se página fechar
- Múltiplos reloads podem causar problemas
- Já foram aplicadas correções, mas podem ocorrer casos edge

**Impacto:**
- Testes podem ser instáveis
- Falsos positivos/negativos

**Arquivo:** `__tests__/e2e/complete-flow.spec.ts`  
**Solução necessária:**
- Melhorar tratamento de erro
- Adicionar retry logic
- Melhorar timeouts

**Prioridade:** 🟠 **ALTA**

---

### BUG-006: Verificação de status "finalizado" pode ser inconsistente
**Status:** 🟠 Alta prioridade  
**Encontrado em:** Tasks 9.3.4

**Descrição:**
- Teste verifica status visual e no banco
- Pode haver inconsistência entre UI e banco
- Verificação atual depende de select value

**Impacto:**
- Testes podem falhar inconsistentemente
- Status pode não atualizar corretamente na UI

**Arquivo:** `__tests__/e2e/complete-flow.spec.ts`, `app/pacientes/[id]/page.tsx`  
**Solução necessária:**
- Melhorar sincronização UI-banco
- Adicionar polling para atualização
- Melhorar feedback visual

**Prioridade:** 🟠 **ALTA**

---

## 🟡 Bugs de MÉDIA PRIORIDADE

### BUG-007: Testes de integração requerem variáveis de ambiente específicas
**Status:** 🟡 Média prioridade  
**Encontrado em:** Tasks 9.2.14

**Descrição:**
- Testes requerem `TEST_USER_EMAIL` e `TEST_USER_PASSWORD`
- Sem variáveis, testes são pulados
- Pode causar confusão

**Impacto:**
- Testes não executam automaticamente
- Desenvolvedores podem não saber configurar

**Solução necessária:**
- Documentar melhor requisitos
- Adicionar valores padrão para desenvolvimento
- Melhorar mensagens de erro

**Prioridade:** 🟡 **MÉDIA**

---

### BUG-008: Validação de duplicação de ID do Paciente pode não mostrar erro claro
**Status:** 🟡 Média prioridade  
**Encontrado em:** Tasks 9.2.10

**Descrição:**
- Teste busca múltiplos padrões de mensagem de erro
- Mensagem pode não ser clara para usuário

**Impacto:**
- UX pode melhorar
- Usuários podem não entender o erro

**Solução necessária:**
- Padronizar mensagens de erro
- Melhorar feedback visual
- Adicionar sugestões de correção

**Prioridade:** 🟡 **MÉDIA**

---

### BUG-009: Testes de permissões podem não verificar todos os cenários
**Status:** 🟡 Média prioridade  
**Encontrado em:** Tasks 9.4

**Descrição:**
- Alguns testes de permissões podem não cobrir todos os casos
- Recepção pode precisar de mais testes

**Impacto:**
- Cobertura de testes pode melhorar
- Alguns bugs podem passar despercebidos

**Solução necessária:**
- Expandir cobertura de testes
- Adicionar mais cenários
- Melhorar assertions

**Prioridade:** 🟡 **MÉDIA**

---

### BUG-010: Dashboard para Recepção pode não ocultar todos os valores numéricos
**Status:** 🟡 Média prioridade  
**Encontrado em:** Tasks 9.4.4

**Descrição:**
- Teste verifica se valores mostram "--"
- Pode haver valores que não foram ocultos
- Verificação pode ser incompleta

**Impacto:**
- Recepção pode ver informações que não deveria
- Segurança de dados pode estar comprometida

**Solução necessária:**
- Revisar todos os componentes do dashboard
- Garantir que todos os valores numéricos sejam ocultos
- Adicionar testes mais abrangentes

**Prioridade:** 🟡 **MÉDIA**

---

## 🟢 Bugs de BAIXA PRIORIDADE

### BUG-011: Mensagens de erro em testes podem ser melhoradas
**Status:** 🟢 Baixa prioridade  
**Encontrado em:** Vários testes

**Descrição:**
- Mensagens de erro nos testes podem ser mais descritivas
- Podem ajudar no debug

**Impacto:**
- Facilita debug de testes
- Melhora experiência de desenvolvedores

**Prioridade:** 🟢 **BAIXA**

---

### BUG-012: Timeouts em testes podem ser otimizados
**Status:** 🟢 Baixa prioridade  
**Encontrado em:** Tasks 9.3.4

**Descrição:**
- Alguns timeouts podem ser muito longos
- Podem ser otimizados para execução mais rápida

**Impacto:**
- Testes podem executar mais rápido
- Melhora experiência de desenvolvedores

**Prioridade:** 🟢 **BAIXA**

---

## 📋 Tabela de Priorização

| ID | Título | Impacto | Esforço | Frequência | Prioridade | Status |
|----|--------|---------|---------|------------|------------|--------|
| BUG-001 | SMTP não configurado | Médio | Baixo | 1/1 | Média | ⚠️ Documentado |
| BUG-002 | Falta campo ID Paciente | **Alto** | Médio | 2/2 | **Crítica** | 🔴 **Pendente** |
| BUG-003 | Validação CPF pouco clara | Alto | Baixo | 1/1 | Alta | 🟠 Pendente |
| BUG-004 | Usuários teste não criados | Alto | Baixo | 1/1 | Alta | 🟠 Pendente |
| BUG-005 | Página fecha inesperadamente | Alto | Médio | 3/3 | Alta | 🟠 Melhorar |
| BUG-006 | Status inconsistente | Alto | Médio | 2/2 | Alta | 🟠 Melhorar |
| BUG-007 | Variáveis env necessárias | Médio | Baixo | 1/1 | Média | 🟡 Pendente |
| BUG-008 | Erro duplicação pouco claro | Médio | Baixo | 1/1 | Média | 🟡 Pendente |
| BUG-009 | Cobertura testes incompleta | Médio | Médio | 1/1 | Média | 🟡 Pendente |
| BUG-010 | Dashboard recepção incompleto | Médio | Médio | 1/1 | Média | 🟡 Verificar |
| BUG-011 | Mensagens erro melhorar | Baixo | Baixo | Vários | Baixa | 🟢 Backlog |
| BUG-012 | Timeouts otimizar | Baixo | Baixo | Vários | Baixa | 🟢 Backlog |

---

## ✅ Próximos Passos

1. **Corrigir BUG-002 (Crítico)** - Adicionar campo ID do Paciente
2. **Corrigir BUG-003, BUG-004 (Alta)** - Melhorar validações e setup
3. **Documentar BUG-007 a BUG-012** - Para correções pós-lançamento
4. **Re-executar todos os testes** - Após correções

---

**Revisão concluída em:** 2025-12-02  
**Próxima atualização:** Após correções

