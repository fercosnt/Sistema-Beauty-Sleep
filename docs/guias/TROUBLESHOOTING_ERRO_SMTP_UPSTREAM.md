# 🔧 Troubleshooting: Erro "Upstream" ao Configurar SMTP

Este guia ajuda a resolver o erro **"upstream"** ou **"connection failed"** ao configurar SMTP no Supabase.

## ⚠️ AVISO DE SEGURANÇA

**NUNCA** commite credenciais SMTP reais no Git. Este arquivo contém apenas exemplos genéricos e placeholders. Sempre use variáveis de ambiente ou secrets do Supabase para armazenar credenciais reais.

---

## 🐛 Erro Comum

Ao tentar salvar as configurações SMTP no Supabase Dashboard, você recebe:

```
Erro: Upstream connection failed
```

ou

```
Erro: Connection failed
```

ou

```
Erro: Unable to connect to SMTP server
```

---

## ✅ Checklist Rápido

Antes de começar, verifique:

- [ ] Host SMTP está correto (sem `http://` ou `https://`)
- [ ] Porta está correta (587 ou 465)
- [ ] Username está correto (para SendGrid: `apikey`)
- [ ] Password está correta (API Key completa para SendGrid)
- [ ] Email do remetente está verificado no provedor SMTP
- [ ] Toggle "Enable custom SMTP" está ativado

---

## 🔍 Soluções por Provedor

### SendGrid

#### Configuração Correta:

```
Host: smtp.sendgrid.net
Port: 587
Username: apikey  ← Literalmente a palavra "apikey"
Password: [SUA_API_KEY_SENDGRID_COMPLETA]  ← Sua API Key completa (começa com SG.)
Sender email: seu-email@seu-dominio.com
Sender name: Beauty Sleep
```

#### Erros Comuns:

1. **Username incorreto:**
   - ❌ Errado: `seu-email@gmail.com`
   - ✅ Correto: `apikey` (literalmente)

2. **API Key incompleta:**
   - ❌ Errado: `SG.xxxxx` (apenas parte)
   - ✅ Correto: API Key completa (muito longa, começa com `SG.`)

3. **Email não verificado:**
   - Vá em SendGrid → Settings → Sender Authentication
   - Verifique seu domínio ou email

---

### AWS SES

#### Configuração Correta:

```
Host: email-smtp.us-east-1.amazonaws.com  ← Use sua região
Port: 587
Username: [SEU_USERNAME_SMTP_AWS]  ← Credenciais SMTP específicas
Password: [SUA_SENHA_SMTP_AWS]  ← Senha SMTP
Sender email: seu-email@seu-dominio.com
Sender name: Beauty Sleep
```

#### Erros Comuns:

1. **Usando credenciais AWS normais:**
   - ❌ Errado: Suas credenciais AWS normais
   - ✅ Correto: Credenciais SMTP específicas (obtenha em SES → SMTP Settings)

2. **Email/domínio não verificado:**
   - Vá em AWS SES → Verified identities
   - Verifique seu email ou domínio

3. **Região incorreta:**
   - Use o host da mesma região onde você verificou o email
   - Exemplos:
     - `us-east-1`: `email-smtp.us-east-1.amazonaws.com`
     - `sa-east-1` (Brasil): `email-smtp.sa-east-1.amazonaws.com`
     - `eu-west-1`: `email-smtp.eu-west-1.amazonaws.com`

---

### Gmail

#### Configuração Correta:

```
Host: smtp.gmail.com
Port: 587
Username: seu-email@gmail.com  ← Seu email Gmail completo
Password: xxxx xxxx xxxx xxxx  ← Senha de app (16 caracteres com espaços)
Sender email: seu-email@gmail.com
Sender name: Beauty Sleep
```

#### Erros Comuns:

1. **Usando senha normal:**
   - ❌ Errado: Sua senha do Gmail
   - ✅ Correto: Senha de app (crie em: Google Account → Security → App passwords)

2. **Verificação em duas etapas desativada:**
   - Você precisa ter verificação em duas etapas ativada
   - Depois disso, pode criar senha de app

3. **Senha de app incorreta:**
   - Copie a senha de app completa (16 caracteres)
   - Pode ter espaços, mas geralmente funciona sem eles também

---

### Office 365 / Microsoft 365

#### Configuração Correta:

```
Host: smtp.office365.com
Port: 587
Username: seu-email@seu-dominio.com  ← Seu email Office 365 completo
Password: sua-senha-ou-senha-de-app  ← Senha normal OU senha de app (se MFA ativado)
Sender email: seu-email@seu-dominio.com
Sender name: Beauty Sleep
```

#### Erros Comuns:

