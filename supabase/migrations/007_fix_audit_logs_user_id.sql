-- Migration 007: Fix audit_logs to capture user_id correctly
-- Updates audit_log_trigger_func to use get_user_id() instead of NULL

-- Drop and recreate the trigger function with user_id capture
CREATE OR REPLACE FUNCTION audit_log_trigger_func() RETURNS TRIGGER AS $$
DECLARE
  detalhes_json JSONB;
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := get_user_id();
  
  detalhes_json := '{}'::JSONB;
  
  IF TG_OP = 'INSERT' THEN
    detalhes_json := to_jsonb(NEW);
    INSERT INTO audit_logs (user_id, acao, entidade, entidade_id, detalhes)
    VALUES (current_user_id, 'INSERT', TG_TABLE_NAME, NEW.id, detalhes_json);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    detalhes_json := jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    );
    INSERT INTO audit_logs (user_id, acao, entidade, entidade_id, detalhes)
    VALUES (current_user_id, 'UPDATE', TG_TABLE_NAME, NEW.id, detalhes_json);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    detalhes_json := to_jsonb(OLD);
    INSERT INTO audit_logs (user_id, acao, entidade, entidade_id, detalhes)
    VALUES (current_user_id, 'DELETE', TG_TABLE_NAME, OLD.id, detalhes_json);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public;

-- Note: The triggers audit_log_pacientes and audit_log_sessoes don't need to be recreated
-- as they already reference the function. The function update will apply automatically.

