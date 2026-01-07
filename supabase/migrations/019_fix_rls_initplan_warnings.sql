-- Migration 019: Fix RLS Initialization Plan Warnings
-- Corrige avisos de performance do Supabase Performance Advisor
-- Substitui auth.<function>() por (select auth.<function>()) para evitar reavaliação por linha
--
-- Problema: Políticas RLS estão reavaliando auth.uid() ou get_user_role() para cada linha
-- Solução: Usar (select auth.uid()) para avaliar uma vez por query, não por linha
--
-- Referência: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select

-- ============================================
-- AUDIT_LOGS TABLE - INSERT POLICY
-- ============================================

-- Drop existing policy if it exists (pode ter sido criada automaticamente pelo Supabase)
DROP POLICY IF EXISTS audit_logs_insert ON audit_logs;

-- Create optimized INSERT policy
-- Permite inserts de triggers (que rodam com SECURITY DEFINER e bypassam RLS)
-- e de usuários autenticados
-- Usa (select auth.uid()) para evitar reavaliação por linha
CREATE POLICY audit_logs_insert ON audit_logs
  FOR INSERT
  WITH CHECK (
    -- Permite inserts de usuários autenticados
    -- Triggers bypassam RLS automaticamente (SECURITY DEFINER)
    -- Usando (select auth.uid()) garante avaliação uma vez por query
    (select auth.uid()) IS NOT NULL
  );

-- ============================================
-- HISTORICO_STATUS TABLE - INSERT POLICY
-- ============================================

-- Drop existing policy if it exists (pode ter sido criada automaticamente pelo Supabase)
DROP POLICY IF EXISTS historico_status_insert ON historico_status;

-- Create optimized INSERT policy
-- Permite inserts de triggers (que rodam com SECURITY DEFINER e bypassam RLS)
-- e de usuários autenticados
-- Usa (select auth.uid()) para evitar reavaliação por linha
CREATE POLICY historico_status_insert ON historico_status
  FOR INSERT
  WITH CHECK (
    -- Permite inserts de usuários autenticados
    -- Triggers bypassam RLS automaticamente (SECURITY DEFINER)
    -- Usando (select auth.uid()) garante avaliação uma vez por query
    (select auth.uid()) IS NOT NULL
  );

-- ============================================
-- SESSAO_HISTORICO TABLE - INSERT POLICY
-- ============================================

-- Drop existing policy if it exists (pode ter sido criada automaticamente pelo Supabase)
DROP POLICY IF EXISTS sessao_historico_insert ON sessao_historico;

-- Create optimized INSERT policy
-- Permite inserts de triggers (que rodam com SECURITY DEFINER e bypassam RLS)
-- e de usuários autenticados
-- Usa (select auth.uid()) para evitar reavaliação por linha
CREATE POLICY sessao_historico_insert ON sessao_historico
  FOR INSERT
  WITH CHECK (
    -- Permite inserts de usuários autenticados
    -- Triggers bypassam RLS automaticamente (SECURITY DEFINER)
    -- Usando (select auth.uid()) garante avaliação uma vez por query
    (select auth.uid()) IS NOT NULL
  );

-- ============================================
-- NOTES
-- ============================================
-- Estas políticas usam (select auth.uid()) em vez de auth.uid() para garantir
-- que a função seja avaliada uma vez por query, não uma vez por linha.
-- Isso melhora a performance em escala, conforme recomendado pelo Supabase.
--
-- As políticas permitem inserts de:
-- 1. Triggers (que rodam com SECURITY DEFINER e bypassam RLS automaticamente)
-- 2. Usuários autenticados (quando auth.uid() não é NULL)
--
-- Isso é seguro porque:
-- - Triggers rodam com SECURITY DEFINER e bypassam RLS
-- - Usuários autenticados já são validados pelo Supabase Auth
-- - Apenas usuários autenticados podem fazer inserts diretos
