# 📋 Guia de Validação de Migração de Sessões

**Versão:** 1.0  
**Data:** 27 de Novembro de 2025  
**Script:** `scripts/validate-sessions-migration.ts`

---

## 🎯 Objetivo

Este script valida todos os dados inseridos durante a migração manual de sessões, verificando:

1. ✅ Total de sessões registradas
2. ✅ Comparação com contagem esperada
3. ✅ Outliers (contador final <= inicial)
4. ✅ Datas faltantes
5. ✅ Consistência de `sessoes_utilizadas`
6. ✅ Cálculo correto de `sessoes_disponiveis`
7. ✅ Spot check de 20 pacientes aleatórios
8. ✅ Geração de relatório completo

---

## 📋 Pré-requisitos

- ✅ Migração manual de sessões concluída (ou parcialmente concluída)
- ✅ Arquivo `.env.local` configurado com credenciais do Supabase
- ✅ Node.js e npm instalados
- ✅ Dependências do projeto instaladas (`npm install`)

---

## 🚀 Como Executar

### Execução Básica

```bash
tsx scripts/validate-sessions-migration.ts
```

### Com Variáveis de Ambiente

O script automaticamente carrega variáveis de ambiente do arquivo `.env.local` na raiz do projeto.

**Variáveis necessárias:**
- `NEXT_PUBLIC_SUPABASE_URL` ou `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (recomendado) ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📊 O que o Script Faz

### 1. Validação de Total de Sessões (8.3.1)

Executa `SELECT COUNT(*) FROM sessoes` e exibe o total de sessões registradas.

**Resultado esperado:**
- ✅ PASS: Total de sessões exibido
- ❌ FAIL: Erro ao contar sessões

### 2. Comparação com Esperado (8.3.2)

Compara o total de sessões registradas com a soma de `sessoes_compradas` de pacientes ativos/finalizados.

**Resultado esperado:**
- ✅ PASS: Contagem exata (registradas = esperadas)
- ⚠️ WARNING: Diferença encontrada (mostra quantas faltam ou sobram)

### 3. Verificação de Outliers (8.3.3)

Busca sessões onde `contador_final <= contador_inicial` (erro crítico).

**Resultado esperado:**
- ✅ PASS: Nenhum outlier encontrado
- ❌ FAIL: Outliers encontrados (lista detalhes)

### 4. Verificação de Datas Faltantes (8.3.4)

Busca sessões com `data_sessao IS NULL`.

**Resultado esperado:**
- ✅ PASS: Nenhuma sessão sem data
- ❌ FAIL: Sessões sem data encontradas (lista IDs)

### 5. Validação de `sessoes_utilizadas` (8.3.5)

Compara o campo `sessoes_utilizadas` de cada paciente com a contagem real de sessões.

**Resultado esperado:**
- ✅ PASS: Todos os pacientes têm contagem correta
- ❌ FAIL: Inconsistências encontradas (lista pacientes com diferença)

### 6. Validação de `sessoes_disponiveis` (8.3.6)

Verifica se o cálculo `disponiveis = compradas + adicionadas - utilizadas` está correto e >= 0.

**Resultado esperado:**
- ✅ PASS: Todos os cálculos estão corretos
- ❌ FAIL: Pacientes com disponíveis negativo encontrados

### 7. Spot Check de 20 Pacientes (8.3.7)

Seleciona 20 pacientes aleatórios com sessões e verifica:
- Consistência de contagem
- Sessões com problemas (data faltante, contadores)

**Resultado esperado:**
- ✅ PASS: Todos os pacientes verificados estão OK
- ⚠️ WARNING: Alguns pacientes com problemas encontrados

### 8. Geração de Relatório (8.3.8)

Gera relatório Markdown completo em `scripts/data/validation/sessions-validation-report-[timestamp].md`.

**Conteúdo do relatório:**
- Resumo (total, passou, falhou, avisos, taxa de sucesso)
- Detalhes de cada verificação
- JSON com detalhes quando aplicável
- Conclusão e próximos passos

---

## 📄 Formato do Relatório

O relatório é gerado em Markdown e inclui:

```markdown
# Relatório de Validação de Migração de Sessões

## 📊 Resumo
- Total de Verificações: 8
- ✅ Passou: 6
- ❌ Falhou: 1
- ⚠️ Avisos: 1
- Taxa de Sucesso: 75.00%

## 📋 Detalhes das Verificações
[Detalhes de cada verificação...]

