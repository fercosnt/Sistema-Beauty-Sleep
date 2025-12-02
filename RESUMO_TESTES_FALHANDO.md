# 📋 Resumo: Testes Ainda Falhando (18 testes)

**Data:** 2025-12-02

---

## ✅ Progresso Incrível!

- **Antes:** 40 testes falhando
- **Agora:** 18 testes falhando  
- **Melhoria:** 55% de redução! 🎉

---

## ⚠️ Testes que Ainda Precisam Correção

### 1. **Testes de Pacientes (10 testes)**

#### Problemas identificados:

1. **"CPF optional" test está incorreto**
   - O código exige CPF **OU** Documento Estrangeiro (não ambos opcionais)
   - Teste tenta criar sem nenhum dos dois
   - **Solução:** Teste precisa preencher Documento Estrangeiro

2. **Validações assíncronas**
   - CPF e ID do Paciente validam onBlur (assíncrono)
   - Testes podem não estar aguardando validações
   - **Solução:** Adicionar waits após preencher campos

3. **Busca na lista pode falhar**
   - Timeout pode ser curto
   - Lista pode não atualizar rapidamente
   - **Solução:** Aumentar timeouts e melhorar seletores

---

### 2. **Testes de Permissões E2E (6 testes)**

- Admin acessando /usuarios e /logs
- Equipe bloqueada de rotas admin  
- Dashboard recepção mostrando "--"

**Problema:** Precisam verificar redirecionamento e exibição de valores

---

### 3. **Teste Complete Flow (2 testes - não mencionados mas provavelmente ainda falha)**

- Fluxo completo end-to-end

---

## 🎯 Prioridade de Correção

1. **Alta:** Corrigir teste "CPF optional" - está incorreto
2. **Média:** Melhorar aguardar validações assíncronas
3. **Média:** Melhorar busca na lista após criar paciente
4. **Baixa:** Testes de permissões (podem estar funcionando, só precisam verificar)

---

## 📊 Resumo Estatístico

| Status | Quantidade | Porcentagem |
|--------|------------|-------------|
| ✅ Passando | 28 | 61% |
| ⚠️ Falhando | 18 | 39% |
| ⏭️ Pulados | 3 | - |

**Taxa de Sucesso: 61%** (excelente progresso!)

---

**Última atualização:** 2025-12-02

