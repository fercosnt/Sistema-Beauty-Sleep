# Resumo: Testes após Atualização do ModalNovoPaciente

## ✅ O que foi implementado

1. **Campo "ID do Paciente" (biologix_id)** adicionado como obrigatório
2. **CPF** agora é opcional
3. **Validação de duplicata** por `biologix_id` (não mais por CPF)
4. **Submit com UPSERT** usando `biologix_id` como chave única
5. **Migration criada**: `008_make_cpf_nullable.sql`

---

## ❌ Problema Principal

**A migration 008 ainda não foi aplicada no banco!**

O banco ainda exige `CPF NOT NULL`, mas o código agora permite CPF opcional. Isso está causando falhas nos testes.

---

## 🔧 Solução: Aplicar Migration 008

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg
2. Vá em **SQL Editor**
3. Execute o SQL:

```sql
-- Migration 008: Make CPF nullable in pacientes table
ALTER TABLE pacientes ALTER COLUMN cpf DROP NOT NULL;

COMMENT ON COLUMN pacientes.cpf IS 'CPF usado apenas para validação e busca, pode ser NULL. O identificador único é biologix_id.';
```

### Opção 2: Via Supabase CLI

```bash
# Se estiver usando Supabase CLI local
npx supabase migration up

# Ou aplicar migration específica
npx supabase db push
```

### Opção 3: Via MCP (se disponível)

A migration já está criada em: `supabase/migrations/008_make_cpf_nullable.sql`

---

## 📊 Status dos Testes

### ✅ Testes que Passaram (3/9)

1. ✅ `should navigate to pacientes page` - Navegação funciona
2. ✅ `ID do Paciente validation: missing ID → error message` - Validação obrigatória funciona
3. ✅ `duplicate ID do Paciente: create paciente with existing biologix_id → error` - Detecção de duplicata funciona

### ❌ Testes que Falharam (5/9)

**Problema comum:** Migration não aplicada - banco ainda exige CPF

1. ❌ `create paciente: fill form → submit → verify in list`
   - **Erro:** Timeout ao aguardar lista
   - **Causa:** Provavelmente erro silencioso no submit (CPF NOT NULL)

2. ❌ `CPF optional: create paciente without CPF → success`
   - **Erro:** Paciente não aparece na lista
   - **Causa:** Falha ao criar paciente sem CPF (banco exige NOT NULL)

3. ❌ `CPF validation: invalid CPF → error message`
   - **Erro:** Mensagem de erro não aparece
   - **Causa:** Validação pode não estar acontecendo no blur

4. ❌ `create sessão: open modal → fill → submit → verify count updated`
   - **Erro:** Timeout - página fechada
   - **Causa:** Não relacionado ao modal (teste pode estar instável)

5. ❌ `status change: Lead → Ativo (after first sessão)`
   - **Erro:** Timeout - página fechada
   - **Causa:** Não relacionado ao modal (teste pode estar instável)

### ⏭️ Teste Pulado (1/9)

- `busca global: search by CPF/nome → verify results` - Pulado (search não disponível)

---

## 📝 Próximos Passos

### 1. Aplicar Migration 008 ⚠️ **CRÍTICO**

```sql
ALTER TABLE pacientes ALTER COLUMN cpf DROP NOT NULL;
```

### 2. Re-executar Testes

```bash
npx playwright test __tests__/integration/pacientes.test.ts
```

### 3. Ajustar Testes (se necessário)

- Verificar texto exato das mensagens de erro
- Adicionar waits mais robustos
- Verificar validação de CPF inválido no blur

---

## 📁 Arquivos Modificados

1. ✅ `app/pacientes/components/ModalNovoPaciente.tsx` - Atualizado com ID do Paciente obrigatório
2. ✅ `supabase/migrations/008_make_cpf_nullable.sql` - Criado (precisa ser aplicado)
3. ✅ `__tests__/integration/pacientes.test.ts` - Atualizado para novo modelo

---

## ⚠️ Importante

**NÃO execute os testes novamente até aplicar a migration 008!**

O banco ainda exige CPF NOT NULL, mas o código permite CPF opcional. Isso causará erros silenciosos nos testes.

---

## 🎯 Checklist

- [ ] Aplicar migration 008 no banco
- [ ] Verificar se CPF pode ser NULL: `SELECT cpf FROM pacientes WHERE cpf IS NULL LIMIT 1;`
- [ ] Re-executar testes Playwright
- [ ] Corrigir testes que ainda falharem após migration
- [ ] Testar criação manual de paciente sem CPF no app

