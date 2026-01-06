# Guia: Deploy do Site para Produção

Este guia explica como fazer o deploy do Beauty Sleep para produção/online.

**⚠️ IMPORTANTE**: Este guia faz parte da **Fase 10: Deploy e Pós-Deploy**. Execute apenas após completar todas as Fases 1-9 (incluindo todos os testes).

## 🎯 Opções de Plataforma

### Recomendado: Vercel (Gratuito e Otimizado para Next.js)
- ✅ Deploy automático do GitHub
- ✅ SSL/HTTPS automático
- ✅ CDN global
- ✅ Variáveis de ambiente fáceis de configurar
- ✅ Integração nativa com Next.js

### Alternativas:
- **Netlify**: Similar ao Vercel, também gratuito
- **Railway**: Boa opção com banco de dados integrado
- **Render**: Alternativa moderna
- **AWS/GCP/Azure**: Para empresas (mais complexo)

---

## 📋 Pré-requisitos

1. ✅ Conta no GitHub (ou GitLab/Bitbucket)
2. ✅ Código commitado e enviado para o repositório
3. ✅ Conta no Vercel (gratuita): https://vercel.com
4. ✅ Projeto Supabase configurado e funcionando

---

## 🚀 Método 1: Deploy na Vercel (Recomendado)

### Passo 1: Preparar o Repositório

1. **Certifique-se de que tudo está commitado**:
   ```bash
   git status
   git add .
   git commit -m "Preparar para deploy"
   git push origin main
   ```

2. **Verifique o `.gitignore`**:
   - Certifique-se de que `.env.local` está no `.gitignore`
   - Certifique-se de que `node_modules` está no `.gitignore`

### Passo 2: Criar Conta na Vercel

1. Acesse: https://vercel.com
2. Clique em **Sign Up**
3. Escolha **Continue with GitHub** (recomendado)
4. Autorize o acesso ao GitHub

### Passo 3: Importar Projeto

1. No dashboard da Vercel, clique em **Add New...** → **Project**
2. Selecione seu repositório do GitHub
3. Clique em **Import**

### Passo 4: Configurar Build Settings

A Vercel detecta automaticamente Next.js, mas verifique:

- **Framework Preset**: Next.js
- **Root Directory**: `./` (raiz do projeto)
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `.next` (automático)
- **Install Command**: `npm install` (automático)

### Passo 5: Configurar Variáveis de Ambiente

Na seção **Environment Variables**, adicione:

#### Variáveis Obrigatórias:

```
NEXT_PUBLIC_SUPABASE_URL=https://[seu-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

#### Variáveis Opcionais (se usar Biologix):

```
BIOLOGIX_USERNAME=seu_username_biologix
BIOLOGIX_PASSWORD=sua_senha_aqui
BIOLOGIX_SOURCE=100
BIOLOGIX_PARTNER_ID=seu_partner_id_aqui
```

**Como adicionar**:
1. Clique em **Add** para cada variável
2. **Name**: Nome da variável (ex: `NEXT_PUBLIC_SUPABASE_URL`)
3. **Value**: Valor da variável
4. **Environment**: Selecione **Production**, **Preview** e **Development**
5. Clique em **Save**

**⚠️ IMPORTANTE**: 
- Use os valores REAIS do seu `.env.local`
- NUNCA commite o `.env.local` no Git
- A Vercel mantém essas variáveis seguras

### Passo 6: Configurar Domínio (Opcional)

1. Na aba **Settings** → **Domains**
2. Adicione seu domínio personalizado (ex: `beautysleep.com.br`)
3. Siga as instruções para configurar DNS
4. Ou use o domínio gratuito da Vercel: `seu-projeto.vercel.app`

### Passo 7: Fazer Deploy

1. Clique em **Deploy**
2. Aguarde o build (2-5 minutos)
3. Quando concluir, você verá: **"Deployment successful"**
4. Clique no link para acessar seu site: `https://seu-projeto.vercel.app`

---

## 🔧 Método 2: Deploy Manual (Build Local)

Se preferir fazer build local e enviar:

### Passo 1: Build Local

```bash
# Instalar dependências
npm install

# Criar build de produção
npm run build

# Testar build localmente
npm start
```

### Passo 2: Enviar para Servidor

1. Copie a pasta `.next` e `public` para seu servidor
2. Configure variáveis de ambiente no servidor
3. Execute `npm start` no servidor

**⚠️ Não recomendado**: Mais complexo e requer servidor próprio.

