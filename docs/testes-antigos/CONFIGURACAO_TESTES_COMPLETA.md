# ✅ Configuração dos Testes - Completa

**Data:** 2025-12-02

---

## ✅ Status da Configuração

### 1. Variáveis de Ambiente ✅

**Arquivo:** `.env.local`

```env
TEST_USER_EMAIL=✅ Configurado
TEST_USER_PASSWORD=✅ Configurado
```

### 2. Usuários de Teste no Supabase ✅

Os seguintes usuários já existem no Supabase Auth:

- ✅ `admin@test.com` / `admin123` (admin)
- ✅ `equipe@test.com` / `equipe123` (equipe)
- ✅ `recepcao@test.com` / `recepcao123` (recepcao)

**Nota:** Alguns usuários já existiam, o que é normal. O script tenta criar novamente e avisa se já existem.

---

## 🚀 Próximos Passos

### 1. Verificar se os usuários estão na tabela `users`

Se os usuários existem no Auth mas não na tabela `users`, você pode inserir manualmente ou o script já deve ter feito isso.

### 2. Executar os Testes

Agora você pode executar os testes:

```bash
# Testes unitários (Jest)
npm test

# Testes E2E e integração (Playwright)
npm run test:e2e
```

---

## 📋 Credenciais dos Usuários de Teste

| Email | Senha | Role | Uso |
|-------|-------|------|-----|
| `admin@test.com` | `admin123` | admin | Testes E2E de permissões |
| `equipe@test.com` | `equipe123` | equipe | Testes E2E de permissões |
| `recepcao@test.com` | `recepcao123` | recepcao | Testes E2E de permissões |

**Para testes de integração:**
- Use as variáveis `TEST_USER_EMAIL` e `TEST_USER_PASSWORD` do `.env.local`

---

## ⚠️ Notas Importantes

1. **Usuários já existentes:** Se você ver a mensagem "A user with this email address has already been registered", significa que o usuário já existe no Supabase Auth. Isso é normal e não é um problema.

2. **Tabela `users`:** Os usuários precisam estar tanto no Supabase Auth quanto na tabela `users`. O script tenta criar/atualizar ambos.

3. **Variáveis de ambiente:** Certifique-se de que as variáveis estão no `.env.local` e não em outro arquivo.

---

## ✅ Checklist

- [x] Variáveis de ambiente configuradas no `.env.local`
- [x] Usuários de teste criados no Supabase Auth
- [ ] Verificar se usuários estão na tabela `users` (opcional)
- [ ] Executar testes para validar

---

**Última atualização:** 2025-12-02

