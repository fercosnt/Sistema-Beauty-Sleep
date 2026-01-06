# Correção: Loop de Redirecionamento Infinito (ERR_TOO_MANY_REDIRECTS)

## 🔴 Problema

O site estava apresentando erro `ERR_TOO_MANY_REDIRECTS` causando um loop infinito de redirecionamentos.

## 🔍 Causa Raiz

O loop ocorria quando:
1. Usuário autenticado no Supabase Auth mas não existe na tabela `users`
2. Middleware redireciona para `/login?error=usuario_nao_autorizado`
3. Página de login verifica se usuário está autenticado
4. Se autenticado, redireciona para `/dashboard`
5. Middleware verifica novamente e redireciona de volta para `/login`
6. **Loop infinito!**

## ✅ Solução Aplicada

### 1. Middleware (`lib/supabase/middleware.ts`)

**Melhorias:**
- Verifica se já está na página de login antes de redirecionar
- Evita adicionar `session_expired` se já estiver presente
- Permite que página de login com erro prossiga sem redirecionar
- Melhor tratamento de casos onde usuário está autenticado mas não autorizado

**Código chave:**
```typescript
// Verifica se já está na página de login
const isLoginPage = request.nextUrl.pathname.startsWith('/login')
const isAuthCallback = request.nextUrl.pathname.startsWith('/auth')

if (!user || authError) {
  // Se já está na página de login, permite prosseguir
  if (isLoginPage || isAuthCallback) {
    return supabaseResponse
  }
  // Só redireciona se não estiver na página de login
  // ...
}
```

### 2. Página de Login (`app/login/page.tsx`)

**Melhorias:**
- Verifica erros de autorização ANTES de verificar autenticação
- Faz sign out quando há erro de autorização
- Verifica se usuário existe na tabela `users` antes de redirecionar
- Não redireciona se houver parâmetros de erro na URL

**Código chave:**
```typescript
// Verifica erros PRIMEIRO
const errorParam = searchParams.get('error')
if (errorParam === 'usuario_nao_autorizado' || errorParam === 'config') {
  // Força sign out e não redireciona
  await supabase.auth.signOut()
  return
}

// Só verifica autenticação DEPOIS de tratar erros
const { data: { user }, error } = await supabase.auth.getUser()

// Verifica se usuário existe na tabela users antes de redirecionar
if (user && !error && !errorParam) {
  const { data: userData } = await supabase
    .from('users')
    .select('id, ativo')
    .eq('email', user.email)
    .single()
  
  // Só redireciona se usuário existe e está ativo
  if (userData && userData.ativo) {
    router.push('/dashboard')
  } else {
    // Se não existe, faz sign out
    await supabase.auth.signOut()
  }
}
```

## 🧪 Como Testar

1. **Teste 1: Usuário não autenticado**
   - Acesse qualquer rota protegida
   - Deve redirecionar para `/login` sem loop

2. **Teste 2: Usuário autenticado mas não na tabela users**
   - Faça login com usuário que existe no Supabase Auth mas não na tabela `users`
   - Deve mostrar erro "Usuário não autorizado" sem loop

3. **Teste 3: Usuário autenticado e autorizado**
   - Faça login com usuário válido
   - Deve redirecionar para `/dashboard` sem loop

4. **Teste 4: Variáveis de ambiente faltando**
   - Remova temporariamente variáveis de ambiente no Vercel
   - Deve redirecionar para `/login?error=config` sem loop

## 📋 Checklist de Verificação

- [x] Middleware verifica se já está na página de login antes de redirecionar
- [x] Página de login verifica erros antes de verificar autenticação
- [x] Página de login verifica se usuário existe na tabela `users` antes de redirecionar
- [x] Sign out é feito quando há erro de autorização
- [x] Não há redirecionamentos desnecessários

## 🚀 Deploy

As correções foram aplicadas e estão disponíveis no commit:
- `f5c93f5` - fix: Melhorar logica de redirecionamento para evitar loops infinitos

## ⚠️ Notas Importantes

1. **Variáveis de Ambiente:** Certifique-se de que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão configuradas no Vercel

2. **Tabela Users:** Todos os usuários autenticados devem existir na tabela `users` com `ativo = true`

3. **Cache do Navegador:** Se ainda houver problemas, limpe os cookies e cache do navegador

## 🐛 Troubleshooting

### Ainda há loop de redirecionamento?

1. **Verifique variáveis de ambiente no Vercel:**
   - Settings → Environment Variables
   - Certifique-se de que estão configuradas para Production

2. **Verifique logs do Vercel:**
   - Deployments → Runtime Logs
   - Procure por erros relacionados a autenticação

3. **Limpe cookies do navegador:**
   - O navegador pode ter cookies antigos causando problemas

4. **Verifique se usuário existe na tabela users:**
   ```sql
   SELECT * FROM users WHERE email = 'seu@email.com';
   ```

### Erro "Missing Supabase environment variables"

- Configure as variáveis de ambiente no Vercel Dashboard
- Faça um redeploy após configurar

