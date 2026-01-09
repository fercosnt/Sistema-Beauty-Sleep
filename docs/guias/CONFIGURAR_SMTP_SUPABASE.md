# 📧 Guia: Configurar SMTP no Supabase

Este guia explica como configurar o envio de emails no Supabase para que os emails de convite e reset de senha sejam enviados automaticamente.

---

## 📋 Pré-requisitos

1. Acesso ao Supabase Dashboard do seu projeto
2. Um provedor SMTP configurado (SendGrid, AWS SES, Gmail, etc.)
3. Credenciais SMTP do seu provedor

---

## 🚀 Passo a Passo

### 1. Acessar Configurações SMTP

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** (Configurações) no menu lateral
4. Clique em **Auth** (Autenticação)
5. Role até encontrar **SMTP Settings** (Configurações SMTP)
6. Clique em **Enable custom SMTP** (Habilitar SMTP personalizado)

### 2. Preencher Sender Details (Detalhes do Remetente)

#### **Sender email address** (Email do remetente)
- **O que é:** O email que aparecerá como remetente
- **Exemplo:** `noreply@beautysleep.com.br` ou `contato@beautysleep.com.br`
- **Importante:** 
  - Deve ser um email válido do seu domínio
  - O domínio deve estar verificado no seu provedor SMTP
  - Não use emails pessoais (gmail.com, hotmail.com, etc.) em produção

#### **Sender name** (Nome do remetente)
- **O que é:** Nome que aparecerá na caixa de entrada do destinatário
- **Exemplo:** `Beauty Sleep` ou `Sistema Beauty Sleep`
- **Dica:** Use um nome que identifique claramente seu sistema

### 3. Preencher SMTP Provider Settings (Configurações do Provedor)

Você precisa escolher um provedor SMTP. Abaixo estão as opções mais comuns:

---

## 🔧 Provedores SMTP Recomendados

### Opção 1: SendGrid (Recomendado para começar)

**Por quê:** Fácil de configurar, 100 emails grátis por dia, boa documentação

**Como configurar:**

