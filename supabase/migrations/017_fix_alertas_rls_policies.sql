-- Migration 017: Fix alertas RLS policies to allow all authenticated users to update alerts
-- 
-- This migration updates the RLS policies for the alertas table to allow
-- all authenticated users (admin, equipe, recepcao) to update alerts.
-- This makes sense because any user should be able to mark an alert as resolved.

-- ============================================
-- 1. Drop existing update policy
-- ============================================
DROP POLICY IF EXISTS "Admin and equipe can update alertas" ON alertas;

-- ============================================
-- 2. Create new update policy for all roles
-- ============================================
CREATE POLICY "All authenticated users can update alertas"
  ON alertas
  FOR UPDATE
  USING (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  )
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  );

-- ============================================
-- 3. Also update select policy to include recepcao
-- ============================================
DROP POLICY IF EXISTS "Admin and equipe can view alertas" ON alertas;

CREATE POLICY "All authenticated users can view alertas"
  ON alertas
  FOR SELECT
  USING (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  );

