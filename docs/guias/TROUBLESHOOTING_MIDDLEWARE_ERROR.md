# Troubleshooting: Erro 500 MIDDLEWARE_INVOCATION_FAILED

## Problema

Erro 500 no site com código `MIDDLEWARE_INVOCATION_FAILED`:
```
500: INTERNAL_SERVER_ERROR
Code: MIDDLEWARE_INVOCATION_FAILED
ID: gru1::d59rc-1767717773264-a5187a7efe1d
```

## Causas Comuns

1. **Variáveis de ambiente não configuradas no Vercel**
2. **Erro ao acessar banco de dados**
3. **Problemas de autenticação**

## Solução Aplicada

O middleware foi atualizado com:
- ✅ Verificação de variáveis de ambiente antes de usar
- ✅ Tratamento de erros com try-catch
- ✅ Validação de email do usuário
- ✅ Melhor tratamento de erros de banco de dados

## Verificar Variáveis de Ambiente no Vercel

Se o erro persistir após o deploy:

1. Acesse o [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione o projeto `Sistema-Beauty-Sleep`
3. Vá em **Settings** > **Environment Variables**
4. Verifique se as seguintes variáveis estão configuradas:

### Variáveis Obrigatórias

- `NEXT_PUBLIC_SUPABASE_URL`
  - Exemplo: `https://xxxxx.supabase.co`
  - Deve estar disponível para **Production**, **Preview** e **Development**

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - Deve estar disponível para **Production**, **Preview** e **Development**

### Como Adicionar/Atualizar

1. Clique em **Add New** ou edite a variável existente
2. Preencha:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL` (ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **Value**: Cole o valor do seu `.env.local`
   - **Environment**: Selecione **Production**, **Preview** e **Development**
3. Clique em **Save**
4. **Importante**: Após adicionar/atualizar, faça um novo deploy:
   - Vá em **Deployments**
   - Clique nos três pontos (...) do último deployment
   - Selecione **Redeploy**

## Verificar Logs do Vercel

Para diagnosticar o problema:

1. Acesse **Deployments** no Vercel Dashboard
2. Clique no deployment que está com erro
3. Vá na aba **Functions** ou **Logs**
4. Procure por erros relacionados a:
   - `Missing Supabase environment variables`
   - `Error fetching user data`
   - `authError`

## Teste Local

Para testar localmente:

1. Verifique se o arquivo `.env.local` existe na raiz do projeto
2. Verifique se contém:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Execute:
   ```bash
   npm run dev
   ```
4. Acesse `http://localhost:3000`
5. Se funcionar localmente mas não no Vercel, o problema é configuração de variáveis de ambiente

## Status

- ✅ Middleware corrigido com tratamento de erros robusto
- ✅ Commit e push realizados
- ⏳ Aguardando deploy no Vercel

## Próximos Passos

1. Aguardar deploy automático no Vercel (ou fazer redeploy manual)
2. Verificar se o erro foi resolvido
3. Se persistir, verificar variáveis de ambiente conforme instruções acima

