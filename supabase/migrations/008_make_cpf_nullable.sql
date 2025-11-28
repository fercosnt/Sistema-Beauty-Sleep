-- Migration 008: Make CPF nullable in pacientes table
-- CPF is now optional - used only for validation and search
-- The unique identifier is biologix_id (ID do Paciente)

-- Remove NOT NULL constraint from cpf column
ALTER TABLE pacientes ALTER COLUMN cpf DROP NOT NULL;

-- Note: UNIQUE constraint on cpf already allows multiple NULL values in PostgreSQL
-- This is the desired behavior - multiple patients can have NULL CPF

COMMENT ON COLUMN pacientes.cpf IS 'CPF usado apenas para validação e busca, pode ser NULL. O identificador único é biologix_id.';

