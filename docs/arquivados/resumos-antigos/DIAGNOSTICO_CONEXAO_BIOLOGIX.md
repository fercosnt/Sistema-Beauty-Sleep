# Diagnóstico: Conexão com API Biologix

**Data:** 2025-12-02  
**Objetivo:** Verificar se a base de dados está atualizada e se a sincronização está funcionando corretamente

---

## 📊 Status Atual

### Última Sincronização
- **Última execução:** 2025-12-02 13:00:05 UTC (10h BRT)
- **Status:** ✅ 200 OK
- **Tempo de execução:** ~10.8 segundos

### Dados no Banco

#### Exames
- **Total de exames:** 2,547
- **Exames sincronizados recentemente (últimos 7 dias):** 25 exames
- **Último exame sincronizado:** 2025-12-02

#### Distribuição por Dia
| Data | Total Exames | Pacientes Únicos | Exames Únicos |
|------|--------------|------------------|---------------|
| 2025-12-02 | 3 | 3 | 3 |
| 2025-12-01 | 3 | 3 | 3 |
| 2025-11-30 | 5 | 5 | 5 |
| 2025-11-29 | 4 | 4 | 4 |
| 2025-11-28 | 9 | 9 | 9 |
| 2025-11-27 | 1 | 1 | 1 |
| 2025-11-26 | 2,522 | 268 | 2,522 |

**Observação:** 2025-11-26 foi a migração inicial do Airtable (2,522 exames).

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. Edge Function não está usando `biologix_id` corretamente

**Problema:**
A Edge Function `sync-biologix` está vinculando pacientes apenas por CPF, mas deveria usar `biologix_id` (ID do Paciente) primeiro, e só usar CPF como fallback.

**Código atual (INCORRETO):**
```typescript
// Linha 145-149 em supabase/functions/sync-biologix/index.ts
const { data: existingPaciente } = await supabase
  .from('pacientes')
  .select('id')
  .eq('cpf', cpf)  // ❌ Só busca por CPF
  .single();
```

**Deveria ser:**
```typescript
// 1. Tentar buscar por biologix_id primeiro (exam.patientUserId)
// 2. Se não encontrar, tentar por CPF
// 3. Se não encontrar, criar novo paciente
```

**Impacto:**
- Pacientes criados pela Edge Function não têm `biologix_id` preenchido
- Risco de duplicação se mesmo paciente vier com CPF diferente
- Dados podem estar desatualizados se paciente foi atualizado na Biologix mas não no nosso sistema

### 2. Pacientes sem `biologix_id`

**Encontrado:**
- 1 paciente criado pela Edge Function sem `biologix_id`:
  - Nome: [Paciente Exemplo]
  - CPF: [CPF fictício para exemplo]
  - Status: lead
  - Criado: 2025-11-28 13:00:06

**Solução necessária:**
Atualizar a Edge Function para salvar `biologix_id` quando criar novos pacientes.

### 3. Limitação atual: apenas 100 exames por sincronização

**Problema:**
A Edge Function busca apenas os primeiros 100 exames da API (linha 118):
```typescript
const examsResponse = await retryWithBackoff(() => biologixClient.getExams(0, 100));
```

**Impacto:**
- Se houver mais de 100 exames novos, alguns podem não ser sincronizados imediatamente
- A sincronização precisa rodar múltiplas vezes para processar todos os exames

**Solução:**
Implementar paginação automática ou aumentar o limite (verificar com Biologix qual é o limite máximo).

---

## ✅ Funcionalidades que Estão Funcionando

1. ✅ Autenticação com API Biologix
2. ✅ Busca de exames
3. ✅ Sincronização diária automática (cron job)
4. ✅ Criação de pacientes quando não existem
5. ✅ Criação/atualização de exames
6. ✅ Cálculo de score_ronco
7. ✅ Cálculo de IMC (via trigger)

---

## 🔧 Correções Necessárias

### Prioridade ALTA

1. **Corrigir vinculação de pacientes para usar `biologix_id`**
   - Arquivo: `supabase/functions/sync-biologix/index.ts`
   - Linhas: 142-175
   - Ação: Buscar por `biologix_id` primeiro, depois CPF como fallback

2. **Salvar `biologix_id` ao criar novos pacientes**
   - Arquivo: `supabase/functions/sync-biologix/index.ts`
   - Linha: 155-167
   - Ação: Incluir `biologix_id: exam.patientUserId` no INSERT

### Prioridade MÉDIA

3. **Implementar paginação completa**
   - Arquivo: `supabase/functions/sync-biologix/index.ts`
   - Linha: 118
   - Ação: Usar `getAllDoneExams()` ou implementar paginação manual

4. **Atualizar pacientes existentes sem `biologix_id`**
   - Script de migração necessário
   - Ação: Buscar na API Biologix e atualizar pacientes sem `biologix_id`

---

## 📝 Estrutura dos Dados da API Biologix

### ExamDto
```typescript
{
  examId: string;              // ID único do exame
  examKey: string;             // Chave do exame (usado para PDF)
  status: number;              // 6 = DONE
  type: number;                // 0 = Ronco, 1 = Sono
  patientUserId: string;       // ⭐ Este é o biologix_id do paciente!
  patient: {
    name: string;
    username: string;          // Contém CPF
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
  };
  base: {
    startTime: string;
    weightKg?: number;
    heightCm?: number;
  };
  result: {
    snoring?: {...};
    oximetry?: {...};
  };
}
```

**Importante:** `exam.patientUserId` é o `biologix_id` que devemos usar para vincular pacientes!

---

## 🧪 Testes Realizados

### ✅ Teste 1: Última Sincronização
- Status: ✅ Sucesso
- Data: 2025-12-02 13:00:05
- Resultado: 3 novos exames sincronizados

### ✅ Teste 2: Dados no Banco
- Total de exames: 2,547 ✅
- Total de pacientes: 268 ✅
- Exames vinculados: 100% ✅

### ⚠️ Teste 3: Pacientes sem biologix_id
- Encontrado: 1 paciente sem `biologix_id`
- Ação necessária: Corrigir Edge Function

---

## 🎯 Próximos Passos

1. **Imediato:**
   - [ ] Corrigir Edge Function para usar `biologix_id` primeiro
   - [ ] Salvar `biologix_id` ao criar novos pacientes
   - [ ] Testar sincronização manual

2. **Curto prazo:**
   - [ ] Implementar paginação completa
   - [ ] Criar script para atualizar pacientes sem `biologix_id`
   - [ ] Adicionar logs mais detalhados

3. **Médio prazo:**
   - [ ] Monitoramento de sincronização
   - [ ] Dashboard de status de sincronização
   - [ ] Alertas quando sincronização falhar

---

## 📞 Contato

Se encontrar problemas, verificar:
1. Logs da Edge Function no Supabase Dashboard
2. Cron job status no Supabase Dashboard
3. Secrets do Supabase (BIOLOGIX_USERNAME, BIOLOGIX_PASSWORD, etc.)

---

**Última atualização:** 2025-12-02