1. **Criar conta no SendGrid:**
   - Acesse [sendgrid.com](https://sendgrid.com)
   - Crie uma conta gratuita
   - Verifique seu email

2. **Criar API Key:**
   - Vá em **Settings** > **API Keys**
   - Clique em **Create API Key**
   - Dê um nome (ex: "Supabase SMTP")
   - Selecione **Full Access** ou **Restricted Access** > **Mail Send**
   - Copie a API Key gerada

3. **Configurar no Supabase:**
   - **Host:** `smtp.sendgrid.net`
   - **Port:** `587` (recomendado) ou `465` (SSL)
   - **Username:** `apikey` (literalmente a palavra "apikey")
   - **Password:** Cole a API Key que você copiou do SendGrid

4. **Verificar domínio (opcional mas recomendado):**
   - No SendGrid, vá em **Settings** > **Sender Authentication**
   - Configure **Domain Authentication** para seu domínio
   - Isso melhora a entrega dos emails

---

### Opção 2: AWS SES (Amazon Simple Email Service)

**Por quê:** Muito confiável, escalável, bom para produção

**Como configurar:**

1. **Criar conta AWS:**
   - Acesse [aws.amazon.com](https://aws.amazon.com)
   - Crie uma conta (se não tiver)
   - Acesse o console AWS SES

2. **Verificar email/domínio:**
   - No AWS SES, vá em **Verified identities**
   - Clique em **Create identity**
   - Adicione seu email ou domínio
   - Siga as instruções para verificar

3. **Criar credenciais SMTP:**
   - No AWS SES, vá em **SMTP settings**
   - Clique em **Create SMTP credentials**
   - Dê um nome (ex: "Supabase")
   - Baixe as credenciais (você só verá a senha uma vez!)

4. **Configurar no Supabase:**
   - **Host:** `email-smtp.us-east-1.amazonaws.com` (ou sua região)
   - **Port:** `587`
   - **Username:** O username fornecido pelo AWS SES
   - **Password:** A senha que você baixou (salve em local seguro!)

**Regiões AWS SES:**
- `us-east-1`: `email-smtp.us-east-1.amazonaws.com`
- `us-west-2`: `email-smtp.us-west-2.amazonaws.com`
- `eu-west-1`: `email-smtp.eu-west-1.amazonaws.com`
- `sa-east-1`: `email-smtp.sa-east-1.amazonaws.com` (Brasil)

---

### Opção 3: Gmail (Apenas para testes/desenvolvimento)

**⚠️ ATENÇÃO:** Não recomendado para produção. Use apenas para testes.

**Como configurar:**

1. **Habilitar Senha de App no Google:**
   - Acesse [myaccount.google.com](https://myaccount.google.com)
   - Vá em **Segurança**
   - Ative **Verificação em duas etapas** (obrigatório)
   - Vá em **Senhas de app**
   - Crie uma senha de app para "Email"
   - Copie a senha gerada

2. **Configurar no Supabase:**
   - **Host:** `smtp.gmail.com`
   - **Port:** `587`
   - **Username:** Seu email Gmail completo
   - **Password:** A senha de app que você criou (não sua senha normal!)

---

### Opção 4: Mailgun

**Por quê:** Bom para produção, 5.000 emails grátis por mês

**Como configurar:**

1. **Criar conta no Mailgun:**
   - Acesse [mailgun.com](https://mailgun.com)
   - Crie uma conta
   - Verifique seu domínio

2. **Obter credenciais SMTP:**
   - No dashboard do Mailgun, vá em **Sending** > **Domain Settings**
   - Role até **SMTP credentials**
   - Copie as credenciais

3. **Configurar no Supabase:**
   - **Host:** `smtp.mailgun.org`
   - **Port:** `587`
   - **Username:** Seu username do Mailgun
   - **Password:** Sua senha do Mailgun

---

### Opção 5: Office 365 / Microsoft 365

**Por quê:** Integração com Microsoft, bom para empresas que já usam Office 365

**Como configurar:**

1. **Obter credenciais:**
   - Você precisa de um email Office 365/Microsoft 365
   - A senha deve ser a senha do seu email (ou senha de app se MFA estiver ativado)

2. **Configurar no Supabase:**
   - **Host:** `smtp.office365.com`
   - **Port:** `587` (recomendado) ou `465` (SSL)
   - **Username:** Seu email completo do Office 365 (ex: `seu-email@seu-dominio.com`)
   - **Password:** Sua senha do Office 365
   - **Sender email address:** Seu email do Office 365
   - **Sender name:** Nome que aparecerá (ex: `Beauty Sleep`)

3. **Se tiver Multi-Factor Authentication (MFA) ativado:**
   - Você precisa criar uma **senha de app** no lugar da senha normal
   - Acesse: https://account.microsoft.com/security
   - Vá em **Security** → **Advanced security options**
   - Clique em **App passwords** → **Create a new app password**
   - Use essa senha de app no Supabase (não sua senha normal)

4. **Verificar configurações:**
   - Certifique-se de que SMTP está habilitado na sua conta Office 365
   - Alguns administradores podem desabilitar SMTP para segurança

**Configuração Completa:**
```
Host: smtp.office365.com
Port: 587
Username: seu-email@seu-dominio.com
Password: sua-senha-ou-senha-de-app
Sender email: seu-email@seu-dominio.com
Sender name: Beauty Sleep
```

**⚠️ IMPORTANTE:**
- Se você tiver MFA (Multi-Factor Authentication) ativado, **deve usar senha de app**
- Senha de app tem 16 caracteres (geralmente com espaços, mas pode usar sem)
- Se não tiver MFA, pode usar sua senha normal

**Troubleshooting Office 365:**
- **Erro "Authentication failed":** Verifique se está usando senha de app se tiver MFA
- **Erro "Connection timeout":** Verifique se SMTP está habilitado na sua conta
- **Erro "Upstream":** Verifique se o Host está correto (`smtp.office365.com`)

---

### Opção 6: Outros Provedores

Se você usar outro provedor (Zoho, etc.), consulte a documentação deles para:
- **Host SMTP:** Geralmente `smtp.provedor.com`
- **Port:** `587` (TLS) ou `465` (SSL)
- **Username e Password:** Suas credenciais do provedor

---

## ⚙️ Configurações Adicionais

### Minimum interval per user (Intervalo mínimo por usuário)
- **Padrão:** `60` segundos
- **O que faz:** Previne spam limitando quantos emails podem ser enviados para o mesmo usuário
- **Recomendação:** Deixe o padrão (60 segundos)

---

## ✅ Salvar e Testar

1. **Preencha todos os campos obrigatórios:**
   - ✅ Sender email address
   - ✅ Sender name
   - ✅ Host
   - ✅ Port
   - ✅ Username
   - ✅ Password

2. **Clique em "Save changes"** (Salvar alterações)

3. **Aguarde a validação:**
   - O Supabase testará a conexão SMTP
   - Se houver erro, verifique as credenciais

4. **Teste criando um usuário:**
   - Vá em **Usuários** no sistema
   - Crie um novo usuário (sem senha)
   - Verifique se o email foi recebido

---

## 🐛 Troubleshooting (Solução de Problemas)

### 🚨 Erro: "Failed to fetch (api.supabase.com)" no Supabase Dashboard

**Quando acontece:** Ao tentar criar um usuário diretamente no Supabase Dashboard (Authentication → Users → Add User)

**Causas possíveis e soluções:**

#### 1. SMTP Não Configurado (Causa Mais Comum)

**Sintoma:** Erro "Failed to invite user" ou "Error sending invite email"

**Solução:**
- Se você está tentando **enviar um convite por email**, o SMTP precisa estar configurado
- **Opção A:** Configure o SMTP (veja seção acima)
- **Opção B:** Crie o usuário **sem enviar convite**:
  1. Ao criar o usuário, **NÃO marque** a opção "Send invite email"
  2. Marque **"Auto Confirm User"** para que o usuário não precise confirmar email
  3. Defina uma senha manualmente
  4. Clique em "Create User"

#### 2. Projeto Supabase Pausado ou Inativo

**Sintoma:** Erro de conexão ou timeout

**Solução:**
1. Verifique se o projeto está ativo no Dashboard
2. Projetos gratuitos podem ser pausados após inatividade
3. Se estiver pausado, clique em "Restore" ou "Resume"
4. Aguarde alguns minutos para o projeto reiniciar

#### 3. Problema de Conectividade/API do Supabase

**Sintoma:** Erro "Failed to fetch" recorrente

**Soluções:**
1. **Atualize a página** do Dashboard (F5)
2. **Limpe o cache do navegador** (Ctrl+Shift+Delete)
3. **Tente em outro navegador** (Chrome, Firefox, Edge)
4. **Verifique o status do Supabase:**
   - Acesse: https://status.supabase.com
   - Verifique se há incidentes reportados
5. **Aguarde alguns minutos** e tente novamente (pode ser um problema temporário)

#### 4. Configurações de Auth Incorretas

**Sintoma:** Erro ao criar usuário mesmo sem enviar email

**Solução:**
1. Vá em **Settings** → **Auth** → **URL Configuration**
2. Verifique se há URLs de redirecionamento configuradas
3. Se necessário, adicione URLs padrão:
   - Site URL: `http://localhost:3000` (desenvolvimento)
   - Redirect URLs: `http://localhost:3000/**`

#### 5. Limite de Rate Limiting

**Sintoma:** Erro após várias tentativas

**Solução:**
- Aguarde 5-10 minutos antes de tentar novamente
- O Supabase limita tentativas de criação de usuários para prevenir spam

---

### ⚠️ Erro: "Error sending invite email" ou "Failed to invite user"

**Causa mais comum:** SMTP não está configurado ou não está habilitado no Supabase.

**Solução passo a passo:**

1. **Verificar se SMTP está habilitado:**
   - Acesse Supabase Dashboard → Settings → Auth → SMTP Settings
   - Certifique-se de que o toggle **"Enable custom SMTP"** está **ATIVADO** (verde)
   - Se estiver desativado, ative e configure as credenciais

2. **Verificar se todas as credenciais estão preenchidas:**
   - ✅ Sender email address
   - ✅ Sender name
   - ✅ Host
   - ✅ Port
   - ✅ Username
   - ✅ Password

3. **Verificar logs do Supabase:**
   - Acesse **Logs** → **Auth Logs** no Supabase Dashboard
   - Procure por erros relacionados ao envio de email
   - Erros comuns:
     - "Invalid credentials" → Credenciais SMTP incorretas
     - "Connection timeout" → Problema de rede ou porta incorreta
     - "Authentication failed" → Username/password incorretos

4. **Testar credenciais SMTP:**
   - Tente fazer login no servidor SMTP usando as mesmas credenciais
   - Para SendGrid: verifique se a API Key está ativa
   - Para AWS SES: verifique se o email/domínio está verificado

5. **Verificar se o email do remetente está verificado:**
   - O email usado em "Sender email address" deve estar verificado no provedor SMTP
   - Para SendGrid: verifique em Settings → Sender Authentication
   - Para AWS SES: verifique em Verified identities

**Se o erro persistir após configurar SMTP:**
- Aguarde alguns minutos após salvar (pode levar tempo para propagar)
- Tente criar um novo usuário para testar
- Verifique se não há rate limiting no provedor SMTP

---

### 🚨 Erro: "Upstream" ou "Connection failed"

**Sintoma:** Erro ao salvar configurações SMTP com mensagem de "upstream" ou "connection failed"

**Causas e soluções:**

#### 1. Host SMTP Incorreto

**Solução:**
- Verifique se o **Host** está correto (sem `http://` ou `https://`)
- **SendGrid:** `smtp.sendgrid.net` (não `https://smtp.sendgrid.net`)
- **AWS SES:** `email-smtp.us-east-1.amazonaws.com` (ou sua região)
- **Gmail:** `smtp.gmail.com`
- **Mailgun:** `smtp.mailgun.org`

#### 2. Porta Incorreta ou Bloqueada

**Solução:**
- Tente **porta 587** primeiro (TLS - recomendado)
- Se não funcionar, tente **porta 465** (SSL)
- **NÃO use porta 25** (geralmente bloqueada)
- Verifique se seu provedor SMTP permite a porta escolhida

#### 3. Credenciais Incorretas

**Solução:**
- **SendGrid:** 
  - Username deve ser literalmente `apikey` (não seu email)
  - Password deve ser sua API Key completa (começa com `SG.`)
- **AWS SES:**
  - Use as credenciais SMTP específicas (não suas credenciais AWS normais)
  - Obtenha em: AWS Console → SES → SMTP Settings → Create SMTP credentials
- **Gmail:**
  - Use **senha de app** (não sua senha normal)
  - Crie em: Google Account → Security → App passwords

#### 4. Firewall ou Bloqueio de Rede

**Solução:**
- O Supabase precisa conseguir conectar ao servidor SMTP
- Verifique se não há firewall bloqueando conexões SMTP
- Alguns provedores bloqueiam conexões de IPs não autorizados
- Para SendGrid: verifique se não há restrições de IP

#### 5. Email do Remetente Não Verificado

**Solução:**
- O email em "Sender email address" deve estar **verificado** no provedor SMTP
- **SendGrid:** Settings → Sender Authentication → Verificar domínio/email
- **AWS SES:** Verified identities → Verificar email/domínio
- **Gmail:** O email deve ser seu próprio email Gmail

#### 6. Provedor SMTP Não Suporta Conexões do Supabase

**Solução:**
- Alguns provedores SMTP podem bloquear conexões de serviços cloud
- Tente usar um provedor mais comum (SendGrid, AWS SES)
- Verifique se o provedor permite conexões de IPs dinâmicos

#### 7. Teste de Conexão Falhando

**Passo a passo para diagnosticar:**

1. **Verifique os logs do Supabase:**
   - Vá em **Logs** → **Auth Logs**
   - Procure por erros relacionados ao SMTP
   - Veja a mensagem de erro completa

2. **Teste as credenciais diretamente:**
   - Use um cliente de email (Outlook, Thunderbird) para testar
   - Configure com as mesmas credenciais SMTP
   - Se funcionar no cliente, o problema pode ser específico do Supabase

3. **Verifique a documentação do provedor:**
   - Cada provedor tem configurações específicas
   - Verifique se está usando as credenciais corretas (SMTP, não API)

4. **Tente outro provedor temporariamente:**
   - Se SendGrid não funcionar, tente Gmail (apenas para teste)
   - Isso ajuda a identificar se o problema é específico do provedor

---

### Erro: "Invalid credentials"
- Verifique se username e password estão corretos
- Para SendGrid, certifique-se de usar `apikey` como username
- Para Gmail, use senha de app, não sua senha normal

### Erro: "Connection timeout"
- Verifique se a porta está correta (587 ou 465)
- Verifique se o firewall não está bloqueando
- Tente usar porta 465 com SSL

### Emails não estão sendo enviados
- Verifique se o SMTP está habilitado (toggle verde)
- Verifique os logs do Supabase em **Logs** > **Auth Logs**
- Teste as credenciais diretamente no provedor SMTP

### Emails vão para spam
- Configure SPF, DKIM e DMARC no seu domínio
- Use um provedor SMTP confiável (SendGrid, AWS SES)
- Verifique o domínio no provedor SMTP

---

## 📝 Exemplo Completo (SendGrid)

```
Enable custom SMTP: ✅ (Habilitado)

Sender Details:
  Sender email address: noreply@beautysleep.com.br
  Sender name: Beauty Sleep

SMTP Provider Settings:
  Host: smtp.sendgrid.net
  Port: 587
  Minimum interval per user: 60 seconds
  Username: apikey
  Password: SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🔒 Segurança

- ✅ **Nunca compartilhe** suas credenciais SMTP
- ✅ **Use senhas fortes** para suas contas SMTP
- ✅ **Rotacione credenciais** periodicamente
- ✅ **Monitore** o uso de emails para detectar abusos
- ✅ **Configure rate limits** apropriados

---

## 📚 Recursos Adicionais

- [Documentação Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)

---

## ✅ Checklist Final

Antes de considerar a configuração completa:

- [ ] Provedor SMTP escolhido e conta criada
- [ ] Credenciais SMTP obtidas
- [ ] Email/domínio verificado no provedor (se necessário)
- [ ] Todos os campos preenchidos no Supabase
- [ ] SMTP habilitado (toggle verde)
- [ ] Teste de envio realizado com sucesso
- [ ] Email recebido na caixa de entrada (não spam)

---

**Última atualização:** 2025-01-08

