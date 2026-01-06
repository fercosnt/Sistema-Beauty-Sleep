-- Script para Verificar Campos da Tabela exames
-- 
-- Execute este script no SQL Editor do Supabase para verificar quais campos existem
-- e quais estão faltando conforme o PRD Fase 2
--
-- Link: https://supabase.com/dashboard/project/qigbblypwkgflwnrrhzg/sql/new

-- ============================================
-- 1. Verificar estrutura atual da tabela exames
-- ============================================
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'exames'
ORDER BY ordinal_position;

-- ============================================
-- 2. Verificar campos específicos necessários para Fase 2
-- ============================================

-- Campos de tempo
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'hora_inicio') THEN '✅ hora_inicio existe' ELSE '❌ hora_inicio FALTANDO' END as status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'hora_fim') THEN '✅ hora_fim existe' ELSE '❌ hora_fim FALTANDO' END as status2,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'duracao_total_seg') THEN '✅ duracao_total_seg existe' ELSE '❌ duracao_total_seg FALTANDO' END as status3,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'duracao_valida_seg') THEN '✅ duracao_valida_seg existe' ELSE '❌ duracao_valida_seg FALTANDO' END as status4;

-- Campos de condições da noite
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'consumo_alcool') THEN '✅ consumo_alcool existe' ELSE '❌ consumo_alcool FALTANDO' END as status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'congestao_nasal') THEN '✅ congestao_nasal existe' ELSE '❌ congestao_nasal FALTANDO' END as status2,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'sedativos') THEN '✅ sedativos existe' ELSE '❌ sedativos FALTANDO' END as status3,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'placa_bruxismo') THEN '✅ placa_bruxismo existe' ELSE '❌ placa_bruxismo FALTANDO' END as status4,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'marcapasso') THEN '✅ marcapasso existe' ELSE '❌ marcapasso FALTANDO' END as status5;

-- Campos de tratamentos
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'cpap') THEN '✅ cpap existe' ELSE '❌ cpap FALTANDO' END as status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'aparelho_avanco') THEN '✅ aparelho_avanco existe' ELSE '❌ aparelho_avanco FALTANDO' END as status2,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'terapia_posicional') THEN '✅ terapia_posicional existe' ELSE '❌ terapia_posicional FALTANDO' END as status3,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'oxigenio') THEN '✅ oxigenio existe' ELSE '❌ oxigenio FALTANDO' END as status4,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'suporte_ventilatorio') THEN '✅ suporte_ventilatorio existe' ELSE '❌ suporte_ventilatorio FALTANDO' END as status5;

-- Campos de oximetria adicionais
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'tempo_spo2_90_seg') THEN '✅ tempo_spo2_90_seg existe' ELSE '❌ tempo_spo2_90_seg FALTANDO' END as status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'num_dessaturacoes') THEN '✅ num_dessaturacoes existe' ELSE '❌ num_dessaturacoes FALTANDO' END as status2,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'ido_sono') THEN '✅ ido_sono existe' ELSE '❌ ido_sono FALTANDO' END as status3,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'num_eventos_hipoxemia') THEN '✅ num_eventos_hipoxemia existe' ELSE '❌ num_eventos_hipoxemia FALTANDO' END as status4,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'tempo_hipoxemia_seg') THEN '✅ tempo_hipoxemia_seg existe' ELSE '❌ tempo_hipoxemia_seg FALTANDO' END as status5;

-- Campos de sono estimado
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'tempo_sono_seg') THEN '✅ tempo_sono_seg existe' ELSE '❌ tempo_sono_seg FALTANDO' END as status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'tempo_dormir_seg') THEN '✅ tempo_dormir_seg existe' ELSE '❌ tempo_dormir_seg FALTANDO' END as status2,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'tempo_acordado_seg') THEN '✅ tempo_acordado_seg existe' ELSE '❌ tempo_acordado_seg FALTANDO' END as status3,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'eficiencia_sono_pct') THEN '✅ eficiencia_sono_pct existe' ELSE '❌ eficiencia_sono_pct FALTANDO' END as status4;

-- Campos de ronco adicionais
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'ronco_duracao_seg') THEN '✅ ronco_duracao_seg existe' ELSE '❌ ronco_duracao_seg FALTANDO' END as status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'ronco_silencio_pct') THEN '✅ ronco_silencio_pct existe' ELSE '❌ ronco_silencio_pct FALTANDO' END as status2,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'ronco_baixo_pct') THEN '✅ ronco_baixo_pct existe' ELSE '❌ ronco_baixo_pct FALTANDO' END as status3,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'ronco_medio_pct') THEN '✅ ronco_medio_pct existe' ELSE '❌ ronco_medio_pct FALTANDO' END as status4,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'ronco_alto_pct') THEN '✅ ronco_alto_pct existe' ELSE '❌ ronco_alto_pct FALTANDO' END as status5;

-- Campos de histograma (podem ser JSONB)
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'spo2_histograma') THEN '✅ spo2_histograma existe' ELSE '❌ spo2_histograma FALTANDO' END as status,
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'bpm_histograma') THEN '✅ bpm_histograma existe' ELSE '❌ bpm_histograma FALTANDO' END as status2;

-- Campos de cardiologia
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exames' AND column_name = 'fibrilacao_atrial') THEN '✅ fibrilacao_atrial existe' ELSE '❌ fibrilacao_atrial FALTANDO' END as status;

