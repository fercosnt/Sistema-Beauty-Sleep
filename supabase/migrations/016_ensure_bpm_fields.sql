-- Migration 016: Ensure BPM fields exist in exames table
-- This migration ensures that bpm_min, bpm_medio, and bpm_max columns exist
-- It's a safety check in case migration 013 was not fully applied

-- ============================================
-- Campos de Frequência Cardíaca
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS bpm_min INTEGER, -- Frequência cardíaca mínima (bpm)
  ADD COLUMN IF NOT EXISTS bpm_medio INTEGER, -- Frequência cardíaca média (bpm)
  ADD COLUMN IF NOT EXISTS bpm_max INTEGER; -- Frequência cardíaca máxima (bpm)

-- Adicionar comentários se não existirem
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_description 
    WHERE objoid = 'exames'::regclass::oid 
    AND objsubid = (SELECT attnum FROM pg_attribute WHERE attrelid = 'exames'::regclass AND attname = 'bpm_min')
  ) THEN
    COMMENT ON COLUMN exames.bpm_min IS 'Frequência cardíaca mínima (bpm)';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_description 
    WHERE objoid = 'exames'::regclass::oid 
    AND objsubid = (SELECT attnum FROM pg_attribute WHERE attrelid = 'exames'::regclass AND attname = 'bpm_medio')
  ) THEN
    COMMENT ON COLUMN exames.bpm_medio IS 'Frequência cardíaca média (bpm)';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_description 
    WHERE objoid = 'exames'::regclass::oid 
    AND objsubid = (SELECT attnum FROM pg_attribute WHERE attrelid = 'exames'::regclass AND attname = 'bpm_max')
  ) THEN
    COMMENT ON COLUMN exames.bpm_max IS 'Frequência cardíaca máxima (bpm)';
  END IF;
END $$;