---

## 🔐 Configurar Supabase para Produção

### Passo 1: Atualizar Site URL no Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Authentication** → **URL Configuration**
4. **Site URL**: `https://seu-projeto.vercel.app` (ou seu domínio)
5. Clique em **Save**

### Passo 2: Adicionar Redirect URLs

Na seção **Redirect URLs**, adicione:

```
https://seu-projeto.vercel.app/auth/callback
https://seu-projeto.vercel.app/auth/reset-password
https://seu-projeto.vercel.app/dashboard
https://seu-projeto.vercel.app/login
```

**Substitua** `seu-projeto.vercel.app` pelo seu domínio real.

### Passo 3: Configurar Email (Produção)

1. **Authentication** → **Providers** → **Email**
2. **Enable Email Signup**: ✅ Habilitado
3. **Confirm email**: ✅ Habilitado (recomendado para produção)
4. **Email Templates**: Personalize se necessário

---

## ✅ Verificações Pós-Deploy

### Checklist de Testes:

- [ ] **Acessar o site**: `https://seu-projeto.vercel.app`
- [ ] **Página inicial**: Redireciona para `/login` ou `/dashboard`
- [ ] **Login**: Teste fazer login
- [ ] **Dashboard**: Acesse após login
- [ ] **Rotas protegidas**: Verifique se estão protegidas
- [ ] **Reset de senha**: Teste o fluxo completo
- [ ] **HTTPS**: Verifique se está usando HTTPS (não HTTP)
- [ ] **Console do navegador**: Verifique se não há erros (F12)

### Verificar Variáveis de Ambiente:

1. No Vercel, vá em **Settings** → **Environment Variables**
2. Verifique se todas as variáveis estão configuradas
3. Certifique-se de que estão marcadas para **Production**

### Verificar Logs:

1. No Vercel, vá em **Deployments**
2. Clique no deployment mais recente
3. Veja os **Build Logs** para verificar se houve erros
4. Veja os **Runtime Logs** para verificar erros em produção

---

## 🔄 Deploy Automático (Recomendado)

### Configurar Deploy Automático:

1. No Vercel, vá em **Settings** → **Git**
2. Certifique-se de que **Automatic deployments** está habilitado
3. Agora, sempre que você fizer `git push`, o Vercel fará deploy automaticamente

### Branches:

- **Production**: Deploy automático da branch `main` ou `master`
- **Preview**: Deploy automático de outras branches (para testes)

---

## 🐛 Troubleshooting

### Erro: "Environment variables not found"

**Solução**:
- Verifique se todas as variáveis estão configuradas no Vercel
- Certifique-se de que estão marcadas para **Production**
- Reinicie o deployment após adicionar variáveis

### Erro: "Invalid redirect URL"

**Solução**:
- Adicione todas as URLs de produção no Supabase Dashboard
- Verifique se a **Site URL** está correta no Supabase

### Erro: "Build failed"

**Solução**:
- Veja os **Build Logs** no Vercel
- Verifique se todas as dependências estão no `package.json`
- Certifique-se de que não há erros de TypeScript/ESLint

### Erro: "User not found" após login

**Solução**:
- Verifique se o usuário existe na tabela `users` do Supabase
- Verifique se o email corresponde entre `auth.users` e `users`
- Verifique se o usuário está ativo (`ativo = true`)

### Site não carrega / Erro 500

**Solução**:
- Verifique os **Runtime Logs** no Vercel
- Verifique se as variáveis de ambiente estão corretas
- Verifique se o Supabase está acessível

---

## 📝 Checklist Final

Antes de considerar o deploy completo:

- [ ] ✅ Código commitado e no GitHub
- [ ] ✅ Projeto importado na Vercel
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ Build bem-sucedido
- [ ] ✅ Site acessível via HTTPS
- [ ] ✅ Supabase configurado com URLs de produção
- [ ] ✅ Login funcionando
- [ ] ✅ Rotas protegidas funcionando
- [ ] ✅ Deploy automático configurado (opcional)

---

## 🔗 Links Úteis

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/hosting/overview)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

## 💡 Dicas

1. **Use Preview Deployments**: Teste em branches antes de fazer merge
2. **Monitore Logs**: Verifique os logs regularmente para detectar problemas
3. **Backup**: Mantenha backups do banco de dados Supabase
4. **Performance**: Use o Vercel Analytics para monitorar performance
5. **Segurança**: Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend

---

**Após completar o deploy, seu site estará online e acessível! 🎉**

