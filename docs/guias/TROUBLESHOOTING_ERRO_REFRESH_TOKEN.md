# 🔧 Troubleshooting: Erro "Invalid Refresh Token"

Este guia explica o erro **"Invalid Refresh Token: Refresh Token Not Found"** que aparece no console do servidor Next.js.

---

## 🐛 Erro Comum

```
[AuthApiError: Invalid Refresh Token: Refresh Token Not Found] {
  __isAuthError: true,
  name: 'AuthApiError',
  status: 400,
  code: 'refresh_token_not_found'
}
```

---

## ✅ **É um erro esperado e não crítico!**

Este erro **é normal** e **não afeta o funcionamento** do sistema. Ele acontece quando:

1. **Você acessa o site pela primeira vez** após iniciar o servidor
2. **Não há sessão ativa** (você não está logado)
3. **Os cookies de autenticação estão inválidos ou expirados**
4. **Você fez logout anteriormente**

---

## 🔍 Por que acontece?

O middleware do Next.js tenta verificar se você está autenticado em **toda requisição**. Quando não há uma sessão válida, o Supabase tenta renovar o token usando o refresh token, mas como não há um válido, ele retorna esse erro.

O sistema **já trata esse erro automaticamente** e redireciona para a página de login.

---

## ✅ O que foi feito para resolver?

O middleware foi atualizado para:

1. **Detectar especificamente** erros de refresh token inválido
2. **Limpar cookies inválidos** automaticamente
3. **Redirecionar para login** com `session_expired=true`
4. **Prevenir erros** desnecessários no console

---

## 🚀 Como funciona agora?

### Fluxo Normal:

1. Você acessa o site → `http://localhost:3000`
2. O middleware verifica autenticação
3. Se não há sessão válida (refresh token inválido):
   - Limpa cookies inválidos
   - Redireciona para `/login?session_expired=true`
4. Você vê a página de login
5. Faz login normalmente

### Quando você está logado:

1. Você acessa o site
2. O middleware verifica autenticação
3. Sessão válida encontrada → Permite acesso
4. Página carrega normalmente

---

## 💡 Como evitar ver o erro?

### Opção 1: Fazer Login

Simplesmente faça login no sistema. Depois disso, não verá mais esse erro.

### Opção 2: Limpar Cookies Manualmente

1. Abra o **DevTools** (F12)
2. Vá na aba **Application** (Chrome) ou **Storage** (Firefox)
3. Clique em **Cookies** → `http://localhost:3000`
4. Delete todos os cookies que começam com `sb-`
5. Recarregue a página

### Opção 3: Usar Modo Anônimo

Acesse o site em uma **janela anônima/privada** do navegador. Isso garante que não há cookies antigos.

---

## 🔧 Para Desenvolvedores

### O erro aparece no console do servidor:

```
[AuthApiError: Invalid Refresh Token: Refresh Token Not Found]
```

**Isso é esperado** e pode ser ignorado. O sistema trata automaticamente.

### Se quiser suprimir completamente:

Você pode filtrar esses erros no console, mas **não é recomendado** porque:
- É útil para debug saber quando sessões expiram
- Não afeta o funcionamento
- O middleware já trata corretamente

---

## 📝 Checklist de Verificação

Se você ver esse erro, verifique:

- [ ] O servidor está rodando (`npm run dev`)
- [ ] Você está acessando `http://localhost:3000`
- [ ] Você **não está logado** (esperado ver o erro)
- [ ] O erro **não impede** você de acessar a página de login
- [ ] Você consegue fazer login normalmente

Se todas as respostas forem "sim", **está tudo funcionando corretamente!** ✅

---

## ⚠️ Quando se preocupar?

Apenas se preocupar se:

1. **Você está logado** e ainda vê o erro (aí sim há um problema)
2. **Não consegue fazer login** mesmo com credenciais corretas
3. **O site não carrega** de jeito nenhum

Nesses casos, verifique:

- Variáveis de ambiente estão configuradas corretamente (`.env.local`)
- O projeto Supabase está ativo (não pausado)
- Você tem conexão com a internet
- As credenciais do Supabase estão corretas

---

## 🆘 Ainda com problemas?

Se após fazer login o erro persistir:

1. **Limpe os cookies do navegador:**
   - DevTools → Application → Cookies → Delete all

2. **Limpe o cache do Next.js:**
   ```powershell
   # Pare o servidor (Ctrl+C)
   # Delete a pasta .next
   Remove-Item -Recurse -Force .next
   # Reinicie o servidor
   npm run dev
   ```

3. **Verifique o `.env.local`:**
   - Certifique-se de que `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão corretos

4. **Verifique os logs do Supabase:**
   - Supabase Dashboard → Logs → Auth Logs
   - Veja se há erros relacionados

---

## 📚 Referências

- [Guia: Configurar .env.local](CONFIGURAR_ENV_LOCAL.md)
- [Guia: Criar Usuário de Teste](GUIA_CRIAR_USUARIO_TESTE.md)
- [Documentação Supabase Auth](https://supabase.com/docs/guides/auth)

---

**Última atualização:** 2025-01-08

