# 🚀 Deploy Manual via Vercel CLI (Sem Conexão GitHub)

**Use esta opção se:** Você não tem acesso ao repositório GitHub ou prefere deploy manual.

---

## 📋 Pré-requisitos

- [ ] Node.js instalado
- [ ] Repositório clonado localmente (ou acesso aos arquivos)
- [ ] Conta Vercel criada

---

## 🔧 Passo a Passo

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

**Verificar instalação:**
```bash
vercel --version
```

---

### 2. Login no Vercel

```bash
vercel login
```

Isso abrirá o navegador para autenticação. Faça login com sua conta Vercel.

**Verificar login:**
```bash
vercel whoami
```

---

### 3. Navegar para o projeto

```bash
cd "caminho/para/o/projeto"
```

**Exemplo:**
```bash
cd "C:\Users\LuizHenriqueSantosdo\OneDrive - MEDLASER COMERCIO IMPORTACAO E EXPORTACAO LTDA\Documentos\Trabalho BS\Sistema-Beauty-Sleep-main"
```

---

### 4. Deploy inicial

```bash
vercel
```

**O Vercel fará perguntas:**

```
? Set up and deploy "~/Sistema-Beauty-Sleep-main"? [Y/n] Y
? Which scope do you want to deploy to? [Selecione sua conta/organização]
? Link to existing project? [y/N] N
? What's your project's name? beauty-sleep
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

**Primeiro deploy:** Será criado como "Preview Deployment"

---

### 5. Configurar variáveis de ambiente

**Opção A: Via CLI (interativo)**

```bash
# Para ambiente Preview (staging)
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add SUPABASE_SERVICE_ROLE_KEY preview sensitive

# Para cada variável:
# 1. Digite o valor quando solicitado
# 2. Para SUPABASE_SERVICE_ROLE_KEY, marque como sensitive (não aparece nos logs)
```

**Opção B: Via Dashboard (mais fácil)**

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto
3. Settings → Environment Variables
4. Adicione cada variável:
   - Nome: `NEXT_PUBLIC_SUPABASE_URL`
   - Valor: `https://[project-id].supabase.co`
   - Environment: **Preview**
   - Repetir para outras variáveis

---

### 6. Deploy novamente com variáveis

```bash
vercel
```

Ou para forçar novo deploy:

```bash
vercel --force
```

---

### 7. Obter URL do deployment

Após deploy, você verá algo como:

```
✅ Production: https://beauty-sleep-abc123.vercel.app
```

**Salve esta URL!**

---

## 🔄 Deploy para Produção (Depois)

Após aprovação dos stakeholders:

```bash
vercel --prod
```

**⚠️ IMPORTANTE:** Configure variáveis de ambiente para produção também!

---

## ⚙️ Comandos Úteis

```bash
# Ver deployments
vercel ls

# Ver logs de um deployment
vercel logs [deployment-url]

# Remover deployment
vercel remove [deployment-url]

# Ver informações do projeto
vercel inspect

# Listar variáveis de ambiente
vercel env ls
```

---

## 🔐 Configurar Variáveis via Arquivo

Criar arquivo `.env.vercel` (não commitar no Git!):

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

Depois:

```bash
vercel env pull .env.vercel.local
```

**⚠️ Não recomendado para produção!** Use o Dashboard do Vercel.

---

## 📋 Checklist Completo

- [ ] Vercel CLI instalado
- [ ] Login feito (`vercel login`)
- [ ] Repositório clonado localmente
- [ ] Deploy inicial feito (`vercel`)
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy final feito
- [ ] URL obtida e testada

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
**Solução:** Execute `npm install` antes de fazer deploy

### Erro: "Build failed"
**Solução:** 
- Verifique se `npm run build` funciona localmente
- Verifique logs: `vercel logs`

### Variáveis não funcionam
**Solução:**
- Verificar se variáveis foram adicionadas para ambiente correto (Preview)
- Fazer novo deploy após adicionar variáveis

---

## ✅ Vantagens do Deploy Manual

- ✅ Não precisa acesso ao GitHub
- ✅ Controle total sobre quando fazer deploy
- ✅ Funciona mesmo sem conexão GitHub-Vercel
- ✅ Pode fazer deploy de qualquer branch/local

---

## ❌ Desvantagens

- ❌ Não é automático (não faz deploy a cada push)
- ❌ Precisa executar manualmente
- ❌ Precisa ter código localmente

---

**Guia criado em:** 2025-12-02

