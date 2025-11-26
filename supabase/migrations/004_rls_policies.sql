-- Migration 004: Row Level Security Policies
-- RLS policies for 3 roles: admin, equipe, recepcao

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exames ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE paciente_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessao_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role from auth.users
CREATE OR REPLACE FUNCTION get_user_role() RETURNS TEXT AS $$
DECLARE
  user_email TEXT;
  user_role TEXT;
BEGIN
  user_email := auth.email();
  IF user_email IS NULL THEN
    RETURN NULL;
  END IF;
  
  SELECT role INTO user_role
  FROM users
  WHERE email = user_email AND ativo = true;
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user id from auth.users
CREATE OR REPLACE FUNCTION get_user_id() RETURNS UUID AS $$
DECLARE
  user_email TEXT;
  user_uuid UUID;
BEGIN
  user_email := auth.email();
  IF user_email IS NULL THEN
    RETURN NULL;
  END IF;
  
  SELECT id INTO user_uuid
  FROM users
  WHERE email = user_email AND ativo = true;
  
  RETURN user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Policy: users_select - All roles can view users
CREATE POLICY users_select ON users
  FOR SELECT
  USING (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  );

-- Policy: users_insert - Only Admin can create users
CREATE POLICY users_insert ON users
  FOR INSERT
  WITH CHECK (
    get_user_role() = 'admin'
  );

-- Policy: users_update - Only Admin can update users
CREATE POLICY users_update ON users
  FOR UPDATE
  USING (
    get_user_role() = 'admin'
  )
  WITH CHECK (
    get_user_role() = 'admin'
  );

-- ============================================
-- PACIENTES TABLE POLICIES
-- ============================================

-- Policy: pacientes_select - All roles can view pacientes
CREATE POLICY pacientes_select ON pacientes
  FOR SELECT
  USING (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  );

-- Policy: pacientes_insert - Admin/Equipe can create pacientes
CREATE POLICY pacientes_insert ON pacientes
  FOR INSERT
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: pacientes_update - Admin/Equipe can update pacientes
CREATE POLICY pacientes_update ON pacientes
  FOR UPDATE
  USING (
    get_user_role() IN ('admin', 'equipe')
  )
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: pacientes_delete - Only Admin can delete pacientes
CREATE POLICY pacientes_delete ON pacientes
  FOR DELETE
  USING (
    get_user_role() = 'admin'
  );

-- ============================================
-- EXAMES TABLE POLICIES
-- ============================================

-- Policy: exames_select - All roles can view exames
CREATE POLICY exames_select ON exames
  FOR SELECT
  USING (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  );

-- Policy: exames_insert - Admin/Equipe can create exames (usually via Edge Function)
CREATE POLICY exames_insert ON exames
  FOR INSERT
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: exames_update - Admin/Equipe can update exames
CREATE POLICY exames_update ON exames
  FOR UPDATE
  USING (
    get_user_role() IN ('admin', 'equipe')
  )
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- ============================================
-- SESSOES TABLE POLICIES
-- ============================================

-- Policy: sessoes_select - All roles can view sessoes
CREATE POLICY sessoes_select ON sessoes
  FOR SELECT
  USING (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  );

-- Policy: sessoes_insert - Admin/Equipe can create sessoes
CREATE POLICY sessoes_insert ON sessoes
  FOR INSERT
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: sessoes_update - Admin can update any, Equipe can update own only
CREATE POLICY sessoes_update ON sessoes
  FOR UPDATE
  USING (
    get_user_role() = 'admin' OR
    (get_user_role() = 'equipe' AND user_id = get_user_id())
  )
  WITH CHECK (
    get_user_role() = 'admin' OR
    (get_user_role() = 'equipe' AND user_id = get_user_id())
  );

-- Policy: sessoes_delete - Only Admin can delete sessoes
CREATE POLICY sessoes_delete ON sessoes
  FOR DELETE
  USING (
    get_user_role() = 'admin'
  );

-- ============================================
-- TAGS TABLE POLICIES
-- ============================================

-- Policy: tags_select - All roles can view tags
CREATE POLICY tags_select ON tags
  FOR SELECT
  USING (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  );

-- Policy: tags_insert - Admin/Equipe can create tags
CREATE POLICY tags_insert ON tags
  FOR INSERT
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: tags_update - Admin/Equipe can update tags
CREATE POLICY tags_update ON tags
  FOR UPDATE
  USING (
    get_user_role() IN ('admin', 'equipe')
  )
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: tags_delete - Only Admin can delete tags
CREATE POLICY tags_delete ON tags
  FOR DELETE
  USING (
    get_user_role() = 'admin'
  );

-- ============================================
-- PACIENTE_TAGS TABLE POLICIES
-- ============================================

-- Policy: paciente_tags_select - All roles can view paciente_tags
CREATE POLICY paciente_tags_select ON paciente_tags
  FOR SELECT
  USING (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  );

-- Policy: paciente_tags_insert - Admin/Equipe can create paciente_tags
CREATE POLICY paciente_tags_insert ON paciente_tags
  FOR INSERT
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: paciente_tags_delete - Admin/Equipe can delete paciente_tags
CREATE POLICY paciente_tags_delete ON paciente_tags
  FOR DELETE
  USING (
    get_user_role() IN ('admin', 'equipe')
  );

-- ============================================
-- NOTAS TABLE POLICIES
-- ============================================

-- Policy: notas_select - All roles can view notas
CREATE POLICY notas_select ON notas
  FOR SELECT
  USING (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  );

-- Policy: notas_insert - Admin/Equipe can create notas
CREATE POLICY notas_insert ON notas
  FOR INSERT
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: notas_update - Admin can update any, Equipe can update own only
CREATE POLICY notas_update ON notas
  FOR UPDATE
  USING (
    get_user_role() = 'admin' OR
    (get_user_role() = 'equipe' AND user_id = get_user_id())
  )
  WITH CHECK (
    get_user_role() = 'admin' OR
    (get_user_role() = 'equipe' AND user_id = get_user_id())
  );

-- Policy: notas_delete - Admin can delete any, Equipe can delete own only
CREATE POLICY notas_delete ON notas
  FOR DELETE
  USING (
    get_user_role() = 'admin' OR
    (get_user_role() = 'equipe' AND user_id = get_user_id())
  );

-- ============================================
-- HISTORICO_STATUS TABLE POLICIES
-- ============================================

-- Policy: historico_status_select - All roles can view historico_status
CREATE POLICY historico_status_select ON historico_status
  FOR SELECT
  USING (
    get_user_role() IN ('admin', 'equipe', 'recepcao')
  );

-- ============================================
-- SESSAO_HISTORICO TABLE POLICIES
-- ============================================

-- Policy: sessao_historico_select - Admin can view sessao_historico
CREATE POLICY sessao_historico_select ON sessao_historico
  FOR SELECT
  USING (
    get_user_role() = 'admin'
  );

-- ============================================
-- AUDIT_LOGS TABLE POLICIES
-- ============================================

-- Policy: audit_logs_select - Only Admin can view audit logs
CREATE POLICY audit_logs_select ON audit_logs
  FOR SELECT
  USING (
    get_user_role() = 'admin'
  );

