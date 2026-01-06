# 📋 Aplicar Migration 019 - Correção de Segurança

## ⚠️ Aviso de Segurança

O Supabase detectou:
```
Function `public.update_alertas_updated_at` has a role mutable search_path
```

## ✅ Solução

A migration 019 corrige isso definindo `SET search_path = public` na função.

---

## 📝 Como Aplicar

### Via Supabase Dashboard

1. **Acesse o SQL Editor:**
   - https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

2. **Copie o conteúdo abaixo:**

```sql
-- Migration 019: Fix security warning - update_alertas_updated_at search_path
CREATE OR REPLACE FUNCTION update_alertas_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_alertas_updated_at() IS 
  'Updates the updated_at timestamp for alertas table. Fixed search_path = public for security.';
```

3. **Cole no SQL Editor e execute**

4. **Verifique:**
   - Deve aparecer: `Success. No rows returned`
   - O aviso desaparecerá em alguns minutos

---

### Via CLI

```bash
npx supabase db push
```

---

## ✅ Verificação

Após aplicar, o aviso de segurança desaparecerá automaticamente no Supabase Dashboard.

**Arquivo completo:** `supabase/migrations/019_fix_alertas_search_path.sql`

