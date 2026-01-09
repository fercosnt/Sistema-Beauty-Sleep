# 🔧 Troubleshooting: Erro ao Criar Usuário

Este guia ajuda a resolver o erro **"Failed to create user: Failed to fetch (api.supabase.com)"** ao tentar cadastrar usuários no sistema.

---

## 🐛 Erro Comum

```
Failed to create user: Failed to fetch (api.supabase.com)
```

ou

```
Erro de conexão com o Supabase
```

---

## 🔍 Causas Possíveis

### 1. Variáveis de Ambiente Não Configuradas

**Sintoma:** Erro "Failed to fetch" ou "Configuração do servidor incompleta"

**Causa:** As variáveis de ambiente necessárias não estão configuradas no arquivo `.env.local`

**Solução:**

1. **Verifique se o arquivo `.env.local` existe:**
   - Deve estar na raiz do projeto
   - Se não existir, copie o arquivo `env.local.example`:
     ```powershell
     Copy-Item env.local.example .env.local
     ```

2. **Verifique se as variáveis estão preenchidas:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
   ```

3. **Onde encontrar as chaves:**
   - Acesse: [Supabase Dashboard](https://app.supabase.com)
   - Selecione seu projeto
   - Vá em **Settings** → **API**
   - Copie:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **IMPORTANTE: Use a Service Role Key, não a Anon Key!**

4. **Reinicie o servidor de desenvolvimento:**
   ```powershell
   # Pare o servidor (Ctrl+C)
   # Depois inicie novamente
   npm run dev
   ```

---

### 2. Service Role Key Incorreta

**Sintoma:** Erro "Invalid API key" ou "JWT"

**Causa:** Você está usando a **Anon Key** em vez da **Service Role Key**

**Solução:**

1. **Verifique qual chave você está usando:**
   - Abra `.env.local`
   - Verifique a variável `SUPABASE_SERVICE_ROLE_KEY`
   - Service Role Keys geralmente começam com `eyJ` e são mais longas que Anon Keys

2. **Obtenha a Service Role Key correta:**
   - Supabase Dashboard → Settings → API
   - Procure por **"service_role"** (não "anon public")
   - ⚠️ **ATENÇÃO:** Esta chave tem acesso total ao banco. Nunca exponha publicamente!

3. **Atualize o `.env.local` e reinicie o servidor**

---

### 3. URL do Supabase Incorreta

**Sintoma:** Erro de conexão ou timeout

**Causa:** A URL do projeto Supabase está incorreta ou o projeto foi pausado

**Solução:**

1. **Verifique a URL:**
   - Deve estar no formato: `https://xxxxx.supabase.co`
   - Não deve ter barra no final (`/`)
   - Deve começar com `https://`

2. **Verifique se o projeto está ativo:**
   - Acesse o Supabase Dashboard
   - Verifique se o projeto está rodando (não pausado)
   - Projetos gratuitos podem ser pausados após inatividade

3. **Teste a URL:**
   - Abra no navegador: `https://seu-projeto-id.supabase.co`
   - Deve retornar uma página do Supabase

---

### 4. Problemas de Rede/Firewall

**Sintoma:** Erro "Failed to fetch" ou "Network error"

**Causa:** Firewall, proxy ou problemas de rede bloqueando a conexão

**Solução:**

1. **Verifique sua conexão com a internet**
2. **Desative temporariamente o firewall** para testar
3. **Verifique se há proxy configurado** que possa estar bloqueando
4. **Teste em outra rede** (ex: hotspot do celular)

---

### 5. Servidor Next.js Não Está Rodando

**Sintoma:** Erro "Failed to fetch" ao tentar criar usuário

**Causa:** O servidor de desenvolvimento não está rodando ou a API route não está acessível

**Solução:**

1. **Verifique se o servidor está rodando:**
   ```powershell
   # Deve mostrar algo como:
   # ▲ Next.js 14.x.x
   # - Local: http://localhost:3000
   ```

2. **Inicie o servidor se necessário:**
   ```powershell
   npm run dev
   ```

3. **Verifique se a API route está acessível:**
   - Abra: `http://localhost:3000/api/usuarios/criar`
   - Deve retornar um erro de método (não "404 Not Found")

---

## ✅ Checklist de Verificação

Antes de reportar o problema, verifique:

