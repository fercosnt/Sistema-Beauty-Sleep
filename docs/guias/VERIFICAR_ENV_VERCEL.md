# 🔧 Como Verificar Variáveis de Ambiente no Vercel

## ⚠️ Erro Atual

```
500: INTERNAL_SERVER_ERROR
Code: MIDDLEWARE_INVOCATION_FAILED
```

**Causa mais provável:** Variáveis de ambiente não configuradas no Vercel.

---

## 📋 Passo a Passo - Verificar/Configurar Variáveis

### 1. Acessar Vercel Dashboard

1. Acesse: https://vercel.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto **Sistema-Beauty-Sleep**

### 2. Verificar Variáveis de Ambiente

1. No menu lateral, clique em **Settings**
2. Clique em **Environment Variables** (no menu lateral esquerdo)

### 3. Verificar se Existem as Variáveis

Você deve ver pelo menos estas duas variáveis:

- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Se NÃO Existem - Adicionar

Para cada variável que estiver faltando:

1. Clique no botão **Add New** (ou **Add**)
2. Preencha:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL` (ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **Value**: Cole o valor do seu arquivo `.env.local`
   - **Environment**: Selecione TODAS as opções:
     - ☑️ Production
     - ☑️ Preview  
     - ☑️ Development
3. Clique em **Save**

### 5. Se JÁ Existem - Verificar Valores

1. Clique na variável para editar
2. Verifique se o **Value** está correto
3. Verifique se está marcado para **Production** (importante!)
4. Se necessário, atualize e salve

### 6. Onde Encontrar os Valores

Os valores estão no seu arquivo `.env.local` local:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**OU** no Supabase Dashboard:
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔄 Após Configurar - Fazer Redeploy

**IMPORTANTE:** Após adicionar/atualizar variáveis, você DEVE fazer um redeploy:

### Opção 1: Redeploy Manual (Recomendado)

1. No Vercel Dashboard, vá em **Deployments**
2. Encontre o último deployment (o que está com erro)
3. Clique nos **três pontos** (...) ao lado do deployment
4. Clique em **Redeploy**
5. Aguarde o deploy terminar

### Opção 2: Push para Trigger Deploy Automático

Se você já fez push das correções:

```bash
git push
```

O Vercel vai fazer deploy automaticamente, mas **certifique-se** de que as variáveis estão configuradas ANTES do deploy.

---

## ✅ Verificar se Funcionou

Após o redeploy:

1. Acesse a URL do seu site no Vercel
2. Se o erro desaparecer, está funcionando! ✅
3. Se ainda aparecer o erro:
   - Verifique os logs do deployment no Vercel
   - Verifique se as variáveis estão marcadas para **Production**
   - Tente fazer um redeploy novamente

---

## 📊 Verificar Logs do Deployment

Para ver erros detalhados:

1. No Vercel Dashboard, vá em **Deployments**
2. Clique no deployment que está com erro
3. Vá na aba **Logs** ou **Functions**
4. Procure por:
   - `Missing Supabase environment variables`
   - `Error fetching user data`
   - Qualquer erro relacionado a `NEXT_PUBLIC_SUPABASE`

---

## 🆘 Se Ainda Não Funcionar

1. **Verifique se as variáveis estão corretas:**
   - `NEXT_PUBLIC_SUPABASE_URL` deve começar com `https://`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` deve ser uma string longa começando com `eyJ...`

2. **Verifique se estão marcadas para Production:**
   - As variáveis devem estar disponíveis para **Production**

3. **Tente deletar e recriar as variáveis:**
   - Delete as variáveis existentes
   - Adicione novamente com os valores corretos
   - Faça um redeploy

4. **Verifique se o projeto está conectado ao repositório correto:**
   - Vercel Dashboard → Settings → Git
   - Verifique se está conectado ao repositório certo

---

## 📝 Checklist Rápido

- [ ] Variável `NEXT_PUBLIC_SUPABASE_URL` existe no Vercel
- [ ] Variável `NEXT_PUBLIC_SUPABASE_ANON_KEY` existe no Vercel
- [ ] Ambas estão marcadas para **Production**
- [ ] Valores estão corretos (copiados do `.env.local` ou Supabase Dashboard)
- [ ] Redeploy foi feito após configurar variáveis
- [ ] Testou acessar o site após o redeploy

---

## 💡 Dica

Se você não tem certeza dos valores, pode testar localmente primeiro:

```bash
# No terminal, na raiz do projeto
npm run dev
```

Se funcionar localmente mas não no Vercel, o problema é definitivamente as variáveis de ambiente não configuradas no Vercel.

