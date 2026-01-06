# Como Aplicar Migration 020: Fix Permissive RLS Policies

## 📋 Objetivo

Corrigir políticas RLS muito permissivas que usam `WITH CHECK (true)`, o que efetivamente ignora a segurança de nível de linha.

## ⚠️ Avisos Corrigidos

Esta migration corrige os seguintes avisos do Supabase Security Linter:

1. **audit_logs_insert** - Política permissiva para INSERT
2. **historico_status_insert** - Política permissiva para INSERT
3. **sessao_historico_insert** - Política permissiva para INSERT

## 🚀 Como Aplicar

### Opção 1: Via Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New query**
5. Abra o arquivo: `supabase/migrations/020_fix_permissive_rls_policies.sql`
6. Copie **TODO o conteúdo** do arquivo
7. Cole no SQL Editor
8. Clique em **Run** (ou pressione `Ctrl+Enter`)
9. Aguarde a confirmação de sucesso

### Opção 2: Via Supabase CLI

```bash
# Aplicar migration
npx supabase db push

# Ou aplicar migration específica
npx supabase migration up 020
```

## ✅ Verificação

Após aplicar a migration, verifique:

1. **No Supabase Dashboard:**
   - Vá em **Database** → **Policies**
   - Verifique se as políticas foram atualizadas:
     - `audit_logs_insert` - Deve ter `WITH CHECK` com verificação de role
     - `historico_status_insert` - Deve ter `WITH CHECK` com verificação de role
     - `sessao_historico_insert` - Deve ter `WITH CHECK` com verificação de role

2. **Verificar avisos de segurança:**
   - Vá em **Database** → **Linter**
   - Os avisos sobre políticas permissivas devem desaparecer

## 📝 O que a Migration Faz

1. **Remove políticas permissivas existentes:**
   - `DROP POLICY IF EXISTS` para cada política permissiva

2. **Cria políticas seguras:**
   - Restringe INSERT apenas para usuários autenticados
   - Verifica que o usuário tem role `admin` ou `equipe`
   - Usa `get_user_role()` para verificar permissões

3. **Adiciona documentação:**
   - Comentários explicando o propósito de cada política

## 🔒 Segurança

**Antes:**
```sql
CREATE POLICY audit_logs_insert ON audit_logs
  FOR INSERT
  WITH CHECK (true);  -- ❌ Permissivo demais!
```

**Depois:**
```sql
CREATE POLICY audit_logs_insert ON audit_logs
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND get_user_role() IN ('admin', 'equipe')
  );  -- ✅ Seguro!
```

## ⚠️ Nota Importante

Essas tabelas são tipicamente populadas por **triggers** e **funções** do banco de dados, não diretamente por usuários. As políticas restritivas garantem que apenas operações autorizadas possam inserir dados nessas tabelas de auditoria e histórico.

## 🐛 Troubleshooting

### Erro: "policy does not exist"
- Isso é normal se a política permissiva nunca foi criada
- A migration usa `DROP POLICY IF EXISTS`, então é seguro

### Erro: "function get_user_role() does not exist"
- Certifique-se de que a migration `004_rls_policies.sql` foi aplicada
- Essa migration cria a função `get_user_role()`

### Avisos ainda aparecem após aplicar
- Aguarde alguns minutos - o linter do Supabase pode levar tempo para atualizar
- Verifique se as políticas foram realmente atualizadas no Dashboard

