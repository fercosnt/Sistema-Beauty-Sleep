-- Migration 013: Add Extended Fields to exames table for Fase 2
-- 
-- This migration adds all fields needed for the enhanced exam modal and evolution tab
-- as specified in PRD Fase 2
--
-- Fields are added to support:
-- - Complete exam header (start/end time, total/valid duration)
-- - Conditions and treatments during exam night
-- - Extended oximetry metrics
-- - Sleep estimation data
-- - Detailed snoring analysis
-- - Histograms for SpO2 and heart rate
-- - Cardiology data

-- ============================================
-- 1. Campos de Tempo (Header do Exame)
-- ============================================
-- Hora de início e fim do exame (extraídos de data_exame ou startTime)
ALTER TABLE exames 
  ADD COLUMN IF NOT EXISTS hora_inicio TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS hora_fim TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS duracao_total_seg INTEGER,
  ADD COLUMN IF NOT EXISTS duracao_valida_seg INTEGER;

-- ============================================
-- 2. Campos de Condições na Noite do Exame
-- ============================================
-- Condições que podem afetar o exame
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS consumo_alcool BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS congestao_nasal BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sedativos BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS placa_bruxismo BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS marcapasso BOOLEAN DEFAULT false;

-- ============================================
-- 3. Campos de Tratamentos na Noite do Exame
-- ============================================
-- Tratamentos que o paciente estava usando durante o exame
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS cpap BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS aparelho_avanco BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS terapia_posicional BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS oxigenio BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS suporte_ventilatorio BOOLEAN DEFAULT false;

-- ============================================
-- 4. Campos de Ficha Médica (já existem como TEXT, manter)
-- ============================================
-- Os campos condicoes, sintomas, doencas, medicamentos já existem
-- Mas vamos garantir que estão como TEXT[] para facilitar parsing
-- Se não existirem, criar como TEXT (será convertido depois se necessário)

-- ============================================
-- 5. Campos de Oximetria Adicionais
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS tempo_spo2_90_seg INTEGER, -- Tempo com SpO2 < 90% (já existe como tempo_spo2_90_seg no sync)
  ADD COLUMN IF NOT EXISTS tempo_spo2_80_seg INTEGER, -- Tempo com SpO2 < 80%
  ADD COLUMN IF NOT EXISTS num_dessaturacoes INTEGER, -- Número de dessaturações
  ADD COLUMN IF NOT EXISTS ido_sono NUMERIC(5,2), -- IDO durante sono (IDOs)
  ADD COLUMN IF NOT EXISTS num_eventos_hipoxemia INTEGER, -- Número de eventos de hipoxemia
  ADD COLUMN IF NOT EXISTS tempo_hipoxemia_seg INTEGER, -- Tempo total em hipoxemia
  ADD COLUMN IF NOT EXISTS carga_hipoxica NUMERIC(8,2); -- Carga hipóxica (%.min/hora)

-- ============================================
-- 6. Campos de Sono Estimado
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS tempo_sono_seg INTEGER, -- Tempo total de sono
  ADD COLUMN IF NOT EXISTS tempo_dormir_seg INTEGER, -- Tempo para dormir (latência)
  ADD COLUMN IF NOT EXISTS tempo_acordado_seg INTEGER, -- Tempo acordado pós-sono
  ADD COLUMN IF NOT EXISTS eficiencia_sono_pct NUMERIC(5,2); -- Eficiência do sono (%)

-- ============================================
-- 7. Campos de Ronco Detalhados
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS ronco_duracao_seg INTEGER, -- Tempo total com ronco
  ADD COLUMN IF NOT EXISTS ronco_silencio_pct NUMERIC(5,2), -- % do tempo em silêncio
  ADD COLUMN IF NOT EXISTS ronco_baixo_pct NUMERIC(5,2), -- % ronco baixo
  ADD COLUMN IF NOT EXISTS ronco_medio_pct NUMERIC(5,2), -- % ronco médio
  ADD COLUMN IF NOT EXISTS ronco_alto_pct NUMERIC(5,2); -- % ronco alto

-- ============================================
-- 8. Campos de Histograma (JSONB)
-- ============================================
-- Histogramas de SpO2 e frequência cardíaca
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS spo2_histograma JSONB, -- Histograma de SpO2 por faixas
  ADD COLUMN IF NOT EXISTS bpm_histograma JSONB; -- Histograma de frequência cardíaca

-- ============================================
-- 9. Campos de Cardiologia
-- ============================================
ALTER TABLE exames
  ADD COLUMN IF NOT EXISTS fibrilacao_atrial INTEGER; -- 0=Negativa, 1=Positiva, <0=Inconclusivo

