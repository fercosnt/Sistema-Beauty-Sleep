-- Migration 019: Fix security warning - update_alertas_updated_at search_path
-- 
-- This migration fixes the security warning about mutable search_path
-- in the update_alertas_updated_at function by explicitly setting
-- search_path = public to prevent schema injection attacks.
--
-- Security Issue:
-- Functions with mutable search_path can be vulnerable to schema
-- injection attacks where an attacker could manipulate the search_path
-- to execute code from a different schema.
--
-- Solution:
-- Set a fixed search_path = public to ensure the function always
-- uses the public schema, preventing any search_path manipulation.

-- ============================================
-- 1. Fix update_alertas_updated_at function
-- ============================================
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

-- ============================================
-- 2. Add comment for documentation
-- ============================================
COMMENT ON FUNCTION update_alertas_updated_at() IS 
  'Updates the updated_at timestamp for alertas table. Fixed search_path = public for security.';

