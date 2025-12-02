# 📍 Onde Estão os Dados dos Usuários

**Data:** 2025-12-02

---

## 📋 Usuários de Teste Definidos

### 1. **Em `__tests__/utils/test-helpers.ts`** (Linha 31-35)

```typescript
export const TEST_USERS: TestUser[] = [
  { email: 'admin@test.com', password: 'admin123', nome: 'Admin Test', role: 'admin' },
  { email: 'equipe@test.com', password: 'equipe123', nome: 'Equipe Test', role: 'equipe' },
  { email: 'recepcao@test.com', password: 'recepcao123', nome: 'Recepcao Test', role: 'recepcao' }
];
```

**Usado por:** Testes E2E de permissões (`__tests__/e2e/permissions.spec.ts`)

---

### 2. **Em `__tests__/integration/auth.test.ts`** (Linha 16-17)

```typescript
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'admin@beautysmile.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';
```

**Usado por:** Testes de integração de autenticação e pacientes

**Fonte:** Variáveis de ambiente ou fallback padrão

---

### 3. **Em `scripts/create-test-users.ts`**

Script que cria os usuários definidos em `test-helpers.ts` no Supabase:

```typescript
const testUsers = [
  { email: 'admin@test.com', password: 'admin123', name: 'Admin Teste', role: 'admin' },
  { email: 'equipe@test.com', password: 'equipe123', name: 'Equipe Teste', role: 'equipe' },
  { email: 'recepcao@test.com', password: 'recepcao123', name: 'Recepção Teste', role: 'recepcao' },
];
```

---

### 4. **Em `supabase/migrations/005_seed_data.sql`** (Comentário)

Menciona usuários que devem ser criados manualmente:

```sql
-- 1. admin@beautysmile.com (role: admin)
-- 2. dentista@beautysmile.com (role: equipe)
-- 3. recepcao@beautysmile.com (role: recepcao)
```

---

## 🔍 Resumo: Diferentes Emails em Uso

| Email | Onde está | Para que serve |
|-------|-----------|----------------|
| `admin@test.com` | `test-helpers.ts` | Testes E2E de permissões |
| `equipe@test.com` | `test-helpers.ts` | Testes E2E de permissões |
| `recepcao@test.com` | `test-helpers.ts` | Testes E2E de permissões |
| `admin@beautysmile.com` | `auth.test.ts` (fallback) | Testes de integração |
| `dentista@beautysmile.com` | `005_seed_data.sql` (comentário) | Documentação |
| `recepcao@beautysmile.com` | `005_seed_data.sql` (comentário) | Documentação |

---

## 📝 Variáveis de Ambiente

Para os testes de integração, você pode configurar no `.env.local`:

```env
TEST_USER_EMAIL=admin@beautysmile.com
TEST_USER_PASSWORD=admin123
```

**Ou usar qualquer email/senha válidos no Supabase Auth.**

---

## ✅ Como Criar os Usuários

### Opção 1: Via Script

```bash
npx tsx scripts/create-test-users.ts
```

Isso cria os 3 usuários:
- admin@test.com
- equipe@test.com
- recepcao@test.com

### Opção 2: Manualmente no Supabase

1. Acesse Supabase Dashboard → Authentication → Users
2. Crie os usuários manualmente
3. Depois insira na tabela `users` via SQL Editor

---

## 🎯 Resposta Rápida

**Os dados dos usuários estão em:**
- ✅ `__tests__/utils/test-helpers.ts` (linha 31-35) - Para testes E2E
- ✅ Variáveis de ambiente `TEST_USER_EMAIL` e `TEST_USER_PASSWORD` - Para testes de integração

**Para criar os usuários:**
```bash
npx tsx scripts/create-test-users.ts
```

---

**Última atualização:** 2025-12-02

