-- Migration 011: Fix All Security Warnings (Consolidated)
-- This migration consolidates all security fixes:
-- 1. Adds SET search_path to all functions
-- 2. Moves pg_net extension from public to extensions schema
--
-- This can be applied even if there are migration history issues

-- ============================================
-- PART 1: Fix Function Search Path
-- ============================================

-- Function: validar_cpf
CREATE OR REPLACE FUNCTION validar_cpf(cpf TEXT) RETURNS BOOLEAN
LANGUAGE plpgsql IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  cpf_limpo TEXT;
  i INTEGER;
  digito1 INTEGER;
  digito2 INTEGER;
  soma INTEGER;
  resto INTEGER;
BEGIN
  cpf_limpo := REGEXP_REPLACE(cpf, '[^0-9]', '', 'g');
  IF LENGTH(cpf_limpo) != 11 THEN
    RETURN FALSE;
  END IF;
  IF cpf_limpo = REGEXP_REPLACE(cpf_limpo, '.', cpf_limpo, 'g') THEN
    RETURN FALSE;
  END IF;
  soma := 0;
  FOR i IN 1..9 LOOP
    soma := soma + CAST(SUBSTRING(cpf_limpo, i, 1) AS INTEGER) * (11 - i);
  END LOOP;
  resto := (soma * 10) % 11;
  IF resto = 10 OR resto = 11 THEN
    resto := 0;
  END IF;
  digito1 := resto;
  IF digito1 != CAST(SUBSTRING(cpf_limpo, 10, 1) AS INTEGER) THEN
    RETURN FALSE;
  END IF;
  soma := 0;
  FOR i IN 1..10 LOOP
    soma := soma + CAST(SUBSTRING(cpf_limpo, i, 1) AS INTEGER) * (12 - i);
  END LOOP;
  resto := (soma * 10) % 11;
  IF resto = 10 OR resto = 11 THEN
    resto := 0;
  END IF;
  digito2 := resto;
  IF digito2 != CAST(SUBSTRING(cpf_limpo, 11, 1) AS INTEGER) THEN
    RETURN FALSE;
  END IF;
  RETURN TRUE;
END;
$$;

-- Function: formatar_cpf
CREATE OR REPLACE FUNCTION formatar_cpf(cpf TEXT) RETURNS TEXT
LANGUAGE plpgsql IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  cpf_limpo TEXT;
BEGIN
  cpf_limpo := REGEXP_REPLACE(cpf, '[^0-9]', '', 'g');
  IF LENGTH(cpf_limpo) != 11 THEN
    RETURN cpf;
  END IF;
  RETURN SUBSTRING(cpf_limpo, 1, 3) || '.' ||
         SUBSTRING(cpf_limpo, 4, 3) || '.' ||
         SUBSTRING(cpf_limpo, 7, 3) || '-' ||
         SUBSTRING(cpf_limpo, 10, 2);
END;
$$;

-- Function: extract_cpf_from_username
CREATE OR REPLACE FUNCTION extract_cpf_from_username(username TEXT) RETURNS TEXT
LANGUAGE plpgsql IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  RETURN REGEXP_REPLACE(username, '[^0-9]', '', 'g');
END;
$$;

-- Function: calcular_imc
CREATE OR REPLACE FUNCTION calcular_imc(peso_kg NUMERIC, altura_cm NUMERIC) RETURNS NUMERIC
LANGUAGE plpgsql IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  altura_m NUMERIC;
BEGIN
  IF peso_kg IS NULL OR altura_cm IS NULL OR altura_cm <= 0 THEN
    RETURN NULL;
  END IF;
  altura_m := altura_cm / 100.0;
  RETURN ROUND((peso_kg / (altura_m * altura_m))::NUMERIC, 2);
END;
$$;

-- Function: calcular_score_ronco
CREATE OR REPLACE FUNCTION calcular_score_ronco(baixo NUMERIC, medio NUMERIC, alto NUMERIC) RETURNS NUMERIC
LANGUAGE plpgsql IMMUTABLE
SET search_path = ''
AS $$
DECLARE
  total NUMERIC;
BEGIN
  IF baixo IS NULL THEN baixo := 0; END IF;
  IF medio IS NULL THEN medio := 0; END IF;
  IF alto IS NULL THEN alto := 0; END IF;
  total := baixo + medio + alto;
  IF total = 0 THEN
    RETURN NULL;
  END IF;
  RETURN ROUND(((baixo * 1 + medio * 2 + alto * 3) / 3)::NUMERIC, 2);
END;
$$;

-- Function: calcular_adesao
CREATE OR REPLACE FUNCTION calcular_adesao(sessoes_utilizadas INT, sessoes_total INT) RETURNS NUMERIC
LANGUAGE plpgsql IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  IF sessoes_total IS NULL OR sessoes_total <= 0 THEN
    RETURN NULL;
  END IF;
  IF sessoes_utilizadas IS NULL THEN
    sessoes_utilizadas := 0;
  END IF;
  RETURN ROUND((sessoes_utilizadas::NUMERIC / sessoes_total::NUMERIC * 100)::NUMERIC, 2);
END;
$$;

-- Function: calcular_proxima_manutencao
CREATE OR REPLACE FUNCTION calcular_proxima_manutencao(data_finalizacao DATE) RETURNS DATE
LANGUAGE plpgsql IMMUTABLE
SET search_path = ''
AS $$
BEGIN
  IF data_finalizacao IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN data_finalizacao + INTERVAL '6 months';
END;
$$;

