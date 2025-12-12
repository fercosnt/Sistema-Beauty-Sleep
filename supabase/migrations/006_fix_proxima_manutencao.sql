-- Migration 006: Fix proxima_manutencao calculation
-- Fix: Use last session date instead of CURRENT_DATE when calculating proxima_manutencao

-- Replace the trigger function to use the last session date
CREATE OR REPLACE FUNCTION calcular_proxima_manutencao_trigger_func() RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
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
$$;

-- Fix existing pacientes that have proxima_manutencao calculated incorrectly
-- Recalculate proxima_manutencao for all finalizado pacientes using their last session date
UPDATE pacientes p
SET proxima_manutencao = calcular_proxima_manutencao(
  (SELECT MAX(data_sessao) FROM sessoes WHERE paciente_id = p.id)
)
WHERE p.status = 'finalizado'
  AND EXISTS (SELECT 1 FROM sessoes WHERE paciente_id = p.id)
  AND (SELECT MAX(data_sessao) FROM sessoes WHERE paciente_id = p.id) IS NOT NULL;

