# Guia: Configurar Templates de Email no Supabase

Este guia mostra como configurar todos os templates de email no Supabase Dashboard para o sistema Beauty Sleep.

## 📍 Acessar Templates de Email

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Authentication** → **Email Templates** (ou **Templates de Email**)

---

## 📋 Variáveis Disponíveis nos Templates

Baseado na [documentação oficial do Supabase](https://supabase.com/docs/guides/local-development/customizing-email-templates), as seguintes variáveis estão disponíveis:

### Variáveis Comuns (disponíveis na maioria dos templates):

- `{{ .Email }}` - Email do usuário
- `{{ .ConfirmationURL }}` - URL completa de confirmação (já inclui token e parâmetros)
- `{{ .Token }}` - Código OTP de 6 dígitos (One-Time-Password)
- `{{ .TokenHash }}` - Hash do token (útil para construir links customizados)
- `{{ .SiteURL }}` - URL base do site configurada nas configurações de autenticação

### Variáveis Específicas por Template:

- `{{ .NewEmail }}` - Novo email (apenas em `email_change`)
- `{{ .OldEmail }}` - Email antigo (apenas em `email_changed_notification`)
- `{{ .Phone }}` - Novo número de telefone (apenas em `phone_changed_notification`)
- `{{ .OldPhone }}` - Número de telefone antigo (apenas em `phone_changed_notification`)
- `{{ .Provider }}` - Provedor de identidade (apenas em `identity_linked_notification` e `identity_unlinked_notification`)
- `{{ .FactorType }}` - Tipo de fator MFA (apenas em `mfa_factor_enrolled_notification` e `mfa_factor_unenrolled_notification`)

**Nota:** A variável `{{ .Data }}` não está disponível nos templates de email do Supabase. Use apenas as variáveis listadas acima.

---

## 📧 Template 1: Invite (Convite de Usuário)

**Quando é usado:** Quando um administrador convida um novo usuário para o sistema.

### Configurações:

**Subject (Assunto):**
```
Você foi convidado para o Beauty Sleep
```

**Body (Corpo do Email):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Convite - Beauty Sleep</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #00109e;
      margin-bottom: 10px;
    }
    .accent {
      color: #35bfad;
    }
    h1 {
      color: #00109e;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #35bfad 0%, #00109e 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button:hover {
      opacity: 0.9;
    }
    .link-text {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      word-break: break-all;
      font-size: 12px;
      color: #666;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .info-box {
      background: #e8f4f8;
      border-left: 4px solid #35bfad;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Beauty <span class="accent">Sleep</span></div>
    </div>
    
    <h1>Você foi convidado!</h1>
    
    <p>Olá,</p>
    
    <p>Você foi convidado para fazer parte da equipe do <strong>Beauty Sleep</strong>. Para começar, você precisa criar sua conta e definir sua senha.</p>
    
    <div class="info-box">
      <strong>📧 Email:</strong> {{ .Email }}<br>
      {{ if .Data }}
        {{ if .Data.nome }}
          <strong>👤 Nome:</strong> {{ .Data.nome }}<br>
        {{ end }}
        {{ if .Data.role }}
          <strong>🎭 Função:</strong> {{ .Data.role }}
        {{ end }}
      {{ end }}
    </div>
    
    <div class="button-container">
      <a href="{{ .ConfirmationURL }}" class="button" style="color: #ffffff !important; text-decoration: none;">Criar Minha Conta</a>
    </div>
    
    <p style="font-size: 14px; color: #999;">
      Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
    </p>
    
    <div class="link-text">
      {{ .ConfirmationURL }}
    </div>
    
    <div class="info-box">
      <strong>⚠️ Importante:</strong> Este link expira em 24 horas. Se você não conseguir acessar a tempo, solicite um novo convite ao administrador.
    </div>
    
    <p>Se você não esperava receber este convite, pode ignorar este email com segurança.</p>
    
    <div class="footer">
      <p>© 2025 Beauty Sleep. Todos os direitos reservados.</p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
```

**Variáveis disponíveis (baseado na [documentação oficial](https://supabase.com/docs/guides/local-development/customizing-email-templates)):**
- `{{ .Email }}` - Email do usuário convidado
- `{{ .ConfirmationURL }}` - URL completa de confirmação (já inclui token e redirecionamento)
- `{{ .Token }}` - Código OTP de 6 dígitos (alternativa ao link)
- `{{ .TokenHash }}` - Hash do token (para construir links customizados)
- `{{ .SiteURL }}` - URL base do site configurada no Supabase

**Nota:** O `{{ .ConfirmationURL }}` já inclui todos os parâmetros necessários (token, type, redirect_to), então você não precisa construir o link manualmente.

---

## 📧 Template 2: Recovery (Recuperação de Senha)

**Quando é usado:** Quando um usuário solicita recuperação de senha ou quando um admin gera link de recovery.

### Configurações:

**Subject (Assunto):**
```
Recuperação de Senha - Beauty Sleep
```

**Body (Corpo do Email):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha - Beauty Sleep</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #00109e;
      margin-bottom: 10px;
    }
    .accent {
      color: #35bfad;
    }
    h1 {
      color: #00109e;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #35bfad 0%, #00109e 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button:hover {
      opacity: 0.9;
    }
    .link-text {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      word-break: break-all;
      font-size: 12px;
      color: #666;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .warning-box {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .security-box {
      background: #e8f4f8;
      border-left: 4px solid #35bfad;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Beauty <span class="accent">Sleep</span></div>
    </div>
    
    <h1>Recuperação de Senha</h1>
    
    <p>Olá,</p>
    
    <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Beauty Sleep</strong>.</p>
    
    <div class="button-container">
      <a href="{{ .ConfirmationURL }}" class="button" style="color: #ffffff !important; text-decoration: none;">Redefinir Minha Senha</a>
    </div>
    
    <p style="font-size: 14px; color: #999;">
      Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
    </p>
    
    <div class="link-text">
      {{ .ConfirmationURL }}
    </div>
    
    <p style="font-size: 12px; color: #999; margin-top: 10px;">
      <strong>Nota:</strong> Este link irá direto para a página de redefinição de senha. Você não precisará informar sua senha antiga.
    </p>
    
    <div class="warning-box">
      <strong>⏰ Importante:</strong> Este link expira em 1 hora por motivos de segurança.
    </div>
    
    <div class="security-box">
      <strong>🔒 Segurança:</strong> Se você não solicitou esta recuperação de senha, ignore este email. Sua conta permanece segura e nenhuma alteração foi feita.
    </div>
    
    <p>Se você continuar tendo problemas, entre em contato com o suporte.</p>
    
    <div class="footer">
      <p>© 2025 Beauty Sleep. Todos os direitos reservados.</p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
```

**Variáveis disponíveis:**
- `{{ .Email }}` - Email do usuário
- `{{ .ConfirmationURL }}` - URL completa para redefinir senha (já inclui token e redirecionamento)
- `{{ .Token }}` - Código OTP de 6 dígitos (alternativa ao link)
- `{{ .TokenHash }}` - Hash do token (para construir links customizados)
- `{{ .SiteURL }}` - URL base do site

---

## 📧 Template 3: Confirmation (Confirmação de Email)

**Quando é usado:** Quando um usuário se cadastra e precisa confirmar o email.

### Configurações:

**Subject (Assunto):**
```
Confirme seu Email - Beauty Sleep
```

**Body (Corpo do Email):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Email - Beauty Sleep</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #00109e;
      margin-bottom: 10px;
    }
    .accent {
      color: #35bfad;
    }
    h1 {
      color: #00109e;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #35bfad 0%, #00109e 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button:hover {
      opacity: 0.9;
    }
    .link-text {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      word-break: break-all;
      font-size: 12px;
      color: #666;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .success-box {
      background: #d4edda;
      border-left: 4px solid #28a745;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Beauty <span class="accent">Sleep</span></div>
    </div>
    
    <h1>Confirme seu Email</h1>
    
    <p>Olá,</p>
    
    <p>Obrigado por se cadastrar no <strong>Beauty Sleep</strong>! Para completar seu cadastro, precisamos confirmar seu endereço de email.</p>
    
    <div class="button-container">
      <a href="{{ .ConfirmationURL }}" class="button" style="color: #ffffff !important; text-decoration: none;">Confirmar Email</a>
    </div>
    
    <p style="font-size: 14px; color: #999;">
      Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
    </p>
    
    <div class="link-text">
      {{ .ConfirmationURL }}
    </div>
    
    <div class="success-box">
      <strong>✅ Próximos passos:</strong> Após confirmar seu email, você poderá fazer login e começar a usar o sistema.
    </div>
    
    <p>Se você não criou uma conta no Beauty Sleep, pode ignorar este email com segurança.</p>
    
    <div class="footer">
      <p>© 2025 Beauty Sleep. Todos os direitos reservados.</p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
```

**Variáveis disponíveis:**
- `{{ .Email }}` - Email do usuário
- `{{ .ConfirmationURL }}` - URL completa de confirmação (já inclui token e redirecionamento)
- `{{ .Token }}` - Código OTP de 6 dígitos (alternativa ao link)
- `{{ .TokenHash }}` - Hash do token (para construir links customizados)
- `{{ .SiteURL }}` - URL base do site

---

## 📧 Template 4: Change Email (Mudança de Email)

**Quando é usado:** Quando um usuário solicita mudança de email.

### Configurações:

**Subject (Assunto):**
```
Confirme a Mudança de Email - Beauty Sleep
```

**Body (Corpo do Email):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Mudança de Email - Beauty Sleep</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #00109e;
      margin-bottom: 10px;
    }
    .accent {
      color: #35bfad;
    }
    h1 {
      color: #00109e;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #35bfad 0%, #00109e 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button:hover {
      opacity: 0.9;
    }
    .link-text {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      word-break: break-all;
      font-size: 12px;
      color: #666;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .info-box {
      background: #e8f4f8;
      border-left: 4px solid #35bfad;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning-box {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Beauty <span class="accent">Sleep</span></div>
    </div>
    
    <h1>Confirme a Mudança de Email</h1>
    
    <p>Olá,</p>
    
    <p>Recebemos uma solicitação para alterar o endereço de email da sua conta no <strong>Beauty Sleep</strong>.</p>
    
    <div class="info-box">
      <strong>📧 Email atual:</strong> {{ .Email }}<br>
      {{ if .NewEmail }}
        <strong>📧 Novo email:</strong> {{ .NewEmail }}
      {{ end }}
    </div>
    
    <p>Para confirmar esta mudança, clique no botão abaixo:</p>
    
    <div class="button-container">
      <a href="{{ .ConfirmationURL }}" class="button" style="color: #ffffff !important; text-decoration: none;">Confirmar Mudança de Email</a>
    </div>
    
    <p style="font-size: 14px; color: #999;">
      Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
    </p>
    
    <div class="link-text">
      {{ .ConfirmationURL }}
    </div>
    
    <div class="warning-box">
      <strong>⚠️ Importante:</strong> Se você não solicitou esta mudança, ignore este email e entre em contato com o suporte imediatamente. Sua conta permanece segura até que você confirme a mudança.
    </div>
    
    <p>Este link expira em 24 horas por motivos de segurança.</p>
    
    <div class="footer">
      <p>© 2025 Beauty Sleep. Todos os direitos reservados.</p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
```

**Variáveis disponíveis:**
- `{{ .Email }}` - Email atual do usuário
- `{{ .NewEmail }}` - Novo email que está sendo confirmado (específico deste template)
- `{{ .ConfirmationURL }}` - URL completa de confirmação (já inclui token e redirecionamento)
- `{{ .Token }}` - Código OTP de 6 dígitos (alternativa ao link)
- `{{ .TokenHash }}` - Hash do token (para construir links customizados)
- `{{ .SiteURL }}` - URL base do site

---

## 📧 Template 5: Magic Link (Login sem Senha)

**Quando é usado:** Quando um usuário solicita login via magic link.

### Configurações:

**Subject (Assunto):**
```
Seu Link de Acesso - Beauty Sleep
```

**Body (Corpo do Email):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link de Acesso - Beauty Sleep</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #00109e;
      margin-bottom: 10px;
    }
    .accent {
      color: #35bfad;
    }
    h1 {
      color: #00109e;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #35bfad 0%, #00109e 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button:hover {
      opacity: 0.9;
    }
    .link-text {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      word-break: break-all;
      font-size: 12px;
      color: #666;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .security-box {
      background: #e8f4f8;
      border-left: 4px solid #35bfad;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Beauty <span class="accent">Sleep</span></div>
    </div>
    
    <h1>Seu Link de Acesso</h1>
    
    <p>Olá,</p>
    
    <p>Você solicitou um link de acesso para entrar no <strong>Beauty Sleep</strong> sem usar senha.</p>
    
    <div class="button-container">
      <a href="{{ .ConfirmationURL }}" class="button" style="color: #ffffff !important; text-decoration: none;">Acessar Sistema</a>
    </div>
    
    <p style="font-size: 14px; color: #999;">
      Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
    </p>
    
    <div class="link-text">
      {{ .ConfirmationURL }}
    </div>
    
    <div class="security-box">
      <strong>🔒 Segurança:</strong> Este link expira em 1 hora e só pode ser usado uma vez. Se você não solicitou este link, ignore este email.
    </div>
    
    <div class="footer">
      <p>© 2025 Beauty Sleep. Todos os direitos reservados.</p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
```

**Variáveis disponíveis:**
- `{{ .Email }}` - Email do usuário
- `{{ .ConfirmationURL }}` - URL completa do magic link (já inclui token e redirecionamento)
- `{{ .Token }}` - Código OTP de 6 dígitos (alternativa ao link)
- `{{ .TokenHash }}` - Hash do token (para construir links customizados)
- `{{ .SiteURL }}` - URL base do site

---

## 📧 Template 6: Email Changed Notification (Notificação de Email Alterado)

**Quando é usado:** Quando o email do usuário é alterado com sucesso.

### Configurações:

**Subject (Assunto):**
```
Seu Email foi Alterado - Beauty Sleep
```

**Body (Corpo do Email):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Alterado - Beauty Sleep</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #00109e;
      margin-bottom: 10px;
    }
    .accent {
      color: #35bfad;
    }
    h1 {
      color: #00109e;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .info-box {
      background: #e8f4f8;
      border-left: 4px solid #35bfad;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning-box {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Beauty <span class="accent">Sleep</span></div>
    </div>
    
    <h1>Email Alterado com Sucesso</h1>
    
    <p>Olá,</p>
    
    <p>Este é um email de confirmação informando que o endereço de email da sua conta no <strong>Beauty Sleep</strong> foi alterado com sucesso.</p>
    
    <div class="info-box">
      {{ if .OldEmail }}
        <strong>📧 Email anterior:</strong> {{ .OldEmail }}<br>
      {{ end }}
      <strong>📧 Novo email:</strong> {{ .Email }}
    </div>
    
    <div class="warning-box">
      <strong>⚠️ Importante:</strong> Se você não solicitou esta alteração, entre em contato com o suporte imediatamente. Sua conta pode estar comprometida.
    </div>
    
    <p>Se você solicitou esta alteração, pode ignorar este email. A mudança já foi aplicada à sua conta.</p>
    
    <div class="footer">
      <p>© 2025 Beauty Sleep. Todos os direitos reservados.</p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
```

**Variáveis disponíveis:**
- `{{ .Email }}` - Novo email do usuário
- `{{ .OldEmail }}` - Email anterior (se disponível)

---

## 📧 Template 7: Password Changed Notification (Notificação de Senha Alterada)

**Quando é usado:** Quando a senha do usuário é alterada com sucesso.

### Configurações:

**Subject (Assunto):**
```
Sua Senha foi Alterada - Beauty Sleep
```

**Body (Corpo do Email):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Senha Alterada - Beauty Sleep</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #00109e;
      margin-bottom: 10px;
    }
    .accent {
      color: #35bfad;
    }
    h1 {
      color: #00109e;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .success-box {
      background: #d4edda;
      border-left: 4px solid #28a745;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning-box {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .security-box {
      background: #e8f4f8;
      border-left: 4px solid #35bfad;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Beauty <span class="accent">Sleep</span></div>
    </div>
    
    <h1>Senha Alterada com Sucesso</h1>
    
    <p>Olá,</p>
    
    <p>Este é um email de confirmação informando que a senha da sua conta no <strong>Beauty Sleep</strong> foi alterada com sucesso.</p>
    
    <div class="success-box">
      <strong>✅ Confirmação:</strong> A alteração da sua senha foi concluída. Você já pode usar sua nova senha para fazer login.
    </div>
    
    <div class="security-box">
      <strong>🔒 Segurança:</strong> Se você não solicitou esta alteração, entre em contato com o suporte imediatamente e altere sua senha o quanto antes.
    </div>
    
    <div class="warning-box">
      <strong>⚠️ Dica de Segurança:</strong> Use uma senha forte e única. Não compartilhe sua senha com ninguém.
    </div>
    
    <p>Se você solicitou esta alteração, pode ignorar este email. A mudança já foi aplicada à sua conta.</p>
    
    <div class="footer">
      <p>© 2025 Beauty Sleep. Todos os direitos reservados.</p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
```

**Variáveis disponíveis:**
- `{{ .Email }}` - Email do usuário

---

## 📧 Template 8: Reauthentication (Reautenticação)

**Quando é usado:** Quando o sistema requer reautenticação para ações sensíveis.

### Configurações:

**Subject (Assunto):**
```
Confirme sua Identidade - Beauty Sleep
```

**Body (Corpo do Email):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reautenticação - Beauty Sleep</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #00109e;
      margin-bottom: 10px;
    }
    .accent {
      color: #35bfad;
    }
    h1 {
      color: #00109e;
      font-size: 24px;
      margin-bottom: 10px;
    }
    p {
      color: #666;
      margin-bottom: 20px;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #35bfad 0%, #00109e 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button:hover {
      opacity: 0.9;
    }
    .link-text {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      word-break: break-all;
      font-size: 12px;
      color: #666;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    .security-box {
      background: #e8f4f8;
      border-left: 4px solid #35bfad;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .warning-box {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Beauty <span class="accent">Sleep</span></div>
    </div>
    
    <h1>Confirme sua Identidade</h1>
    
    <p>Olá,</p>
    
    <p>Para sua segurança, precisamos confirmar sua identidade antes de realizar uma ação sensível na sua conta do <strong>Beauty Sleep</strong>.</p>
    
    <div class="security-box">
      <strong>🔒 Por que este email?</strong> Você ou alguém tentou realizar uma ação que requer confirmação de identidade, como alterar informações importantes da conta.
    </div>
    
    <div class="button-container">
      <a href="{{ .ConfirmationURL }}" class="button" style="color: #ffffff !important; text-decoration: none;">Confirmar Minha Identidade</a>
    </div>
    
    <p style="font-size: 14px; color: #999;">
      Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
    </p>
    
    <div class="link-text">
      {{ .ConfirmationURL }}
    </div>
    
    <div class="warning-box">
      <strong>⚠️ Importante:</strong> Este link expira em 1 hora. Se você não solicitou esta confirmação, ignore este email e entre em contato com o suporte.
    </div>
    
    <p>Se você não solicitou esta confirmação, pode ignorar este email com segurança.</p>
    
    <div class="footer">
      <p>© 2025 Beauty Sleep. Todos os direitos reservados.</p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
```

**Variáveis disponíveis:**
- `{{ .Email }}` - Email do usuário
- `{{ .ConfirmationURL }}` - URL completa de confirmação (já inclui token e redirecionamento)
- `{{ .Token }}` - Código OTP de 6 dígitos (alternativa ao link)
- `{{ .TokenHash }}` - Hash do token (para construir links customizados)
- `{{ .SiteURL }}` - URL base do site

---

## ✅ Como Aplicar os Templates

### Para Produção (Supabase Hosted):

1. **Copie o HTML** de cada template acima
2. **Cole no Supabase Dashboard**:
   - Acesse [Supabase Dashboard](https://supabase.com/dashboard)
   - Selecione seu projeto
   - Vá em **Authentication** → **Email Templates**
   - Selecione o template (Invite, Recovery, Confirmation, etc.)
   - Cole o HTML no campo **Body**
   - Atualize o **Subject** (Assunto)
   - Clique em **Save** (Salvar)

### Para Desenvolvimento Local:

1. **Crie os arquivos HTML** na pasta `supabase/templates/`:
   - `supabase/templates/invite.html`
   - `supabase/templates/recovery.html`
   - `supabase/templates/confirmation.html`
   - `supabase/templates/magic_link.html`
   - `supabase/templates/email_change.html`
   - `supabase/templates/email_changed_notification.html`
   - `supabase/templates/password_changed_notification.html`
   - `supabase/templates/reauthentication.html`

2. **Configure no `supabase/config.toml`**:
```toml
[auth.email.template.invite]
subject = "Você foi convidado para o Beauty Sleep"
content_path = "./supabase/templates/invite.html"

[auth.email.template.recovery]
subject = "Recuperação de Senha - Beauty Sleep"
content_path = "./supabase/templates/recovery.html"

[auth.email.template.confirmation]
subject = "Confirme seu Email - Beauty Sleep"
content_path = "./supabase/templates/confirmation.html"

[auth.email.template.magic_link]
subject = "Seu Link de Acesso - Beauty Sleep"
content_path = "./supabase/templates/magic_link.html"

[auth.email.template.email_change]
subject = "Confirme a Mudança de Email - Beauty Sleep"
content_path = "./supabase/templates/email_change.html"

[auth.email.notification.email_changed]
enabled = true
subject = "Seu Email foi Alterado - Beauty Sleep"
content_path = "./supabase/templates/email_changed_notification.html"

[auth.email.notification.password_changed]
enabled = true
subject = "Sua Senha foi Alterada - Beauty Sleep"
content_path = "./supabase/templates/password_changed_notification.html"

[auth.email.template.reauthentication]
subject = "Confirme sua Identidade - Beauty Sleep"
content_path = "./supabase/templates/reauthentication.html"
```

3. **Reinicie o Supabase local**:
```bash
supabase stop && supabase start
```

## 🔗 URLs Importantes

Certifique-se de que os links nos templates apontam para:
- **Invite**: `/auth/signup`
- **Recovery**: `/auth/reset-password`
- **Confirmation**: `/auth/callback`
- **Change Email**: `/auth/callback`
- **Magic Link**: `/auth/callback`

## 📝 Notas Importantes

- **Variáveis:** Use apenas as variáveis listadas na seção "Variáveis Disponíveis no Supabase" acima
- **Sintaxe:** Use `{{ .Variavel }}` (com espaço após o ponto) para variáveis simples
- **Dados aninhados:** Para acessar propriedades de `Data`, use `{{ .Data.nome }}` ou `{{ .Data.role }}`
- **Design:** Os templates são responsivos e funcionam em dispositivos móveis
- **Cores:** Seguem a identidade visual do Beauty Sleep (#00109e e #35bfad)
- **Fallback:** Todos os templates incluem texto alternativo caso o HTML não carregue
- **URLs:** Os links usam `{{ .ConfirmationURL }}` que já inclui todos os parâmetros necessários (token, redirect, etc.)