-- ============================================
-- 10. Campos de Ficha Médica (verificar se existem)
-- ============================================
-- Verificar se campos existem, se não, criar como TEXT
DO $$
BEGIN
  -- Condições (pode ser TEXT ou TEXT[])
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'condicoes') THEN
    ALTER TABLE exames ADD COLUMN condicoes TEXT;
  END IF;
  
  -- Sintomas
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'sintomas') THEN
    ALTER TABLE exames ADD COLUMN sintomas TEXT;
  END IF;
  
  -- Doenças
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'doencas') THEN
    ALTER TABLE exames ADD COLUMN doencas TEXT;
  END IF;
  
  -- Medicamentos
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'medicamentos') THEN
    ALTER TABLE exames ADD COLUMN medicamentos TEXT;
  END IF;
END $$;

-- ============================================
-- 11. Adicionar comentários para documentação
-- ============================================
COMMENT ON COLUMN exames.hora_inicio IS 'Data/hora de início do exame (extraído de startTime)';
COMMENT ON COLUMN exames.hora_fim IS 'Data/hora de fim do exame (calculado: inicio + duracao)';
COMMENT ON COLUMN exames.duracao_total_seg IS 'Duração total do exame em segundos';
COMMENT ON COLUMN exames.duracao_valida_seg IS 'Duração válida do exame em segundos (após remover artefatos)';
COMMENT ON COLUMN exames.consumo_alcool IS 'Paciente consumiu álcool na noite do exame';
COMMENT ON COLUMN exames.congestao_nasal IS 'Paciente tinha congestão nasal na noite do exame';
COMMENT ON COLUMN exames.sedativos IS 'Paciente usou sedativos na noite do exame';
COMMENT ON COLUMN exames.placa_bruxismo IS 'Paciente usou placa de bruxismo na noite do exame';
COMMENT ON COLUMN exames.marcapasso IS 'Paciente usa marcapasso';
COMMENT ON COLUMN exames.cpap IS 'Paciente usou CPAP na noite do exame';
COMMENT ON COLUMN exames.aparelho_avanco IS 'Paciente usou aparelho de avanço mandibular na noite do exame';
COMMENT ON COLUMN exames.terapia_posicional IS 'Paciente usou terapia posicional na noite do exame';
COMMENT ON COLUMN exames.oxigenio IS 'Paciente usou oxigênio na noite do exame';
COMMENT ON COLUMN exames.suporte_ventilatorio IS 'Paciente usou suporte ventilatório na noite do exame';
COMMENT ON COLUMN exames.num_dessaturacoes IS 'Número de dessaturações de oxigênio';
COMMENT ON COLUMN exames.ido_sono IS 'IDO durante sono estimado (IDOs)';
COMMENT ON COLUMN exames.num_eventos_hipoxemia IS 'Número de eventos de hipoxemia';
COMMENT ON COLUMN exames.tempo_hipoxemia_seg IS 'Tempo total em hipoxemia (segundos)';
COMMENT ON COLUMN exames.carga_hipoxica IS 'Carga hipóxica (%.min/hora) - risco cardiovascular';
COMMENT ON COLUMN exames.tempo_sono_seg IS 'Tempo total de sono estimado (segundos)';
COMMENT ON COLUMN exames.tempo_dormir_seg IS 'Tempo para dormir - latência do sono (segundos)';
COMMENT ON COLUMN exames.tempo_acordado_seg IS 'Tempo acordado após início do sono (segundos)';
COMMENT ON COLUMN exames.eficiencia_sono_pct IS 'Eficiência do sono (%) = (tempo_sono / tempo_total) * 100';
COMMENT ON COLUMN exames.ronco_duracao_seg IS 'Tempo total com ronco (segundos)';
COMMENT ON COLUMN exames.ronco_silencio_pct IS 'Percentual do tempo em silêncio';
COMMENT ON COLUMN exames.ronco_baixo_pct IS 'Percentual do tempo com ronco baixo';
COMMENT ON COLUMN exames.ronco_medio_pct IS 'Percentual do tempo com ronco médio';
COMMENT ON COLUMN exames.ronco_alto_pct IS 'Percentual do tempo com ronco alto';
COMMENT ON COLUMN exames.spo2_histograma IS 'Histograma de SpO2 por faixas (JSONB)';
COMMENT ON COLUMN exames.bpm_histograma IS 'Histograma de frequência cardíaca por faixas (JSONB)';
COMMENT ON COLUMN exames.fibrilacao_atrial IS 'Fibrilação atrial: 0=Negativa, 1=Positiva, <0=Inconclusivo';

