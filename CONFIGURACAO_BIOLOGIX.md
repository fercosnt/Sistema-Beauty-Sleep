# Configuração da API Biologix

## Onde Obter as Credenciais

As credenciais da API Biologix são fornecidas diretamente pela empresa Biologix quando você se torna um centro credenciado.

### Contatos para Obter Credenciais:

1. **Suporte Biologix**
   - Email: (verificar no contrato/documentação)
   - Portal do Cliente: (se disponível)

2. **Documentação Fornecida**
   - Verifique emails/documentos recebidos da Biologix
   - Contrato de credenciamento
   - Manual de integração (se fornecido)

### Credenciais Necessárias:

| Variável | Descrição | Onde Encontrar |
|----------|-----------|----------------|
| `BIOLOGIX_USERNAME` | Nome de usuário para acesso à API | Fornecido pela Biologix |
| `BIOLOGIX_PASSWORD` | Senha para acesso à API | Fornecido pela Biologix |
| `BIOLOGIX_SOURCE` | Código source para autenticação (ex: 100) | Fornecido pela Biologix |
| `BIOLOGIX_PARTNER_ID` | ID do centro credenciado (partnerId/centerID) | Mesmo valor do `centerID` usado no workflow n8n |

**Nota:** 
- O `userId` retornado na sessão é usado para Basic Auth
- O `BIOLOGIX_PARTNER_ID` é usado na URL `/v2/partners/{partnerId}/exams`
- No seu workflow n8n (`Exame Ronco.json`), o `centerID` é `4798042LW` - use este mesmo valor

## Como Configurar

### 1. Para Desenvolvimento Local

Adicione as credenciais ao arquivo `.env.local`:

```env
BIOLOGIX_USERNAME=seu_username_aqui
BIOLOGIX_PASSWORD=sua_senha_aqui
BIOLOGIX_SOURCE=100
BIOLOGIX_PARTNER_ID=seu_partner_id_aqui
```

### 2. Para Edge Function no Supabase

As Edge Functions do Supabase precisam das credenciais configuradas como **Secrets**.

#### Passo a Passo:

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Selecione seu projeto: `qigbblypwkgflwnrrhzg`
3. Vá em **Edge Functions** → **Secrets**
4. Adicione cada variável:
   - Clique em **"Add new secret"**
   - Nome: `BIOLOGIX_USERNAME`
   - Valor: (seu username)
   - Clique em **"Save"**
   - Repita para `BIOLOGIX_PASSWORD`, `BIOLOGIX_SOURCE` e `BIOLOGIX_PARTNER_ID`

#### Ou via CLI:

```bash
# Fazer login primeiro
npx supabase login

# Adicionar secrets
npx supabase secrets set BIOLOGIX_USERNAME=seu_username
npx supabase secrets set BIOLOGIX_PASSWORD=sua_senha
npx supabase secrets set BIOLOGIX_SOURCE=100
npx supabase secrets set BIOLOGIX_PARTNER_ID=4798042LW
```

### 3. Verificar Secrets Configurados

```bash
npx supabase secrets list
```

## Testando a Configuração

Após configurar as credenciais, você pode testar a Edge Function:

```bash
# Deploy da função
npx supabase functions deploy sync-biologix

# Invocar manualmente para teste
npx supabase functions invoke sync-biologix
```

## Importante

⚠️ **Nunca commite as credenciais no Git!**
- O arquivo `.env.local` já está no `.gitignore`
- Use apenas Secrets do Supabase para produção
- Mantenha as credenciais seguras e não compartilhe

## Próximos Passos

1. Obter credenciais da Biologix
2. Configurar secrets no Supabase
3. Fazer deploy da Edge Function (tarefa 1.8.13)
4. Configurar Cron Job (tarefa 1.9)

