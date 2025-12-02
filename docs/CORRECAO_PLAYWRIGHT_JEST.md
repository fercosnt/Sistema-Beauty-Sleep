# 🔧 Correção: Separação Playwright vs Jest

**Data:** 2025-12-02

---

## ❌ Problema

O Playwright estava tentando executar arquivos de teste do Jest (`.test.ts`), causando erro:

```
ReferenceError: describe is not defined
```

**Causa:** O Playwright e o Jest usam APIs diferentes:
- Jest usa: `describe()`, `it()`, `expect()`
- Playwright usa: `test()`, `expect()` da biblioteca do Playwright

---

## ✅ Solução

Atualizada a configuração do Playwright para ignorar arquivos do Jest.

### `playwright.config.ts`

Adicionado `testMatch` global para ignorar testes do Jest:

```typescript
testMatch: [
  '**/*.spec.ts',                    // Apenas arquivos Playwright
  '**/integration/**/*.test.ts',     // Testes de integração Playwright
  '!**/utils/**/*.test.ts',          // Ignorar testes Jest
],
```

---

## 📋 Estrutura de Testes

### Jest (Testes Unitários)
- **Padrão:** `**/*.test.ts`
- **Localização:** `__tests__/utils/`
- **Comando:** `npm test`
- **Exemplos:**
  - `__tests__/utils/cpf.test.ts`
  - `__tests__/utils/calculos.test.ts`

### Playwright (Integração e E2E)
- **Padrão:** `**/*.spec.ts` ou `**/integration/**/*.test.ts`
- **Localização:** 
  - `__tests__/e2e/` (arquivos `.spec.ts`)
  - `__tests__/integration/` (arquivos `.test.ts` do Playwright)
- **Comando:** `npm run test:e2e`
- **Exemplos:**
  - `__tests__/e2e/complete-flow.spec.ts`
  - `__tests__/e2e/permissions.spec.ts`
  - `__tests__/integration/auth.test.ts`
  - `__tests__/integration/pacientes.test.ts`

---

## ✅ Resultado

Agora o Playwright lista corretamente apenas seus próprios testes:

```
Total: 46 tests in 4 files
- [integration] auth.test.ts (7 testes)
- [integration] pacientes.test.ts (10 testes)
- [e2e] complete-flow.spec.ts (1 teste)
- [e2e] permissions.spec.ts (6 testes)
```

**Testes do Jest são completamente ignorados pelo Playwright.**

---

## 🔄 Comandos

### Executar apenas Jest:
```bash
npm test
```

### Executar apenas Playwright:
```bash
npm run test:e2e
```

### Executar projeto específico Playwright:
```bash
npm run test:e2e -- integration
npm run test:e2e -- e2e
```

---

**Correção aplicada em:** 2025-12-02