1. **Usando senha normal com MFA ativado:**
   - ❌ Errado: Sua senha normal do Office 365 (se tiver MFA)
   - ✅ Correto: Senha de app (crie em: https://account.microsoft.com/security → App passwords)

2. **Host incorreto:**
   - ❌ Errado: `smtp.outlook.com` ou `smtp.microsoft.com`
   - ✅ Correto: `smtp.office365.com`

3. **SMTP desabilitado pelo administrador:**
   - Alguns administradores desabilitam SMTP para segurança
   - Entre em contato com o administrador do Office 365

4. **Porta incorreta:**
   - Use porta **587** (TLS) - recomendado
   - Porta **465** (SSL) também funciona, mas 587 é mais comum

5. **Email não verificado:**
   - Certifique-se de que o email está ativo e verificado
   - O email deve ser o mesmo que você usa para fazer login no Office 365

#### Como Criar Senha de App (se tiver MFA):

1. Acesse: https://account.microsoft.com/security
2. Vá em **Security** → **Advanced security options**
3. Clique em **App passwords** → **Create a new app password**
4. Dê um nome (ex: "Supabase SMTP")
5. Copie a senha gerada (16 caracteres)
6. Use essa senha no Supabase (não sua senha normal)

---

## 🔧 Passo a Passo de Diagnóstico

### Passo 1: Verificar Host e Porta

1. Abra as configurações SMTP no Supabase
2. Verifique se o Host está correto:
   - ❌ `https://smtp.sendgrid.net`
   - ✅ `smtp.sendgrid.net`
3. Verifique a porta:
   - Tente **587** primeiro
   - Se não funcionar, tente **465**

### Passo 2: Verificar Credenciais

1. **Para SendGrid:**
   - Username deve ser exatamente: `apikey`
   - Password deve ser sua API Key completa

2. **Para AWS SES:**
   - Use credenciais SMTP (não suas credenciais AWS normais)
   - Obtenha em: AWS Console → SES → SMTP Settings

3. **Para Gmail:**
   - Use senha de app (não sua senha normal)
   - Crie em: Google Account → Security → App passwords

### Passo 3: Verificar Email do Remetente

1. O email em "Sender email address" deve estar verificado no provedor
2. **SendGrid:** Settings → Sender Authentication
3. **AWS SES:** Verified identities
4. **Gmail:** O email deve ser seu próprio email Gmail

### Passo 4: Verificar Logs do Supabase

1. Vá em **Logs** → **Auth Logs** no Supabase Dashboard
2. Procure por erros relacionados ao SMTP
3. A mensagem de erro pode dar mais detalhes sobre o problema

### Passo 5: Testar em Cliente de Email

1. Configure um cliente de email (Outlook, Thunderbird) com as mesmas credenciais
2. Se funcionar no cliente, o problema pode ser específico do Supabase
3. Se não funcionar, o problema está nas credenciais

---

## 🚨 Problemas Específicos

### Problema: "Connection timeout"

**Causa:** Supabase não consegue conectar ao servidor SMTP

**Soluções:**
1. Verifique se o Host está correto
2. Tente porta 465 em vez de 587
3. Verifique se há firewall bloqueando
4. Tente outro provedor SMTP

### Problema: "Authentication failed"

**Causa:** Credenciais incorretas

**Soluções:**
1. Verifique username e password
2. Para SendGrid: certifique-se de usar `apikey` como username
3. Para Gmail: use senha de app, não senha normal
4. Para AWS SES: use credenciais SMTP específicas

### Problema: "Sender email not verified"

**Causa:** Email do remetente não está verificado no provedor

**Soluções:**
1. Verifique o email no provedor SMTP
2. **SendGrid:** Settings → Sender Authentication → Verificar
3. **AWS SES:** Verified identities → Verificar email/domínio
4. **Gmail:** Use seu próprio email Gmail

---

## 📝 Exemplos de Configuração Completa

### SendGrid

```
✅ Enable custom SMTP: ATIVADO

Sender Details:
  Sender email address: noreply@beautysleep.com.br
  Sender name: Beauty Sleep

SMTP Provider Settings:
  Host: smtp.sendgrid.net
  Port: 587
  Minimum interval per user: 60 seconds
  Username: apikey
  Password: [SUA_API_KEY_SENDGRID_COMPLETA]
```

### Office 365

```
✅ Enable custom SMTP: ATIVADO

Sender Details:
  Sender email address: seu-email@seu-dominio.com
  Sender name: Beauty Sleep

SMTP Provider Settings:
  Host: smtp.office365.com
  Port: 587
  Minimum interval per user: 60 seconds
  Username: seu-email@seu-dominio.com
  Password: sua-senha-ou-senha-de-app
```

**⚠️ IMPORTANTE para Office 365:**
- Se você tiver **Multi-Factor Authentication (MFA)** ativado, deve usar **senha de app**
- Senha de app: https://account.microsoft.com/security → App passwords
- Se não tiver MFA, pode usar sua senha normal

---

## 🔗 Links Úteis

- [Documentação Supabase SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [SendGrid SMTP Settings](https://docs.sendgrid.com/for-developers/sending-email/getting-started-smtp)
- [AWS SES SMTP Settings](https://docs.aws.amazon.com/ses/latest/dg/send-email-smtp.html)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

---

## 💡 Dicas Finais

1. **Sempre teste após configurar:**
   - Tente criar um usuário e enviar convite
   - Verifique se o email foi recebido

2. **Aguarde alguns minutos:**
   - Após salvar, pode levar alguns minutos para propagar
   - Tente novamente após 2-3 minutos

3. **Verifique spam:**
   - Emails podem ir para spam inicialmente
   - Configure SPF, DKIM e DMARC para melhorar entrega

4. **Use provedores confiáveis:**
   - SendGrid e AWS SES são mais confiáveis que Gmail
   - Gmail é bom para testes, mas pode ter limitações

---

## 🆘 Ainda com Problemas?

Se após seguir todos os passos o problema persistir:

1. **Verifique os logs completos:**
   - Supabase Dashboard → Logs → Auth Logs
   - Procure por mensagens de erro detalhadas

2. **Tente outro provedor:**
   - Se SendGrid não funcionar, tente AWS SES
   - Isso ajuda a identificar se é problema específico do provedor

3. **Entre em contato com o suporte:**
   - Supabase Support: https://supabase.com/support
   - Ou suporte do seu provedor SMTP

---

**Última atualização:** 2025-01-08

