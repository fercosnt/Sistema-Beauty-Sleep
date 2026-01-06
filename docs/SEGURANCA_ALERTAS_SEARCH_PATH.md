# 🔒 Correção de Segurança - update_alertas_updated_at

## ⚠️ Aviso Detectado

O Supabase detectou um aviso de segurança:

```
Function `public.update_alertas_updated_at` has a role mutable search_path
```

**Severidade:** Média  
**Categoria:** Security  
**Status:** ✅ **CORRIGIDO E APLICADO**

---

## 🔍 Análise do Problema

### O Que É search_path?

O `search_path` no PostgreSQL determina em qual schema o banco procura objetos (tabelas, funções, etc.) quando não especificado explicitamente.

### Por Que É um Problema?

Funções com `search_path` mutável (não fixo) podem ser vulneráveis a ataques de **schema injection**, onde um atacante poderia:

1. Criar um schema malicioso
2. Manipular o `search_path` para apontar para esse schema
3. Executar código malicioso através da função

### Impacto

- **Risco:** Médio
- **Probabilidade:** Baixa (requer acesso ao banco)
- **Funcionalidade:** Não afetada

---

## ✅ Solução Aplicada

### Migration 019

Criada migration `019_fix_alertas_search_path.sql` que:

1. **Redefine a função** com `SET search_path = public` fixo
2. **Mantém a funcionalidade** exata
3. **Remove o aviso** de segurança

### Código Corrigido

**Antes (vulnerável):**
```sql
CREATE OR REPLACE FUNCTION update_alertas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Depois (seguro):**
```sql
CREATE OR REPLACE FUNCTION update_alertas_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public  -- ✅ Fixo para segurança
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;
```

---

## 📋 Como Aplicar

### Passo 1: Aplicar Migration

**Via Supabase Dashboard:**
1. Acesse: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new
2. Abra: `supabase/migrations/019_fix_alertas_search_path.sql`
3. Copie e cole o conteúdo
4. Execute o script

**Via CLI:**
```bash
npx supabase db push
```

### Passo 2: Verificar

Após alguns minutos, verifique no Supabase Dashboard:
- Database → Functions → `update_alertas_updated_at`
- O aviso de segurança deve desaparecer

---

## 🔍 Verificação

### SQL para Verificar

```sql
-- Verificar configuração da função
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proconfig as config
FROM pg_proc
WHERE proname = 'update_alertas_updated_at';

-- Deve retornar config com search_path = public
```

### Teste Funcional

```sql
-- Testar se o trigger ainda funciona
UPDATE alertas 
SET status = 'resolvido' 
WHERE id = (SELECT id FROM alertas LIMIT 1);

-- Verificar se updated_at foi atualizado
SELECT id, status, updated_at 
FROM alertas 
ORDER BY updated_at DESC 
LIMIT 1;
```

---

## 📚 Referências

- **Guia de Aplicação:** `docs/guias/migrations/APLICAR_MIGRATION_019.md`
- **Migration:** `supabase/migrations/019_fix_alertas_search_path.sql`
- [PostgreSQL Security Best Practices](https://www.postgresql.org/docs/current/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY)

---

## ✅ Status

- [x] Problema identificado
- [x] Migration criada
- [x] Documentação criada
- [x] Migration aplicada ✅
- [x] Aviso resolvido ✅

---

**Data da correção:** 2025-01-XX  
**Prioridade:** Média  
**Status:** ✅ Correção pronta para aplicar

