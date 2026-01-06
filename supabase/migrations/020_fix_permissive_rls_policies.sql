-- Migration 020: Fix Permissive RLS Policies
-- 
-- This migration fixes overly permissive RLS policies that use
-- WITH CHECK (true), which effectively bypasses row-level security.
-- These policies are flagged by Supabase's security linter.
--
-- Tables affected:
-- - audit_logs (audit_logs_insert)
-- - historico_status (historico_status_insert)
-- - sessao_historico (sessao_historico_insert)
--
-- These tables are typically populated by triggers/functions,
-- so we'll restrict INSERT to authenticated users with appropriate roles.

-- ============================================
-- 1. Fix audit_logs INSERT policy
-- ============================================
-- Drop existing permissive policy if it exists
DROP POLICY IF EXISTS audit_logs_insert ON public.audit_logs;

-- Create secure INSERT policy: Only authenticated users can insert
-- (Typically done via triggers, but we restrict to authenticated users)
CREATE POLICY audit_logs_insert ON public.audit_logs
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND get_user_role() IN ('admin', 'equipe')
  );

-- ============================================
-- 2. Fix historico_status INSERT policy
-- ============================================
-- Drop existing permissive policy if it exists
DROP POLICY IF EXISTS historico_status_insert ON public.historico_status;

-- Create secure INSERT policy: Only authenticated users with appropriate roles
CREATE POLICY historico_status_insert ON public.historico_status
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND get_user_role() IN ('admin', 'equipe')
  );

-- ============================================
-- 3. Fix sessao_historico INSERT policy
-- ============================================
-- Drop existing permissive policy if it exists
DROP POLICY IF EXISTS sessao_historico_insert ON public.sessao_historico;

-- Create secure INSERT policy: Only authenticated users with appropriate roles
CREATE POLICY sessao_historico_insert ON public.sessao_historico
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND get_user_role() IN ('admin', 'equipe')
  );

-- ============================================
-- 4. Add comments for documentation
-- ============================================
COMMENT ON POLICY audit_logs_insert ON public.audit_logs IS 
  'Allows INSERT only for authenticated admin and equipe users. Typically used by triggers.';

COMMENT ON POLICY historico_status_insert ON public.historico_status IS 
  'Allows INSERT only for authenticated admin and equipe users. Typically used by triggers.';

COMMENT ON POLICY sessao_historico_insert ON public.sessao_historico IS 
  'Allows INSERT only for authenticated admin and equipe users. Typically used by triggers.';