- [ ] Arquivo `.env.local` existe na raiz do projeto
- [ ] `NEXT_PUBLIC_SUPABASE_URL` está preenchida e correta
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` está preenchida
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está preenchida (não a Anon Key!)
- [ ] Servidor Next.js está rodando (`npm run dev`)
- [ ] Projeto Supabase está ativo (não pausado)
- [ ] Você está logado como admin no sistema
- [ ] Reiniciou o servidor após alterar `.env.local`

---

## 🔧 Passo a Passo de Diagnóstico

### Passo 1: Verificar Variáveis de Ambiente

```powershell
# No PowerShell, na raiz do projeto:
Get-Content .env.local | Select-String "SUPABASE"
```

Deve mostrar:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Passo 2: Verificar se o Servidor Está Rodando

```powershell
# Deve estar rodando na porta 3000
# Verifique o terminal onde você executou `npm run dev`
```

### Passo 3: Verificar Logs do Console

1. Abra o **Console do Navegador** (F12)
2. Vá na aba **Console**
3. Tente criar um usuário
4. Veja se há erros mais detalhados

### Passo 4: Verificar Logs do Servidor

1. Veja o terminal onde o servidor Next.js está rodando
2. Procure por mensagens de erro ao tentar criar usuário
3. Erros comuns:
   - `SUPABASE_SERVICE_ROLE_KEY não está configurada`
   - `NEXT_PUBLIC_SUPABASE_URL não está configurada`
   - `Invalid API key`

---

## 🚨 Erros Específicos e Soluções

### Erro: "SUPABASE_SERVICE_ROLE_KEY não está configurada"

**Solução:**
1. Abra `.env.local`
2. Adicione: `SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui`
3. Reinicie o servidor

### Erro: "Invalid API key" ou "JWT expired"

**Solução:**
1. Verifique se está usando a **Service Role Key** (não Anon Key)
2. Obtenha uma nova chave no Supabase Dashboard
3. Atualize `.env.local`
4. Reinicie o servidor

### Erro: "Failed to fetch" sem mais detalhes

**Solução:**
1. Verifique se o servidor Next.js está rodando
2. Verifique se todas as variáveis de ambiente estão configuradas
3. Verifique os logs do servidor (terminal)
4. Verifique os logs do navegador (F12 → Console)

### Erro: "Este email já está cadastrado"

**Solução:**
- Este não é um erro de configuração
- O email já existe no sistema
- Use outro email ou edite o usuário existente

---

## 📝 Exemplo de `.env.local` Correto

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qigbblypwkgflwnrrhzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2JibHlwd2tnZmx3bnJyaHpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTgwMDAwMDAwMH0.xxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpZ2JibHlwd2tnZmx3bnJyaHpnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxODAwMDAwMDAwfQ.xxxxx

# Site URL (opcional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ **NUNCA commite o arquivo `.env.local` com valores reais!**

---

## 🔗 Links Úteis

- [Guia: Configurar .env.local](CONFIGURAR_ENV_LOCAL.md)
- [Guia: Configurar SMTP](CONFIGURAR_SMTP_SUPABASE.md)
- [Supabase Dashboard](https://app.supabase.com)
- [Documentação Supabase](https://supabase.com/docs)

---

## 💡 Dicas Adicionais

1. **Sempre reinicie o servidor** após alterar `.env.local`
2. **Use a Service Role Key**, não a Anon Key para operações admin
3. **Mantenha as chaves seguras** - nunca as exponha publicamente
4. **Verifique os logs** - tanto do servidor quanto do navegador
5. **Teste em modo anônimo** - para descartar problemas de cache

---

## 📞 Ainda com Problemas?

Se após seguir todos os passos o problema persistir:

1. **Verifique os logs completos:**
   - Console do navegador (F12)
   - Terminal do servidor Next.js
   - Logs do Supabase (Dashboard → Logs → Auth Logs)

2. **Colete informações:**
   - Mensagem de erro completa
   - Screenshot do erro
   - Conteúdo do `.env.local` (sem as chaves reais!)
   - Logs do console e servidor

3. **Verifique se:**
   - O projeto Supabase não está pausado
   - Você tem permissões de admin no sistema
   - A conta Supabase não está com problemas

---

**Última atualização:** 2025-01-08

