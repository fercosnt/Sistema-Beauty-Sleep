# Guia: Configuração do Supabase Auth no Dashboard

Este guia explica como configurar a autenticação do Supabase no dashboard para que o sistema funcione corretamente.

## 📋 Pré-requisitos

- Acesso ao Supabase Dashboard do seu projeto
- URL do seu projeto (exemplo: `https://qigbblypwkgflwnrrhzg.supabase.co`)
- URL do seu site em produção (ou `http://localhost:3000` para desenvolvimento)

## 🔧 Passo 1: Acessar as Configurações de Auth

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto: `qigbblypwkgflwnrrhzg`
3. No menu lateral, clique em **Authentication** (ou **Auth**)
4. Clique na aba **URL Configuration** (ou **Configuração de URL**)

## 🔧 Passo 2: Configurar Site URL

Na seção **Site URL**, configure:

- **Site URL**: 
  - Para desenvolvimento: `http://localhost:3000`
  - Para produção: `https://seu-dominio.com` (substitua pelo seu domínio real)

Esta URL é usada como base para redirecionamentos após login/logout.

## 🔧 Passo 3: Configurar Redirect URLs

Na seção **Redirect URLs**, adicione as seguintes URLs (uma por linha):

### Para Desenvolvimento:
```
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
http://localhost:3000/dashboard
```

### Para Produção:
```
https://seu-dominio.com/auth/callback
https://seu-dominio.com/auth/reset-password
https://seu-dominio.com/dashboard
```

**Importante**: Substitua `seu-dominio.com` pelo seu domínio real em produção.

## 🔧 Passo 4: Habilitar Provider de Email

1. Na aba **Providers** (ou **Provedores**), encontre **Email**
2. Certifique-se de que o provider **Email** está **habilitado** (toggle ON)
3. Configure as opções:

   - **Enable Email Signup**: ✅ Habilitado (permite cadastro por email)
   - **Confirm email**: 
     - Para desenvolvimento: ⚠️ Desabilitado (permite login sem confirmar email)
     - Para produção: ✅ Habilitado (requer confirmação de email)

## 🔧 Passo 5: Configurar Templates de Email (Opcional)

1. Na aba **Email Templates** (ou **Templates de Email**)
2. Personalize os templates se desejar:
   - **Confirm signup**: Email de confirmação de cadastro
   - **Magic Link**: Link mágico para login
   - **Change Email Address**: Confirmação de mudança de email
   - **Reset Password**: Recuperação de senha

### ⚠️ Importante: Template de Confirmação de Cadastro

Se você habilitou "Confirm email", certifique-se de que o template **Confirm signup** está configurado corretamente:

1. Abra o template **Confirm signup**
2. Verifique se o link de confirmação está correto:
   ```
   {{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email
   
   ```
3. Se não estiver, atualize para o formato acima

## 🔧 Passo 6: Configurar JWT Expiry (Opcional)

1. Na aba **Settings** (ou **Configurações**)
2. Configure **JWT expiry**:
   - Padrão: `3600` segundos (1 hora)
   - Recomendado para desenvolvimento: `86400` segundos (24 horas)
   - Para produção: `3600` segundos (1 hora) é seguro

## 🔧 Passo 7: Verificar Configurações de Segurança

1. Na aba **Settings**, verifique:
   - **Enable signup**: ✅ Habilitado (se você quer permitir novos cadastros)
   - **Enable email confirmations**: Conforme sua preferência
   - **Minimum password length**: `6` (padrão, pode aumentar para 8+ em produção)

## ✅ Verificação Final

Após configurar, teste:

1. **Login**: Tente fazer login com um usuário existente
2. **Cadastro**: Tente criar uma nova conta (se habilitado)
3. **Reset de Senha**: Teste o fluxo de recuperação de senha
4. **Callback**: Verifique se o redirecionamento após login funciona

## 🐛 Troubleshooting

### Erro: "Invalid redirect URL"
- Verifique se todas as URLs de redirecionamento estão na lista de **Redirect URLs**
- Certifique-se de que não há espaços ou caracteres especiais nas URLs

### Erro: "Email not confirmed"
- Se você habilitou confirmação de email, verifique sua caixa de entrada
- Para desenvolvimento, você pode desabilitar temporariamente a confirmação

### Erro: "User not found"
- Certifique-se de que o usuário existe na tabela `users` do banco de dados
- Verifique se o email do usuário corresponde ao email usado no login
- Verifique se o usuário está ativo (`ativo = true`)

### Redirecionamento não funciona
- Verifique se a **Site URL** está configurada corretamente
- Verifique se as **Redirect URLs** incluem todas as rotas necessárias
- Limpe o cache do navegador e tente novamente

## 📝 Notas Importantes

1. **Desenvolvimento vs Produção**: Configure URLs diferentes para cada ambiente
2. **Segurança**: Em produção, sempre habilite confirmação de email
3. **HTTPS**: Em produção, sempre use HTTPS (não HTTP)
4. **Domínio**: Certifique-se de que o domínio em produção está correto

## 🔗 Links Úteis

- [Documentação do Supabase Auth](https://supabase.com/docs/guides/auth)
- [Configuração de Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

---

**Após completar esta configuração, marque a tarefa 2.1.4 como concluída no arquivo de tarefas.**

