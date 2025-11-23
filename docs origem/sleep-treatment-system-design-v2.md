# Framework do Sistema: Sleep Treatment Tracker
## Sistema de Acompanhamento de Tratamento de Ronco e Apneia - Beauty Smile

**Versão:** 2.0  
**Data:** 2025-11-22  
**Cliente:** Beauty Smile  
**Autor:** Conselho Consultivo de Sistemas

---

## Resumo Executivo

O Sleep Treatment Tracker é uma plataforma de gestão clínica para acompanhamento de tratamentos a laser (Fotona LightWalker) para ronco e apneia do sono. O sistema integra dados do Biologix (exames de polissonografia e teste do ronco) com registros de sessões de tratamento, permitindo visualizar evolução dos pacientes, calcular métricas de eficácia e gerar análises por IA.

**Problema resolvido:** Atualmente os dados estão fragmentados entre Biologix e Airtable, sem visão consolidada de evolução, sem alertas automáticos e sem análises inteligentes do progresso.

**Solução:** Sistema web com dashboard para equipe de dentistas, integração automatizada via Supabase Edge Functions, banco de dados robusto no PostgreSQL, análises por IA orquestradas pelo n8n, e sistema de notificações interno.

**Usuários:** Equipe de dentistas da Beauty Smile (~5-10 usuários), com dois níveis de permissão (Admin e Equipe).

**Volume atual:** 175 pacientes, 479 exames históricos, ~35 novos exames/mês.

---

## 1. Arquitetura Técnica

### 1.1 Visão Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ARQUITETURA v2.0                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    cron 10h    ┌────────────────────────────────┐│
│  │   Biologix   │◄──────────────►│         Supabase               ││
│  │     API      │                │  ┌──────────────────────────┐  ││
│  └──────────────┘                │  │    Edge Function         │  ││
│                                  │  │    (Sync diário)         │  ││
│                                  │  └───────────┬──────────────┘  ││
│                                  │              │                  ││
│                                  │              ▼                  ││
│                                  │  ┌──────────────────────────┐  ││
│                                  │  │     PostgreSQL           │  ││
│                                  │  │  + Auth + Storage        │  ││
│                                  │  └───────────┬──────────────┘  ││
│                                  └──────────────┼─────────────────┘│
│                                                 │                   │
│         ┌───────────────────────────────────────┼───────────────┐   │
│         │                                       │               │   │
│         ▼                                       ▼               │   │
│  ┌──────────────┐                        ┌──────────────┐       │   │
│  │     n8n      │◄── webhook ────────────│   Next.js    │       │   │
│  │  (Hostinger) │    novo exame          │   (Vercel)   │       │   │
│  │              │                        │              │       │   │
│  │  ┌────────┐  │                        │  Dashboard   │       │   │
│  │  │ Claude │  │── salva análise ──────►│  Dentistas   │       │   │
│  │  │  API   │  │                        │              │       │   │
│  │  └────────┘  │                        └──────────────┘       │   │
│  └──────────────┘                                               │   │
│                                                                 │   │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FLUXO PRINCIPAL                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. SYNC (Supabase Edge Function - Cron 10h)                       │
│     ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐       │
│     │ Auth    │───►│ Fetch   │───►│ Upsert  │───►│ Trigger │       │
│     │Biologix │    │ Exames  │    │ DB      │    │ Webhook │       │
│     └─────────┘    └─────────┘    └─────────┘    └─────────┘       │
│                                                        │            │
│  2. ANÁLISE IA (n8n - Webhook)                         │            │
│     ┌─────────┐    ┌─────────┐    ┌─────────┐         │            │
│     │ Recebe  │◄───│ Novo    │◄───┘                   │            │
│     │ Exame   │    │ Exame   │                                     │
│     └────┬────┘    └─────────┘                                     │
│          │                                                          │
│          ▼                                                          │
│     ┌─────────┐    ┌─────────┐    ┌─────────┐                      │
│     │ Claude  │───►│ Gera    │───►│ Salva   │                      │
│     │ API     │    │ Análise │    │ no DB   │                      │
│     └─────────┘    └─────────┘    └─────────┘                      │
│                                                                     │
│  3. ALERTAS (Supabase Edge Function - Cron 10h30)                  │
│     ┌─────────┐    ┌─────────┐    ┌─────────┐                      │
│     │ Verifica│───►│ Cria    │───►│ Marca   │                      │
│     │ Regras  │    │ Alertas │    │ Notif.  │                      │
│     └─────────┘    └─────────┘    └─────────┘                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.3 Stack Tecnológico

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| **Sync Biologix** | Supabase Edge Functions (Deno) | Serverless, integrado, sem servidor extra |
| **Banco de Dados** | Supabase PostgreSQL | Relacional robusto, RLS, realtime built-in |
| **Autenticação** | Supabase Auth | Integrado, suporta roles, sem custo adicional |
| **Orquestração IA** | n8n (self-hosted Hostinger) | Visual, flexível para prompts complexos |
| **IA** | Claude API (Anthropic) | Qualidade de análise médica |
| **Frontend** | Next.js 14 (App Router) | SSR, performance, integração Supabase |
| **Deploy** | Vercel | Otimizado para Next.js, free tier |
| **Storage** | Supabase Storage | Para anexos futuros (já incluso) |

### 1.4 Componentes do Sistema

#### 1.4.1 Edge Function: Sync Biologix
- **Trigger:** Cron diário às 10h (horário de Brasília)
- **Responsabilidades:**
  - Autenticar na API Biologix
  - Buscar todos os exames com status=6 (concluídos)
  - Upsert pacientes (criar ou atualizar)
  - Upsert exames (criar ou atualizar)
  - Disparar webhook para n8n quando exame é novo
- **Runtime:** Deno (padrão Supabase)
- **Timeout:** 60 segundos (suficiente para ~100 exames)

#### 1.4.2 Edge Function: Gerador de Alertas
- **Trigger:** Cron diário às 10h30 (após sync completar)
- **Responsabilidades:**
  - Verificar pacientes com >21 dias sem sessão
  - Verificar exames onde IDO piorou
  - Verificar SpO2 mínimo crítico (<80%)
  - Verificar fibrilação atrial detectada
  - Verificar pacientes sem resposta (5+ sessões, <20% melhora)
  - Criar registros na tabela `alertas`

#### 1.4.3 n8n Workflow: Análise IA
- **Trigger:** Webhook (chamado pela Edge Function)
- **Responsabilidades:**
  - Receber dados do exame novo
  - Buscar histórico do paciente no Supabase
  - Montar prompt contextualizado
  - Chamar Claude API
  - Salvar análise no banco (update do exame)
- **Custo estimado:** ~$5-10/mês (35 análises)

#### 1.4.4 Dashboard Next.js
- **Páginas:**
  - `/login` - Autenticação
  - `/dashboard` - Visão geral + notificações
  - `/pacientes` - Lista com busca e filtros
  - `/pacientes/[id]` - Perfil completo do paciente
  - `/pacientes/[id]/sessao` - Registrar nova sessão
  - `/configuracoes` - Gestão de usuários (admin only)
- **Componentes principais:**
  - Gráfico de evolução (ronco + IDO)
  - Gráfico de peso ao longo do tempo
  - Card de análise IA
  - Lista de sessões com energia laser
  - Sistema de notificações interno

---

## 2. Modelo de Dados

### 2.1 Diagrama Entidade-Relacionamento

```
┌─────────────────┐
│  auth.users     │
│  (Supabase)     │
├─────────────────┤
│ id (uuid) PK    │─────────────────────────────────────────────┐
│ email           │                                             │
│ user_metadata   │                                             │
│   └─ role       │                                             │
└─────────────────┘                                             │
        │                                                       │
        │ created_by                                            │
        ▼                                                       │
┌─────────────────┐       ┌─────────────────┐                   │
│    pacientes    │       │     sessoes     │                   │
├─────────────────┤       ├─────────────────┤                   │
│ id (uuid) PK    │◄──────│ paciente_id FK  │                   │
│ biologix_id UK  │       │ id (uuid) PK    │                   │
│ nome            │       │ data_sessao     │                   │
│ cpf             │       │ peso_kg         │                   │
│ sexo            │       │ eryag_*         │                   │
│ email           │       │ ndyag_*         │                   │
│ telefone        │       │ observacoes     │                   │
│ data_nascimento │       │ created_by FK   │───────────────────┤
│ altura_cm       │       │ created_at      │                   │
│ created_at      │       └─────────────────┘                   │
│ updated_at      │                                             │
└────────┬────────┘                                             │
         │                                                      │
         │ paciente_id                                          │
         ▼                                                      │
┌─────────────────┐       ┌─────────────────┐                   │
│     exames      │       │ notas_paciente  │                   │
├─────────────────┤       ├─────────────────┤                   │
│ id (uuid) PK    │       │ id (uuid) PK    │                   │
│ paciente_id FK  │       │ paciente_id FK  │◄──────────────────┤
│ biologix_exam_id│       │ nota            │                   │
│ exam_key        │       │ created_by FK   │───────────────────┤
│ tipo            │       │ created_at      │                   │
│ data_exame      │       └─────────────────┘                   │
│                 │                                             │
│ -- Ronco --     │       ┌─────────────────┐                   │
│ ronco_*         │       │    alertas      │                   │
│ score_ronco     │       ├─────────────────┤                   │
│                 │       │ id (uuid) PK    │                   │
│ -- Oximetria -- │       │ paciente_id FK  │◄──────────────────┤
│ ido, spo2_*     │       │ exame_id FK     │◄──────────────────┤
│ bpm_*, etc      │       │ tipo            │                   │
│                 │       │ mensagem        │                   │
│ -- Cardio --    │       │ dados (jsonb)   │                   │
│ fibrilacao_atrial│      │ lido            │                   │
│                 │       │ lido_por FK     │───────────────────┘
│ -- Pós-exame -- │       │ lido_em         │
│ qualidade_sono  │       │ created_at      │
│ comparacao_sono │       └─────────────────┘
│ comentarios     │
│                 │
│ -- IA --        │
│ analise_ia      │
│ resumo          │
│ sugestoes       │
│                 │
│ -- Meta --      │
│ aparelho_serial │
│ pdf_url         │
│ created_at      │
└─────────────────┘
```

