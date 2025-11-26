# Guia: Teste de Proteção de Rotas (Tarefa 2.3.5)

Este guia explica como testar se a proteção de rotas está funcionando corretamente.

## 🎯 Objetivo

Verificar se o middleware está protegendo corretamente as rotas, redirecionando usuários não autenticados para a página de login e permitindo acesso apenas para usuários autenticados.

## 📋 Pré-requisitos

- Servidor de desenvolvimento rodando (`npm run dev`)
- Navegador com DevTools aberto (F12)
- Acesso ao Supabase Dashboard para criar usuários de teste (se necessário)

## ✅ Testes a Realizar

### Teste 1: Acessar Dashboard sem Login

**Objetivo**: Verificar se usuários não autenticados são redirecionados para `/login`

**Passos**:
1. Abra uma janela anônima/privada do navegador (Ctrl+Shift+N no Chrome/Edge)
2. Acesse: `http://localhost:3000/dashboard`
3. **Resultado esperado**: 
   - Você deve ser redirecionado automaticamente para `http://localhost:3000/login`
   - A URL deve mostrar `/login` na barra de endereços
   - Você deve ver a página de login

**Como verificar**:
- Abra o DevTools (F12) → Aba **Network**
- Procure por requisições de redirecionamento (status 307 ou 302)
- Verifique se há uma requisição para `/login`

---

### Teste 2: Acessar Rotas Protegidas sem Login

**Objetivo**: Verificar se todas as rotas protegidas redirecionam para login

**Rotas para testar**:
- `http://localhost:3000/pacientes`
- `http://localhost:3000/usuarios` (se você não for admin)
- `http://localhost:3000/logs` (se você não for admin)
- `http://localhost:3000/` (página raiz)

**Passos**:
1. Em uma janela anônima, acesse cada uma das rotas acima
2. **Resultado esperado**: 
   - Todas devem redirecionar para `/login`
   - Nenhuma deve mostrar conteúdo protegido

---

### Teste 3: Acesso Permitido após Login

**Objetivo**: Verificar se usuários autenticados conseguem acessar as rotas protegidas

**Passos**:
1. Faça login com um usuário válido em `http://localhost:3000/login`
2. Após o login bem-sucedido, você deve ser redirecionado para `/dashboard`
3. Tente acessar outras rotas protegidas:
   - `http://localhost:3000/pacientes`
   - `http://localhost:3000/dashboard`
4. **Resultado esperado**: 
   - Todas as rotas devem ser acessíveis
   - Você deve ver o conteúdo (mesmo que seja uma página vazia ainda)
   - O Sidebar e Header devem aparecer

---

### Teste 4: Rotas Públicas Acessíveis

**Objetivo**: Verificar se rotas públicas (login, auth) são acessíveis sem autenticação

**Rotas para testar**:
- `http://localhost:3000/login` ✅ Deve ser acessível
- `http://localhost:3000/auth/callback` ✅ Deve ser acessível (mesmo que retorne erro sem parâmetros)
- `http://localhost:3000/auth/reset-password` ✅ Deve ser acessível

**Passos**:
1. Em uma janela anônima, acesse cada rota acima
2. **Resultado esperado**: 
   - Todas devem ser acessíveis sem redirecionamento
   - Não devem redirecionar para `/login`

---

### Teste 5: Controle de Acesso Baseado em Role (Admin)

**Objetivo**: Verificar se rotas admin-only bloqueiam usuários não-admin

**Pré-requisito**: Você precisa ter dois usuários de teste:
- Um usuário com `role = 'admin'`
- Um usuário com `role = 'equipe'` ou `role = 'recepcao'`

**Passos**:
1. **Como Admin**:
   - Faça login com o usuário admin
   - Acesse `http://localhost:3000/usuarios`
   - Acesse `http://localhost:3000/logs`
   - **Resultado esperado**: ✅ Deve conseguir acessar ambas as rotas

2. **Como Não-Admin**:
   - Faça logout
   - Faça login com o usuário não-admin (equipe ou recepcao)
   - Tente acessar `http://localhost:3000/usuarios`
   - Tente acessar `http://localhost:3000/logs`
   - **Resultado esperado**: 
     - ❌ Deve ser redirecionado para `/dashboard`
     - Não deve conseguir acessar as rotas admin-only

