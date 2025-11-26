-- Migration 001: Initial Schema
-- Creates all 10 main tables for Beauty Sleep Treatment System

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'equipe', 'recepcao')),
  ativo BOOLEAN DEFAULT true,
  tour_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: pacientes
CREATE TABLE IF NOT EXISTS pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  biologix_id TEXT UNIQUE,
  cpf TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  data_nascimento DATE,
  genero TEXT CHECK (genero IN ('M', 'F', 'Outro')),
  status TEXT NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'ativo', 'finalizado', 'inativo')),
  sessoes_compradas INTEGER DEFAULT 0,
  sessoes_adicionadas INTEGER DEFAULT 0,
  sessoes_utilizadas INTEGER DEFAULT 0,
  proxima_manutencao DATE,
  observacoes_gerais TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: exames
CREATE TABLE IF NOT EXISTS exames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  biologix_exam_id TEXT UNIQUE NOT NULL,
  biologix_exam_key TEXT,
  tipo INTEGER, -- 0 = Ronco, 1 = Sono
  status INTEGER, -- 6 = DONE
  data_exame DATE NOT NULL,
  peso_kg NUMERIC(5,2),
  altura_cm NUMERIC(5,2),
  imc NUMERIC(4,2),
  score_ronco NUMERIC(4,2),
  ido NUMERIC(4,2), -- Índice de Dessaturação de Oxigênio
  ido_categoria INTEGER CHECK (ido_categoria IN (0, 1, 2, 3)), -- 0=Normal, 1=Leve, 2=Moderado, 3=Acentuado
  spo2_min NUMERIC(4,2),
  spo2_avg NUMERIC(4,2),
  spo2_max NUMERIC(4,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: sessoes
CREATE TABLE IF NOT EXISTS sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  data_sessao DATE NOT NULL,
  protocolo TEXT[], -- Array of tag names
  contador_pulsos_inicial INTEGER NOT NULL DEFAULT 0,
  contador_pulsos_final INTEGER NOT NULL DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  editado_por UUID REFERENCES users(id) ON DELETE SET NULL,
  editado_em TIMESTAMPTZ
);

-- Table: tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  cor TEXT NOT NULL, -- Hex color code
  tipo TEXT, -- Optional: protocolo, observacao, etc
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: paciente_tags
CREATE TABLE IF NOT EXISTS paciente_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(paciente_id, tag_id)
);

-- Table: notas
CREATE TABLE IF NOT EXISTS notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  conteudo TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: historico_status
CREATE TABLE IF NOT EXISTS historico_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  status_anterior TEXT,
  status_novo TEXT NOT NULL,
  motivo TEXT, -- Required when status_novo = 'inativo'
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: sessao_historico
CREATE TABLE IF NOT EXISTS sessao_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessao_id UUID NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
  campo_alterado TEXT NOT NULL,
  valor_anterior TEXT,
  valor_novo TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  acao TEXT NOT NULL CHECK (acao IN ('INSERT', 'UPDATE', 'DELETE')),
  entidade TEXT NOT NULL,
  entidade_id UUID,
  detalhes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pacientes_cpf ON pacientes(cpf);
CREATE INDEX IF NOT EXISTS idx_pacientes_biologix_id ON pacientes(biologix_id);
CREATE INDEX IF NOT EXISTS idx_exames_paciente_id ON exames(paciente_id);
CREATE INDEX IF NOT EXISTS idx_exames_data ON exames(data_exame);
CREATE INDEX IF NOT EXISTS idx_sessoes_paciente_id ON sessoes(paciente_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_user_id ON sessoes(user_id);
CREATE INDEX IF NOT EXISTS idx_paciente_tags_paciente_id ON paciente_tags(paciente_id);
CREATE INDEX IF NOT EXISTS idx_notas_paciente_id ON notas(paciente_id);
CREATE INDEX IF NOT EXISTS idx_historico_status_paciente_id ON historico_status(paciente_id);
CREATE INDEX IF NOT EXISTS idx_sessao_historico_sessao_id ON sessao_historico(sessao_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entidade ON audit_logs(entidade, entidade_id);

