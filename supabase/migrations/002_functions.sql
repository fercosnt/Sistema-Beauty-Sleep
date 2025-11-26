-- Migration 002: Database Functions
-- PostgreSQL functions for CPF validation, formatting, calculations, etc.

-- Function: validar_cpf
-- Validates CPF using the official Brazilian algorithm
CREATE OR REPLACE FUNCTION validar_cpf(cpf TEXT) RETURNS BOOLEAN AS $$
DECLARE
  cpf_limpo TEXT;
  i INTEGER;
  digito1 INTEGER;
  digito2 INTEGER;
  soma INTEGER;
  resto INTEGER;
BEGIN
  -- Remove non-numeric characters
  cpf_limpo := REGEXP_REPLACE(cpf, '[^0-9]', '', 'g');
  
  -- Check if CPF has 11 digits
  IF LENGTH(cpf_limpo) != 11 THEN
    RETURN FALSE;
  END IF;
  
  -- Check if all digits are the same (invalid CPF)
  IF cpf_limpo = REGEXP_REPLACE(cpf_limpo, '.', cpf_limpo, 'g') THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate first check digit
  soma := 0;
  FOR i IN 1..9 LOOP
    soma := soma + CAST(SUBSTRING(cpf_limpo, i, 1) AS INTEGER) * (11 - i);
  END LOOP;
  resto := (soma * 10) % 11;
  IF resto = 10 OR resto = 11 THEN
    resto := 0;
  END IF;
  digito1 := resto;
  
  -- Check first digit
  IF digito1 != CAST(SUBSTRING(cpf_limpo, 10, 1) AS INTEGER) THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate second check digit
  soma := 0;
  FOR i IN 1..10 LOOP
    soma := soma + CAST(SUBSTRING(cpf_limpo, i, 1) AS INTEGER) * (12 - i);
  END LOOP;
  resto := (soma * 10) % 11;
  IF resto = 10 OR resto = 11 THEN
    resto := 0;
  END IF;
  digito2 := resto;
  
  -- Check second digit
  IF digito2 != CAST(SUBSTRING(cpf_limpo, 11, 1) AS INTEGER) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: formatar_cpf
-- Formats CPF as 000.000.000-00
CREATE OR REPLACE FUNCTION formatar_cpf(cpf TEXT) RETURNS TEXT AS $$
DECLARE
  cpf_limpo TEXT;
BEGIN
  -- Remove non-numeric characters
  cpf_limpo := REGEXP_REPLACE(cpf, '[^0-9]', '', 'g');
  
  -- Check if CPF has 11 digits
  IF LENGTH(cpf_limpo) != 11 THEN
    RETURN cpf; -- Return original if invalid length
  END IF;
  
  -- Format as 000.000.000-00
  RETURN SUBSTRING(cpf_limpo, 1, 3) || '.' ||
         SUBSTRING(cpf_limpo, 4, 3) || '.' ||
         SUBSTRING(cpf_limpo, 7, 3) || '-' ||
         SUBSTRING(cpf_limpo, 10, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: extract_cpf_from_username
-- Extracts CPF from username using regex
CREATE OR REPLACE FUNCTION extract_cpf_from_username(username TEXT) RETURNS TEXT AS $$
BEGIN
  -- Extract only numbers from username (assuming CPF is embedded)
  RETURN REGEXP_REPLACE(username, '[^0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: calcular_imc
-- Calculates BMI (Body Mass Index)
CREATE OR REPLACE FUNCTION calcular_imc(peso_kg NUMERIC, altura_cm NUMERIC) RETURNS NUMERIC AS $$
DECLARE
  altura_m NUMERIC;
BEGIN
  IF peso_kg IS NULL OR altura_cm IS NULL OR altura_cm <= 0 THEN
    RETURN NULL;
  END IF;
  
  altura_m := altura_cm / 100.0;
  RETURN ROUND((peso_kg / (altura_m * altura_m))::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: calcular_score_ronco
-- Calculates snoring score: (baixo × 1 + medio × 2 + alto × 3) / 3
CREATE OR REPLACE FUNCTION calcular_score_ronco(baixo NUMERIC, medio NUMERIC, alto NUMERIC) RETURNS NUMERIC AS $$
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
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: calcular_adesao
-- Calculates treatment adherence percentage
CREATE OR REPLACE FUNCTION calcular_adesao(sessoes_utilizadas INT, sessoes_total INT) RETURNS NUMERIC AS $$
BEGIN
  IF sessoes_total IS NULL OR sessoes_total <= 0 THEN
    RETURN NULL;
  END IF;
  
  IF sessoes_utilizadas IS NULL THEN
    sessoes_utilizadas := 0;
  END IF;
  
  RETURN ROUND((sessoes_utilizadas::NUMERIC / sessoes_total::NUMERIC * 100)::NUMERIC, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: calcular_proxima_manutencao
-- Calculates next maintenance date (6 months after finalization)
CREATE OR REPLACE FUNCTION calcular_proxima_manutencao(data_finalizacao DATE) RETURNS DATE AS $$
BEGIN
  IF data_finalizacao IS NULL THEN
    RETURN NULL;
  END IF;
  
  RETURN data_finalizacao + INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