### 2.2 Tabelas Detalhadas

#### Tabela: `pacientes`

```sql
CREATE TABLE pacientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  biologix_id TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  cpf TEXT,
  sexo TEXT CHECK (sexo IN ('m', 'f', 'o')),
  email TEXT,
  telefone TEXT,
  data_nascimento DATE,
  altura_cm INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_pacientes_biologix_id ON pacientes(biologix_id);
CREATE INDEX idx_pacientes_nome ON pacientes(nome);
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK, gerado automaticamente |
| biologix_id | text | ID único do paciente no Biologix |
| nome | text | Nome completo |
| cpf | text | CPF (extraído do username Biologix) |
| sexo | text | 'm', 'f', 'o' |
| email | text | Email do paciente |
| telefone | text | Telefone |
| data_nascimento | date | Data de nascimento |
| altura_cm | integer | Altura em cm |
| created_at | timestamptz | Data de criação |
| updated_at | timestamptz | Última atualização |

---

#### Tabela: `exames`

```sql
CREATE TABLE exames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  biologix_exam_id TEXT UNIQUE NOT NULL,
  exam_key TEXT NOT NULL,
  tipo INTEGER NOT NULL CHECK (tipo IN (0, 1)),
  data_exame TIMESTAMPTZ NOT NULL,
  duracao_seg INTEGER,
  
  -- Dados do paciente no momento do exame
  peso_kg DECIMAL(5,2),
  altura_cm INTEGER,
  condicoes TEXT,
  sintomas TEXT,
  doencas TEXT,
  medicamentos TEXT,
  
  -- Ronco
  ronco_duracao_seg INTEGER,
  ronco_silencio_pct DECIMAL(5,2),
  ronco_baixo_pct DECIMAL(5,2),
  ronco_medio_pct DECIMAL(5,2),
  ronco_alto_pct DECIMAL(5,2),
  score_ronco DECIMAL(5,2) GENERATED ALWAYS AS (
    (COALESCE(ronco_baixo_pct, 0) * 1 + 
     COALESCE(ronco_medio_pct, 0) * 2 + 
     COALESCE(ronco_alto_pct, 0) * 3) / 3
  ) STORED,
  
  -- Oximetria
  ido DECIMAL(5,2),
  ido_dormindo DECIMAL(5,2),
  ido_categoria INTEGER CHECK (ido_categoria IN (0, 1, 2, 3)),
  carga_hipoxica DECIMAL(6,2),
  spo2_min INTEGER,
  spo2_medio INTEGER,
  spo2_max INTEGER,
  tempo_spo2_90_seg INTEGER,
  tempo_spo2_80_seg INTEGER,
  bpm_min INTEGER,
  bpm_medio INTEGER,
  bpm_max INTEGER,
  latencia_sono_seg INTEGER,
  duracao_sono_seg INTEGER,
  eficiencia_sono_pct INTEGER,
  tempo_acordado_seg INTEGER,
  eventos_hipoxemia INTEGER,
  duracao_hipoxemia_seg INTEGER,
  
  -- Cardiologia
  fibrilacao_atrial INTEGER, -- 0=Negativa, 1=Positiva, <0=Inconclusivo
  
  -- Questionário pós-exame
  qualidade_sono TEXT,
  comparacao_sono TEXT,
  comentarios_pos TEXT,
  data_respostas_pos TIMESTAMPTZ,
  
  -- Análise IA
  analise_ia JSONB,
  resumo TEXT,
  sugestoes TEXT[],
  alertas_clinicos TEXT[],
  
  -- Metadados
  aparelho_serial TEXT,
  celular TEXT,
  modelo_celular TEXT,
  pdf_url TEXT GENERATED ALWAYS AS (
    'https://api.biologixsleep.com/v2/exams/' || exam_key || '/files/report.pdf'
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_exames_paciente_id ON exames(paciente_id);
CREATE INDEX idx_exames_data ON exames(data_exame DESC);
CREATE INDEX idx_exames_biologix_id ON exames(biologix_exam_id);
CREATE INDEX idx_exames_tipo ON exames(tipo);
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Identificação** |||
| id | uuid | PK |
| paciente_id | uuid | FK para pacientes |
| biologix_exam_id | text | ID único do exame no Biologix |
| exam_key | text | Chave para obter PDF |
| tipo | integer | 0=Teste do Ronco, 1=Exame do Sono |
| data_exame | timestamptz | Data/hora do exame |
| duracao_seg | integer | Duração total em segundos |
| **Dados do Paciente** |||
| peso_kg | decimal | Peso no dia do exame |
| altura_cm | integer | Altura |
| condicoes | text | Condições marcadas (álcool, sedativos, etc) |
| sintomas | text | Sintomas reportados |
| doencas | text | Doenças pré-existentes |
| medicamentos | text | Medicamentos em uso |
| **Ronco** |||
| ronco_duracao_seg | integer | Tempo total com ronco |
| ronco_silencio_pct | decimal | % do tempo em silêncio |
| ronco_baixo_pct | decimal | % ronco baixo |
| ronco_medio_pct | decimal | % ronco médio |
| ronco_alto_pct | decimal | % ronco alto |
| score_ronco | decimal | **Calculado:** (baixo×1 + médio×3 + alto×5)/5 |
| **Oximetria** |||
| ido | decimal | Índice de Dessaturação de Oxigênio |
| ido_dormindo | decimal | IDO durante sono estimado |
| ido_categoria | integer | 0=Normal, 1=Leve, 2=Moderada, 3=Acentuada |
| carga_hipoxica | decimal | Hypoxic burden (%.min/hora) |
| spo2_min | integer | SpO2 mínimo % |
| spo2_medio | integer | SpO2 médio % |
| spo2_max | integer | SpO2 máximo % |
| tempo_spo2_90_seg | integer | Tempo com SpO2 < 90% |
| tempo_spo2_80_seg | integer | Tempo com SpO2 < 80% |
| bpm_min | integer | Frequência cardíaca mínima |
| bpm_medio | integer | FC média |
| bpm_max | integer | FC máxima |
| latencia_sono_seg | integer | Tempo para dormir |
| duracao_sono_seg | integer | Tempo total de sono |
| eficiencia_sono_pct | integer | Eficiência do sono % |
| tempo_acordado_seg | integer | WASO (Wake After Sleep Onset) |
| eventos_hipoxemia | integer | Número de eventos de hipoxemia |
| duracao_hipoxemia_seg | integer | Tempo total em hipoxemia |
| **Cardiologia** |||
| fibrilacao_atrial | integer | 0=Negativa, 1=Positiva, <0=Inconclusivo |
| **Pós-Exame** |||
| qualidade_sono | text | Resposta do paciente |
| comparacao_sono | text | Comparação com noite típica |
| comentarios_pos | text | Comentários livres |
| data_respostas_pos | timestamptz | Quando respondeu |
| **IA** |||
| analise_ia | jsonb | Análise completa estruturada |
| resumo | text | Resumo em linguagem natural |
| sugestoes | text[] | Array de sugestões |
| alertas_clinicos | text[] | Alertas identificados pela IA |
| **Meta** |||
| aparelho_serial | text | Serial do Oxistar |
| celular | text | Telefone usado no app |
| modelo_celular | text | Modelo do celular |
| pdf_url | text | **Calculado:** URL do laudo |
| created_at | timestamptz | Data de inserção |

---

#### Tabela: `sessoes`

```sql
CREATE TABLE sessoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  data_sessao DATE NOT NULL,
  peso_kg DECIMAL(5,2),
  observacoes TEXT,
  
  -- Er:YAG
  eryag_pulso_inicial INTEGER,
  eryag_pulso_final INTEGER,
  eryag_energia_mj INTEGER GENERATED ALWAYS AS (
    COALESCE(eryag_pulso_final, 0) - COALESCE(eryag_pulso_inicial, 0)
  ) STORED,
  
  -- Nd:YAG
  ndyag_pulso_inicial INTEGER,
  ndyag_pulso_final INTEGER,
  ndyag_energia_mj INTEGER GENERATED ALWAYS AS (
    COALESCE(ndyag_pulso_final, 0) - COALESCE(ndyag_pulso_inicial, 0)
  ) STORED,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Índices
CREATE INDEX idx_sessoes_paciente_id ON sessoes(paciente_id);
CREATE INDEX idx_sessoes_data ON sessoes(data_sessao DESC);
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| paciente_id | uuid | FK para pacientes |
| data_sessao | date | Data da sessão |
| peso_kg | decimal | Peso do paciente na sessão |
| observacoes | text | Observações gerais |
| **Er:YAG** |||
| eryag_pulso_inicial | integer | Contador inicial |
| eryag_pulso_final | integer | Contador final |
| eryag_energia_mj | integer | **Calculado:** final - inicial (em mJ) |
| **Nd:YAG** |||
| ndyag_pulso_inicial | integer | Contador inicial |
| ndyag_pulso_final | integer | Contador final |
| ndyag_energia_mj | integer | **Calculado:** final - inicial (em mJ) |
| **Meta** |||
| created_at | timestamptz | Data de criação |
| created_by | uuid | Usuário que registrou |

---

#### Tabela: `notas_paciente`

```sql
CREATE TABLE notas_paciente (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  nota TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_notas_paciente_id ON notas_paciente(paciente_id);
```

---

#### Tabela: `alertas`

```sql
CREATE TABLE alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
  exame_id UUID REFERENCES exames(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL CHECK (tipo IN (
    'intervalo_sessao',
    'ido_piorou', 
    'spo2_critico',
    'fibrilacao_atrial',
    'sem_resposta',
    'eficiencia_baixa'
  )),
  mensagem TEXT NOT NULL,
  dados JSONB,
  prioridade TEXT DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  lido BOOLEAN DEFAULT FALSE,
  lido_em TIMESTAMPTZ,
  lido_por UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alertas_paciente_id ON alertas(paciente_id);
CREATE INDEX idx_alertas_lido ON alertas(lido) WHERE lido = FALSE;
CREATE INDEX idx_alertas_created ON alertas(created_at DESC);
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | PK |
| paciente_id | uuid | FK para pacientes |
| exame_id | uuid | FK para exame relacionado (opcional) |
| tipo | text | Tipo do alerta (enum) |
| mensagem | text | Descrição do alerta |
| dados | jsonb | Dados adicionais (valores, comparações) |
| prioridade | text | 'baixa', 'media', 'alta' |
| lido | boolean | Se foi lido/resolvido |
| lido_em | timestamptz | Quando foi lido |
| lido_por | uuid | Quem leu |
| created_at | timestamptz | Data de criação |

**Tipos de Alerta:**

| Tipo | Trigger | Prioridade |
|------|---------|------------|
| `intervalo_sessao` | >21 dias desde última sessão | Média |
| `ido_piorou` | IDO atual > IDO anterior | Alta |
| `spo2_critico` | SpO2 mínimo < 80% | Alta |
| `fibrilacao_atrial` | Detectada (valor = 1) | Alta |
| `sem_resposta` | <20% melhora após 5+ sessões | Média |
| `eficiencia_baixa` | Eficiência do sono < 75% | Baixa |

---

### 2.3 Views

```sql
-- View: Resumo do paciente
CREATE VIEW vw_pacientes_resumo AS
SELECT 
  p.id,
  p.nome,
  p.telefone,
  p.data_nascimento,
  EXTRACT(YEAR FROM AGE(p.data_nascimento)) as idade,
  p.altura_cm,
  
  -- Contagens
  COUNT(DISTINCT e.id) as total_exames,
  COUNT(DISTINCT e.id) FILTER (WHERE e.tipo = 0) as total_ronco,
  COUNT(DISTINCT e.id) FILTER (WHERE e.tipo = 1) as total_sono,
  COUNT(DISTINCT s.id) as total_sessoes,
  
  -- Datas
  MAX(e.data_exame) as ultimo_exame,
  MAX(s.data_sessao) as ultima_sessao,
  EXTRACT(DAY FROM NOW() - MAX(s.data_sessao))::INTEGER as dias_sem_sessao,
  
  -- Primeiro exame (ronco)
  (SELECT score_ronco FROM exames 
   WHERE paciente_id = p.id AND tipo = 0 
   ORDER BY data_exame LIMIT 1) as primeiro_score_ronco,
   
  -- Último exame (ronco)
  (SELECT score_ronco FROM exames 
   WHERE paciente_id = p.id AND tipo = 0 
   ORDER BY data_exame DESC LIMIT 1) as ultimo_score_ronco,
   
  -- Primeiro IDO
  (SELECT ido FROM exames 
   WHERE paciente_id = p.id AND tipo = 1 
   ORDER BY data_exame LIMIT 1) as primeiro_ido,
   
  -- Último IDO
  (SELECT ido FROM exames 
   WHERE paciente_id = p.id AND tipo = 1 
   ORDER BY data_exame DESC LIMIT 1) as ultimo_ido,
   
  -- Último peso (da última sessão)
  (SELECT peso_kg FROM sessoes 
   WHERE paciente_id = p.id 
   ORDER BY data_sessao DESC LIMIT 1) as ultimo_peso,
   
  -- Alertas não lidos
  (SELECT COUNT(*) FROM alertas 
   WHERE paciente_id = p.id AND lido = FALSE) as alertas_pendentes

FROM pacientes p
LEFT JOIN exames e ON e.paciente_id = p.id
LEFT JOIN sessoes s ON s.paciente_id = p.id
GROUP BY p.id;

-- View: Alertas ativos (não lidos)
CREATE VIEW vw_alertas_ativos AS
SELECT 
  a.*,
  p.nome as paciente_nome,
  p.telefone as paciente_telefone
FROM alertas a
JOIN pacientes p ON p.id = a.paciente_id
WHERE a.lido = FALSE
ORDER BY 
  CASE a.prioridade 
    WHEN 'alta' THEN 1 
    WHEN 'media' THEN 2 
    ELSE 3 
  END,
  a.created_at DESC;

-- View: Métricas globais
CREATE VIEW vw_metricas_globais AS
SELECT
  (SELECT COUNT(*) FROM pacientes) as total_pacientes,
  (SELECT COUNT(*) FROM exames) as total_exames,
  (SELECT COUNT(*) FROM sessoes) as total_sessoes,
  (SELECT COUNT(*) FROM alertas WHERE lido = FALSE) as alertas_pendentes,
  
  -- Pacientes ativos (sessão nos últimos 90 dias)
  (SELECT COUNT(DISTINCT paciente_id) FROM sessoes 
   WHERE data_sessao > CURRENT_DATE - INTERVAL '90 days') as pacientes_ativos,
   
  -- Média de sessões por paciente
  (SELECT AVG(cnt) FROM (
    SELECT COUNT(*) as cnt FROM sessoes GROUP BY paciente_id
  ) t) as media_sessoes_paciente,
  
  -- Taxa média de melhora (ronco)
  (SELECT AVG(
    CASE WHEN primeiro > 0 
    THEN ((primeiro - ultimo) / primeiro) * 100 
    ELSE 0 END
  ) FROM (
    SELECT 
      (SELECT score_ronco FROM exames WHERE paciente_id = p.id AND tipo = 0 ORDER BY data_exame LIMIT 1) as primeiro,
      (SELECT score_ronco FROM exames WHERE paciente_id = p.id AND tipo = 0 ORDER BY data_exame DESC LIMIT 1) as ultimo
    FROM pacientes p
  ) t WHERE primeiro IS NOT NULL AND ultimo IS NOT NULL) as media_melhora_ronco,
  
  -- Taxa média de melhora (IDO)
  (SELECT AVG(
    CASE WHEN primeiro > 0 
    THEN ((primeiro - ultimo) / primeiro) * 100 
    ELSE 0 END
  ) FROM (
    SELECT 
      (SELECT ido FROM exames WHERE paciente_id = p.id AND tipo = 1 ORDER BY data_exame LIMIT 1) as primeiro,
      (SELECT ido FROM exames WHERE paciente_id = p.id AND tipo = 1 ORDER BY data_exame DESC LIMIT 1) as ultimo
    FROM pacientes p
  ) t WHERE primeiro IS NOT NULL AND ultimo IS NOT NULL) as media_melhora_ido;

-- View: Histórico de peso do paciente
CREATE VIEW vw_historico_peso AS
SELECT 
  paciente_id,
  data_sessao as data,
  peso_kg,
  'sessao' as fonte
FROM sessoes
WHERE peso_kg IS NOT NULL
UNION ALL
SELECT 
  paciente_id,
  data_exame::DATE as data,
  peso_kg,
  'exame' as fonte
FROM exames
WHERE peso_kg IS NOT NULL
ORDER BY paciente_id, data;
```

---

## 3. Edge Functions

### 3.1 Sync Biologix (`sync-biologix`)

```typescript
// supabase/functions/sync-biologix/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const BIOLOGIX_API = 'https://api.biologixsleep.com/v2'
const PARTNER_ID = Deno.env.get('BIOLOGIX_PARTNER_ID')
const BIOLOGIX_USERNAME = Deno.env.get('BIOLOGIX_USERNAME')
const BIOLOGIX_PASSWORD = Deno.env.get('BIOLOGIX_PASSWORD')
const N8N_WEBHOOK_URL = Deno.env.get('N8N_WEBHOOK_URL')

interface BiologixSession {
  userId: string
  token: string
}

async function authenticate(): Promise<BiologixSession> {
  const response = await fetch(`${BIOLOGIX_API}/sessions/open`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: BIOLOGIX_USERNAME,
      password: BIOLOGIX_PASSWORD,
      source: 100
    })
  })
  
  const body = await response.json()
  const token = response.headers.get('bx-session-token')
  
  return { userId: body.userId, token: token! }
}

function getAuthHeader(session: BiologixSession): string {
  const credentials = btoa(`${session.userId}:${session.token}`)
  return `basic ${credentials}`
}

async function fetchExams(session: BiologixSession): Promise<any[]> {
  const response = await fetch(
    `${BIOLOGIX_API}/partners/${PARTNER_ID}/exams`,
    {
      headers: { 'Authorization': getAuthHeader(session) }
    }
  )
  return response.json()
}

serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    
    // 1. Autenticar no Biologix
    const session = await authenticate()
    
    // 2. Buscar todos os exames
    const exams = await fetchExams(session)
    
    // 3. Filtrar apenas concluídos (status = 6)
    const completedExams = exams.filter(e => e.status === 6)
    
    let newExams = 0
    let updatedExams = 0
    
    for (const exam of completedExams) {
      // 4. Upsert paciente
      const { data: patient } = await supabase
        .from('pacientes')
        .upsert({
          biologix_id: exam.patientUserId,
          nome: exam.patient?.name,
          cpf: exam.patient?.username?.replace(/[^0-9]/g, ''),
          sexo: exam.patient?.gender,
          email: exam.patient?.email,
          telefone: exam.patient?.phone,
          data_nascimento: exam.patient?.birthDate,
          updated_at: new Date().toISOString()
        }, { onConflict: 'biologix_id' })
        .select('id')
        .single()
      
      // 5. Verificar se exame já existe
      const { data: existingExam } = await supabase
        .from('exames')
        .select('id')
        .eq('biologix_exam_id', exam.examId)
        .single()
      
      const isNew = !existingExam
      
      // 6. Upsert exame
      const examData = {
        paciente_id: patient.id,
        biologix_exam_id: exam.examId,
        exam_key: exam.examKey,
        tipo: exam.type,
        data_exame: exam.base?.startTime,
        duracao_seg: exam.base?.durationSecs,
        
        // Paciente
        peso_kg: exam.base?.weightKg,
        altura_cm: exam.base?.heightCm,
        condicoes: exam.base?.conditions?.join(', '),
        sintomas: exam.base?.symptoms?.join(', '),
        doencas: exam.base?.illnesses?.join(', '),
        medicamentos: exam.base?.medicines?.join(', '),
        
        // Ronco
        ronco_duracao_seg: exam.result?.snoring?.validDurationSecs,
        ronco_silencio_pct: exam.result?.snoring?.silentDurationPercent,
        ronco_baixo_pct: exam.result?.snoring?.lowDurationPercent,
        ronco_medio_pct: exam.result?.snoring?.mediumDurationPercent,
        ronco_alto_pct: exam.result?.snoring?.highDurationPercent,
        
        // Oximetria
        ido: exam.result?.oximetry?.odi,
        ido_dormindo: exam.result?.oximetry?.odiSleeping,
        ido_categoria: exam.result?.oximetry?.odiCategory,
        carga_hipoxica: exam.result?.oximetry?.hypoxicBurden,
        spo2_min: exam.result?.oximetry?.spO2Min,
        spo2_medio: exam.result?.oximetry?.spO2Avg,
        spo2_max: exam.result?.oximetry?.spO2Max,
        tempo_spo2_90_seg: exam.result?.oximetry?.spO2Under90Secs,
        tempo_spo2_80_seg: exam.result?.oximetry?.spO2Under80Secs,
        bpm_min: exam.result?.oximetry?.hrMin,
        bpm_medio: exam.result?.oximetry?.hrAvg,
        bpm_max: exam.result?.oximetry?.hrMax,
        latencia_sono_seg: exam.result?.oximetry?.sleepLatencySecs,
        duracao_sono_seg: exam.result?.oximetry?.sleepDurationSecs,
        eficiencia_sono_pct: exam.result?.oximetry?.sleepEfficiencyPercent,
        tempo_acordado_seg: exam.result?.oximetry?.wakeTimeAfterSleepSecs,
        eventos_hipoxemia: exam.result?.oximetry?.nbHypoxemiaEvents,
        duracao_hipoxemia_seg: exam.result?.oximetry?.hypoxemiaTotalDurationSecs,
        
        // Cardiologia
        fibrilacao_atrial: exam.result?.cardiology?.afNotification,
        
        // Pós-exame
        qualidade_sono: exam.afterQuestions?.sleepQuality,
        comparacao_sono: exam.afterQuestions?.sleepComparison,
        comentarios_pos: exam.afterQuestions?.comments,
        data_respostas_pos: exam.afterQuestions?.lastAnsweredTime,
        
        // Meta
        aparelho_serial: exam.oxistar?.serialNumber?.toString(),
        celular: exam.patient?.phone,
        modelo_celular: exam.base?.appModelName
      }
      
      const { data: savedExam } = await supabase
        .from('exames')
        .upsert(examData, { onConflict: 'biologix_exam_id' })
        .select('id, paciente_id')
        .single()
      
      if (isNew) {
        newExams++
        
        // 7. Disparar webhook n8n para análise IA
        if (N8N_WEBHOOK_URL) {
          await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              exame_id: savedExam.id,
              paciente_id: savedExam.paciente_id,
              exam_data: examData
            })
          })
        }
      } else {
        updatedExams++
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        processed: completedExams.length,
        new: newExams,
        updated: updatedExams
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### 3.2 Gerador de Alertas (`generate-alerts`)

```typescript
// supabase/functions/generate-alerts/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  const alertsCreated: string[] = []
  
  // 1. Pacientes com >21 dias sem sessão
  const { data: pacientesSemSessao } = await supabase
    .rpc('get_pacientes_sem_sessao', { dias: 21 })
  
  for (const p of pacientesSemSessao || []) {
    // Verificar se já tem alerta ativo
    const { data: existingAlert } = await supabase
      .from('alertas')
      .select('id')
      .eq('paciente_id', p.id)
      .eq('tipo', 'intervalo_sessao')
      .eq('lido', false)
      .single()
    
    if (!existingAlert) {
      await supabase.from('alertas').insert({
        paciente_id: p.id,
        tipo: 'intervalo_sessao',
        mensagem: `${p.nome} está há ${p.dias_sem_sessao} dias sem sessão`,
        prioridade: 'media',
        dados: { dias: p.dias_sem_sessao }
      })
      alertsCreated.push(`intervalo_sessao: ${p.nome}`)
    }
  }
  
  // 2. Exames onde IDO piorou
  const { data: examePiorou } = await supabase
    .rpc('get_exames_ido_piorou')
  
  for (const e of examePiorou || []) {
    const { data: existingAlert } = await supabase
      .from('alertas')
      .select('id')
      .eq('exame_id', e.exame_id)
      .eq('tipo', 'ido_piorou')
      .single()
    
    if (!existingAlert) {
      await supabase.from('alertas').insert({
        paciente_id: e.paciente_id,
        exame_id: e.exame_id,
        tipo: 'ido_piorou',
        mensagem: `IDO piorou: ${e.ido_anterior} → ${e.ido_atual}`,
        prioridade: 'alta',
        dados: { ido_anterior: e.ido_anterior, ido_atual: e.ido_atual }
      })
      alertsCreated.push(`ido_piorou: ${e.paciente_nome}`)
    }
  }
  
  // 3. SpO2 crítico (<80%)
  const { data: spo2Critico } = await supabase
    .from('exames')
    .select('id, paciente_id, spo2_min, pacientes(nome)')
    .lt('spo2_min', 80)
    .eq('created_at', new Date().toISOString().split('T')[0]) // Só hoje
  
  for (const e of spo2Critico || []) {
    await supabase.from('alertas').insert({
      paciente_id: e.paciente_id,
      exame_id: e.id,
      tipo: 'spo2_critico',
      mensagem: `SpO2 mínimo crítico: ${e.spo2_min}%`,
      prioridade: 'alta',
      dados: { spo2_min: e.spo2_min }
    })
    alertsCreated.push(`spo2_critico: ${e.pacientes?.nome}`)
  }
  
  // 4. Fibrilação atrial detectada
  const { data: fibrilacao } = await supabase
    .from('exames')
    .select('id, paciente_id, pacientes(nome)')
    .eq('fibrilacao_atrial', 1)
    .eq('created_at', new Date().toISOString().split('T')[0])
  
  for (const e of fibrilacao || []) {
    await supabase.from('alertas').insert({
      paciente_id: e.paciente_id,
      exame_id: e.id,
      tipo: 'fibrilacao_atrial',
      mensagem: 'Fibrilação atrial detectada - encaminhar cardiologista',
      prioridade: 'alta'
    })
    alertsCreated.push(`fibrilacao_atrial: ${e.pacientes?.nome}`)
  }
  
  return new Response(
    JSON.stringify({ success: true, alerts_created: alertsCreated }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
```

### 3.3 Cron Jobs (supabase/config.toml)

```toml
[functions.sync-biologix]
schedule = "0 10 * * *"  # Diário às 10h UTC-3

[functions.generate-alerts]
schedule = "30 10 * * *"  # Diário às 10h30 UTC-3
```

---

## 4. Análise por IA (n8n)

### 4.1 Workflow: Análise de Exame

**Trigger:** Webhook POST de Supabase Edge Function

**Nodes:**

```
[Webhook] → [HTTP Request: Buscar histórico] → [Code: Montar prompt]
                                                        ↓
[HTTP Request: Salvar no Supabase] ← [Code: Parsear resposta] ← [Claude API]
```

### 4.2 Prompt para Claude

```
Você é um assistente especializado em medicina do sono, ajudando 
dentistas que realizam tratamento a laser (Fotona LightWalker) 
para ronco e apneia.

## Contexto do Tratamento
- Laser: Er:YAG + Nd:YAG
- Intervalo ideal entre sessões: 21 dias
- Objetivo: reduzir score de ronco e IDO

## Dados do Exame Atual
- **Paciente:** {{nome}}, {{idade}} anos, {{sexo}}
- **Tipo:** {{tipo_exame}}
- **Data:** {{data_exame}}
- **Peso:** {{peso_kg}} kg | **Altura:** {{altura_cm}} cm

### Resultados do Ronco
- Silêncio: {{ronco_silencio}}%
- Baixo: {{ronco_baixo}}%
- Médio: {{ronco_medio}}%
- Alto: {{ronco_alto}}%
- **Score de Impacto:** {{score_ronco}}

### Resultados da Oximetria (se Exame do Sono)
- **IDO:** {{ido}} ({{categoria_ido}})
- **Carga Hipóxica:** {{carga_hipoxica}} %.min/hora
- **SpO2:** min {{spo2_min}}%, médio {{spo2_medio}}%
- **Tempo com SpO2 < 90%:** {{tempo_spo2_90}}
- **Eficiência do Sono:** {{eficiencia_sono}}%
- **Fibrilação Atrial:** {{fibrilacao_atrial}}

### Feedback do Paciente
- Qualidade do sono: {{qualidade_sono}}
- Comparação: {{comparacao_sono}}
- Comentários: {{comentarios}}

## Histórico do Paciente
- Total de sessões: {{total_sessoes}}
- Última sessão: {{data_ultima_sessao}}
- Exame anterior:
  - Data: {{data_exame_anterior}}
  - Score Ronco: {{score_ronco_anterior}}
  - IDO: {{ido_anterior}}

## Sua Tarefa
Forneça uma análise estruturada em JSON:

{
  "resumo": "2-3 frases com interpretação geral",
  "comparacao": "Comparação com exame anterior (ou null se primeiro)",
  "melhora_ronco_pct": número ou null,
  "melhora_ido_pct": número ou null,
  "pontos_atencao": ["lista de alertas clínicos"],
  "sugestoes": ["lista de próximos passos recomendados"],
  "risco_cardiovascular": "baixo/moderado/alto (baseado em carga hipóxica)",
  "prognóstico": "positivo/neutro/negativo"
}

Seja objetivo e clinicamente relevante. Evite linguagem técnica excessiva.
```

### 4.3 Custo Estimado

- ~35 exames/mês
- ~1500 tokens por análise (input + output)
- Claude 3.5 Sonnet: $3/1M input, $15/1M output
- **Estimativa:** $5-10/mês

---

## 5. Interface do Usuário

### 5.1 Sistema de Notificações

O dashboard terá um ícone de sino no header com badge de contagem:

```
┌─────────────────────────────────────────────────────────────┐
│  🦷 Sleep Tracker              🔔(3)    [Dr. João ▼]        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Ao clicar no sino, abre dropdown:                         │
│  ┌───────────────────────────────────────────┐             │
│  │ 📋 Notificações                    [Ver todas]│         │
│  ├───────────────────────────────────────────┤             │
│  │ 🔴 Maria Santos                            │             │
│  │    IDO piorou: 12 → 18                     │             │
│  │    há 2 horas                              │             │
│  ├───────────────────────────────────────────┤             │
│  │ 🔴 Pedro Lima                              │             │
│  │    Fibrilação atrial detectada             │             │
│  │    há 3 horas                              │             │
│  ├───────────────────────────────────────────┤             │
│  │ 🟡 João Silva                              │             │
│  │    25 dias sem sessão                      │             │
│  │    há 5 horas                              │             │
│  └───────────────────────────────────────────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Cores: 🔴 Alta prioridade | 🟡 Média | 🔵 Baixa
```

### 5.2 Dashboard com Abas

O dashboard possui 4 abas para visualizações separadas:

```
┌─────────────────────────────────────────────────────────────┐
│  🦷 Sleep Tracker              🔔(3)    [Dr. João ▼]        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Geral]  [Ronco]  [Apneia]  [Alertas]                     │
│  ════════                                                   │
```

#### Aba Geral

```
┌─────────────────────────────────────────────────────────────┐
│  [Geral]  [Ronco]  [Apneia]  [Alertas]                     │
│  ════════                                                   │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │   175   │ │   479   │ │   312   │ │  62%    │           │
│  │Pacientes│ │ Exames  │ │ Sessões │ │Melhora  │           │
│  │ ativos  │ │ total   │ │ total   │ │ média   │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                             │
│  ┌──────────────────────┐  ┌───────────────────────────┐   │
│  │ 🔔 Alertas Recentes  │  │ 📊 Últimos Exames         │   │
│  │                      │  │                           │   │
│  │ 🔴 Maria - IDO ↑     │  │ Marcelo C. - Sono         │   │
│  │ 🔴 Pedro - Fibrilação│  │ IDO: 6.2 | Score: 1       │   │
│  │ 🟡 João - 25 dias    │  │ há 4 horas                │   │
│  │                      │  │                           │   │
│  │ [Ver todos →]        │  │ Ana Paula - Ronco         │   │
│  └──────────────────────┘  │ Score: 8                  │   │
│                            │ há 1 dia                  │   │
│                            └───────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⏰ Próximas Sessões Sugeridas (>21 dias sem sessão)  │   │
│  │                                                       │   │
│  │ Nome          │ Última Sessão │ Dias │ Telefone      │   │
│  │ João Silva    │ 28/10/2025    │  25  │ 11 98765-4321 │   │
│  │ Ana Costa     │ 30/10/2025    │  23  │ 11 91234-5678 │   │
│  │ Carlos Lima   │ 01/11/2025    │  21  │ 11 99876-5432 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Aba Ronco

```
┌─────────────────────────────────────────────────────────────┐
│  [Geral]  [Ronco]  [Apneia]  [Alertas]                     │
│          ════════                                           │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │   312   │ │  58%    │ │   45    │ │   12    │           │
│  │ Exames  │ │Melhora  │ │ Respond.│ │ Sem     │           │
│  │ ronco   │ │ média   │ │ bem     │ │ resposta│           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Distribuição por Score de Ronco                      │   │
│  │                                                       │   │
│  │ Leve (0-20)      ████████████████████████  68%       │   │
│  │ Moderado (20-40) █████████████             25%       │   │
│  │ Signific. (40-60)████                       5%       │   │
│  │ Severo (60+)     █                          2%       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────┐    │
│  │ 🏆 Top Melhorias         │  │ ⚠️ Sem Resposta      │    │
│  │                          │  │                      │    │
│  │ 1. João S. -85%          │  │ Maria L. +5%         │    │
│  │ 2. Ana C.  -78%          │  │ Pedro M. +2%         │    │
│  │ 3. Carlos  -72%          │  │ José R.  -8%         │    │
│  │ 4. Pedro   -68%          │  │ (após 5+ sessões)    │    │
│  │ 5. Maria   -65%          │  │                      │    │
│  └──────────────────────────┘  └──────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📈 Tendência Geral (últimos 6 meses)                 │   │
│  │                                                       │   │
│  │  Score│                                              │   │
│  │    25│ ●                                             │   │
│  │    20│  ╲                                            │   │
│  │    15│   ●━━●                                        │   │
│  │    10│       ╲━━●━━●━━●                              │   │
│  │      └──────────────────────                         │   │
│  │       Jun  Jul  Ago  Set  Out  Nov                   │   │
│  │                                                       │   │
│  │  Score médio inicial → atual: 22 → 10 (-55%)        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Aba Apneia

```
┌─────────────────────────────────────────────────────────────┐
│  [Geral]  [Ronco]  [Apneia]  [Alertas]                     │
│                   ════════                                  │
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │   167   │ │  45%    │ │    3    │ │    2    │           │
│  │ Exames  │ │Melhora  │ │ SpO2    │ │Fibrilaç.│           │
│  │ sono    │ │IDO média│ │ crítico │ │ detectada│          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Distribuição por Categoria IDO                       │   │
│  │                                                       │   │
│  │ Normal (<5)      ████████████████████████  45%       │   │
│  │ Leve (5-15)      ██████████████████        35%       │   │
│  │ Moderada (15-30) ████████                  15%       │   │
│  │ Acentuada (≥30)  ███                        5%       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────┐  ┌──────────────────────┐    │
│  │ 🔴 SpO2 Crítico (<80%)   │  │ ❤️ Fibrilação Atrial │    │
│  │                          │  │                      │    │
│  │ Pedro M. - SpO2 min: 72% │  │ José R. - 15/11      │    │
│  │ Maria L. - SpO2 min: 78% │  │ Ana L.  - 10/11      │    │
│  │ João S.  - SpO2 min: 79% │  │                      │    │
│  │                          │  │ Encaminhar cardio!   │    │
│  └──────────────────────────┘  └──────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📈 Tendência IDO Médio (últimos 6 meses)             │   │
│  │                                                       │   │
│  │   IDO │                                              │   │
│  │    15│ ●                                             │   │
│  │    12│  ╲━━●                                         │   │
│  │     9│      ╲━━●                                     │   │
│  │     6│          ╲━━●━━●━━●                           │   │
│  │      └──────────────────────                         │   │
│  │       Jun  Jul  Ago  Set  Out  Nov                   │   │
│  │                                                       │   │
│  │  IDO médio inicial → atual: 14.2 → 7.8 (-45%)       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Métricas Adicionais                                  │   │
│  │                                                       │   │
│  │ Carga Hipóxica média:  24.5 → 16.2 %.min/h (-34%)   │   │
│  │ Eficiência sono média: 76% → 84% (+8%)              │   │
│  │ SpO2 mínimo médio:     81% → 86% (+5%)              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Aba Alertas

```
┌─────────────────────────────────────────────────────────────┐
│  [Geral]  [Ronco]  [Apneia]  [Alertas]                     │
│                             ════════                        │
│                                                             │
│  Filtros: [Todos ▼] [Alta ▼] [Não lidos ▼]    12 alertas  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🔴 ALTA PRIORIDADE                                   │   │
│  │                                                       │   │
│  │ ☐ Maria Santos - IDO piorou                          │   │
│  │   IDO: 12 → 18 (+50%)                                │   │
│  │   há 2 horas                            [Ver paciente]│   │
│  │                                                       │   │
│  │ ☐ Pedro Lima - Fibrilação atrial detectada           │   │
│  │   Encaminhar para cardiologista                      │   │
│  │   há 3 horas                            [Ver paciente]│   │
│  │                                                       │   │
│  │ ☐ José Rodrigues - SpO2 crítico                      │   │
│  │   SpO2 mínimo: 72%                                   │   │
│  │   há 5 horas                            [Ver paciente]│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🟡 MÉDIA PRIORIDADE                                  │   │
│  │                                                       │   │
│  │ ☐ João Silva - Intervalo de sessão                   │   │
│  │   25 dias sem sessão                                 │   │
│  │   há 5 horas                            [Ver paciente]│   │
│  │                                                       │   │
│  │ ☐ Ana Costa - Intervalo de sessão                    │   │
│  │   23 dias sem sessão                                 │   │
│  │   há 5 horas                            [Ver paciente]│   │
│  │                                                       │   │
│  │ ☐ Carlos Lima - Sem resposta ao tratamento           │   │
│  │   -8% melhora após 6 sessões                         │   │
│  │   há 1 dia                              [Ver paciente]│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ✅ RESOLVIDOS RECENTEMENTE                           │   │
│  │                                                       │   │
│  │ ✓ Fernando M. - Intervalo de sessão                  │   │
│  │   Resolvido por Dr. João em 21/11/2025              │   │
│  │                                                       │   │
│  │ ✓ Paula R. - IDO piorou                              │   │
│  │   Resolvido por Dra. Maria em 20/11/2025            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Perfil do Paciente

```
┌─────────────────────────────────────────────────────────────┐
│  ← Voltar    Marcelo Cusnir                    [+ Sessão]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────┐  ┌─────────────────────────────────┐│
│  │ 👤 Dados          │  │ 📊 Resumo                       ││
│  │ 65 anos, Masculino│  │                                 ││
│  │ 📞 11 98765-4321  │  │ Exames: 5 │ Sessões: 3          ││
│  │ 📧 email@...      │  │ Melhora Ronco: -87%             ││
│  │                   │  │ Melhora IDO: -35%               ││
│  │ Altura: 179 cm    │  │                                 ││
│  │ Peso atual: 85 kg │  │ Status: ✅ Respondendo bem      ││
│  └───────────────────┘  └─────────────────────────────────┘│
│                                                             │
│  [Exames] [Sessões] [Evolução] [Peso] [Notas]              │
│  ════════                                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Tab Exames (com filtro)

```
┌─────────────────────────────────────────────────────────────┐
│  [Exames] [Sessões] [Evolução] [Peso] [Notas]              │
│  ════════                                                   │
│                                                             │
│  Filtro: [Todos ▼]  [Sono]  [Ronco]              5 exames  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📊 18/11/2025 - Exame do Sono                 [Ver] │   │
│  │    IDO: 6.2 (Leve) │ Score: 1 │ SpO2 min: 87%       │   │
│  │    Eficiência: 85% │ Carga Hipóxica: 16.0           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📊 15/10/2025 - Teste do Ronco                [Ver] │   │
│  │    Score: 8 │ Silêncio: 70% │ Alto: 12%             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📊 20/09/2025 - Exame do Sono                 [Ver] │   │
│  │    IDO: 9.5 (Leve) │ Score: 12 │ SpO2 min: 82%      │   │
│  │    Eficiência: 78% │ Carga Hipóxica: 24.0           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Tab Evolução (métricas expandidas)

```
┌─────────────────────────────────────────────────────────────┐
│  [Exames] [Sessões] [Evolução] [Peso] [Notas]              │
│                      ════════                               │
│                                                             │
│  Métricas: [Score Ronco] [IDO] [SpO2] [Eficiência] [FC]    │
│            ═════════════                                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         📉 Evolução do Score de Ronco                │   │
│  │                                                       │   │
│  │  Score│                                              │   │
│  │    12│ ●                                             │   │
│  │    10│  ╲                                            │   │
│  │     8│   ●                                           │   │
│  │     6│    ╲                                          │   │
│  │     4│     ●                                         │   │
│  │     2│      ╲                                        │   │
│  │     1│       ●━━●                                    │   │
│  │      └──────────────────────                         │   │
│  │       Set   Out   Out   Nov   Nov                    │   │
│  │        ▲     ▲     ▲                                 │   │
│  │       S1    S2    S3 (sessões)                       │   │
│  │                                                       │   │
│  │  Primeiro: 12 → Último: 1 │ Melhora: -92% ✅         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📊 Comparativo Primeiro vs Último Exame              │   │
│  │                                                       │   │
│  │ Métrica            │ Primeiro │ Último │ Variação    │   │
│  ├────────────────────┼──────────┼────────┼─────────────┤   │
│  │ Score Ronco        │ 12.0     │ 1.0    │ -92% ✅     │   │
│  │ Ronco Alto %       │ 25%      │ 1%     │ -96% ✅     │   │
│  │ IDO                │ 9.5      │ 6.2    │ -35% ✅     │   │
│  │ SpO2 Mínimo        │ 82%      │ 87%    │ +5% ✅      │   │
│  │ SpO2 Médio         │ 91%      │ 94%    │ +3% ✅      │   │
│  │ Tempo SpO2 <90%    │ 15 min   │ 2.6min │ -83% ✅     │   │
│  │ Carga Hipóxica     │ 24.0     │ 16.0   │ -33% ✅     │   │
│  │ Eficiência Sono    │ 78%      │ 85%    │ +7% ✅      │   │
│  │ FC Máxima          │ 125 bpm  │ 110 bpm│ -12% ✅     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Tab Peso

```
┌─────────────────────────────────────────────────────────────┐
│  [Exames] [Sessões] [Evolução] [Peso] [Notas]              │
│                               ══════                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         📉 Evolução do Peso                          │   │
│  │                                                       │   │
│  │  Peso│                                               │   │
│  │   88│ ●                                              │   │
│  │   87│  ╲                                             │   │
│  │   86│   ●━━━●                                        │   │
│  │   85│        ╲━━●                                    │   │
│  │   84│            ╲━●                                 │   │
│  │      └──────────────────────                         │   │
│  │       Set   Out   Out   Nov   Nov                    │   │
│  │        E     S     E     S     E                     │   │
│  │                                                       │   │
│  │  E = Exame  │  S = Sessão                            │   │
│  │                                                       │   │
│  │  Peso inicial: 88 kg → Atual: 84 kg │ Variação: -4kg │   │
│  │  IMC inicial: 27.5 → Atual: 26.2 (-1.3)              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.4 Visualização do Exame (Estilo PDF Biologix)

Ao clicar em "Ver" em um exame, abre modal/página com layout similar ao PDF do Biologix:

```
┌─────────────────────────────────────────────────────────────────────┐
│  Exame do Sono Biologix®                                       [X] │
│  Ref.: 100-3002938JP                                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ EXAME                                                        │   │
│  │                                                               │   │
│  │ Nome: Marcelo Cusnir          Nascimento: 06/08/1960 (65 anos)│  │
│  │ Início: 18/11/2025 – 23:59    Tempo total: 06:33:30          │   │
│  │ Fim: 19/11/2025 – 06:32       Tempo válido: 06:27:33         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐    │
│  │ CONDIÇÕES NA NOITE       │  │ TRATAMENTOS NA NOITE         │    │
│  │                          │  │                              │    │
│  │ ○ Consumo de álcool      │  │ ○ CPAP                       │    │
│  │ ○ Congestão nasal        │  │ ○ Aparelho avanço mandibular │    │
│  │ ● Sedativos              │  │ ○ Terapia posicional         │    │
│  │ ○ Placa de bruxismo      │  │ ○ Oxigênio                   │    │
│  │ ○ Marcapasso             │  │ ○ Suporte ventilatório       │    │
│  └──────────────────────────┘  └──────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ FICHA MÉDICA                                                 │   │
│  ├───────────────┬───────────────────┬─────────────────────────┤   │
│  │ Medidas       │ Sintomas          │ Doenças associadas      │   │
│  │               │                   │                         │   │
│  │ Peso: 86 kg   │ ● Ronco alto      │ ● Hipertensão arterial  │   │
│  │ Altura: 1,79m │ ○ Sonolência      │ ● Diabetes              │   │
│  │ IMC: 26,8     │ ○ Sono não repar. │ ● Dislipidemia          │   │
│  │               │ ○ Despertares     │ ○ Depressão             │   │
│  │ Medicamentos: │                   │                         │   │
│  │ ● Roypinol    │                   │                         │   │
│  │ ● Omnic Ocas  │                   │                         │   │
│  │ ● Metformina  │                   │                         │   │
│  │ ● Livalo 2mg  │                   │                         │   │
│  │ ● Paroxetina  │                   │                         │   │
│  └───────────────┴───────────────────┴─────────────────────────┘   │
│                                                                     │
│  ════════════════════════ RESULTADO ═══════════════════════════    │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │     IDO      │  │ Tempo SpO2   │  │  ⭐ Score de Ronco       │  │
│  │   ┌─────┐    │  │    < 90%     │  │    (calculado)           │  │
│  │   │ 6,2 │    │  │   ┌─────┐    │  │      ┌─────┐             │  │
│  │   └─────┘    │  │   │  0  │    │  │      │  1  │             │  │
│  │    /hora     │  │   └─────┘    │  │      └─────┘             │  │
│  │              │  │      %       │  │    Ronco leve ✅         │  │
│  │ Apneia Leve  │  │              │  │                          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Valores de referência IDO          │ Score de Ronco         │   │
│  │ IDO < 5      Normal                │ 0-20   Leve ✅         │   │
│  │ 5 ≤ IDO < 15 Apneia leve           │ 20-40  Moderado ⚠️     │   │
│  │ 15 ≤ IDO < 30 Apneia moderada      │ 40-60  Significativo 🟠│   │
│  │ IDO ≥ 30     Apneia acentuada      │ 60+    Severo 🔴       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ════════════════════ OXIMETRIA (SpO2) ════════════════════════    │
│                                                                     │
│  ┌─────────────────────────────┐  ┌────────────────────────────┐   │
│  │ Histograma SpO2 (%)         │  │                            │   │
│  │                             │  │ SpO2 mínima        87%     │   │
│  │ > 95  ████████████████  68% │  │ SpO2 média         94%     │   │
│  │ 95-93 ████████          20% │  │ SpO2 máxima        99%     │   │
│  │ 92-90 ████               8% │  │                            │   │
│  │ 89-87 ██                 3% │  │ Tempo SpO2 < 90%   2,6 min │   │
│  │ 86-84 ░                  1% │  │ Nº dessaturações   40      │   │
│  │ 83-81 ░                  0% │  │ IDO                6,2/h   │   │
│  │ 80-78 ░                  0% │  │ IDO sono           4,5/h   │   │
│  │ < 78  ░                  0% │  │ Eventos hipoxemia  0       │   │
│  │       0   25   50   75  100 │  │ Tempo hipoxemia    0 min   │   │
│  └─────────────────────────────┘  └────────────────────────────┘   │
│                                                                     │
│  ══════════════════ FREQUÊNCIA CARDÍACA ═══════════════════════    │
│                                                                     │
│  ┌─────────────────────────────┐  ┌────────────────────────────┐   │
│  │ Histograma FC (bpm)         │  │                            │   │
│  │                             │  │ Mínima             45 bpm  │   │
│  │ > 109 ░                  1% │  │ Média              55 bpm  │   │
│  │ 99-90 ░                  2% │  │ Máxima            110 bpm  │   │
│  │ 89-80 ██                 5% │  │                            │   │
│  │ 79-70 ████               8% │  │                            │   │
│  │ 69-60 ████████          18% │  │                            │   │
│  │ 59-50 ████████████████  45% │  │                            │   │
│  │ < 50  ████████          21% │  │                            │   │
│  │       0   25   50   75  100 │  │                            │   │
│  └─────────────────────────────┘  └────────────────────────────┘   │
│                                                                     │
│  ═══════════════════ CARGA HIPÓXICA ═══════════════════════════    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │ Carga hipóxica: 16,0 %.min/hora                              │   │
│  │                                                               │   │
│  │ Risco cardiovascular:                                        │   │
│  │ ┌────────────────────────────────────────────────────────┐   │   │
│  │ │██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│   │   │
│  │ └────────────────────────────────────────────────────────┘   │   │
│  │ 0          Risco menor              Risco maior         300+ │   │
│  │            ▲ 16                                              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ════════════════════ SONO ESTIMADO ═══════════════════════════    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │ Tempo total de sono      336,0 min (5h 36min)                │   │
│  │ Tempo para dormir         22,5 min                           │   │
│  │ Tempo acordado pós-sono   32,5 min                           │   │
│  │ Eficiência do sono        85%                                │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ════════════════════ ANÁLISE DE RONCO ════════════════════════    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │ Tempo de gravação:  394,0 min                                │   │
│  │ Tempo com ronco:      3,9 min (1%)                           │   │
│  │                                                               │   │
│  │ ┌───────────┬───────────┬───────────┬───────────┐            │   │
│  │ │ Silêncio  │   Baixo   │   Médio   │   Alto    │            │   │
│  │ │  ██████   │           │           │     █     │            │   │
│  │ │    99%    │     0%    │     0%    │     1%    │            │   │
│  │ └───────────┴───────────┴───────────┴───────────┘            │   │
│  │                                                               │   │
│  │ ⭐ SCORE DE RONCO: 1                                         │   │
│  │    Classificação: Ronco leve ✅                              │   │
│  │    Fórmula: (baixo×1 + médio×2 + alto×3) / 3                 │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ═══════════════════ CARDIOLOGIA ══════════════════════════════    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │ Fibrilação Atrial: ✅ Negativa                               │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ═══════════════════ ANÁLISE IA 🤖 ════════════════════════════    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │ Resumo:                                                      │   │
│  │ "Exame compatível com apneia do sono leve (IDO 6,2/hora).    │   │
│  │ Score de ronco excelente (1), indicando ótimo controle.      │   │
│  │ SpO2 manteve-se estável durante a noite com mínimo de 87%.   │   │
│  │ Eficiência do sono de 85% está dentro do esperado."          │   │
│  │                                                               │   │
│  │ Comparação com exame anterior (20/09/2025):                  │   │
│  │ ┌────────────────────────────────────────────────────────┐   │   │
│  │ │ • IDO: 9,5 → 6,2 (-35%) ✅                             │   │   │
│  │ │ • Score Ronco: 12 → 1 (-92%) ✅                        │   │   │
│  │ │ • SpO2 mínimo: 82% → 87% (+5%) ✅                      │   │   │
│  │ │ • Eficiência: 78% → 85% (+7%) ✅                       │   │   │
│  │ │ • Carga Hipóxica: 24.0 → 16.0 (-33%) ✅               │   │   │
│  │ └────────────────────────────────────────────────────────┘   │   │
│  │                                                               │   │
│  │ Sugestões:                                                   │   │
│  │ • Paciente respondendo muito bem ao tratamento               │   │
│  │ • Manter protocolo de sessões a cada 21 dias                 │   │
│  │ • Continuar monitoramento do peso (correlação positiva)      │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ═══════════════════ FEEDBACK PACIENTE ════════════════════════    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │ Qualidade do sono: Boa                                       │   │
│  │ Comparação com noite típica: Melhor que o normal             │   │
│  │ Comentários: "Dormi bem, acordei descansado"                 │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ═══════════════════ METADADOS ════════════════════════════════    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                               │   │
│  │ Nº de série Oxistar: 10767                                   │   │
│  │ Firmware: 02.001.001                                         │   │
│  │ Aplicativo: iOS, versão 2/1.17.1                             │   │
│  │                                                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                         [📄 Ver PDF Original]                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.5 Modal: Nova Sessão

```
┌─────────────────────────────────────────────────────────────┐
│  Nova Sessão - Marcelo Cusnir                          [X] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Data da Sessão:  [22/11/2025    📅]                       │
│                                                             │
│  Peso (kg):       [85.0         ]                          │
│                                                             │
│  ─────────── Er:YAG ───────────                            │
│  Pulso Inicial:   [1450         ]                          │
│  Pulso Final:     [1700         ]                          │
│  Energia:         250 mJ (calculado)                       │
│                                                             │
│  ─────────── Nd:YAG ───────────                            │
│  Pulso Inicial:   [950          ]                          │
│  Pulso Final:     [1100         ]                          │
│  Energia:         150 mJ (calculado)                       │
│                                                             │
│  Observações:                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Paciente relatou melhora no ronco segundo esposa.   │   │
│  │ Sem efeitos colaterais.                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│                              [Cancelar]  [💾 Salvar]       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Segurança e Permissões

### 6.1 Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE exames ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_paciente ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ver tudo
CREATE POLICY "Users can view all data"
ON pacientes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view all exams"
ON exames FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view all sessions"
ON sessoes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view all notes"
ON notas_paciente FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view all alerts"
ON alertas FOR SELECT TO authenticated USING (true);

-- Política: Todos podem inserir/atualizar
CREATE POLICY "Users can insert patients"
ON pacientes FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update patients"
ON pacientes FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can insert sessions"
ON sessoes FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can insert notes"
ON notas_paciente FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update alerts"
ON alertas FOR UPDATE TO authenticated USING (true);

-- Política: Só admin pode deletar
CREATE POLICY "Only admins can delete"
ON pacientes FOR DELETE TO authenticated
USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete sessions"
ON sessoes FOR DELETE TO authenticated
USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
```

### 6.2 Funções de Verificação

```sql
-- Função para verificar se é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN COALESCE(
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter role do usuário
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text AS $$
BEGIN
  RETURN COALESCE(
    auth.jwt() -> 'user_metadata' ->> 'role',
    'equipe'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 6.3 Roles

| Role | Permissões |
|------|------------|
| **admin** | Tudo + gestão de usuários + deletar registros |
| **equipe** | Visualizar tudo + criar/editar sessões e notas + marcar alertas como lidos |

---

## 7. Estimativas

### 7.1 Custos Mensais

| Serviço | Plano | Custo |
|---------|-------|-------|
| Supabase | Pro (já tem) | $25/mês |
| Vercel | Hobby (free) | $0 |
| n8n | Self-hosted Hostinger | Já incluso |
| Claude API | ~35 análises | ~$5-10/mês |
| **Total** | | **~$30-35/mês** |

### 7.2 Timeline de Implementação

| Semana | Atividades | Entregável |
|--------|------------|------------|
| **1** | Setup Supabase: schemas, migrations, RLS, functions auxiliares | Banco pronto |
| **2** | Edge Functions: sync-biologix, generate-alerts | Sync funcionando |
| **3** | Migração dados Airtable → Supabase | Dados migrados |
| **4** | n8n: Workflow análise IA + webhook | IA funcionando |
| **5** | Frontend: Auth, layout, dashboard, notificações | Dashboard básico |
| **6** | Frontend: Lista pacientes, perfil, gráficos | Fluxo principal |
| **7** | Frontend: Sessões, notas, configurações | Features completas |
| **8** | Testes, ajustes, deploy produção | Sistema em produção |

**Total: ~8 semanas**

### 7.3 Recursos

- **Desenvolvedor Full-Stack:** 1 pessoa
- **Acessos necessários:**
  - Supabase (já tem)
  - Vercel (criar conta)
  - Biologix API credentials
  - Anthropic API key
  - n8n Hostinger

---

## 8. Roadmap de Evolução

### ✅ Fase 1: MVP (Este documento)
- Sync Biologix → Supabase via Edge Functions
- Dashboard com métricas e notificações
- Perfil do paciente com histórico completo
- Registro de sessões com energia laser
- Gráficos de evolução (ronco, IDO, peso)
- Análise IA intermediária via n8n
- Sistema de alertas interno

### 🔮 Fase 2: IA Avançada (2-3 meses)
- [ ] Análise comparativa entre pacientes similares
- [ ] Predição de resposta ao tratamento (quantas sessões até meta)
- [ ] Relatório PDF gerado por IA para mostrar ao paciente
- [ ] Benchmark vs. população geral da clínica
- [ ] Sugestões de protocolo personalizadas

### 🔮 Fase 3: Automação Total (3-6 meses)
- [ ] Webhook do Biologix (se disponibilizar) = sync em tempo real
- [ ] Migrar análise IA para Supabase Edge Functions
- [ ] Notificações por email para alertas críticos
- [ ] Lembretes automáticos de sessão (WhatsApp/SMS)

### 🔮 Fase 4: Expansão (6+ meses)
- [ ] App mobile para dentistas (React Native)
- [ ] Portal simplificado para paciente ver evolução
- [ ] Integração com agenda (Google Calendar)
- [ ] Multi-clínica (white-label)
- [ ] Exportação de dados para pesquisa clínica

---

## 9. Riscos e Mitigações

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| API Biologix indisponível | Baixa | Alto | Retry com backoff, log de erros, alerta manual |
| Token Biologix expira | Média | Médio | Renovação automática na Edge Function |
| Edge Function timeout | Baixa | Médio | Processar em batches se necessário |
| Custo IA excede budget | Baixa | Baixo | Monitorar uso, cache de análises similares |
| Erro na migração Airtable | Média | Alto | Backup completo, script de validação |
| n8n Hostinger instável | Baixa | Médio | Monitoramento, retry automático |

---

## Anexos

### A. Mapeamento Biologix → Supabase

| Campo API Biologix | Coluna Supabase |
|--------------------|-----------------|
| `patientUserId` | `pacientes.biologix_id` |
| `examId` | `exames.biologix_exam_id` |
| `examKey` | `exames.exam_key` |
| `type` | `exames.tipo` |
| `base.startTime` | `exames.data_exame` |
| `result.snoring.*` | `exames.ronco_*` |
| `result.oximetry.*` | `exames.ido, spo2_*, bpm_*` |
| `result.cardiology.afNotification` | `exames.fibrilacao_atrial` |
| `afterQuestions.*` | `exames.qualidade_sono, comparacao_sono, comentarios_pos` |
| `oxistar.serialNumber` | `exames.aparelho_serial` |

### B. Script de Migração Airtable

```sql
-- Executar após importar CSVs do Airtable

-- 1. Migrar pacientes
INSERT INTO pacientes (biologix_id, nome, cpf, sexo, email, telefone, data_nascimento)
SELECT DISTINCT
  "ID do Paciente",
  "Nome",
  REGEXP_REPLACE("username", '[^0-9]', '', 'g'),
  LOWER("Sexo"),
  "Email",
  "Telefone",
  "Data de Nascimento"::DATE
FROM airtable_pacientes
ON CONFLICT (biologix_id) DO NOTHING;

-- 2. Migrar exames
INSERT INTO exames (
  paciente_id, biologix_exam_id, exam_key, tipo, data_exame,
  ronco_silencio_pct, ronco_baixo_pct, ronco_medio_pct, ronco_alto_pct,
  ido, ido_categoria, spo2_min, spo2_medio, spo2_max
  -- ... demais campos
)
SELECT 
  p.id,
  ae."ID Exame",
  ae."Chave Exame",
  ae."Type",
  ae."Data do Processamento"::TIMESTAMPTZ,
  ae."Ronco - Silencio",
  ae."Ronco - Baixo",
  ae."Ronco - Medio",
  ae."Ronco - Alto",
  ae."IDO",
  ae."IDO Cat",
  ae."spO2 Min",
  ae."spO2 Médio",
  ae."spO2 Max"
  -- ... demais campos
FROM airtable_exames ae
JOIN pacientes p ON p.biologix_id = ae."ID Paciente (fonte)"
ON CONFLICT (biologix_exam_id) DO NOTHING;
```

### C. Variáveis de Ambiente

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Biologix (Edge Functions)
BIOLOGIX_PARTNER_ID=4798042LW
BIOLOGIX_USERNAME=l|DEMO|47349438
BIOLOGIX_PASSWORD=xxx

# n8n Webhook
N8N_WEBHOOK_URL=https://n8n.srv881294.hstgr.cloud/webhook/xxx

# Claude API (n8n)
ANTHROPIC_API_KEY=xxx
```

---

*Documento gerado pelo Conselho Consultivo de Sistemas*  
*Versão 2.0 - 2025-11-22*
