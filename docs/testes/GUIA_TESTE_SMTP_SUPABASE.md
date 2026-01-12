# 🧪 Guia: Testar SMTP do Supabase

Este guia explica como testar se a configuração SMTP do Supabase está funcionando corretamente.

---

## 📋 Pré-requisitos

1. SMTP configurado no Supabase Dashboard
2. Acesso ao Supabase Dashboard do seu projeto
3. Um email de teste para receber os emails

---

## 🔍 Passo 1: Verificar Configuração SMTP

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **Settings** → **Auth**
4. Role até **SMTP Settings**
5. Verifique se:
   - ✅ **Enable custom SMTP** está marcado
   - ✅ Todos os campos estão preenchidos:
     - Sender email address
     - Sender name
     - SMTP Host
     - SMTP Port
     - SMTP User
     - SMTP Password
   - ✅ **Test SMTP** mostra sucesso (se disponível)

---

## 🧪 Passo 2: Testar Email de Convite (Criar Usuário)

### Opção A: Via Interface do Sistema

1. Acesse a página de **Usuários** no sistema
2. Clique em **Novo Usuário**
3. Preencha:
   - **Nome:** Teste SMTP
   - **Email:** seu-email-de-teste@exemplo.com
   - **Role:** Equipe
   - **Senha:** Marque "Gerar senha automaticamente"
4. Clique em **Salvar Usuário**
5. Verifique:
   - ✅ Se apareceu mensagem de sucesso
   - ✅ Se o email foi recebido na caixa de entrada
   - ✅ Se o email está na pasta de spam (verifique também)

### Opção B: Via Supabase Dashboard

1. No Supabase Dashboard, vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Preencha:
   - **Email:** seu-email-de-teste@exemplo.com
   - **Password:** (deixe em branco para enviar convite)
   - Marque **Send invite email**
4. Clique em **Create user**
5. Verifique se o email foi recebido

---

## 🧪 Passo 3: Testar Email de Reset de Senha

### Via Interface do Sistema

1. Acesse a página de **Usuários**
2. Encontre um usuário existente
3. Clique no botão **Resetar Senha**
4. Confirme a ação
5. Verifique:
   - ✅ Se apareceu mensagem de sucesso
   - ✅ Se o email foi recebido
   - ✅ Se o link de reset funciona

### Via Página de Login

1. Acesse a página de **Login**
2. Clique em **Esqueci minha senha**
3. Digite um email válido cadastrado no sistema
4. Clique em **Enviar link de recuperação**
5. Verifique se o email foi recebido

---

## 🔍 Passo 4: Verificar Logs do Supabase

1. No Supabase Dashboard, vá em **Logs** → **Auth Logs**
2. Procure por:
   - `invite_user` - Para emails de convite
   - `recover` - Para emails de reset de senha
3. Verifique se há erros relacionados a SMTP:
   - `SMTP error`
   - `Email sending failed`
   - `Connection timeout`

---

## 🐛 Troubleshooting

### Email não está sendo recebido

**Verifique:**

1. **Spam/Lixo Eletrônico:**
   - Verifique a pasta de spam
   - Adicione o remetente aos contatos

2. **Configuração SMTP:**
   - Verifique se todas as credenciais estão corretas
   - Teste as credenciais no provedor SMTP

3. **Logs do Supabase:**
   - Verifique os logs de Auth para erros
   - Procure por mensagens de erro SMTP

4. **Provedor SMTP:**
   - Verifique se há limites de envio atingidos
   - Verifique se o domínio/email está verificado
   - Verifique se há bloqueios de IP

### Erro: "Failed to send email"

**Possíveis causas:**

1. **Credenciais SMTP incorretas:**
   - Verifique username e password
   - Para SendGrid: username deve ser `apikey` (literalmente)

2. **Porta SMTP incorreta:**
   - Tente porta `587` (TLS) ou `465` (SSL)
   - Verifique se a porta não está bloqueada por firewall

3. **Host SMTP incorreto:**
   - Verifique o host do seu provedor SMTP
   - SendGrid: `smtp.sendgrid.net`
   - Gmail: `smtp.gmail.com`
   - Office 365: `smtp.office365.com`

4. **Autenticação falhando:**
   - Verifique se precisa de autenticação de dois fatores desabilitada
   - Para Gmail: use "Senha de app" ao invés da senha normal

### Erro: "upstream" (Office 365)

**Solução:**

1. Verifique se o MFA está desabilitado OU
2. Use uma "Senha de app" do Office 365
3. Verifique se o usuário tem permissão para enviar emails

---

## 📧 Testar com Diferentes Provedores

### SendGrid

**Configuração:**
- Host: `smtp.sendgrid.net`
- Port: `587`
- User: `apikey`
- Password: Sua API Key do SendGrid

**Teste:**
- Crie um usuário no sistema
- Verifique o email na caixa de entrada
- Verifique no SendGrid Dashboard → Activity

### Gmail

**Configuração:**
- Host: `smtp.gmail.com`
- Port: `587`
- User: Seu email do Gmail
- Password: Senha de app (não a senha normal)

**Como criar senha de app:**
1. Acesse [Google Account](https://myaccount.google.com)
2. Vá em **Segurança**
3. Ative **Verificação em duas etapas**
4. Vá em **Senhas de app**
5. Crie uma nova senha de app
6. Use essa senha no Supabase

### Office 365

**Configuração:**
- Host: `smtp.office365.com`
- Port: `587`
- User: Seu email do Office 365
- Password: Senha de app OU senha normal (se MFA desabilitado)

---

## ✅ Checklist de Testes

- [ ] SMTP está habilitado no Supabase
- [ ] Todas as credenciais estão corretas
- [ ] Email de convite foi recebido
- [ ] Email de reset de senha foi recebido
- [ ] Links nos emails funcionam corretamente
- [ ] Não há erros nos logs do Supabase
- [ ] Emails não estão indo para spam

---

## 📝 Notas Importantes

1. **Em desenvolvimento local:**
   - Se estiver usando Supabase local, emails são capturados pelo Inbucket
   - Acesse `http://localhost:54324` para ver os emails

2. **Limites de envio:**
   - SendGrid: 100 emails/dia no plano gratuito
   - Gmail: 500 emails/dia
   - Office 365: Varia por plano

3. **Verificação de domínio:**
   - Para melhor entrega, verifique seu domínio no provedor SMTP
   - Isso melhora a reputação do remetente

---

## 🚀 Próximos Passos

Após confirmar que o SMTP está funcionando:

1. Configure templates de email personalizados (opcional)
2. Configure SPF/DKIM para melhor entrega
3. Monitore a taxa de entrega
4. Configure alertas para falhas de envio