-- Function: atualizar_sessoes_utilizadas_func
CREATE OR REPLACE FUNCTION atualizar_sessoes_utilizadas_func() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE pacientes
    SET sessoes_utilizadas = sessoes_utilizadas + (NEW.contador_pulsos_final - NEW.contador_pulsos_inicial)
    WHERE id = NEW.paciente_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE pacientes
    SET sessoes_utilizadas = GREATEST(0, sessoes_utilizadas - (OLD.contador_pulsos_final - OLD.contador_pulsos_inicial))
    WHERE id = OLD.paciente_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Function: atualizar_status_ao_criar_sessao_func
CREATE OR REPLACE FUNCTION atualizar_status_ao_criar_sessao_func() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE pacientes
  SET status = 'ativo'
  WHERE id = NEW.paciente_id
    AND status = 'lead';
  RETURN NEW;
END;
$$;

-- Function: calcular_proxima_manutencao_trigger_func
CREATE OR REPLACE FUNCTION calcular_proxima_manutencao_trigger_func() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  ultima_sessao_date DATE;
BEGIN
  IF NEW.status = 'finalizado' AND (OLD.status IS NULL OR OLD.status != 'finalizado') THEN
    SELECT MAX(data_sessao) INTO ultima_sessao_date
    FROM sessoes
    WHERE paciente_id = NEW.id;
    IF ultima_sessao_date IS NOT NULL THEN
      NEW.proxima_manutencao := calcular_proxima_manutencao(ultima_sessao_date);
    ELSE
      NEW.proxima_manutencao := calcular_proxima_manutencao(CURRENT_DATE);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Function: atualizar_imc_func
CREATE OR REPLACE FUNCTION atualizar_imc_func() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.peso_kg IS NOT NULL AND NEW.altura_cm IS NOT NULL THEN
    NEW.imc := calcular_imc(NEW.peso_kg, NEW.altura_cm);
  END IF;
  RETURN NEW;
END;
$$;

-- Function: registrar_historico_status_func
CREATE OR REPLACE FUNCTION registrar_historico_status_func() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO historico_status (paciente_id, status_anterior, status_novo, user_id)
    VALUES (NEW.id, OLD.status, NEW.status, NULL);
  END IF;
  RETURN NEW;
END;
$$;

-- Function: registrar_edicao_sessao_func
CREATE OR REPLACE FUNCTION registrar_edicao_sessao_func() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.data_sessao IS DISTINCT FROM NEW.data_sessao THEN
    INSERT INTO sessao_historico (sessao_id, campo_alterado, valor_anterior, valor_novo, user_id)
    VALUES (NEW.id, 'data_sessao', OLD.data_sessao::TEXT, NEW.data_sessao::TEXT, NULL);
  END IF;
  IF OLD.contador_pulsos_inicial IS DISTINCT FROM NEW.contador_pulsos_inicial THEN
    INSERT INTO sessao_historico (sessao_id, campo_alterado, valor_anterior, valor_novo, user_id)
    VALUES (NEW.id, 'contador_pulsos_inicial', OLD.contador_pulsos_inicial::TEXT, NEW.contador_pulsos_inicial::TEXT, NULL);
  END IF;
  IF OLD.contador_pulsos_final IS DISTINCT FROM NEW.contador_pulsos_final THEN
    INSERT INTO sessao_historico (sessao_id, campo_alterado, valor_anterior, valor_novo, user_id)
    VALUES (NEW.id, 'contador_pulsos_final', OLD.contador_pulsos_final::TEXT, NEW.contador_pulsos_final::TEXT, NULL);
  END IF;
  IF OLD.protocolo IS DISTINCT FROM NEW.protocolo THEN
    INSERT INTO sessao_historico (sessao_id, campo_alterado, valor_anterior, valor_novo, user_id)
    VALUES (NEW.id, 'protocolo', array_to_string(OLD.protocolo, ','), array_to_string(NEW.protocolo, ','), NULL);
  END IF;
  IF OLD.observacoes IS DISTINCT FROM NEW.observacoes THEN
    INSERT INTO sessao_historico (sessao_id, campo_alterado, valor_anterior, valor_novo, user_id)
    VALUES (NEW.id, 'observacoes', COALESCE(OLD.observacoes, ''), COALESCE(NEW.observacoes, ''), NULL);
  END IF;
  NEW.editado_em := NOW();
  RETURN NEW;
END;
$$;

-- Function: audit_log_trigger_func
CREATE OR REPLACE FUNCTION audit_log_trigger_func() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  detalhes_json JSONB;
  current_user_id UUID;
BEGIN
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
$$;

-- Function: atualizar_updated_at_func
CREATE OR REPLACE FUNCTION atualizar_updated_at_func() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- Function: get_user_role
CREATE OR REPLACE FUNCTION get_user_role() RETURNS TEXT
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Function: get_user_id
CREATE OR REPLACE FUNCTION get_user_id() RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- ============================================
-- PART 2: Move pg_net Extension
-- ============================================

-- Create extensions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS extensions;

-- Move pg_net extension to extensions schema
DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- Grant usage on the extensions schema
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO anon;

-- Update the cron job to use schema-qualified name for net.http_post
DO $update_cron$
DECLARE
  job_id BIGINT;
BEGIN
  SELECT jobid INTO job_id
  FROM cron.job
  WHERE jobname = 'sync-biologix-daily';
  
  IF job_id IS NOT NULL THEN
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 13 * * *',
      command := $cmd$SELECT extensions.net.http_post(url := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/sync-biologix', headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key')), body := jsonb_build_object('time', now()), timeout_milliseconds := 300000) as request_id;$cmd$
    );
  END IF;
END;
$update_cron$;


