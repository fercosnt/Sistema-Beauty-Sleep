# 🧪 Guia de Testes - Beauty Sleep

## Variáveis de Ambiente Necessárias

Para executar os testes, você precisa configurar as seguintes variáveis de ambiente no arquivo `.env.local`:

### Variáveis Obrigatórias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[seu-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[sua-service-role-key]

# Usuários de Teste (para testes E2E e Integração)
TEST_USER_EMAIL=admin@beautysmile.com
TEST_USER_PASSWORD=admin123
```

### Variáveis Opcionais

```env
# URL do site (opcional, usado em alguns testes)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Testes Unitários (Jest)

### Executar todos os testes
```bash
npm test
```

### Executar com cobertura
```bash
npm test -- --coverage
```

### Executar um arquivo específico
```bash
npm test __tests__/utils/cpf.test.ts
```

**Variáveis necessárias:** Nenhuma (testes isolados)

---

## Testes de Integração (Playwright)

### Executar todos os testes de integração
```bash
npx playwright test integration
```

### Executar um teste específico
```bash
npx playwright test integration/auth.test.ts
```

**Variáveis necessárias:**
- `TEST_USER_EMAIL` (obrigatório)
- `TEST_USER_PASSWORD` (obrigatório)
- `NEXT_PUBLIC_SUPABASE_URL` (obrigatório)
- `SUPABASE_SERVICE_ROLE_KEY` (obrigatório)

**Valores padrão (se não configurado):**
- `TEST_USER_EMAIL`: `admin@beautysmile.com`
- `TEST_USER_PASSWORD`: `testpassword123`

---

## Testes E2E (Playwright)

### Executar teste de fluxo completo
```bash
npx playwright test e2e/complete-flow
```

### Executar testes de permissões
```bash
# Primeiro criar usuários de teste (se necessário)
npx tsx scripts/create-test-users.ts

# Depois executar testes
npx playwright test e2e/permissions
```

**Variáveis necessárias:**
- `TEST_USER_EMAIL` (obrigatório)
- `TEST_USER_PASSWORD` (obrigatório)
- `NEXT_PUBLIC_SUPABASE_URL` (obrigatório)
- `SUPABASE_SERVICE_ROLE_KEY` (obrigatório)

**Nota:** Os testes de permissões criam usuários de teste automaticamente via `test-helpers.ts`.

---

## Configuração Rápida

### 1. Criar arquivo `.env.local`
```bash
cp env.local.example .env.local
```

### 2. Preencher variáveis
Edite `.env.local` e adicione:
- URLs e chaves do Supabase
- Credenciais de teste

### 3. Verificar configuração
```bash
# Verificar se variáveis estão carregadas
node -e "require('dotenv').config({ path: '.env.local' }); console.log(process.env.TEST_USER_EMAIL)"
```

---

## Troubleshooting

### Testes pulam automaticamente
**Causa:** Variáveis de ambiente não configuradas  
**Solução:** Configure todas as variáveis obrigatórias no `.env.local`

### Erro de autenticação nos testes
**Causa:** Credenciais de teste incorretas ou usuário não existe  
**Solução:** Verificar se usuário existe na tabela `users` e está ativo

### Testes de permissão falham
**Causa:** Usuários de teste não existem  
**Solução:** Executar `npx tsx scripts/create-test-users.ts` ou os testes criam automaticamente

### Timeout nos testes
**Causa:** Sistema muito lento ou problemas de rede  
**Solução:** Aumentar timeouts no `playwright.config.ts` se necessário

---

## Estrutura de Testes

```
__tests__/
├── utils/              # Testes unitários
│   ├── cpf.test.ts
│   └── calculos.test.ts
├── integration/        # Testes de integração
│   ├── auth.test.ts
│   └── pacientes.test.ts
├── e2e/               # Testes E2E
│   ├── complete-flow.spec.ts
│   └── permissions.spec.ts
└── utils/             # Helpers para testes
    └── test-helpers.ts
```

---

**Última atualização:** 2025-12-02
