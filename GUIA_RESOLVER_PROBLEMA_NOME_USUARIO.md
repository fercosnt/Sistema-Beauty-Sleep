# Guia: Resolver Problema de Nome de Usuário Incorreto

## 🔍 Problema

Quando você faz login com `admin@beautysmile.com`, o nome exibido continua sendo "Henrique" (de outra conta) ao invés do nome correto da tabela `users`.

## ✅ Solução

### Opção 1: Limpar Cache do Navegador (Mais Rápido)

O problema geralmente é cache do navegador ou sessão antiga do Supabase Auth.

**Chrome/Edge:**
1. Pressione `F12` para abrir DevTools
2. Vá na aba **Application** (ou **Aplicativo**)
3. No menu lateral, expanda **Local Storage**
4. Clique em `http://localhost:3000` (ou sua URL)
5. Procure por chaves relacionadas ao Supabase (geralmente começam com `sb-`)
6. Clique com botão direito → **Clear** (ou **Limpar**)
7. Faça o mesmo para **Session Storage**
8. Recarregue a página (`Ctrl+R` ou `F5`)

**Firefox:**
1. Pressione `F12` para abrir DevTools
2. Vá na aba **Storage** (ou **Armazenamento**)
3. Expanda **Local Storage** e **Session Storage**
4. Selecione `http://localhost:3000`
5. Clique com botão direito → **Delete All** (ou **Excluir Tudo**)
6. Recarregue a página

**Limpar Tudo (Recomendado):**
1. Pressione `Ctrl+Shift+Delete` (Windows) ou `Cmd+Shift+Delete` (Mac)
2. Selecione "Cookies e outros dados do site"
3. Selecione "Última hora" ou "Últimas 24 horas"
4. Clique em "Limpar dados"

### Opção 2: Fazer Logout e Login Novamente

1. Clique no seu avatar no canto superior direito
2. Clique em **Sair** (ou **Logout**)
3. Feche completamente o navegador
4. Abra o navegador novamente
5. Acesse `http://localhost:3000/login`
6. Faça login novamente com `admin@beautysmile.com`

### Opção 3: Verificar e Atualizar Registro na Tabela `users`

Se o problema persistir, verifique se o registro está correto:

1. Acesse o **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Execute:

```sql
-- Verificar registro atual
SELECT email, nome, role, ativo 
FROM users 
WHERE email = 'admin@beautysmile.com';

-- Se o nome estiver incorreto, atualize:
UPDATE users 
SET nome = 'Administrador'
WHERE email = 'admin@beautysmile.com';
```

### Opção 4: Limpar Sessão do Supabase Auth

Se nada funcionar, você pode limpar a sessão do Supabase Auth diretamente:

1. Abra o **Console do Navegador** (`F12` → aba **Console`)
2. Execute:

```javascript
// Limpar sessão do Supabase
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## 🔧 Correção Implementada

O componente `Header.tsx` foi atualizado para:
- ✅ Recarregar dados do usuário quando a sessão muda
- ✅ Escutar mudanças de autenticação (SIGNED_IN, TOKEN_REFRESHED)
- ✅ Forçar refresh dos dados após login

## 📝 Verificação

Após seguir os passos acima:

1. Faça logout
2. Limpe o cache (Opção 1)
3. Faça login novamente
4. O nome deve aparecer como **"Administrador"** (ou o nome que está na tabela `users`)

## 🐛 Se o Problema Persistir

1. Verifique se há múltiplos registros na tabela `users` com o mesmo email:
   ```sql
   SELECT email, nome, role, COUNT(*) 
   FROM users 
   WHERE email = 'admin@beautysmile.com'
   GROUP BY email, nome, role;
   ```

2. Verifique se o email está correto no Supabase Auth:
   - Vá em **Authentication** → **Users**
   - Procure por `admin@beautysmile.com`
   - Verifique se o email está exatamente igual

3. Verifique se há conflito de emails (case-sensitive):
   ```sql
   SELECT email, nome, role 
   FROM users 
   WHERE LOWER(email) = LOWER('admin@beautysmile.com');
   ```

