# Guia: Como Criar Usuário de Teste

## 📋 Situação Atual

Não há usuários cadastrados no sistema. Você precisa criar um usuário de teste para fazer login.

## 🚀 Opção 1: Criar Usuário via Supabase Dashboard (Recomendado)

### Passo 1: Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: `qigbblypwkgflwnrrhzg`
3. No menu lateral, clique em **Authentication** (ou **Auth**)

### Passo 2: Criar Usuário

1. Clique na aba **Users** (ou **Usuários**)
2. Clique no botão **Add User** (ou **Adicionar Usuário**)
3. Preencha:
   - **Email**: `admin@beautysmile.com` (ou qualquer email válido)
   - **Password**: Escolha uma senha (ex: `admin123`)
   - **Auto Confirm User**: ✅ Marque esta opção (para não precisar confirmar email)
   - **Send invite email**: ❌ **NÃO marque** esta opção (evita erro se SMTP não estiver configurado)
4. Clique em **Create User** (ou **Criar Usuário**)

**💡 Dica:** Se você receber erro "Failed to fetch" ou "Error sending invite email", certifique-se de que **"Send invite email" está DESMARCADO**. Você não precisa enviar email para criar o usuário - apenas defina a senha manualmente.

### Passo 3: Inserir na Tabela `users`

Após criar o usuário no Auth, você precisa inserir na tabela `users` do banco:

1. No Supabase Dashboard, vá em **SQL Editor**
2. Execute este SQL (substitua o email se necessário):

```sql
INSERT INTO users (email, nome, role, ativo) 
VALUES ('admin@beautysmile.com', 'Administrador', 'admin', true)
ON CONFLICT (email) DO UPDATE SET ativo = true;
```

### Passo 4: Fazer Login

Agora você pode fazer login com:
- **Email**: `admin@beautysmile.com`
- **Senha**: A senha que você definiu no Passo 2

---

## 🚀 Opção 2: Criar Usuário via Cadastro no Sistema (Se Habilitado)

Se o cadastro estiver habilitado no Supabase Auth:

1. Acesse: `http://localhost:3000/login`
2. Clique em **Cadastre-se** (ou link de signup)
3. Preencha:
   - **Email**: Seu email
   - **Senha**: Escolha uma senha
4. Após criar, você precisará inserir na tabela `users` manualmente (veja Passo 3 acima)

---

## 🔧 Criar Múltiplos Usuários de Teste

Para criar os 3 usuários sugeridos (admin, equipe, recepção):

### 1. Criar no Supabase Auth Dashboard:

- **admin@beautysmile.com** (senha: `admin123`)
- **dentista@beautysmile.com** (senha: `dentista123`)
- **recepcao@beautysmile.com** (senha: `recepcao123`)

### 2. Executar este SQL no SQL Editor:

```sql
INSERT INTO users (email, nome, role, ativo) VALUES
  ('admin@beautysmile.com', 'Administrador', 'admin', true),
  ('dentista@beautysmile.com', 'Dentista Teste', 'equipe', true),
  ('recepcao@beautysmile.com', 'Recepcionista Teste', 'recepcao', true)
ON CONFLICT (email) DO UPDATE SET ativo = true;
```

---

## ✅ Verificar se Funcionou

Após criar o usuário:

1. Acesse: `http://localhost:3000/login`
2. Digite o email e senha
3. Clique em **Entrar**
4. Você deve ser redirecionado para `/dashboard`

---

## 🐛 Problemas Comuns

### Erro: "Failed to fetch (api.supabase.com)" ou "Failed to invite user"

**Causa:** Tentativa de enviar email de convite sem SMTP configurado

**Solução:**
1. Ao criar o usuário, **NÃO marque** a opção "Send invite email"
2. Marque **"Auto Confirm User"** ✅
3. Defina uma senha manualmente
4. Clique em "Create User"

**Alternativa:** Se você realmente precisa enviar emails, configure o SMTP primeiro (veja [Guia de Configuração SMTP](CONFIGURAR_SMTP_SUPABASE.md))

---

### Erro: "Invalid login credentials"
- Verifique se o email e senha estão corretos
- Verifique se o usuário foi criado no Supabase Auth

### Erro: "User not authorized"
- Verifique se o usuário foi inserido na tabela `users`
- Verifique se `ativo = true` na tabela `users`

### Erro: "Email not confirmed"
- No Supabase Auth Dashboard, vá em **Users** → encontre seu usuário → clique nos 3 pontos → **Auto Confirm User**

---

## 📝 Credenciais Sugeridas para Teste

| Email | Senha | Role | Descrição |
|-------|-------|------|-----------|
| `admin@beautysmile.com` | `admin123` | admin | Acesso total |
| `dentista@beautysmile.com` | `dentista123` | equipe | Acesso limitado |
| `recepcao@beautysmile.com` | `recepcao123` | recepcao | Acesso apenas leitura |

**⚠️ IMPORTANTE**: Estas são senhas de teste. Em produção, use senhas fortes!

