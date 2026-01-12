# ⚡ Teste Rápido de SMTP

## 🚀 Forma Mais Rápida: Via Interface do Sistema

1. **Acesse:** `/usuarios` (página de usuários)
2. **Clique:** "Novo Usuário"
3. **Preencha:**
   - Nome: Teste SMTP
   - Email: seu-email-de-teste@exemplo.com
   - Role: Equipe
   - ✅ Marque "Gerar senha automaticamente"
4. **Clique:** "Salvar Usuário"
5. **Verifique:** Seu email (incluindo spam)

---

## 🧪 Via Script (Terminal)

```bash
npx tsx scripts/test/test-smtp-supabase.ts seu-email@exemplo.com
```

O script vai:
- ✅ Criar um usuário de teste
- ✅ Enviar email de convite
- ✅ Mostrar status do envio
- ✅ Dar dicas de troubleshooting

---

## 📋 Checklist Rápido

- [ ] SMTP habilitado no Supabase Dashboard
- [ ] Credenciais SMTP preenchidas
- [ ] Email de teste criado
- [ ] Email recebido (verificar spam também)
- [ ] Link no email funciona

---

## 🔍 Verificar Logs

**No Supabase Dashboard:**
1. Vá em **Logs** → **Auth Logs**
2. Procure por `invite_user` ou `recover`
3. Verifique se há erros SMTP

---

## ❌ Se não funcionar

1. **Verifique spam/lixo eletrônico**
2. **Verifique logs do Supabase** (Dashboard > Logs > Auth Logs)
3. **Verifique configuração SMTP** (Dashboard > Settings > Auth > SMTP Settings)
4. **Teste credenciais** no provedor SMTP
5. **Verifique limites** de envio do provedor

---

## 📚 Documentação Completa

Veja o guia completo em: `docs/testes/GUIA_TESTE_SMTP_SUPABASE.md`







