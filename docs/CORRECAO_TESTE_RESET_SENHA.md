# 🔧 Correção: Teste de Reset de Senha

**Data:** 2025-12-02

---

## ❌ Problema

Os testes estavam falhando ao procurar pelo link "Esqueci minha senha":

```
Error: expect(locator).toBeVisible() failed
Locator: getByRole('button', { name: /esqueci|esqueceu/i })
Expected: visible
Timeout: 5000ms
```

---

## 🔍 Análise

**Texto na página:** "Esqueceu sua senha?" (linha 195 de `app/login/page.tsx`)

**Regex no teste:** `/esqueci|esqueceu/i` (procura apenas por "esqueci" OU "esqueceu")

**Problema:** O regex não capturava "Esqueceu sua senha?" porque:
- O texto completo é "Esqueceu sua senha?"
- O regex procurava apenas palavras isoladas

---

## ✅ Solução

Atualizado o regex para procurar por "esqueceu" seguido de qualquer coisa até "senha":

**Antes:**
```typescript
const resetLink = page.getByRole('button', { name: /esqueci|esqueceu/i })
```

**Depois:**
```typescript
const resetLink = page.getByRole('button', { name: /esqueceu.*senha/i })
```

---

## 📝 Mudanças Aplicadas

### 1. Teste: "should show Esqueci minha senha link"
- ✅ Adicionado `page.goto('/login')` explícito
- ✅ Adicionado `waitForLoadState('networkidle')`
- ✅ Corrigido regex para `/esqueceu.*senha/i`
- ✅ Adicionado timeout explícito de 5000ms

### 2. Teste: "should navigate to password reset"
- ✅ Adicionado `page.goto('/login')` explícito
- ✅ Adicionado `waitForLoadState('networkidle')`
- ✅ Corrigido regex para `/esqueceu.*senha/i`
- ✅ Adicionado timeout explícito de 5000ms
- ✅ Verificação do formulário de reset: "Recuperar Senha"

---

## ✅ Resultado Esperado

Após a correção, os testes devem:
1. ✅ Encontrar o botão "Esqueceu sua senha?"
2. ✅ Clicar no botão
3. ✅ Verificar que o formulário de reset aparece com heading "Recuperar Senha"

---

**Correção aplicada em:** 2025-12-02

