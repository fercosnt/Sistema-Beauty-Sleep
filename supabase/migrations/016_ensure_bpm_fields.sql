-- Migration 016: Ensure all extended fields exist in exames table
-- This migration ensures that all fields needed by sync-biologix exist
-- It's a safety check in case migration 013 was not fully applied
-- This migration is idempotent - can be run multiple times safely

-- ============================================
-- 1. Campos de Tempo (Header do Exame)
-- ============================================
ALTER TABLE exames 
  ADD COLUMN IF NOT EXISTS hora_inicio TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS hora_fim TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS duracao_total_seg INTEGER,
  ADD COLUMN IF NOT EXISTS duracao_valida_seg INTEGER;

-- ============================================
-- 2. Campos de Condições na Noite do Exame
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS consumo_alcool BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS congestao_nasal BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sedativos BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS placa_bruxismo BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS marcapasso BOOLEAN DEFAULT false;

-- ============================================
-- 3. Campos de Tratamentos na Noite do Exame
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS cpap BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS aparelho_avanco BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS terapia_posicional BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS oxigenio BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS suporte_ventilatorio BOOLEAN DEFAULT false;

-- ============================================
-- 4. Campos de Ficha Médica
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'condicoes') THEN
    ALTER TABLE exames ADD COLUMN condicoes TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'sintomas') THEN
    ALTER TABLE exames ADD COLUMN sintomas TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'doencas') THEN
    ALTER TABLE exames ADD COLUMN doencas TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'medicamentos') THEN
    ALTER TABLE exames ADD COLUMN medicamentos TEXT;
  END IF;
END $$;

-- ============================================
-- 5. Campos de Oximetria Adicionais
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS tempo_spo2_90_seg INTEGER,
  ADD COLUMN IF NOT EXISTS tempo_spo2_80_seg INTEGER,
  ADD COLUMN IF NOT EXISTS num_dessaturacoes INTEGER,
  ADD COLUMN IF NOT EXISTS ido_sono NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS num_eventos_hipoxemia INTEGER,
  ADD COLUMN IF NOT EXISTS tempo_hipoxemia_seg INTEGER,
  ADD COLUMN IF NOT EXISTS carga_hipoxica NUMERIC(8,2);

-- ============================================
-- 6. Campos de Sono Estimado
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS tempo_sono_seg INTEGER,
  ADD COLUMN IF NOT EXISTS tempo_dormir_seg INTEGER,
  ADD COLUMN IF NOT EXISTS tempo_acordado_seg INTEGER,
  ADD COLUMN IF NOT EXISTS eficiencia_sono_pct NUMERIC(5,2);

-- ============================================
-- 7. Campos de Ronco Detalhados
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS ronco_duracao_seg INTEGER,
  ADD COLUMN IF NOT EXISTS ronco_silencio_pct NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ronco_baixo_pct NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ronco_medio_pct NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS ronco_alto_pct NUMERIC(5,2);

-- ============================================
-- 8. Campos de Frequência Cardíaca
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS bpm_min INTEGER,
  ADD COLUMN IF NOT EXISTS bpm_medio INTEGER,
  ADD COLUMN IF NOT EXISTS bpm_max INTEGER;

-- ============================================
-- 9. Campos de Cardiologia
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS fibrilacao_atrial INTEGER;

