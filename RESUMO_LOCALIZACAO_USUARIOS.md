# 📍 Onde Estão os Dados dos Usuários

**Data:** 2025-12-02

---

## ✅ Resposta Rápida

Os dados dos usuários estão em **3 lugares principais**:

---

## 1. **Testes E2E** → `__tests__/utils/test-helpers.ts`

**Linha 31-35:**

```typescript
export const TEST_USERS: TestUser[] = [
  { email: 'admin@test.com', password: 'admin123', nome: 'Admin Test', role: 'admin' },
  { email: 'equipe@test.com', password: 'equipe123', nome: 'Equipe Test', role: 'equipe' },
  { email: 'recepcao@test.com', password: 'recepcao123', nome: 'Recepcao Test', role: 'recepcao' }
];
```

**Usado por:** Testes E2E de permissões (`__tests__/e2e/permissions.spec.ts`)

---

## 2. **Testes de Integração** → Variáveis de Ambiente ou Fallback

**Em `__tests__/integration/auth.test.ts` (linha 16-17):**

```typescript
const TEST_EMAIL = process.env.TEST_USER_EMAIL || 'admin@beautysmile.com';
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'testpassword123';
```

**Você pode configurar no `.env.local`:**
```env
TEST_USER_EMAIL=admin@beautysmile.com
TEST_USER_PASSWORD=admin123
```

---

## 3. **Script de Criação** → `scripts/create-test-users.ts`

**Linha 34-38:**

```typescript
const TEST_USERS = [
  { email: 'admin@test.com', password: 'admin123', nome: 'Admin Test', role: 'admin' },
  { email: 'equipe@test.com', password: 'equipe123', nome: 'Equipe Test', role: 'equipe' },
  { email: 'recepcao@test.com', password: 'recepcao123', nome: 'Recepcao Test', role: 'recepcao' }
]
```

**Para criar os usuários:**
```bash
npx tsx scripts/create-test-users.ts
```

---

## 📋 Resumo Completo

| Localização | Emails | Senhas | Uso |
|-------------|--------|--------|-----|
| `test-helpers.ts` | admin@test.com<br>equipe@test.com<br>recepcao@test.com | admin123<br>equipe123<br>recepcao123 | Testes E2E |
| Variáveis de ambiente | `TEST_USER_EMAIL` | `TEST_USER_PASSWORD` | Testes de Integração |
| Fallback padrão | admin@beautysmile.com | testpassword123 | Se não configurado |

---

## 🚀 Criar Usuários de Teste

Execute este comando para criar os 3 usuários no Supabase:

```bash
npx tsx scripts/create-test-users.ts
```

Isso cria:
- ✅ admin@test.com / admin123 (admin)
- ✅ equipe@test.com / equipe123 (equipe)
- ✅ recepcao@test.com / recepcao123 (recepcao)

---

**Documentação completa:** Veja `docs/ONDE_ESTAO_USUARIOS.md`

