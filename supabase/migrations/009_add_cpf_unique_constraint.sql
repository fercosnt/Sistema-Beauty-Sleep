-- Migration 009: Add UNIQUE constraint to CPF column
-- This ensures that no two patients can have the same CPF
-- Note: PostgreSQL allows multiple NULL values even with UNIQUE constraint, which is desired behavior

-- First, check if there are any duplicate CPFs (excluding NULLs)
-- If duplicates exist, we need to handle them first
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT cpf, COUNT(*) as cnt
    FROM pacientes
    WHERE cpf IS NOT NULL
    GROUP BY cpf
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF duplicate_count > 0 THEN
    RAISE WARNING 'Found % duplicate CPF values. Please resolve duplicates before applying UNIQUE constraint.', duplicate_count;
    -- You may want to update or delete duplicates manually
  END IF;
END $$;

-- Add UNIQUE constraint to CPF column
-- This will fail if there are duplicate CPFs (excluding NULLs)
ALTER TABLE pacientes 
ADD CONSTRAINT pacientes_cpf_unique UNIQUE (cpf);

-- Add comment
COMMENT ON CONSTRAINT pacientes_cpf_unique ON pacientes IS 'CPF deve ser único quando fornecido. Múltiplos NULLs são permitidos.';