---

### Teste 6: Usuário Inativo

**Objetivo**: Verificar se usuários inativos são bloqueados

**Passos**:
1. No Supabase Dashboard, vá em **Table Editor** → `users`
2. Encontre um usuário de teste e altere `ativo = false`
3. Tente fazer login com esse usuário
4. Após o login, tente acessar qualquer rota protegida
5. **Resultado esperado**: 
   - Deve ser redirecionado para `/login`
   - Deve ver uma mensagem de erro: "Usuário não autorizado"

---

### Teste 7: Sessão Expirada

**Objetivo**: Verificar se sessões expiradas são tratadas corretamente

**Passos**:
1. Faça login normalmente
2. No DevTools → Aba **Application** → **Cookies**
3. Delete manualmente os cookies relacionados ao Supabase (geralmente começam com `sb-`)
4. Tente acessar `http://localhost:3000/dashboard`
5. **Resultado esperado**: 
   - Deve ser redirecionado para `/login`
   - Não deve mostrar erro no console

---

## 🔍 Como Verificar se Está Funcionando

### No Console do Navegador (DevTools)

Abra o DevTools (F12) e verifique:

1. **Aba Console**: Não deve haver erros relacionados a autenticação
2. **Aba Network**: 
   - Deve ver requisições para `/api/auth/user` ou similar
   - Redirecionamentos devem ter status 307 ou 302

### No Código

O middleware está em `lib/supabase/middleware.ts` e deve:

1. ✅ Verificar se o usuário está autenticado (`supabase.auth.getUser()`)
2. ✅ Redirecionar para `/login` se não autenticado
3. ✅ Buscar o role do usuário na tabela `users`
4. ✅ Verificar se o usuário está ativo
5. ✅ Bloquear acesso a rotas admin-only para não-admins

---

## 📝 Checklist de Testes

Marque cada teste conforme você realiza:

- [ ] Teste 1: Dashboard sem login → redireciona para `/login`
- [ ] Teste 2: Rotas protegidas sem login → todas redirecionam
- [ ] Teste 3: Acesso após login → rotas acessíveis
- [ ] Teste 4: Rotas públicas → acessíveis sem autenticação
- [ ] Teste 5: Admin pode acessar `/usuarios` e `/logs`
- [ ] Teste 5: Não-admin NÃO pode acessar `/usuarios` e `/logs`
- [ ] Teste 6: Usuário inativo → bloqueado
- [ ] Teste 7: Sessão expirada → redireciona para login

---

## 🐛 Problemas Comuns

### Problema: Não redireciona para login

**Possíveis causas**:
- Middleware não está sendo executado
- Verifique se `middleware.ts` está na raiz do projeto
- Verifique se o `matcher` no `middleware.ts` está correto

**Solução**:
```typescript
// middleware.ts deve ter:
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Problema: Loop de redirecionamento

**Possíveis causas**:
- `/login` está sendo protegido pelo middleware
- Cookie de sessão está corrompido

**Solução**:
- Verifique se o middleware permite acesso a `/login`:
```typescript
if (
  !user &&
  !request.nextUrl.pathname.startsWith('/login') &&
  !request.nextUrl.pathname.startsWith('/auth')
) {
  // redireciona para login
}
```

### Problema: Usuário autenticado não consegue acessar rotas

**Possíveis causas**:
- Usuário não existe na tabela `users`
- Email não corresponde entre `auth.users` e `users`
- Usuário está inativo (`ativo = false`)

**Solução**:
- Verifique no Supabase Dashboard se o usuário existe na tabela `users`
- Verifique se o email corresponde exatamente
- Verifique se `ativo = true`

---

## ✅ Após Completar os Testes

Se todos os testes passarem:

1. ✅ Marque a tarefa 2.3.5 como concluída no arquivo de tarefas
2. ✅ Documente quaisquer problemas encontrados
3. ✅ Se encontrar bugs, reporte e corrija antes de prosseguir

---

## 📚 Referências

- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- Arquivo do middleware: `lib/supabase/middleware.ts`
- Arquivo de configuração: `middleware.ts` (raiz)

