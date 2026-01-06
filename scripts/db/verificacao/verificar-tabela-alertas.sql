-- Script para verificar se a tabela alertas foi criada corretamente
-- Execute este script no Supabase SQL Editor

-- 1. Verificar se a tabela existe
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'alertas';

-- 2. Verificar estrutura da tabela
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'alertas'
ORDER BY ordinal_position;

-- 3. Verificar constraints CHECK
SELECT 
  constraint_name,
  constraint_type,
  check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'alertas'
  AND tc.constraint_type = 'CHECK';

-- 4. Verificar índices
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'alertas';

-- 5. Verificar RLS
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'alertas';

-- 6. Verificar policies RLS
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'alertas';

-- 7. Contar registros (se houver)
SELECT COUNT(*) as total_alertas FROM alertas;

-- 8. Verificar se há alertas pendentes
SELECT 
  tipo,
  urgencia,
  status,
  COUNT(*) as quantidade
FROM alertas
GROUP BY tipo, urgencia, status
ORDER BY tipo, urgencia, status;

