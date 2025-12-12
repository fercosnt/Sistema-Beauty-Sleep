# Guia de Segurança de Autenticação - Supabase

## 🔒 Habilitar Leaked Password Protection

### Resumo do Problema
O Supabase Auth pode verificar senhas contra o banco de dados HaveIBeenPwned.org para prevenir o uso de senhas comprometidas. Esta funcionalidade está atualmente desabilitada.

**Risco:** Usuários podem registrar ou alterar para senhas conhecidamente comprometidas, aumentando o risco de:
- Account takeover (tomada de conta)
- Credential stuffing (tentativas de login com credenciais vazadas)

### Passos para Habilitar

#### Opção 1: Via Dashboard (Recomendado)

1. **Acesse o Dashboard do Supabase**
   - Vá para https://supabase.com/dashboard
   - Selecione seu projeto

2. **Navegue até Authentication → Providers**
   - Menu lateral: **Authentication**
   - Submenu: **Providers**
   - Clique em **Email**

3. **Habilite Leaked Password Protection**
   - Procure pela opção **"Leaked password protection"**
   - Ative o toggle/switch
   - Clique em **"Save"** ou **"Salvar"**

#### Opção 2: Via Project Settings

1. **Acesse Project Settings**
   - Menu lateral: **Settings** (⚙️)
   - Submenu: **Auth**

2. **Encontre Password Security**
   - Procure por **"Password Security"** ou **"Segurança de Senhas"**
   - Ou **"Password Strength"** / **"Força da Senha"**

3. **Habilite a Proteção**
   - Ative **"Leaked password protection"**
   - Salve as alterações

### Validação

Após habilitar, teste o fluxo:

1. **Teste de Signup**
   - Tente criar uma conta com uma senha conhecidamente comprometida
   - Exemplo: `Password123!`
   - Deve ser rejeitada com mensagem de erro

2. **Teste de Mudança de Senha**
   - Tente alterar a senha para uma comprometida
   - Deve ser rejeitada

3. **Verifique os Logs**
   - Vá em **Authentication → Logs**
   - Confirme que as tentativas com senhas comprometidas são bloqueadas

---

## 🛡️ Melhorias Adicionais de Segurança

### 1. Política de Senha Mais Forte

**Recomendações:**
- **Comprimento mínimo:** 12+ caracteres
- **Variedade de caracteres:** 
  - Letras maiúsculas (A-Z)
  - Letras minúsculas (a-z)
  - Números (0-9)
  - Símbolos (!@#$%^&*)
- **Ou use política de passphrase:** Frases longas e memoráveis

**Como configurar:**
- Dashboard → Authentication → Settings
- Procure por **"Password requirements"** ou **"Requisitos de senha"**
- Configure os requisitos mínimos

### 2. Rate Limiting (Limitação de Taxa)

**Proteção contra ataques de força bruta:**

1. **Acesse:** Authentication → Rate limits
2. **Configure:**
   - Limite de tentativas de login por IP
   - Limite de tentativas de signup por IP
   - Limite de recuperação de senha por email

**Valores recomendados:**
- Login: 5 tentativas por 15 minutos
- Signup: 3 tentativas por hora
- Password reset: 3 tentativas por hora

### 3. Feedback para Usuários

**No seu código frontend, trate erros de senha comprometida:**

```typescript
// Exemplo com Supabase Auth
try {
  const { data, error } = await supabase.auth.signUp({
    email: userEmail,
    password: userPassword
  });
  
  if (error) {
    if (error.message.includes('compromised') || error.message.includes('pwned')) {
      // Senha comprometida
      showError('Esta senha foi encontrada em vazamentos de dados. Por favor, escolha uma senha diferente e mais segura.');
    } else {
      // Outro erro
      showError(error.message);
    }
  }
} catch (err) {
  console.error('Erro ao criar conta:', err);
}
```

### 4. Autenticação Multi-Fator (MFA)

**Recomendações:**
- **Obrigatório para:** Administradores e usuários com acesso a dados sensíveis
- **Opcional mas recomendado:** Todos os usuários

**Como habilitar:**
- Dashboard → Authentication → Providers
- Procure por **"Multi-factor authentication"** ou **"MFA"**
- Configure TOTP (Time-based One-Time Password)

### 5. Monitoramento e Alertas

**Configure alertas para:**
- Múltiplas tentativas de login falhadas
- Padrões incomuns de signup
- Mudanças de senha suspeitas

**Onde verificar:**
- Dashboard → Authentication → Logs
- Configure alertas em **Project Settings → Monitoring** (se disponível)

### 6. Políticas de Sessão

**Recomendações:**
- **Tempo de sessão:** 7-30 dias (dependendo da sensibilidade)
- **Re-autenticação:** Para ações críticas (ex: mudança de senha, exclusão de conta)
- **Sessões simultâneas:** Limite o número de dispositivos conectados

**Onde configurar:**
- Dashboard → Authentication → Settings
- Procure por **"Session management"** ou **"Gerenciamento de sessão"**

---

## ✅ Checklist de Segurança de Autenticação

- [ ] Leaked Password Protection habilitado
- [ ] Política de senha forte configurada (12+ caracteres, variedade)
- [ ] Rate limiting configurado para login/signup/password reset
- [ ] Tratamento de erros de senha comprometida no frontend
- [ ] MFA habilitado (obrigatório para admins, recomendado para todos)
- [ ] Monitoramento de logs de autenticação ativo
- [ ] Políticas de sessão configuradas
- [ ] Testes realizados com senhas comprometidas
- [ ] Documentação de segurança atualizada

---

## 📚 Recursos Adicionais

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Password Security Best Practices](https://supabase.com/docs/guides/auth/password-security)
- [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3)
- [OWASP Password Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## 🔍 Verificação Final

Após implementar todas as melhorias:

1. Execute o **Database Linter** novamente
2. Verifique que o aviso de "Leaked Password Protection Disabled" desapareceu
3. Teste os fluxos de autenticação
4. Revise os logs de autenticação regularmente