## 📝 Conclusão
[Conclusão e próximos passos...]
```

---

## 🔍 Interpretando os Resultados

### ✅ PASS (Verde)

A verificação passou sem problemas. Os dados estão corretos.

### ⚠️ WARNING (Amarelo)

A verificação encontrou avisos, mas não são críticos. Pode ser:
- Diferença entre registrado e esperado (mas dentro do esperado)
- Alguns pacientes com problemas menores

**Ação:** Revisar os avisos, mas não bloqueia a migração.

### ❌ FAIL (Vermelho)

A verificação falhou. Há problemas críticos que precisam ser corrigidos:
- Outliers (contador final <= inicial)
- Datas faltantes
- Inconsistências críticas

**Ação:** Corrigir os problemas antes de considerar a migração completa.

---

## 🛠️ Correção de Problemas

### Se encontrar Outliers (8.3.3)

1. Identificar a sessão no relatório
2. Verificar dados históricos originais
3. Corrigir manualmente no sistema (Admin pode editar/deletar)
4. Re-executar validação

### Se encontrar Datas Faltantes (8.3.4)

1. Identificar sessões sem data no relatório
2. Buscar data nos dados históricos
3. Editar sessão no sistema para adicionar data
4. Re-executar validação

### Se encontrar Inconsistências em `sessoes_utilizadas` (8.3.5)

**Causa comum:** Trigger não executou corretamente.

**Solução:**
1. Verificar se trigger `atualizar_sessoes_utilizadas` está ativo
2. Recalcular manualmente se necessário:
   ```sql
   UPDATE pacientes p
   SET sessoes_utilizadas = (
     SELECT COUNT(*) FROM sessoes s WHERE s.paciente_id = p.id
   );
   ```
3. Re-executar validação

### Se encontrar Disponíveis Negativos (8.3.6)

**Causa comum:** `sessoes_utilizadas` > `sessoes_compradas + sessoes_adicionadas`

**Solução:**
1. Verificar dados históricos
2. Ajustar `sessoes_compradas` ou `sessoes_adicionadas` se necessário
3. Ou corrigir `sessoes_utilizadas` se houver erro de contagem
4. Re-executar validação

---

## 📊 Métricas de Sucesso

### Validação Completa Bem-Sucedida

- ✅ Todas as 8 verificações passaram
- ✅ Taxa de sucesso: 100%
- ✅ Nenhum erro crítico encontrado

### Validação com Avisos

- ✅ Verificações críticas passaram
- ⚠️ Alguns avisos (não bloqueiam)
- 📊 Taxa de sucesso: >75%

### Validação com Falhas

- ❌ Pelo menos uma verificação crítica falhou
- 📊 Taxa de sucesso: <75%
- 🔧 Correções necessárias antes de prosseguir

---

## 🔄 Processo de Validação Iterativa

1. **Executar validação**: `tsx scripts/validate-sessions-migration.ts`
2. **Revisar relatório**: Abrir arquivo gerado em `scripts/data/validation/`
3. **Corrigir problemas**: Usar guia de correção acima
4. **Re-executar validação**: Repetir até 100% de sucesso
5. **Documentar**: Salvar relatório final como evidência

---

## 📝 Exemplo de Uso

```bash
# 1. Executar validação
$ tsx scripts/validate-sessions-migration.ts

🚀 Iniciando validação de migração de sessões...
============================================================

📊 8.3.1: Verificando total de sessões...
✅ 8.3.1: Total de sessões registradas: 1250

📊 8.3.2: Comparando com contagem esperada do Airtable...
⚠️ 8.3.2: 1250 sessões registradas de 1300 esperadas (50 faltando, 96.15% completo)

📊 8.3.3: Verificando outliers...
✅ 8.3.3: Nenhum outlier encontrado

[... outras verificações ...]

📊 8.3.8: Gerando relatório de validação...
✅ 8.3.8: Relatório gerado: scripts/data/validation/sessions-validation-report-2025-11-27T20-30-00.md

============================================================

📊 Resumo da Validação:
✅ Passou: 6
❌ Falhou: 0
⚠️  Avisos: 2
📊 Total: 8

✅ Validação concluída!
```

---

## 🆘 Troubleshooting

### Erro: "Variáveis de ambiente não configuradas"

**Solução:**
1. Verificar se `.env.local` existe na raiz do projeto
2. Verificar se contém `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
3. Executar novamente

### Erro: "Erro ao contar sessões"

**Solução:**
1. Verificar conexão com Supabase
2. Verificar se tabela `sessoes` existe
3. Verificar permissões RLS (usar SERVICE_ROLE_KEY)

### Script muito lento

**Causa:** Validação 8.3.5 itera sobre todos os pacientes.

**Solução:** Normal para grandes volumes. Aguardar conclusão.

---

## 📞 Suporte

Para dúvidas ou problemas:

- **Documentação:** Ver `docs/GUIA_MIGRACAO_SESSOES.md`
- **Scripts:** Ver `scripts/validate-sessions-migration.ts`
- **Relatórios:** Ver `scripts/data/validation/`

---

**Última atualização:** 27 de Novembro de 2025  
**Versão do documento:** 1.0

