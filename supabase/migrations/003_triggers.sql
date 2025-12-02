-- Migration 003: Database Triggers
-- Automatic triggers for status updates, session tracking, maintenance calculation, etc.

-- Trigger: atualizar_sessoes_utilizadas
-- Updates pacientes.sessoes_utilizadas when sessoes are inserted or deleted
CREATE OR REPLACE FUNCTION atualizar_sessoes_utilizadas_func() RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER atualizar_sessoes_utilizadas
  AFTER INSERT OR DELETE ON sessoes
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_sessoes_utilizadas_func();

-- Trigger: atualizar_status_ao_criar_sessao
-- Changes paciente status from 'lead' to 'ativo' when first session is created
CREATE OR REPLACE FUNCTION atualizar_status_ao_criar_sessao_func() RETURNS TRIGGER AS $$
BEGIN
  UPDATE pacientes
  SET status = 'ativo'
  WHERE id = NEW.paciente_id
    AND status = 'lead';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atualizar_status_ao_criar_sessao
  AFTER INSERT ON sessoes
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_status_ao_criar_sessao_func();

-- Trigger: calcular_proxima_manutencao_trigger
-- Calculates proxima_manutencao when status changes to 'finalizado'
-- Uses the date of the last session, not CURRENT_DATE
CREATE OR REPLACE FUNCTION calcular_proxima_manutencao_trigger_func() RETURNS TRIGGER AS $$
DECLARE
  ultima_sessao_date DATE;
BEGIN
  IF NEW.status = 'finalizado' AND (OLD.status IS NULL OR OLD.status != 'finalizado') THEN
    -- Get the date of the last session for this patient
    SELECT MAX(data_sessao) INTO ultima_sessao_date
    FROM sessoes
    WHERE paciente_id = NEW.id;
    
    -- If there's a last session, use its date; otherwise use CURRENT_DATE as fallback
    IF ultima_sessao_date IS NOT NULL THEN
      NEW.proxima_manutencao := calcular_proxima_manutencao(ultima_sessao_date);
    ELSE
      -- Fallback: if no sessions found, use CURRENT_DATE
      NEW.proxima_manutencao := calcular_proxima_manutencao(CURRENT_DATE);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calcular_proxima_manutencao_trigger
  BEFORE UPDATE ON pacientes
  FOR EACH ROW
  WHEN (NEW.status = 'finalizado' AND (OLD.status IS NULL OR OLD.status != 'finalizado'))
  EXECUTE FUNCTION calcular_proxima_manutencao_trigger_func();

-- Trigger: atualizar_imc
-- Calculates and sets IMC when exames are inserted or updated
CREATE OR REPLACE FUNCTION atualizar_imc_func() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.peso_kg IS NOT NULL AND NEW.altura_cm IS NOT NULL THEN
    NEW.imc := calcular_imc(NEW.peso_kg, NEW.altura_cm);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atualizar_imc
  BEFORE INSERT OR UPDATE ON exames
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_imc_func();

-- Trigger: registrar_historico_status
-- Records status changes in historico_status table
CREATE OR REPLACE FUNCTION registrar_historico_status_func() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO historico_status (paciente_id, status_anterior, status_novo, user_id)
    VALUES (NEW.id, OLD.status, NEW.status, NULL); -- user_id will be set by application
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER registrar_historico_status
  AFTER UPDATE ON pacientes
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION registrar_historico_status_func();

-- Trigger: registrar_edicao_sessao
-- Records session edits in sessao_historico table
CREATE OR REPLACE FUNCTION registrar_edicao_sessao_func() RETURNS TRIGGER AS $$
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
  
  -- Update editado_por and editado_em
  NEW.editado_em := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER registrar_edicao_sessao
  AFTER UPDATE ON sessoes
  FOR EACH ROW
  WHEN (
    OLD.data_sessao IS DISTINCT FROM NEW.data_sessao OR
    OLD.contador_pulsos_inicial IS DISTINCT FROM NEW.contador_pulsos_inicial OR
    OLD.contador_pulsos_final IS DISTINCT FROM NEW.contador_pulsos_final OR
    OLD.protocolo IS DISTINCT FROM NEW.protocolo OR
    OLD.observacoes IS DISTINCT FROM NEW.observacoes
  )
  EXECUTE FUNCTION registrar_edicao_sessao_func();

-- Trigger: audit_log_trigger
-- Records all changes to pacientes and sessoes in audit_logs
CREATE OR REPLACE FUNCTION audit_log_trigger_func() RETURNS TRIGGER AS $$
DECLARE
  detalhes_json JSONB;
BEGIN
  detalhes_json := '{}'::JSONB;
  
  IF TG_OP = 'INSERT' THEN
    detalhes_json := to_jsonb(NEW);
    INSERT INTO audit_logs (user_id, acao, entidade, entidade_id, detalhes)
    VALUES (NULL, 'INSERT', TG_TABLE_NAME, NEW.id, detalhes_json);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    detalhes_json := jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    );
    INSERT INTO audit_logs (user_id, acao, entidade, entidade_id, detalhes)
    VALUES (NULL, 'UPDATE', TG_TABLE_NAME, NEW.id, detalhes_json);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    detalhes_json := to_jsonb(OLD);
    INSERT INTO audit_logs (user_id, acao, entidade, entidade_id, detalhes)
    VALUES (NULL, 'DELETE', TG_TABLE_NAME, OLD.id, detalhes_json);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_pacientes
  AFTER INSERT OR UPDATE OR DELETE ON pacientes
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_trigger_func();

CREATE TRIGGER audit_log_sessoes
  AFTER INSERT OR UPDATE OR DELETE ON sessoes
  FOR EACH ROW
  EXECUTE FUNCTION audit_log_trigger_func();

-- Trigger: atualizar_updated_at
-- Automatically updates updated_at timestamp on pacientes
CREATE OR REPLACE FUNCTION atualizar_updated_at_func() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atualizar_updated_at_pacientes
  BEFORE UPDATE ON pacientes
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_updated_at_func();

CREATE TRIGGER atualizar_updated_at_sessoes
  BEFORE UPDATE ON sessoes
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_updated_at_func();

