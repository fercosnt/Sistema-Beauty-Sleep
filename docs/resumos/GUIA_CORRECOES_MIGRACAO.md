# 🔧 Guia de Correções e Ajustes - Migração de Sessões

**Versão:** 1.0  
**Data:** 27 de Novembro de 2025  
**Objetivo:** Orientar a correção de problemas identificados durante a validação da migração

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Identificação de Causa Raiz](#identificação-de-causa-raiz)
3. [Correção de Bugs do Sistema](#correção-de-bugs-do-sistema)
4. [Correção de Erros de Dados](#correção-de-erros-de-dados)
5. [Processo Iterativo de Validação](#processo-iterativo-de-validação)
6. [Checklist de Correção](#checklist-de-correção)

---

## 🎯 Visão Geral

Este guia estabelece o processo para corrigir problemas identificados durante a validação da migração de sessões (tarefa 8.3). O objetivo é garantir que todos os dados estejam 100% corretos antes de considerar a migração completa.

### Fluxo de Correção

```
Validação (8.3) → Identificar Problemas → Diagnosticar Causa → Corrigir → Re-validar → Repetir até 100%
```

---

## 🔍 Identificação de Causa Raiz (8.4.1)

### Tipos de Problemas

#### 1. Erro do Usuário

**Características:**
- ✅ Dados inseridos incorretamente (contadores trocados, data errada)
- ✅ Protocolo selecionado incorretamente
- ✅ Observações com informações incorretas

**Indicadores:**
- Problema isolado em poucas sessões
- Padrão inconsistente (alguns usuários têm mais erros)
- Dados parecem corretos mas estão errados

**Exemplos:**
- Contador final menor que inicial (erro de digitação)
- Data futura (erro ao selecionar data)
- Protocolo não corresponde ao tratamento realizado

#### 2. Bug do Sistema

**Características:**
- ✅ Problema sistemático (afeta múltiplas sessões)
- ✅ Dados corretos inseridos mas salvos incorretamente
- ✅ Cálculos automáticos incorretos
- ✅ Validações não funcionando

**Indicadores:**
- Problema afeta muitas sessões de forma consistente
- Todos os usuários têm o mesmo problema
- Dados parecem corretos mas sistema não processa corretamente

**Exemplos:**
- `sessoes_utilizadas` não atualiza após criar sessão (trigger não funciona)
- Disponíveis calculado incorretamente (fórmula errada)
- Validação não impede contador final <= inicial

### Processo de Diagnóstico

#### Passo 1: Analisar Relatório de Validação

1. Abrir relatório gerado em `scripts/data/validation/sessions-validation-report-[timestamp].md`
2. Identificar quais verificações falharam
3. Analisar detalhes de cada falha

#### Passo 2: Classificar Problemas

Para cada problema encontrado:

**Perguntas a fazer:**
- Quantas sessões/pacientes são afetados?
- O problema é consistente ou isolado?
- Todos os usuários têm o mesmo problema?
- Os dados inseridos parecem corretos?

**Classificação:**
- **Erro do Usuário**: Poucos casos, isolados, inconsistente entre usuários
- **Bug do Sistema**: Muitos casos, consistente, afeta todos os usuários

#### Passo 3: Documentar Causa Raiz

Criar documento com:
- Problema identificado
- Classificação (erro do usuário / bug do sistema)
- Evidências (quantidade afetada, padrão)
- Causa raiz identificada

**Template:**
```markdown
## Problema: [Descrição]

**Classificação:** Erro do Usuário / Bug do Sistema

**Evidências:**
- Quantidade afetada: [X] sessões/pacientes
- Padrão: [Descrição]
- Usuários afetados: [Lista]

**Causa Raiz:**
[Explicação detalhada]

**Ação Corretiva:**
[Plano de correção]
```

---

## 🐛 Correção de Bugs do Sistema (8.4.2)

### Processo de Correção

#### 1. Identificar o Bug

**Bugs Comuns:**

**Bug 1: Trigger não atualiza `sessoes_utilizadas`**
- **Sintoma**: Campo `sessoes_utilizadas` não muda após criar sessão
- **Causa**: Trigger `atualizar_sessoes_utilizadas` não está ativo ou tem erro
- **Verificação**:
  ```sql
  -- Verificar se trigger existe e está ativo
  SELECT 
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
  FROM information_schema.triggers
  WHERE trigger_name = 'atualizar_sessoes_utilizadas';
  ```

**Bug 2: Cálculo de disponíveis incorreto**
- **Sintoma**: `sessoes_disponiveis` negativo ou incorreto
- **Causa**: Fórmula incorreta ou campo não calculado
- **Verificação**:
  ```sql
  -- Verificar pacientes com disponíveis negativo
  SELECT 
    id,
    nome,
    sessoes_compradas,
    sessoes_adicionadas,
    sessoes_utilizadas,
    (sessoes_compradas + sessoes_adicionadas - sessoes_utilizadas) as disponiveis_calculado
  FROM pacientes
  WHERE (sessoes_compradas + sessoes_adicionadas - sessoes_utilizadas) < 0;
  ```

**Bug 3: Validação não funciona**
- **Sintoma**: Sessões com contador final <= inicial são criadas
- **Causa**: Validação no frontend não está funcionando ou foi bypassada
- **Verificação**: Verificar código do `ModalNovaSessao.tsx`

#### 2. Corrigir o Bug

**Para Triggers:**

1. Verificar trigger no banco:
   ```sql
   -- Ver definição do trigger
   SELECT pg_get_triggerdef(oid) 
   FROM pg_trigger 
   WHERE tgname = 'atualizar_sessoes_utilizadas';
   ```

2. Se trigger não existe ou está incorreto:
   - Criar/corrigir trigger em nova migration
   - Aplicar migration: `npx supabase db push`
   - Testar trigger criando uma sessão de teste

3. Recalcular dados afetados:
   ```sql
   -- Recalcular sessoes_utilizadas para todos os pacientes
   UPDATE pacientes p
   SET sessoes_utilizadas = (
     SELECT COUNT(*) FROM sessoes s WHERE s.paciente_id = p.id
   );
   ```

**Para Validações Frontend:**

1. Verificar código do componente (`ModalNovaSessao.tsx`)
2. Corrigir validação se necessário
3. Testar validação criando sessão de teste
4. Deploy da correção

**Para Cálculos:**

1. Verificar fórmula no código
2. Corrigir se necessário
3. Recalcular dados afetados via SQL ou script

#### 3. Testar Correção

1. Criar caso de teste que reproduz o bug
2. Verificar se bug foi corrigido
3. Verificar se não introduziu novos bugs
4. Executar validação novamente

#### 4. Documentar Correção

Criar migration ou commit com:
- Descrição do bug
- Causa raiz
- Correção aplicada
- Testes realizados

---

## ✏️ Correção de Erros de Dados (8.4.3)

### Processo de Correção

#### 1. Identificar Erros

Usar relatório de validação para identificar:
- Sessões com contador final <= inicial
- Sessões sem data
- Sessões com protocolo incorreto
- Pacientes com `sessoes_utilizadas` incorreto

#### 2. Priorizar Correções

**Prioridade Alta (Crítico):**
- Contador final <= inicial (afeta cálculos)
- Data faltante (afeta relatórios temporais)
- `sessoes_utilizadas` incorreto (afeta métricas)

**Prioridade Média:**
- Protocolo incorreto (afeta análises)
- Observações incorretas (afeta histórico)

#### 3. Corrigir Dados

**Opção 1: Correção Manual via Interface (Recomendado)**

1. Acessar perfil do paciente
2. Abrir aba "Sessões"
3. Clicar em "Editar" na sessão com erro
4. Corrigir dados
5. Salvar

**Opção 2: Correção via SQL (Admin apenas)**

⚠️ **Cuidado**: Use apenas se necessário e com backup!

**Exemplo: Corrigir contador final**
```sql
-- ATENÇÃO: Fazer backup antes!
-- Corrigir contador final de uma sessão específica
UPDATE sessoes
SET contador_pulsos_final = [valor_correto]
WHERE id = '[id_da_sessao]';
```

**Exemplo: Adicionar data faltante**
```sql
-- Adicionar data a sessão sem data
UPDATE sessoes
SET data_sessao = '[data_correta]'
WHERE data_sessao IS NULL AND id = '[id_da_sessao]';
```

**Exemplo: Recalcular sessoes_utilizadas**
```sql
-- Recalcular para um paciente específico
UPDATE pacientes
SET sessoes_utilizadas = (
  SELECT COUNT(*) FROM sessoes WHERE paciente_id = pacientes.id
)
WHERE id = '[id_do_paciente]';
```

#### 4. Verificar Correção

1. Verificar dados corrigidos no sistema
2. Confirmar que cálculo está correto
3. Marcar como corrigido no checklist

---

## 🔄 Processo Iterativo de Validação (8.4.4)

### Fluxo Completo

```
1. Executar Validação (8.3)
   ↓
2. Analisar Relatório
   ↓
3. Identificar Problemas
   ↓
4. Diagnosticar Causa Raiz (8.4.1)
   ↓
5. Corrigir Problemas (8.4.2 ou 8.4.3)
   ↓
6. Re-executar Validação (8.3)
   ↓
7. Verificar se 100% correto
   ↓
   ├─ Não → Voltar para passo 3
   └─ Sim → Migração Completa! ✅
```

### Critérios de Sucesso

**Validação 100% Correta:**
- ✅ Todas as 8 verificações passaram
- ✅ Taxa de sucesso: 100%
- ✅ Nenhum erro crítico
- ✅ Avisos mínimos (se houver, não bloqueiam)

### Número Máximo de Iterações

**Recomendação:** Máximo 3-5 iterações

Se após 5 iterações ainda houver problemas:
1. Revisar processo de migração
2. Identificar problemas sistemáticos
3. Considerar migração parcial e correção gradual

---

## ✅ Checklist de Correção

### Antes de Começar

- [ ] Relatório de validação gerado e analisado
- [ ] Problemas identificados e classificados
- [ ] Causa raiz documentada para cada problema
- [ ] Backup do banco de dados criado (se correção via SQL)

### Durante a Correção

- [ ] Bugs do sistema corrigidos e testados
- [ ] Erros de dados corrigidos (prioridade alta primeiro)
- [ ] Correções documentadas
- [ ] Testes realizados após cada correção

### Após Correção

- [ ] Validação re-executada
- [ ] Resultados comparados com validação anterior
- [ ] Progresso documentado
- [ ] Se 100% correto: Migração completa! ✅
- [ ] Se ainda houver problemas: Repetir processo

---

## 📊 Template de Acompanhamento

### Registro de Correções

```markdown
# Registro de Correções - Migração de Sessões

## Iteração 1 - [Data]

### Problemas Identificados
1. [Descrição] - [Classificação] - [Causa Raiz]
2. [Descrição] - [Classificação] - [Causa Raiz]

### Correções Aplicadas
1. [Descrição da correção]
2. [Descrição da correção]

### Resultado da Validação
- Taxa de sucesso: [X]%
- Problemas restantes: [Y]

## Iteração 2 - [Data]
[...]
```

---

## 🛠️ Ferramentas Úteis

### Queries SQL para Diagnóstico

**Verificar sessões com problemas:**
```sql
-- Sessões com contador final <= inicial
SELECT 
  s.id,
  p.nome as paciente,
  s.contador_pulsos_inicial,
  s.contador_pulsos_final,
  (s.contador_pulsos_final - s.contador_pulsos_inicial) as pulsos
FROM sessoes s
JOIN pacientes p ON p.id = s.paciente_id
WHERE s.contador_pulsos_final <= s.contador_pulsos_inicial;

-- Sessões sem data
SELECT 
  s.id,
  p.nome as paciente,
  s.created_at
FROM sessoes s
JOIN pacientes p ON p.id = s.paciente_id
WHERE s.data_sessao IS NULL;

-- Pacientes com sessoes_utilizadas incorreto
SELECT 
  p.id,
  p.nome,
  p.sessoes_utilizadas as campo,
  COUNT(s.id) as real
FROM pacientes p
LEFT JOIN sessoes s ON s.paciente_id = p.id
GROUP BY p.id, p.nome, p.sessoes_utilizadas
HAVING p.sessoes_utilizadas != COUNT(s.id);
```

### Scripts de Correção em Lote

**Recalcular todos os sessoes_utilizadas:**
```sql
-- ATENÇÃO: Fazer backup antes!
UPDATE pacientes p
SET sessoes_utilizadas = (
  SELECT COUNT(*) FROM sessoes s WHERE s.paciente_id = p.id
);
```

**Corrigir disponíveis negativos:**
```sql
-- Verificar pacientes com disponíveis negativo
SELECT 
  id,
  nome,
  sessoes_compradas,
  sessoes_adicionadas,
  sessoes_utilizadas,
  (sessoes_compradas + sessoes_adicionadas - sessoes_utilizadas) as disponiveis
FROM pacientes
WHERE (sessoes_compradas + sessoes_adicionadas - sessoes_utilizadas) < 0;

-- Ajustar sessoes_compradas ou sessoes_adicionadas conforme necessário
-- (Cada caso deve ser analisado individualmente)
```

---

## 📝 Exemplo de Fluxo Completo

### Cenário: Encontrados 5 outliers (contador final <= inicial)

**Passo 1: Identificar Causa Raiz (8.4.1)**
- Analisar relatório: 5 sessões afetadas
- Verificar padrão: Todas de usuários diferentes, datas diferentes
- Classificação: **Erro do Usuário** (isolado, inconsistente)

**Passo 2: Corrigir Dados (8.4.3)**
- Prioridade: Alta (afeta cálculos)
- Método: Correção manual via interface
- Para cada sessão:
  1. Acessar perfil do paciente
  2. Abrir sessão com erro
  3. Verificar dados históricos originais
  4. Corrigir contador final
  5. Salvar

**Passo 3: Re-executar Validação (8.4.4)**
```bash
tsx scripts/validate-sessions-migration.ts
```

**Passo 4: Verificar Resultado**
- ✅ Verificação 8.3.3 agora passa
- ✅ Taxa de sucesso: 100%
- ✅ Migração completa!

---

## 🆘 Suporte

Para dúvidas durante correções:

- **Documentação:** Ver `docs/VALIDACAO_SESSOES.md`
- **Scripts:** Ver `scripts/validate-sessions-migration.ts`
- **Relatórios:** Ver `scripts/data/validation/`

---

**Última atualização:** 27 de Novembro de 2025  
**Versão do documento:** 1.0

