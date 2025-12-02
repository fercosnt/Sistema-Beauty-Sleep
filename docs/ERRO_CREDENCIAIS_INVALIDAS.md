# 🔴 Erro: Invalid login credentials

**Data:** 2025-12-02

---

## 🔴 Erro Identificado

```
POST /login?error=Invalid%20login%20credentials
```

**Significado:** O servidor está recebendo a requisição de login, mas as credenciais estão incorretas.

---

## ✅ Verificações Realizadas

### 1. Usuário existe no Supabase Auth ✅
- Email: `admin@test.com`
- ID: `b7d22b24-46af-44ef-bbf8-5feb2ecf0477`
- Email confirmado: ✅ Sim
- Criado em: 02/12/2025, 15:55:49

### 2. Login direto funciona ✅
- Testado diretamente via script: ✅ **Login bem-sucedido!**
- Credenciais: `admin@test.com` / `admin123`

### 3. Usuário existe na tabela users ✅
- ID: `7e9cb0bf-0237-44ef-940c-c90f90d9ddd9`
- Nome: Admin Test
- Role: admin
- Ativo: ✅ Sim

---

## ⚠️ Problema Identificado

**IDs diferentes:**
- Auth ID: `b7d22b24-46af-44ef-bbf8-5feb2ecf0477`
- Users ID: `7e9cb0bf-0237-44ef-940c-c90f90d9ddd9`

**Isso pode causar problemas** porque o sistema espera que o ID na tabela `users` seja o mesmo ID do Auth.

---

## 🔧 Soluções

### Solução 1: Corrigir ID na tabela users

Execute o script para corrigir:
```bash
npx tsx scripts/fix-test-user-id.ts
```

Este script vai:
1. Verificar se os IDs são diferentes
2. Criar/atualizar o registro com o ID correto do Auth

### Solução 2: Verificar credenciais nos testes

Os testes podem estar usando credenciais diferentes. Verifique:

1. **Teste de integração** (`__tests__/integration/auth.test.ts`):
   - Usa: `process.env.TEST_USER_EMAIL` ou `'admin@beautysmile.com'`
   - Senha: `process.env.TEST_USER_PASSWORD` ou `'testpassword123'`

2. **Teste E2E** (`__tests__/e2e/complete-flow.spec.ts`):
   - Usa: `process.env.TEST_USER_EMAIL` ou `'admin@beautysmile.com'`
   - Senha: `process.env.TEST_USER_PASSWORD` ou `'testpassword123'`

3. **Verifique `.env.local`:**
   ```env
   TEST_USER_EMAIL=admin@test.com
   TEST_USER_PASSWORD=admin123
   ```

---

## ✅ Próximos Passos

1. **Corrigir ID do usuário:**
   ```bash
   npx tsx scripts/fix-test-user-id.ts
   ```

2. **Verificar credenciais no `.env.local`:**
   - Deve ter: `TEST_USER_EMAIL=admin@test.com`
   - Deve ter: `TEST_USER_PASSWORD=admin123`

3. **Testar login manualmente:**
   - Abrir `http://localhost:3000/login`
   - Tentar fazer login
   - Se funcionar manualmente, o problema pode ser nos testes

4. **Re-executar testes:**
   ```bash
   npm run test:e2e
   ```

---

## 📋 Status Atual

- ✅ Usuário existe no Auth
- ✅ Login direto funciona
- ✅ Usuário existe na tabela users
- ⚠️ IDs diferentes (podem causar problemas)
- ❓ Testes falhando (precisa investigar mais)

---

**Última atualização:** 2025-12-02

