-- Migration 014: Create alertas table for Fase 2
-- 
-- This migration creates the alertas table to track system alerts
-- for critical cases, maintenance reminders, and follow-ups
--
-- Alert types:
-- - critico: Critical alerts (e.g., high IDO, low SpO2)
-- - manutencao: Maintenance reminders (e.g., overdue maintenance)
-- - followup: Follow-up reminders (e.g., patient needs attention)
--
-- Urgency levels:
-- - alta: High urgency (requires immediate attention)
-- - media: Medium urgency (should be addressed soon)
-- - baixa: Low urgency (can be addressed later)

-- ============================================
-- 1. Create alertas table
-- ============================================
CREATE TABLE IF NOT EXISTS alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('critico', 'manutencao', 'followup')),
  urgencia TEXT NOT NULL CHECK (urgencia IN ('alta', 'media', 'baixa')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  exame_id UUID REFERENCES exames(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'resolvido', 'ignorado')),
  resolvido_por UUID REFERENCES users(id) ON DELETE SET NULL,
  resolvido_em TIMESTAMPTZ,
  dados_extras JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. Create indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_alertas_status ON alertas(status);
CREATE INDEX IF NOT EXISTS idx_alertas_tipo ON alertas(tipo);
CREATE INDEX IF NOT EXISTS idx_alertas_created_at ON alertas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alertas_paciente_id ON alertas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_alertas_exame_id ON alertas(exame_id);
CREATE INDEX IF NOT EXISTS idx_alertas_urgencia ON alertas(urgencia);
CREATE INDEX IF NOT EXISTS idx_alertas_status_tipo ON alertas(status, tipo);

-- ============================================
-- 3. Enable Row Level Security
-- ============================================
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. Create RLS Policies
-- ============================================

-- Policy: Admin and equipe can view all alertas
CREATE POLICY "Admin and equipe can view alertas"
  ON alertas
  FOR SELECT
  USING (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: Admin and equipe can insert alertas
CREATE POLICY "Admin and equipe can insert alertas"
  ON alertas
  FOR INSERT
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: Admin and equipe can update alertas
CREATE POLICY "Admin and equipe can update alertas"
  ON alertas
  FOR UPDATE
  USING (
    get_user_role() IN ('admin', 'equipe')
  )
  WITH CHECK (
    get_user_role() IN ('admin', 'equipe')
  );

-- Policy: Admin can delete alertas
CREATE POLICY "Admin can delete alertas"
  ON alertas
  FOR DELETE
  USING (
    get_user_role() = 'admin'
  );

-- ============================================
-- 5. Create trigger to update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_alertas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_alertas_updated_at
  BEFORE UPDATE ON alertas
  FOR EACH ROW
  EXECUTE FUNCTION update_alertas_updated_at();

-- ============================================
-- 6. Add comments for documentation
-- ============================================
COMMENT ON TABLE alertas IS 'Tabela de alertas do sistema para casos críticos, manutenções e follow-ups';
COMMENT ON COLUMN alertas.tipo IS 'Tipo de alerta: critico, manutencao, followup';
COMMENT ON COLUMN alertas.urgencia IS 'Nível de urgência: alta, media, baixa';
COMMENT ON COLUMN alertas.status IS 'Status do alerta: pendente, resolvido, ignorado';
COMMENT ON COLUMN alertas.dados_extras IS 'Dados adicionais em formato JSON para contexto do alerta';

