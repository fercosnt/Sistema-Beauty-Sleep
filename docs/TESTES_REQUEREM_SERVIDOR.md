# ⚠️ IMPORTANTE: Testes Playwright Requerem Servidor Rodando

**Data:** 2025-12-02

---

## 🔴 Problema Identificado

**44 testes falharam** porque o servidor Next.js não está rodando.

**Erro típico:**
```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log: - waiting for locator('input[name="email"]')
```

**Causa:** Os testes tentam acessar `http://localhost:3000` mas o servidor não está respondendo.

---

## ✅ Solução: Iniciar Servidor Antes dos Testes

### Opção 1: Servidor Automático (Recomendado)

Habilitar o `webServer` no `playwright.config.ts` para iniciar o servidor automaticamente.

### Opção 2: Servidor Manual

1. **Terminal 1:** Iniciar servidor
```bash
npm run dev
```

2. **Terminal 2:** Executar testes
```bash
npm run test:e2e
```

---

## 📋 Status Atual dos Testes

### ✅ Testes Unitários (Jest)
- **Status:** ✅ 52 testes passando
- **Não requer servidor**
- **Comando:** `npm test`

### ⏳ Testes de Integração (Playwright)
- **Status:** ⏳ 44 testes falhando (servidor não rodando)
- **Requer servidor:** SIM
- **Comando:** `npm run test:e2e -- integration`

### ⏳ Testes E2E (Playwright)
- **Status:** ⏳ 13 testes falhando (servidor não rodando)
- **Requer servidor:** SIM
- **Comando:** `npm run test:e2e -- e2e`

---

## 🔧 Como Executar os Testes Corretamente

### Passo 1: Configurar Variáveis de Ambiente

Criar `.env.test.local` na raiz do projeto:

```env
TEST_USER_EMAIL=admin@beautysmile.com
TEST_USER_PASSWORD=admin123
NEXT_PUBLIC_SUPABASE_URL=https://[seu-project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[sua-service-role-key]
```

### Passo 2: Iniciar Servidor

**Opção A: Automático (Playwright inicia servidor)**
- Habilitar `webServer` no `playwright.config.ts`

**Opção B: Manual**
```bash
npm run dev
```

Aguardar até ver:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

### Passo 3: Executar Testes

Em outro terminal:

```bash
# Todos os testes Playwright
npm run test:e2e

# Apenas integração
npm run test:e2e -- integration

# Apenas E2E
npm run test:e2e -- e2e
```

---

## 🛠️ Habilitar Servidor Automático

Vou habilitar o servidor automático no Playwright para facilitar a execução dos testes.

---

**Última atualização:** 2025-12-02

