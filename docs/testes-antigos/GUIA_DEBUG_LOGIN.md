# 🔧 Guia: Como Debugar Problemas de Login nos Testes

**Data:** 2025-12-02

---

## 🎯 Passo 1: Testar Login Manualmente

Antes de tudo, verifique se o login funciona manualmente:

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Abra no navegador:**
   ```
   http://localhost:3000/login
   ```

3. **Tente fazer login com:**
   - Email: `admin@test.com` (ou o que estiver no `.env.local`)
   - Senha: `admin123` (ou a senha configurada)

4. **Verifique:**
   - ✅ Login funciona e redireciona para `/dashboard`?
   - ❌ Fica na página de login?
   - ❌ Mostra erro?

---

## 🔍 Passo 2: Verificar Usuários no Supabase

1. **Acesse o Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Selecione seu projeto

2. **Vá para Authentication → Users:**
   - Procure pelos emails:
     - `admin@test.com`
     - `equipe@test.com`
     - `recepcao@test.com`
     - Ou o email configurado em `TEST_USER_EMAIL`

3. **Verifique:**
   - ✅ Usuário existe?
   - ✅ Email está confirmado?
   - ✅ Senha está correta?

---

## 🔍 Passo 3: Verificar Variáveis de Ambiente

1. **Verifique o arquivo `.env.local`:**

```bash
# Verificar se as variáveis estão configuradas
node -e "require('dotenv').config({ path: '.env.local' }); console.log('TEST_USER_EMAIL:', process.env.TEST_USER_EMAIL); console.log('TEST_USER_PASSWORD:', process.env.TEST_USER_PASSWORD ? '✅ Configurado' : '❌ Não configurado');"
```

2. **Confirme que os valores estão corretos:**
   ```env
   TEST_USER_EMAIL=admin@test.com  # ou admin@beautysmile.com
   TEST_USER_PASSWORD=admin123      # senha correta
   ```

---

## 🔍 Passo 4: Verificar Screenshots dos Testes

Os testes criam screenshots quando falham:

1. **Localização dos screenshots:**
   ```
   test-results/integration-auth-*/test-failed-1.png
   test-results/e2e-permissions-*/test-failed-1.png
   ```

2. **Abra os screenshots:**
   - Veja o que está na tela quando o teste falha
   - Procure por mensagens de erro
   - Veja se o formulário está preenchido

---

## 🔍 Passo 5: Verificar Logs do Servidor

1. **Execute os testes com mais verbosidade:**
   ```bash
   DEBUG=pw:* npm run test:e2e
   ```

2. **Ou verifique os logs do Playwright:**
   - Os testes mostram "Call log" no erro
   - Veja qual ação falhou

---

## 🔍 Passo 6: Testar com Credenciais Diferentes

Se as credenciais atuais não funcionam, tente:

1. **Criar um novo usuário de teste:**
   ```bash
   npx tsx scripts/create-test-users.ts
   ```

2. **Ou criar manualmente no Supabase:**
   - Dashboard → Authentication → Users → Add User
   - Email: `teste@example.com`
   - Senha: `teste123`
   - Confirm email: ✅

3. **Atualizar `.env.local`:**
   ```env
   TEST_USER_EMAIL=teste@example.com
   TEST_USER_PASSWORD=teste123
   ```

---

## ✅ Solução Rápida: Verificar e Criar Usuário

Execute este comando para verificar/criar usuários:

```bash
# 1. Verificar variáveis
node -e "require('dotenv').config({ path: '.env.local' }); console.log('Email:', process.env.TEST_USER_EMAIL); console.log('Senha configurada:', process.env.TEST_USER_PASSWORD ? 'Sim' : 'Não');"

# 2. Criar usuários de teste
npx tsx scripts/create-test-users.ts

# 3. Verificar se login funciona manualmente
npm run dev
# Depois abra http://localhost:3000/login no navegador
```

---

## 🔧 Se Nada Funcionar

1. **Verificar se o servidor está rodando:**
   - Playwright inicia automaticamente, mas pode haver problemas
   - Tente iniciar manualmente: `npm run dev`

2. **Verificar configuração do Supabase:**
   - Site URL configurada?
   - Redirect URLs configuradas?
   - Email provider habilitado?

3. **Verificar middleware:**
   - Está bloqueando o acesso?
   - Está redirecionando incorretamente?

---

**Última atualização:** 2025-12-02

