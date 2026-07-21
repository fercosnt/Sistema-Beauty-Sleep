-- Migration 012: Add Extended Exam Fields
-- Adds all missing fields from Biologix API to support detailed exam views

-- Time fields
ALTER TABLE exames ADD COLUMN IF NOT EXISTS hora_inicio TIMESTAMPTZ;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS duracao_total_secs INTEGER;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS duracao_valida_secs INTEGER;

-- Conditions and treatments (stored as JSONB arrays)
ALTER TABLE exames ADD COLUMN IF NOT EXISTS condicoes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS tratamentos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS sintomas JSONB DEFAULT '[]'::jsonb;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS doencas JSONB DEFAULT '[]'::jsonb;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS medicamentos JSONB DEFAULT '[]'::jsonb;

-- Extended oximetry fields
ALTER TABLE exames ADD COLUMN IF NOT EXISTS tempo_spo2_90_secs INTEGER;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS tempo_spo2_80_secs INTEGER;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS num_dessaturacoes INTEGER;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS carga_hipoxica NUMERIC(10,2);

-- Heart rate fields
ALTER TABLE exames ADD COLUMN IF NOT EXISTS bpm_min INTEGER;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS bpm_medio INTEGER;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS bpm_max INTEGER;

-- Sleep estimation fields
ALTER TABLE exames ADD COLUMN IF NOT EXISTS tempo_sono_secs INTEGER;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS tempo_dormir_secs INTEGER; -- Sleep latency
ALTER TABLE exames ADD COLUMN IF NOT EXISTS tempo_acordado_secs INTEGER; -- Wake After Sleep Onset (WASO)
ALTER TABLE exames ADD COLUMN IF NOT EXISTS eficiencia_sono NUMERIC(5,2);

-- Cardiology field
ALTER TABLE exames ADD COLUMN IF NOT EXISTS fibrilacao_atrial INTEGER; -- 0=Negativa, 1=Positiva, <0=Inconclusivo

-- Hypoxemia fields
ALTER TABLE exames ADD COLUMN IF NOT EXISTS num_eventos_hipoxemia INTEGER;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS tempo_hipoxemia_secs INTEGER;

-- IDO during sleep (distinct from general IDO)
ALTER TABLE exames ADD COLUMN IF NOT EXISTS ido_sono NUMERIC(5,2);

-- Extended snoring fields (percentages)
ALTER TABLE exames ADD COLUMN IF NOT EXISTS tempo_ronco_secs INTEGER;
ALTER TABLE exames ADD COLUMN IF NOT EXISTS silencio_percent NUMERIC(5,2);
ALTER TABLE exames ADD COLUMN IF NOT EXISTS ronco_baixo_percent NUMERIC(5,2);
ALTER TABLE exames ADD COLUMN IF NOT EXISTS ronco_medio_percent NUMERIC(5,2);
ALTER TABLE exames ADD COLUMN IF NOT EXISTS ronco_alto_percent NUMERIC(5,2);

-- Add index for fibrilacao_atrial for alert queries
CREATE INDEX IF NOT EXISTS idx_exames_fibrilacao_atrial ON exames(fibrilacao_atrial) WHERE fibrilacao_atrial = 1;

-- Add index for ido_categoria for critical cases queries
CREATE INDEX IF NOT EXISTS idx_exames_ido_categoria ON exames(ido_categoria) WHERE ido_categoria = 3;

-- Comment for documentation
COMMENT ON COLUMN exames.condicoes IS 'Array of conditions during exam: alcohol, nasal_congestion, sedatives, bruxism_plate, pacemaker';
COMMENT ON COLUMN exames.tratamentos IS 'Array of treatments during exam: cpap, mandibular_advancement, positional_therapy, oxygen, ventilatory_support';
COMMENT ON COLUMN exames.fibrilacao_atrial IS '0=Negative, 1=Positive, <0=Inconclusive';
COMMENT ON COLUMN exames.carga_hipoxica IS 'Hypoxic burden in %.min/hour - cardiovascular risk indicator';
COMMENT ON COLUMN exames.eficiencia_sono IS 'Sleep efficiency percentage (0-100)';
