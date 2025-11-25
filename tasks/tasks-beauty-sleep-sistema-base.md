# Tasks: Beauty Sleep Treatment System - Sistema Base (v2.1)

> **Baseado em**: PRD v2.1 - Beauty Sleep Treatment System
> **Timeline**: 10 semanas
> **Stack**: Next.js 14, Supabase PostgreSQL, TypeScript, Tailwind CSS

---

## Relevant Files

### Supabase Backend
- `supabase/migrations/001_initial_schema.sql` - Schema inicial com 10 tabelas principais
- `supabase/migrations/002_rls_policies.sql` - Row Level Security policies para 3 roles
- `supabase/migrations/003_triggers.sql` - Triggers automáticos (status, sessões, manutenção)
- `supabase/migrations/004_functions.sql` - Funções PostgreSQL (validar_cpf, extract_cpf, etc)
- `supabase/migrations/005_seed_data.sql` - Tags pré-definidas e configurações iniciais
- `supabase/functions/sync-biologix/index.ts` - Edge Function para sync diária com API Biologix
- `supabase/functions/sync-biologix/biologix-client.ts` - Cliente API Biologix
- `supabase/functions/sync-biologix/types.ts` - Types para API Biologix

### Scripts de Migração
- `scripts/migrate-from-airtable.ts` - Script de migração do Airtable para Supabase
- `scripts/validate-migration.ts` - Script de validação pós-migração (checklist)

### Frontend Core
- `app/layout.tsx` - Layout principal com sidebar, header, providers
- `app/page.tsx` - Redirect para /dashboard
- `app/login/page.tsx` - Página de login
- `app/dashboard/page.tsx` - Dashboard com 3 abas (Geral, Ronco, Apneia)
- `app/dashboard/components/KPICards.tsx` - Cards de KPIs principais
- `app/dashboard/components/WidgetAcoesPendentes.tsx` - Widget de ações pendentes
- `app/dashboard/components/GraficoTendencia.tsx` - Gráfico de tendência temporal

### Gestão de Pacientes
- `app/pacientes/page.tsx` - Lista de pacientes com filtros e busca
- `app/pacientes/[id]/page.tsx` - Perfil completo do paciente (tabs)
- `app/pacientes/[id]/components/HeaderPerfil.tsx` - Header com dados, status, quick actions
- `app/pacientes/[id]/components/TabExames.tsx` - Tab de exames
- `app/pacientes/[id]/components/TabSessoes.tsx` - Tab de sessões
- `app/pacientes/[id]/components/TabEvolucao.tsx` - Tab de gráficos de evolução
- `app/pacientes/[id]/components/TabPeso.tsx` - Tab de peso e IMC
- `app/pacientes/[id]/components/TabNotas.tsx` - Tab de notas clínicas
- `app/pacientes/[id]/components/TabHistoricoStatus.tsx` - Tab de histórico de status
- `app/pacientes/components/ModalNovoPaciente.tsx` - Modal de pré-cadastro
- `app/pacientes/components/ModalNovaSessao.tsx` - Modal de nova sessão
- `app/pacientes/components/ModalDetalhesExame.tsx` - Modal de detalhes do exame

### Gestão de Usuários (Admin)
- `app/usuarios/page.tsx` - Lista de usuários (Admin only)
- `app/usuarios/components/ModalNovoUsuario.tsx` - Modal de criação de usuário
- `app/logs/page.tsx` - Logs de auditoria (Admin only)

### Components Globais
- `components/ui/Sidebar.tsx` - Sidebar com navegação
- `components/ui/Header.tsx` - Header com busca global
- `components/ui/BuscaGlobal.tsx` - Campo de busca global (CPF/nome/telefone)
- `components/ui/BadgeStatus.tsx` - Badge de status do paciente
- `components/ui/BadgeAdesao.tsx` - Badge de adesão ao tratamento
- `components/OnboardingTour.tsx` - Tour guiado com Shepherd.js

### Utilities e Hooks
- `lib/supabase/client.ts` - Cliente Supabase (browser)
- `lib/supabase/server.ts` - Cliente Supabase (server)
- `lib/utils/cpf.ts` - Funções de validação e formatação de CPF
- `lib/utils/calculos.ts` - Cálculos (IMC, adesão, score ronco, etc)
- `lib/utils/dates.ts` - Conversões de data (UTC ↔ BRT)
- `hooks/usePacientes.ts` - Hook para CRUD de pacientes
- `hooks/useExames.ts` - Hook para fetch de exames
- `hooks/useSessoes.ts` - Hook para CRUD de sessões

### Types
- `types/database.ts` - Types gerados do Supabase schema
- `types/biologix.ts` - Types da API Biologix
- `types/paciente.ts` - Types do domínio de pacientes

### Tests
- `__tests__/utils/cpf.test.ts` - Testes de validação de CPF
- `__tests__/utils/calculos.test.ts` - Testes de cálculos
- `__tests__/integration/auth.test.ts` - Testes de autenticação
- `__tests__/integration/pacientes.test.ts` - Testes de fluxo de pacientes
- `__tests__/e2e/complete-flow.spec.ts` - Teste E2E completo (Playwright)

### Configuração
- `next.config.js` - Configuração Next.js
- `tailwind.config.ts` - Configuração Tailwind + Admin Theme
- `tsconfig.json` - Configuração TypeScript
- `.env.local` - Variáveis de ambiente
- `package.json` - Dependências
- `playwright.config.ts` - Configuração Playwright

### Notes

- Este projeto segue a estrutura Next.js 14 App Router
- Supabase é usado tanto para banco de dados quanto para autenticação
- Edge Functions rodam em Deno (TypeScript)
- Migrations devem ser aplicadas em ordem numérica
- Testes unitários usam Jest, testes E2E usam Playwright
- Design segue o Admin Theme do Beauty Smile Design System

---

## 🔴 CRITICAL RULES - READ BEFORE STARTING

### Mandatory Rules (Non-Negotiable)

**RULE 1: ALWAYS follow phases in order**
- Fase 0 → Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5 → Fase 6 → Fase 7 → Fase 8 → Fase 9
- NEVER skip ahead to later phases
- Complete ALL sub-tasks in a phase before moving to next phase
- **Exception**: Fase 8 (Migração Manual) can be done in parallel with user input, but Fase 9 must wait for Fase 8 completion

**RULE 2: NEVER skip tasks or sub-tasks**
- Every checkbox must be completed in sequence
- If a sub-task is not applicable, mark it as done and add note explaining why
- If blocked by external dependency (e.g., waiting for Biologix API access), document the blocker and inform user

**RULE 3: ALWAYS mark checkboxes immediately after completion**
- Change `- [ ]` to `- [x]` right after finishing the sub-task
- Update this file using Edit tool after EACH sub-task
- Do NOT batch checkbox updates

**RULE 4: ALWAYS commit at end of each FASE (not each task)**
- Fase 1 complete → commit
- Fase 2 complete → commit
- ... and so on
- Use standardized commit messages (see below)
- **Special case**: Fase 1 has critical migrations - commit after 1.3, 1.4, 1.5, 1.6, 1.7 individually for safety

**RULE 5: ALWAYS read this tasks file before starting work**
- At beginning of each session, read `tasks-beauty-sleep-sistema-base.md`
- Verify last completed task (last checkbox marked [x])
- Confirm with user before continuing

**RULE 6: ALWAYS validate migrations before proceeding**
- After running any migration, verify it applied correctly: `npx supabase db diff`
- After Fase 1.10 (Airtable migration), run validation script (1.11) before continuing
- Never proceed to next fase if data validation fails

**RULE 7: ALWAYS test in staging before production**
- Fase 1-8: Work in staging environment first
- Only deploy to production in Fase 9.8 after stakeholder approval
- If production deployment fails, rollback immediately and fix in staging

**RULE 8: ALWAYS backup before destructive operations**
- Before running migrations in production: export database backup
- Before deleting data: confirm with user twice
- Before deploying to production: create database snapshot (Supabase dashboard)
- Keep Airtable export intact until final handoff (Fase 9.12)
- Never run DROP TABLE, TRUNCATE, or DELETE without backup

---

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

---

### Workflow: Starting a Session

```
1. [ ] Read tasks-beauty-sleep-sistema-base.md completely
2. [ ] Find last completed sub-task (last [x] checkbox)
3. [ ] Identify next pending sub-task (first [ ] checkbox)
4. [ ] Inform user: "Last completed: [X.Y.Z], Next: [A.B.C - description]"
5. [ ] Ask user: "Should I continue from task [A.B.C]?"
6. [ ] Wait for confirmation before starting
```

---

### Workflow: During Execution

```
For each sub-task:
1. [ ] Read sub-task description carefully
2. [ ] Execute the sub-task completely
3. [ ] Test if applicable (run build, verify database, test API, check UI)
4. [ ] Mark checkbox as [x] in this file (use Edit tool)
5. [ ] Inform user: "✅ Completed [X.Y.Z - description]"
6. [ ] Move to next sub-task

IMPORTANT: Update this file after EACH sub-task, not in batches!
```

---

### Workflow: Completing a FASE

```
When all sub-tasks in a fase are [x]:
1. [ ] Verify ALL checkboxes in the fase are marked [x]
2. [ ] Run fase-level validation (build, lint, tests, migration checks)
3. [ ] Create commit with standardized message
4. [ ] Push to remote repository
5. [ ] Inform user: "✅ FASE [N] COMPLETED: [name]"
6. [ ] Show commit hash and summary of what was accomplished
7. [ ] Ask user: "Should I proceed to Fase [N+1]?"
8. [ ] Wait for confirmation before starting next fase
```

---

### Standardized Commit Messages

```bash
# After Fase 0 complete:
git commit -m "feat(beauty-sleep): Fase 0 - Feature Branch

- Branch feature/beauty-sleep-sistema-base created
- Repository structure verified"

# After Fase 1 complete:
git commit -m "feat(beauty-sleep): Fase 1 - Setup e Migração

- Next.js 14 + Supabase configurado
- 5 migrations aplicadas (schema, functions, triggers, RLS, seed)
- Edge Function sync-biologix implementada
- 175 pacientes migrados do Airtable
- 479 exames sincronizados e validados
- Cron job configurado (10h BRT diário)"

# After Fase 2 complete:
git commit -m "feat(beauty-sleep): Fase 2 - Autenticação e Layout

- Sistema de autenticação Supabase implementado
- Layout base com Sidebar + Header
- Busca global (CPF/nome/telefone)
- Tour guiado Shepherd.js (3 roles)
- Middleware de proteção de rotas
- Admin Theme aplicado"

# After Fase 3 complete:
git commit -m "feat(beauty-sleep): Fase 3 - Dashboard e Ações Pendentes

- Dashboard 3 abas (Geral, Ronco, Apneia)
- KPI Cards com role-based visibility
- Widget Ações Pendentes (4 tipos)
- Gráficos Recharts (tendência, distribuição)
- Exames recentes e casos críticos"

# After Fase 4 complete:
git commit -m "feat(beauty-sleep): Fase 4 - Gestão de Pacientes

- Lista de pacientes com paginação
- Filtros avançados (status, tags, adesão)
- Modal Novo Paciente com validação CPF
- Gestão de tags (CRUD)
- Badges de status e adesão"

# After Fase 5 complete:
git commit -m "feat(beauty-sleep): Fase 5 - Perfil de Paciente Parte 1

- Header do perfil com status dropdown
- Resumo de tratamento (sessões, adesão)
- Tab Exames com modal detalhes
- Tab Sessões (CRUD completo)
- Modal histórico de edições
- WhatsApp integration"

# After Fase 6 complete:
git commit -m "feat(beauty-sleep): Fase 6 - Perfil de Paciente Parte 2

- Tab Evolução com 4 gráficos temporais
- Tab Peso/IMC com thresholds
- Tab Notas clínicas
- Tab Histórico de Status
- Tags no perfil (add/remove)"

# After Fase 7 complete:
git commit -m "feat(beauty-sleep): Fase 7 - Features Avançadas

- Gestão de Usuários (Admin only)
- Logs de Auditoria com filtros
- Triggers automáticos validados
- RLS policies testadas (3 roles)
- Configurações de perfil"

# After Fase 8 complete:
git commit -m "feat(beauty-sleep): Fase 8 - Migração Manual de Sessões

- Documentação de migração criada
- Equipe treinada (30 min)
- Sessões históricas migradas manualmente
- Validação de dados completa
- Gamificação aplicada"

# After Fase 9 complete:
git commit -m "feat(beauty-sleep): Fase 9 - Testes e Deploy

- Testes unitários (Jest) - 80% coverage
- Testes integração (Playwright)
- Testes E2E completos
- Testes RLS e usabilidade aprovados
- Deploy staging → produção
- Documentação de uso criada
- Treinamento final realizado
- Sistema em produção estável 🎉"
```

---

### Common Mistakes to Avoid

❌ **DON'T:**
- Skip reading the tasks file at start of session
- Jump to later phases (e.g., start Fase 5 before Fase 4 is done)
- Mark multiple checkboxes at once without updating file
- Commit before fase is complete (except Fase 1 migrations)
- Start work without user confirmation
- Assume what the next task is
- Run migrations in production before testing in staging
- Skip data validation after migrations

✅ **DO:**
- Read tasks file every session
- Follow sequential order religiously
- Update checkboxes one at a time immediately
- Commit only at fase completion (or critical migration points)
- Always confirm with user first
- Verify last completed task before starting
- Test every migration in staging first
- Run validation scripts after data migrations
- Ask user if blocked or unsure

---

### Recovery from Errors

If you realize you skipped a task or made a mistake:

```
1. [ ] Stop immediately - do not continue
2. [ ] Inform user about the issue clearly
3. [ ] Identify which task was skipped/failed
4. [ ] If it's a migration error, check if rollback is needed
5. [ ] Go back and complete the skipped task properly
6. [ ] Update checkboxes correctly
7. [ ] Re-run any dependent tasks that may be affected
8. [ ] Continue from there only after validation
```

---

### Special Notes for Beauty Sleep Project

**Database Migrations (Fase 1):**
- ALWAYS apply migrations in order: 001 → 002 → 003 → 004 → 005
- ALWAYS verify migration applied: `npx supabase db diff`
- NEVER skip validation steps after migrations
- Keep Airtable backup intact until Fase 9 completion

**Biologix API Integration:**
- Credentials will be provided by user (username, password, partnerId)
- Test sync manually before enabling cron
- Monitor first automatic sync closely (next day 10h BRT)

**Data Validation:**
- After 1.10 (Airtable migration): Expect exactly 175 pacientes, 479 exames
- After 8.3 (Sessões migration): Verify sessoes_utilizadas matches COUNT(*)
- Any mismatch requires investigation before proceeding

**Testing Strategy:**
- Fase 1-8: Use staging Supabase + Vercel preview deployments
- Fase 9: Only deploy to production after ALL tests pass
- If production issues occur, rollback immediately

---

## Tasks

### 0.0 Create feature branch
- [x] 0.1 Create and checkout a new branch `git checkout -b feature/beauty-sleep-sistema-base`
- [x] 0.2 Verify branch is created and active with `git branch`

---

### 1.0 Fase 1: Setup e Migração (Semanas 1-2)

#### 1.1 Setup Projeto Next.js
- [ ] 1.1.1 Initialize Next.js 14 project with TypeScript: `npx create-next-app@latest beauty-sleep --typescript --tailwind --app`
- [ ] 1.1.2 Install core dependencies: `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs zod react-hook-form @hookform/resolvers`
- [ ] 1.1.3 Install UI dependencies: `npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select recharts shepherd.js lucide-react`
- [ ] 1.1.4 Install dev dependencies: `npm install -D @types/node prettier eslint-config-prettier`
- [ ] 1.1.5 Configure Tailwind with Admin Theme colors in `tailwind.config.ts`
- [ ] 1.1.6 Create `.env.local` with Supabase variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] 1.1.7 Update `next.config.js` to allow Supabase images domain

#### 1.2 Setup Supabase Project
- [ ] 1.2.1 Create new Supabase project in dashboard (Production)
- [ ] 1.2.2 Create staging Supabase project for testing
- [ ] 1.2.3 Copy connection strings and API keys to `.env.local`
- [ ] 1.2.4 Install Supabase CLI: `npm install -D supabase`
- [ ] 1.2.5 Initialize Supabase locally: `npx supabase init`
- [ ] 1.2.6 Link to remote project: `npx supabase link --project-ref [project-id]`

#### 1.3 Database Schema (Migration 001)
- [ ] 1.3.1 Create `supabase/migrations/001_initial_schema.sql`
- [ ] 1.3.2 Add table `users` (id, email, nome, role, ativo, tour_completed, created_at)
- [ ] 1.3.3 Add table `pacientes` (id, biologix_id UNIQUE, cpf UNIQUE, nome, email, telefone, data_nascimento, genero, status, sessoes_compradas, sessoes_adicionadas, proxima_manutencao, observacoes_gerais, created_at, updated_at)
- [ ] 1.3.4 Add table `exames` (id, paciente_id, biologix_exam_id UNIQUE, biologix_exam_key, tipo, status, data_exame, peso_kg, altura_cm, imc, score_ronco, ido, ido_categoria, spo2_min, spo2_avg, spo2_max, created_at)
- [ ] 1.3.5 Add table `sessoes` (id, paciente_id, user_id, data_sessao, protocolo, contador_pulsos_inicial, contador_pulsos_final, observacoes, created_at, updated_at, editado_por, editado_em)
- [ ] 1.3.6 Add table `tags` (id, nome, cor, tipo, created_at)
- [ ] 1.3.7 Add table `paciente_tags` (id, paciente_id, tag_id, created_at)
- [ ] 1.3.8 Add table `notas` (id, paciente_id, user_id, conteudo, created_at)
- [ ] 1.3.9 Add table `historico_status` (id, paciente_id, status_anterior, status_novo, motivo, user_id, created_at)
- [ ] 1.3.10 Add table `sessao_historico` (id, sessao_id, campo_alterado, valor_anterior, valor_novo, user_id, created_at)
- [ ] 1.3.11 Add table `audit_logs` (id, user_id, acao, entidade, entidade_id, detalhes, created_at)
- [ ] 1.3.12 Add indexes: `idx_pacientes_cpf`, `idx_pacientes_biologix_id`, `idx_exames_paciente_id`, `idx_exames_data`, `idx_sessoes_paciente_id`
- [ ] 1.3.13 Apply migration: `npx supabase db push`

#### 1.4 Database Functions (Migration 002)
- [ ] 1.4.1 Create `supabase/migrations/002_functions.sql`
- [ ] 1.4.2 Add function `validar_cpf(cpf TEXT) RETURNS BOOLEAN` with full CPF validation algorithm
- [ ] 1.4.3 Add function `formatar_cpf(cpf TEXT) RETURNS TEXT` to format as 000.000.000-00
- [ ] 1.4.4 Add function `extract_cpf_from_username(username TEXT) RETURNS TEXT` with regex extraction
- [ ] 1.4.5 Add function `calcular_imc(peso_kg NUMERIC, altura_cm NUMERIC) RETURNS NUMERIC`
- [ ] 1.4.6 Add function `calcular_score_ronco(baixo NUMERIC, medio NUMERIC, alto NUMERIC) RETURNS NUMERIC` with formula: (baixo × 1 + medio × 2 + alto × 3) / 3
- [ ] 1.4.7 Add function `calcular_adesao(sessoes_utilizadas INT, sessoes_total INT) RETURNS NUMERIC`
- [ ] 1.4.8 Add function `calcular_proxima_manutencao(data_finalizacao DATE) RETURNS DATE` (+ 6 months)
- [ ] 1.4.9 Apply migration: `npx supabase db push`

#### 1.5 Database Triggers (Migration 003)
- [ ] 1.5.1 Create `supabase/migrations/003_triggers.sql`
- [ ] 1.5.2 Add trigger `atualizar_sessoes_utilizadas` on INSERT/DELETE sessoes → update pacientes.sessoes_utilizadas
- [ ] 1.5.3 Add trigger `atualizar_status_ao_criar_sessao` on INSERT sessoes → change status lead → ativo
- [ ] 1.5.4 Add trigger `calcular_proxima_manutencao_trigger` on UPDATE pacientes.status → finalizado (calculate proxima_manutencao)
- [ ] 1.5.5 Add trigger `atualizar_imc` on INSERT/UPDATE exames → calculate and set IMC
- [ ] 1.5.6 Add trigger `registrar_historico_status` on UPDATE pacientes.status → insert into historico_status
- [ ] 1.5.7 Add trigger `registrar_edicao_sessao` on UPDATE sessoes → insert into sessao_historico
- [ ] 1.5.8 Add trigger `audit_log_trigger` on INSERT/UPDATE/DELETE pacientes, sessoes → insert into audit_logs
- [ ] 1.5.9 Apply migration: `npx supabase db push`

#### 1.6 Row Level Security (Migration 004)
- [ ] 1.6.1 Create `supabase/migrations/004_rls_policies.sql`
- [ ] 1.6.2 Enable RLS on all tables: `ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;`
- [ ] 1.6.3 Add policy `users_select`: Admin/Equipe/Recepcao can view users
- [ ] 1.6.4 Add policy `users_insert`: Only Admin can create users
- [ ] 1.6.5 Add policy `users_update`: Only Admin can update users
- [ ] 1.6.6 Add policy `pacientes_select`: All roles can view pacientes
- [ ] 1.6.7 Add policy `pacientes_insert`: Admin/Equipe can create pacientes
- [ ] 1.6.8 Add policy `pacientes_update`: Admin/Equipe can update pacientes
- [ ] 1.6.9 Add policy `pacientes_delete`: Only Admin can delete pacientes
- [ ] 1.6.10 Add policy `sessoes_insert`: Admin/Equipe can create sessoes
- [ ] 1.6.11 Add policy `sessoes_update`: Admin can update any, Equipe can update own only
- [ ] 1.6.12 Add policy `sessoes_delete`: Only Admin can delete sessoes
- [ ] 1.6.13 Add policy `audit_logs_select`: Only Admin can view audit logs
- [ ] 1.6.14 Apply migration: `npx supabase db push`

#### 1.7 Seed Data (Migration 005)
- [ ] 1.7.1 Create `supabase/migrations/005_seed_data.sql`
- [ ] 1.7.2 Insert pre-defined tags: Atropina, Vonau, Nasal, Palato, Língua, Combinado
- [ ] 1.7.3 Insert test admin user (email: admin@beautysmile.com, role: admin)
- [ ] 1.7.4 Insert test equipe user (email: dentista@beautysmile.com, role: equipe)
- [ ] 1.7.5 Insert test recepcao user (email: recepcao@beautysmile.com, role: recepcao)
- [ ] 1.7.6 Apply migration: `npx supabase db push`

#### 1.8 Edge Function: sync-biologix
- [ ] 1.8.1 Create `supabase/functions/sync-biologix/index.ts`
- [ ] 1.8.2 Create `supabase/functions/sync-biologix/types.ts` with Biologix API types (ExamDto, ExamResultDto, etc)
- [ ] 1.8.3 Create `supabase/functions/sync-biologix/biologix-client.ts` with API client class
- [ ] 1.8.4 Implement `openSession()` method: POST /v2/sessions/open with username/password
- [ ] 1.8.5 Implement `getExams()` method: GET /v2/partners/{partnerId}/exams with pagination
- [ ] 1.8.6 Implement token renewal logic (check if expired, renew before day 7)
- [ ] 1.8.7 Implement main handler: fetch all exams with status = DONE (6)
- [ ] 1.8.8 Extract CPF from patient.username using regex `REGEX_REPLACE({username}, "[^0-9]", "")`
- [ ] 1.8.9 Match exam to paciente by CPF (find existing or create new as lead)
- [ ] 1.8.10 Calculate score_ronco using formula if exam type = 0
- [ ] 1.8.11 Upsert exam to database (unique by biologix_exam_id)
- [ ] 1.8.12 Add error handling and retry logic with exponential backoff
- [ ] 1.8.13 Deploy Edge Function: `npx supabase functions deploy sync-biologix`

#### 1.9 Cron Job Configuration
- [ ] 1.9.1 Create cron job in Supabase dashboard: `0 13 * * *` (10h BRT = 13h UTC)
- [ ] 1.9.2 Configure cron to call Edge Function `sync-biologix`
- [ ] 1.9.3 Test cron manually to verify it works
- [ ] 1.9.4 Monitor first automatic run and check logs

#### 1.10 Migration Script: Airtable → Supabase
- [ ] 1.10.1 Create `scripts/migrate-from-airtable.ts`
- [ ] 1.10.2 Export all data from Airtable to CSV (pacientes, exames, tags)
- [ ] 1.10.3 Read CSV files and parse data
- [ ] 1.10.4 Validate all CPFs using `validar_cpf()` function
- [ ] 1.10.5 Transform Airtable fields to Supabase schema
- [ ] 1.10.6 Insert pacientes (175 records) with proper status mapping
- [ ] 1.10.7 Insert exames (479 records) linking by biologix_id
- [ ] 1.10.8 Insert tags and tag associations
- [ ] 1.10.9 Run script in staging first: `tsx scripts/migrate-from-airtable.ts --env=staging`
- [ ] 1.10.10 Verify data integrity in staging

#### 1.11 Validation Script: Post-Migration
- [ ] 1.11.1 Create `scripts/validate-migration.ts`
- [ ] 1.11.2 Check count: SELECT COUNT(*) FROM pacientes (expect 175)
- [ ] 1.11.3 Check count: SELECT COUNT(*) FROM exames (expect 479)
- [ ] 1.11.4 Verify all CPFs are valid: SELECT COUNT(*) FROM pacientes WHERE NOT validar_cpf(cpf)
- [ ] 1.11.5 Verify all exames have paciente_id: SELECT COUNT(*) FROM exames WHERE paciente_id IS NULL
- [ ] 1.11.6 Verify no duplicate CPFs: SELECT cpf, COUNT(*) FROM pacientes GROUP BY cpf HAVING COUNT(*) > 1
- [ ] 1.11.7 Spot check 10 random patients (compare Airtable vs Supabase)
- [ ] 1.11.8 Verify IMC calculations are correct
- [ ] 1.11.9 Verify score_ronco calculations are correct
- [ ] 1.11.10 Generate validation report (PDF or markdown)
- [ ] 1.11.11 Run validation: `tsx scripts/validate-migration.ts`
- [ ] 1.11.12 Review report and fix any issues found

#### 1.12 Production Migration
- [ ] 1.12.1 Backup Airtable data (export to JSON + CSV)
- [ ] 1.12.2 Run migration script in production: `tsx scripts/migrate-from-airtable.ts --env=production`
- [ ] 1.12.3 Run validation script: `tsx scripts/validate-migration.ts --env=production`
- [ ] 1.12.4 Verify validation report shows 100% success
- [ ] 1.12.5 Test sync-biologix Edge Function manually
- [ ] 1.12.6 Verify new exams are being synced correctly

---

### 2.0 Fase 2: Autenticação e Layout Base (Semana 3)

#### 2.1 Supabase Auth Setup
- [ ] 2.1.1 Create `lib/supabase/client.ts` with `createClientComponentClient()`
- [ ] 2.1.2 Create `lib/supabase/server.ts` with `createServerComponentClient()` and `createRouteHandlerClient()`
- [ ] 2.1.3 Create `lib/supabase/middleware.ts` for route protection
- [ ] 2.1.4 Configure Supabase Auth in dashboard (email provider, redirect URLs)
- [ ] 2.1.5 Create auth callback route: `app/auth/callback/route.ts`

#### 2.2 Login Page
- [ ] 2.2.1 Create `app/login/page.tsx` with email/password form
- [ ] 2.2.2 Add form validation with Zod schema
- [ ] 2.2.3 Implement login handler with `supabase.auth.signInWithPassword()`
- [ ] 2.2.4 Add error handling (invalid credentials, network errors)
- [ ] 2.2.5 Redirect to `/dashboard` on successful login
- [ ] 2.2.6 Style with Admin Theme (Tailwind classes)
- [ ] 2.2.7 Add "Esqueci minha senha" link (password reset flow)

#### 2.3 Middleware and Route Protection
- [ ] 2.3.1 Create `middleware.ts` in root to protect all routes except `/login`
- [ ] 2.3.2 Check if user is authenticated, redirect to `/login` if not
- [ ] 2.3.3 Fetch user role from database
- [ ] 2.3.4 Add role-based access control (Admin-only routes: `/usuarios`, `/logs`)
- [ ] 2.3.5 Test route protection (try accessing `/dashboard` without login)

#### 2.4 Layout Base
- [ ] 2.4.1 Create `app/layout.tsx` with Providers (Supabase, Theme)
- [ ] 2.4.2 Create `components/ui/Sidebar.tsx` with navigation links
- [ ] 2.4.3 Add navigation items: Dashboard, Pacientes, Usuários (Admin only), Logs (Admin only)
- [ ] 2.4.4 Add user menu dropdown: Perfil, Configurações, Sair
- [ ] 2.4.5 Create `components/ui/Header.tsx` with logo and user avatar
- [ ] 2.4.6 Add responsive mobile menu (hamburger)
- [ ] 2.4.7 Style Sidebar and Header with Admin Theme

#### 2.5 Busca Global
- [ ] 2.5.1 Create `components/ui/BuscaGlobal.tsx` in Header
- [ ] 2.5.2 Add input field with search icon (Lucide)
- [ ] 2.5.3 Implement debounced search (300ms) with `useDebouncedValue` hook
- [ ] 2.5.4 Query database: `SELECT * FROM pacientes WHERE cpf LIKE %search% OR nome ILIKE %search% OR telefone LIKE %search%`
- [ ] 2.5.5 Display search results dropdown with patient cards
- [ ] 2.5.6 Navigate to patient profile on result click
- [ ] 2.5.7 Add keyboard shortcuts: Cmd+K to focus search
- [ ] 2.5.8 Test search with CPF (only numbers), nome (case-insensitive), telefone

#### 2.6 Tour Guiado (Shepherd.js)
- [ ] 2.6.1 Install Shepherd.js: `npm install shepherd.js`
- [ ] 2.6.2 Create `components/OnboardingTour.tsx` component
- [ ] 2.6.3 Define tour steps for Admin (12 steps) based on PRD Apêndice B
- [ ] 2.6.4 Define tour steps for Equipe (8 steps)
- [ ] 2.6.5 Define tour steps for Recepção (5 steps)
- [ ] 2.6.6 Add function `getTourSteps(role)` to return appropriate steps
- [ ] 2.6.7 Trigger tour on first login: check `user.tour_completed === false`
- [ ] 2.6.8 Save `tour_completed = true` on tour completion
- [ ] 2.6.9 Add "Refazer Tour" button in user settings
- [ ] 2.6.10 Style tour tooltips with Admin Theme
- [ ] 2.6.11 Test tour for all 3 roles

#### 2.7 Root Page and Redirects
- [ ] 2.7.1 Create `app/page.tsx` that redirects to `/dashboard`
- [ ] 2.7.2 Test redirect flow: login → dashboard
- [ ] 2.7.3 Add loading state during redirect

---

### 3.0 Fase 3: Dashboard e Ações Pendentes (Semana 4)

#### 3.1 Dashboard - Aba Geral
- [ ] 3.1.1 Create `app/dashboard/page.tsx` with tab navigation (Geral, Ronco, Apneia)
- [ ] 3.1.2 Create `app/dashboard/components/KPICards.tsx`
- [ ] 3.1.3 Add KPI: Total de Pacientes (count by status)
- [ ] 3.1.4 Add KPI: Leads para Converter (count where status = lead)
- [ ] 3.1.5 Add KPI: Exames Realizados (total count exames)
- [ ] 3.1.6 Add KPI: Taxa de Conversão (% leads que viraram ativos)
- [ ] 3.1.7 Add KPI: Adesão Média ao Tratamento (avg % sessoes utilizadas)
- [ ] 3.1.8 Style KPI cards with icons and colors (Admin Theme)
- [ ] 3.1.9 Add role-based visibility: Recepção cannot see numeric values (show "--" instead)

#### 3.2 Widget Ações Pendentes
- [ ] 3.2.1 Create `app/dashboard/components/WidgetAcoesPendentes.tsx`
- [ ] 3.2.2 Query leads sem follow-up: status = lead AND created_at < 7 days ago
- [ ] 3.2.3 Query pacientes sem sessão: status = ativo AND sessoes_utilizadas = 0
- [ ] 3.2.4 Query manutenção atrasada: status = finalizado AND proxima_manutencao < TODAY
- [ ] 3.2.5 Query completando tratamento: sessoes_disponiveis <= 2 AND status = ativo
- [ ] 3.2.6 Display 4 sections with counts and patient lists
- [ ] 3.2.7 Add click handler to navigate to patient profile
- [ ] 3.2.8 Add badges with urgency levels (high = red, medium = yellow)
- [ ] 3.2.9 Test widget with different scenarios

#### 3.3 Dashboard - Exames Recentes
- [ ] 3.3.1 Create `app/dashboard/components/ExamesRecentes.tsx`
- [ ] 3.3.2 Query last 10 exames: `SELECT * FROM exames ORDER BY data_exame DESC LIMIT 10`
- [ ] 3.3.3 Display table with: Paciente, Data, Tipo, IDO, Score Ronco
- [ ] 3.3.4 Add badges for IDO categoria (Normal = green, Leve = yellow, etc)
- [ ] 3.3.5 Add click to view exam details modal
- [ ] 3.3.6 Style table with Admin Theme

#### 3.4 Dashboard - Aba Ronco
- [ ] 3.4.1 Create tab "Ronco" in dashboard
- [ ] 3.4.2 Add KPI: Score Médio de Ronco (avg score_ronco)
- [ ] 3.4.3 Add KPI: Pacientes com Ronco Alto (count where score_ronco > 2)
- [ ] 3.4.4 Create `components/GraficoDistribuicaoRonco.tsx` (pie chart: % baixo/médio/alto)
- [ ] 3.4.5 Create table "Top 10 Melhorias" (compare first vs last exam, show % improvement)
- [ ] 3.4.6 Create `components/GraficoTendenciaRonco.tsx` (line chart: avg score over time)
- [ ] 3.4.7 Add date range filter (last 30/60/90/180/365 days, custom)
- [ ] 3.4.8 Use Recharts for all charts
- [ ] 3.4.9 Style charts with Admin Theme colors

#### 3.5 Dashboard - Aba Apneia
- [ ] 3.5.1 Create tab "Apneia" in dashboard
- [ ] 3.5.2 Add KPI: IDO Médio (avg ido)
- [ ] 3.5.3 Add KPI: Casos Críticos (count where ido_categoria = 3)
- [ ] 3.5.4 Add KPI: SpO2 Médio (avg spo2_avg)
- [ ] 3.5.5 Create `components/GraficoDistribuicaoIDO.tsx` (bar chart: count per categoria)
- [ ] 3.5.6 Create table "Casos Críticos" (patients with IDO categoria 3, sorted by IDO desc)
- [ ] 3.5.7 Create `components/GraficoTendenciaIDO.tsx` (line chart: avg IDO over time)
- [ ] 3.5.8 Add same date range filter as Ronco tab
- [ ] 3.5.9 Style charts with Admin Theme colors

#### 3.6 Dashboard - Tempo Médio de Tratamento
- [ ] 3.6.1 Add section "Tempo Médio de Tratamento" in Geral tab
- [ ] 3.6.2 Calculate: avg days between first exam and status = finalizado
- [ ] 3.6.3 Segment by: IDO inicial (Normal, Leve, Moderado, Acentuado)
- [ ] 3.6.4 Display bar chart comparing avg days per segment
- [ ] 3.6.5 Add tooltip showing number of patients in each segment

---

### 4.0 Fase 4: Gestão de Pacientes (Semana 5)

#### 4.1 Lista de Pacientes
- [ ] 4.1.1 Create `app/pacientes/page.tsx`
- [ ] 4.1.2 Query all pacientes with pagination (20 per page)
- [ ] 4.1.3 Display table with: Nome, CPF, Status, Adesão, Último Exame, Ações
- [ ] 4.1.4 Add status badge with colors (Lead = blue, Ativo = green, Finalizado = gray, Inativo = red)
- [ ] 4.1.5 Add adesão badge with colors (>80% = green, 50-80% = yellow, <50% = red)
- [ ] 4.1.6 Add "Novo" badge if created < 7 days ago
- [ ] 4.1.7 Add click row to navigate to patient profile
- [ ] 4.1.8 Style table with Admin Theme

#### 4.2 Filtros Avançados
- [ ] 4.2.1 Create `app/pacientes/components/FiltrosAvancados.tsx`
- [ ] 4.2.2 Add filter by status (multi-select: Lead, Ativo, Finalizado, Inativo)
- [ ] 4.2.3 Add filter by tags (multi-select)
- [ ] 4.2.4 Add filter by adesão range (slider: 0-100%)
- [ ] 4.2.5 Add filter by data cadastro (date range picker)
- [ ] 4.2.6 Add "Limpar Filtros" button
- [ ] 4.2.7 Update query with WHERE clauses based on active filters
- [ ] 4.2.8 Show active filter chips above table
- [ ] 4.2.9 Test combinations of filters

#### 4.3 Modal Novo Paciente
- [ ] 4.3.1 Create `app/pacientes/components/ModalNovoPaciente.tsx`
- [ ] 4.3.2 Add form fields: CPF (required), Nome, Email, Telefone, Data Nascimento, Gênero
- [ ] 4.3.3 Add field: Status (radio: Lead or Paciente)
- [ ] 4.3.4 Add field: Sessões Compradas (only visible if status = Paciente, optional)
- [ ] 4.3.5 Add CPF validation on blur using `validar_cpf()` function
- [ ] 4.3.6 Add CPF auto-formatting (000.000.000-00)
- [ ] 4.3.7 Add duplicate CPF check (query database)
- [ ] 4.3.8 Implement form submit: INSERT INTO pacientes
- [ ] 4.3.9 Show success toast and close modal
- [ ] 4.3.10 Show error toast if CPF already exists (suggest existing patient)
- [ ] 4.3.11 Style modal with Admin Theme

#### 4.4 Gestão de Tags
- [ ] 4.4.1 Create `app/configuracoes/tags/page.tsx` (Settings → Tags)
- [ ] 4.4.2 Display list of all tags with colors
- [ ] 4.4.3 Add button "Nova Tag"
- [ ] 4.4.4 Create `components/ModalNovaTag.tsx` with fields: Nome, Cor (color picker), Tipo
- [ ] 4.4.5 Implement create tag: INSERT INTO tags
- [ ] 4.4.6 Implement edit tag: UPDATE tags
- [ ] 4.4.7 Implement delete tag (only Admin): DELETE FROM tags (cascade to paciente_tags)
- [ ] 4.4.8 Show count of patients using each tag
- [ ] 4.4.9 Test CRUD operations

#### 4.5 Button Novo Paciente
- [ ] 4.5.1 Add floating action button "Novo Paciente" in `/pacientes` page
- [ ] 4.5.2 Open ModalNovoPaciente on click
- [ ] 4.5.3 Hide button for Recepção role
- [ ] 4.5.4 Test button visibility per role

---

### 5.0 Fase 5: Perfil de Paciente - Parte 1 (Semana 6)

#### 5.1 Header do Perfil
- [ ] 5.1.1 Create `app/pacientes/[id]/page.tsx`
- [ ] 5.1.2 Fetch paciente by id with all relations
- [ ] 5.1.3 Create `app/pacientes/[id]/components/HeaderPerfil.tsx`
- [ ] 5.1.4 Display: Nome, CPF, Email, Telefone, Data Nascimento, Idade
- [ ] 5.1.5 Add status dropdown (Admin/Equipe can change, Recepção cannot)
- [ ] 5.1.6 Implement status change: UPDATE pacientes SET status = X (trigger historico_status)
- [ ] 5.1.7 Add modal for status = Inativo to ask for motivo
- [ ] 5.1.8 Add WhatsApp button with link: `https://wa.me/55{telefone}`
- [ ] 5.1.9 Add field Observações Gerais (textarea, auto-save on blur)
- [ ] 5.1.10 Style header with Admin Theme

#### 5.2 Resumo de Tratamento
- [ ] 5.2.1 Create `app/pacientes/[id]/components/ResumoTratamento.tsx`
- [ ] 5.2.2 Display: Sessões Compradas, Sessões Adicionadas, Sessões Utilizadas, Sessões Disponíveis
- [ ] 5.2.3 Calculate Adesão: (utilizadas / (compradas + adicionadas)) × 100
- [ ] 5.2.4 Display Adesão with badge (>80% = green, 50-80% = yellow, <50% = red)
- [ ] 5.2.5 Add badge if Disponíveis < 2 (warning: "Poucas sessões disponíveis")
- [ ] 5.2.6 Display Próxima Manutenção date (if status = finalizado)
- [ ] 5.2.7 Add badge if Próxima Manutenção < TODAY (urgent: "Manutenção atrasada")
- [ ] 5.2.8 Add button "Adicionar Sessões" (Admin/Equipe only)
- [ ] 5.2.9 Implement modal to add sessões: UPDATE pacientes SET sessoes_adicionadas = sessoes_adicionadas + X

#### 5.3 Quick Actions
- [ ] 5.3.1 Create `components/QuickActions.tsx` in header
- [ ] 5.3.2 Add button "Nova Sessão" → open ModalNovaSessao
- [ ] 5.3.3 Add button "Adicionar Nota" → open ModalNovaNota
- [ ] 5.3.4 Add button "Editar Paciente" → open ModalEditarPaciente
- [ ] 5.3.5 Hide buttons based on role (Recepção cannot use)

#### 5.4 Tab Exames
- [ ] 5.4.1 Create `app/pacientes/[id]/components/TabExames.tsx`
- [ ] 5.4.2 Query all exames for this paciente: `SELECT * FROM exames WHERE paciente_id = X ORDER BY data_exame DESC`
- [ ] 5.4.3 Display table with: Data, Tipo, Status, IDO, Score Ronco, Ações
- [ ] 5.4.4 Add filter by tipo (Ronco, Sono)
- [ ] 5.4.5 Add filter by date range
- [ ] 5.4.6 Add button "Ver Detalhes" → open ModalDetalhesExame
- [ ] 5.4.7 Add button "Baixar PDF" → fetch from Biologix API using examKey
- [ ] 5.4.8 Hide "Baixar PDF" for Recepção role
- [ ] 5.4.9 Show badge "Novo" if exam created < 7 days ago

#### 5.5 Modal Detalhes Exame
- [ ] 5.5.1 Create `app/pacientes/components/ModalDetalhesExame.tsx`
- [ ] 5.5.2 Display full exam details in sections: Dados Básicos, Ronco, Oximetria, Cardiologia
- [ ] 5.5.3 Section Dados Básicos: Data, Peso, Altura, IMC, Duração
- [ ] 5.5.4 Section Ronco: Score, % Silêncio, % Baixo, % Médio, % Alto, Duração total ronco
- [ ] 5.5.5 Section Oximetria: IDO, Categoria IDO, SpO2 Min/Avg/Max, Tempo <90%, Tempo <80%, FC Min/Avg/Max
- [ ] 5.5.6 Section Cardiologia: Fibrilação Atrial (Positiva/Negativa/Inconclusivo)
- [ ] 5.5.7 Style modal with cards and visual indicators (colors, icons)
- [ ] 5.5.8 Add button "Baixar PDF" in modal footer

#### 5.6 Tab Sessões
- [ ] 5.6.1 Create `app/pacientes/[id]/components/TabSessoes.tsx`
- [ ] 5.6.2 Query all sessoes for this paciente: `SELECT * FROM sessoes WHERE paciente_id = X ORDER BY data_sessao DESC`
- [ ] 5.6.3 Display table with: Data, Protocolo, Pulsos (inicial → final), Dentista, Ações
- [ ] 5.6.4 Add badge "Editada" if editado_em IS NOT NULL
- [ ] 5.6.5 Add button "Nova Sessão" (Admin/Equipe only)
- [ ] 5.6.6 Add button "Editar" (Admin can edit any, Equipe can edit own only)
- [ ] 5.6.7 Add button "Deletar" (Admin only)
- [ ] 5.6.8 Add filter by date range
- [ ] 5.6.9 Show total count of sessões

#### 5.7 Modal Nova Sessão
- [ ] 5.7.1 Create `app/pacientes/components/ModalNovaSessao.tsx`
- [ ] 5.7.2 Add form fields: Data Sessão (date picker), Protocolo (multi-select tags), Contador Inicial, Contador Final, Observações
- [ ] 5.7.3 Validate: Contador Final > Contador Inicial
- [ ] 5.7.4 Calculate pulsos utilizados: Final - Inicial (display in real-time)
- [ ] 5.7.5 Implement submit: INSERT INTO sessoes (user_id = current user)
- [ ] 5.7.6 Show success toast
- [ ] 5.7.7 Refresh sessoes table and Resumo Tratamento (sessões utilizadas updated by trigger)
- [ ] 5.7.8 Check if patient status changed to Ativo (if was Lead)
- [ ] 5.7.9 Style modal with Admin Theme

#### 5.8 Modal Editar Sessão
- [ ] 5.8.1 Create `app/pacientes/components/ModalEditarSessao.tsx`
- [ ] 5.8.2 Pre-fill form with existing sessão data
- [ ] 5.8.3 Implement submit: UPDATE sessoes SET ... (trigger sessao_historico)
- [ ] 5.8.4 Show warning if editing another user's sessão (Admin only)
- [ ] 5.8.5 Add button "Ver Histórico de Edições" (Admin only)
- [ ] 5.8.6 Refresh table after edit

#### 5.9 Modal Histórico de Edições de Sessão
- [ ] 5.9.1 Create `app/pacientes/components/ModalHistoricoSessao.tsx`
- [ ] 5.9.2 Query: `SELECT * FROM sessao_historico WHERE sessao_id = X ORDER BY created_at DESC`
- [ ] 5.9.3 Display timeline with: Data/Hora, Usuário, Campo Alterado, Valor Anterior → Valor Novo
- [ ] 5.9.4 Style timeline with icons and colors
- [ ] 5.9.5 Only accessible by Admin

---

### 6.0 Fase 6: Perfil de Paciente - Parte 2 (Semana 7)

#### 6.1 Tab Evolução
- [ ] 6.1.1 Create `app/pacientes/[id]/components/TabEvolucao.tsx`
- [ ] 6.1.2 Query all exames for charts: `SELECT * FROM exames WHERE paciente_id = X ORDER BY data_exame ASC`
- [ ] 6.1.3 Add date range filter (all time, last 6/12 months)
- [ ] 6.1.4 Create line chart: IDO over time (Recharts)
- [ ] 6.1.5 Create line chart: Score Ronco over time
- [ ] 6.1.6 Create line chart: SpO2 Médio over time
- [ ] 6.1.7 Create line chart: FC Médio over time
- [ ] 6.1.8 Add comparison card: Primeiro Exame vs Último Exame
- [ ] 6.1.9 Display % improvement for each metric (green if improved, red if worsened)
- [ ] 6.1.10 Add badge "Respondendo ao tratamento" if improvement ≥ 20%
- [ ] 6.1.11 Add badge "Não respondendo" if improvement < 20% after 5+ sessões
- [ ] 6.1.12 Style charts with Admin Theme colors

#### 6.2 Tab Peso
- [ ] 6.2.1 Create `app/pacientes/[id]/components/TabPeso.tsx`
- [ ] 6.2.2 Query peso/altura from exames: `SELECT peso_kg, altura_cm, imc, data_exame FROM exames WHERE paciente_id = X ORDER BY data_exame ASC`
- [ ] 6.2.3 Create line chart: Peso (kg) over time
- [ ] 6.2.4 Create line chart: IMC over time
- [ ] 6.2.5 Add horizontal line showing IMC = 25 (overweight threshold)
- [ ] 6.2.6 Add horizontal line showing IMC = 30 (obese threshold)
- [ ] 6.2.7 Display current vs initial: Peso Atual vs Peso Inicial, IMC Atual vs IMC Inicial
- [ ] 6.2.8 Show % change (+ or -)
- [ ] 6.2.9 Style charts with Admin Theme colors

#### 6.3 Tab Notas
- [ ] 6.3.1 Create `app/pacientes/[id]/components/TabNotas.tsx`
- [ ] 6.3.2 Query all notas: `SELECT * FROM notas WHERE paciente_id = X ORDER BY created_at DESC`
- [ ] 6.3.3 Display list of notes with: Conteúdo, Autor, Data/Hora
- [ ] 6.3.4 Add button "Nova Nota" (Admin/Equipe only)
- [ ] 6.3.5 Create inline form for new note (textarea + Save/Cancel buttons)
- [ ] 6.3.6 Implement save: INSERT INTO notas (user_id = current user)
- [ ] 6.3.7 Add delete button (Admin only, or own notes for Equipe)
- [ ] 6.3.8 Confirm before delete (modal: "Tem certeza?")
- [ ] 6.3.9 Style notes as cards with author avatar

#### 6.4 Tab Histórico de Status
- [ ] 6.4.1 Create `app/pacientes/[id]/components/TabHistoricoStatus.tsx`
- [ ] 6.4.2 Query: `SELECT * FROM historico_status WHERE paciente_id = X ORDER BY created_at DESC`
- [ ] 6.4.3 Display timeline with: Data/Hora, Status Anterior → Status Novo, Motivo (if inativo), Usuário
- [ ] 6.4.4 Style timeline with colors per status (lead = blue, ativo = green, etc)
- [ ] 6.4.5 Add icons for each status change
- [ ] 6.4.6 Show motivo in card if status_novo = inativo

#### 6.5 Tags no Perfil
- [ ] 6.5.1 Add tags section in HeaderPerfil
- [ ] 6.5.2 Display current tags as colored badges
- [ ] 6.5.3 Add button "+" to add new tag (Admin/Equipe only)
- [ ] 6.5.4 Create dropdown with all available tags
- [ ] 6.5.5 Implement add tag: INSERT INTO paciente_tags
- [ ] 6.5.6 Implement remove tag: DELETE FROM paciente_tags (click X on badge)
- [ ] 6.5.7 Only Admin/Equipe can add/remove tags

---

### 7.0 Fase 7: Features Avançadas (Semana 8)

#### 7.1 Gestão de Usuários (Admin only)
- [ ] 7.1.1 Create `app/usuarios/page.tsx`
- [ ] 7.1.2 Query all users: `SELECT * FROM users ORDER BY nome ASC`
- [ ] 7.1.3 Display table with: Nome, Email, Role, Ativo, Última Atividade, Ações
- [ ] 7.1.4 Add button "Novo Usuário"
- [ ] 7.1.5 Create `app/usuarios/components/ModalNovoUsuario.tsx`
- [ ] 7.1.6 Add form fields: Nome, Email, Role (select: admin/equipe/recepcao), Senha (auto-generate or manual)
- [ ] 7.1.7 Implement create user: Supabase Auth + INSERT INTO users
- [ ] 7.1.8 Send invitation email with password reset link
- [ ] 7.1.9 Add button "Editar" → open ModalEditarUsuario
- [ ] 7.1.10 Implement edit user: UPDATE users (can change nome, role, ativo)
- [ ] 7.1.11 Add button "Desativar" (soft delete: UPDATE users SET ativo = false)
- [ ] 7.1.12 Add button "Resetar Senha" → send password reset email
- [ ] 7.1.13 Protect route: only Admin can access

#### 7.2 Logs de Auditoria (Admin only)
- [ ] 7.2.1 Create `app/logs/page.tsx`
- [ ] 7.2.2 Query: `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100`
- [ ] 7.2.3 Display table with: Data/Hora, Usuário, Ação, Entidade, Detalhes
- [ ] 7.2.4 Add filters: Por Usuário, Por Entidade (pacientes/sessoes/etc), Por Ação (INSERT/UPDATE/DELETE)
- [ ] 7.2.5 Add date range filter
- [ ] 7.2.6 Add pagination (100 logs per page)
- [ ] 7.2.7 Add search by detalhes (full-text search)
- [ ] 7.2.8 Style table with Admin Theme
- [ ] 7.2.9 Protect route: only Admin can access

#### 7.3 Triggers de Mudança de Status Automática
- [ ] 7.3.1 Verify trigger `atualizar_status_ao_criar_sessao` is working
- [ ] 7.3.2 Test: Create paciente with status = lead
- [ ] 7.3.3 Test: Create first sessão → verify status changed to ativo
- [ ] 7.3.4 Test: Verify historico_status has entry for lead → ativo
- [ ] 7.3.5 Edge case: If status manually changed back to lead, trigger should still work

#### 7.4 Cálculo Automático de Próxima Manutenção
- [ ] 7.4.1 Verify trigger `calcular_proxima_manutencao_trigger` is working
- [ ] 7.4.2 Test: Change status to finalizado
- [ ] 7.4.3 Verify proxima_manutencao = data_finalizacao + 6 months
- [ ] 7.4.4 Test: If already finalizado, changing status back and forth should recalculate

#### 7.5 Permissões RLS Completas
- [ ] 7.5.1 Test Admin: Can create/edit/delete pacientes, sessoes, users, tags
- [ ] 7.5.2 Test Equipe: Can create/edit pacientes, can create sessoes, can edit own sessoes only, cannot delete
- [ ] 7.5.3 Test Recepção: Can only view pacientes/exames, cannot create/edit/delete
- [ ] 7.5.4 Test Recepção: Cannot see numeric values in dashboard (should show "--")
- [ ] 7.5.5 Test Admin: Can view audit logs, Equipe/Recepção cannot
- [ ] 7.5.6 Test edge cases: Equipe trying to edit another user's sessão (should fail)
- [ ] 7.5.7 Test edge cases: Recepção trying to create paciente (should fail)

#### 7.6 Configurações de Perfil
- [ ] 7.6.1 Create `app/perfil/page.tsx`
- [ ] 7.6.2 Display current user info: Nome, Email, Role
- [ ] 7.6.3 Add form to change password (old password + new password + confirm)
- [ ] 7.6.4 Implement password change: Supabase Auth updateUser
- [ ] 7.6.5 Add button "Refazer Tour Guiado"
- [ ] 7.6.6 Implement refazer tour: trigger OnboardingTour component
- [ ] 7.6.7 Style page with Admin Theme

---

### 8.0 Fase 8: Migração Manual de Sessões (Semana 9)

#### 8.1 Preparação para Migração Manual
- [ ] 8.1.1 Create documentation: "Guia de Migração de Sessões" (PDF or Markdown)
- [ ] 8.1.2 Document: Como usar o Modal Nova Sessão
- [ ] 8.1.3 Document: Campos obrigatórios e opcionais
- [ ] 8.1.4 Document: Como escolher protocolos (tags)
- [ ] 8.1.5 Create template spreadsheet for equipe to organize sessões before inputting
- [ ] 8.1.6 Schedule training session with equipe (30 min)

#### 8.2 Suporte durante Migração
- [ ] 8.2.1 Day 1: Monitor usage, answer questions in real-time (Slack/WhatsApp)
- [ ] 8.2.2 Day 2-3: Check progress (how many sessões registered)
- [ ] 8.2.3 Day 4-5: Spot check data quality (verify random sessões are correct)
- [ ] 8.2.4 Day 6-7: Final push to complete remaining sessões
- [ ] 8.2.5 Day 8: Validation (see 8.3)

#### 8.3 Validação de Dados Inseridos
- [ ] 8.3.1 Query total sessões: `SELECT COUNT(*) FROM sessoes`
- [ ] 8.3.2 Compare with expected count from Airtable
- [ ] 8.3.3 Check for outliers: Contador Final < Contador Inicial (should be 0)
- [ ] 8.3.4 Check for missing dates: Data Sessão IS NULL (should be 0)
- [ ] 8.3.5 Verify pacientes.sessoes_utilizadas updated correctly (compare COUNT(*) vs field)
- [ ] 8.3.6 Verify sessoes_disponiveis calculated correctly
- [ ] 8.3.7 Spot check 20 random pacientes (compare manual data vs system)
- [ ] 8.3.8 Generate validation report

#### 8.4 Correções e Ajustes
- [ ] 8.4.1 If errors found, identify root cause (user error or system bug)
- [ ] 8.4.2 Fix system bugs if any
- [ ] 8.4.3 Correct data errors (Admin can edit/delete sessões)
- [ ] 8.4.4 Re-run validation (8.3) until 100% correct

#### 8.5 Gamificação (Opcional)
- [ ] 8.5.1 Create leaderboard: "Quem registrou mais sessões hoje?"
- [ ] 8.5.2 Send daily updates: "X sessões registradas hoje, Y restantes"
- [ ] 8.5.3 Celebrate milestones: "50% concluído! 🎉"
- [ ] 8.5.4 Final celebration when 100% complete

---

### 9.0 Fase 9: Testes e Deploy (Semana 10)

#### 9.1 Testes Unitários
- [ ] 9.1.1 Install Jest: `npm install -D jest @testing-library/react @testing-library/jest-dom`
- [ ] 9.1.2 Configure Jest: `jest.config.js`
- [ ] 9.1.3 Create `__tests__/utils/cpf.test.ts`
- [ ] 9.1.4 Test `validar_cpf()`: valid CPF, invalid CPF, formatted, unformatted
- [ ] 9.1.5 Test `formatar_cpf()`: with/without mask
- [ ] 9.1.6 Create `__tests__/utils/calculos.test.ts`
- [ ] 9.1.7 Test `calcular_imc()`: various weights/heights
- [ ] 9.1.8 Test `calcular_score_ronco()`: edge cases (all zero, all high, etc)
- [ ] 9.1.9 Test `calcular_adesao()`: 0%, 50%, 100%, >100%
- [ ] 9.1.10 Run tests: `npm test`
- [ ] 9.1.11 Verify coverage: `npm test -- --coverage` (target: 80%)

#### 9.2 Testes de Integração (Playwright)
- [ ] 9.2.1 Install Playwright: `npm install -D @playwright/test`
- [ ] 9.2.2 Configure Playwright: `playwright.config.ts`
- [ ] 9.2.3 Create `__tests__/integration/auth.test.ts`
- [ ] 9.2.4 Test login flow: valid credentials → dashboard
- [ ] 9.2.5 Test login flow: invalid credentials → error message
- [ ] 9.2.6 Test logout flow: click logout → redirect to login
- [ ] 9.2.7 Create `__tests__/integration/pacientes.test.ts`
- [ ] 9.2.8 Test create paciente: fill form → submit → verify in list
- [ ] 9.2.9 Test CPF validation: invalid CPF → error message
- [ ] 9.2.10 Test duplicate CPF: create paciente with existing CPF → error
- [ ] 9.2.11 Test create sessão: open modal → fill → submit → verify count updated
- [ ] 9.2.12 Test status change: Lead → Ativo (after first sessão)
- [ ] 9.2.13 Test busca global: search by CPF/nome → verify results
- [ ] 9.2.14 Run tests: `npx playwright test`

#### 9.3 Testes E2E (Fluxo Completo)
- [ ] 9.3.1 Create `__tests__/e2e/complete-flow.spec.ts`
- [ ] 9.3.2 Test complete flow: Login → Create Lead → Sync Exam (mock) → Exam appears → Create Sessão → Status changes to Ativo → Add more sessões → Mark as Finalizado → Verify próxima_manutencao
- [ ] 9.3.3 Run E2E test: `npx playwright test e2e`
- [ ] 9.3.4 Fix any issues found

#### 9.4 Testes de Permissões (RLS)
- [ ] 9.4.1 Create 3 test users in staging: admin@test.com, equipe@test.com, recepcao@test.com
- [ ] 9.4.2 Test Admin: Login → verify can access /usuarios, /logs
- [ ] 9.4.3 Test Equipe: Login → verify cannot access /usuarios, /logs (redirect or 403)
- [ ] 9.4.4 Test Recepcao: Login → verify dashboard shows "--" for numeric values
- [ ] 9.4.5 Test Recepcao: Verify cannot create paciente (button hidden)
- [ ] 9.4.6 Test Equipe: Create sessão → try to edit another user's sessão (should fail)
- [ ] 9.4.7 Test Admin: Can edit any sessão (should succeed)
- [ ] 9.4.8 Document any permission issues found

#### 9.5 Testes de Usabilidade
- [ ] 9.5.1 Recruit 2 dentistas (Equipe role)
- [ ] 9.5.2 Recruit 1 recepcionista (Recepcao role)
- [ ] 9.5.3 Schedule 30-min sessions with each user
- [ ] 9.5.4 Ask them to complete tasks: Create paciente, register sessão, view dashboard, search patient
- [ ] 9.5.5 Observe and take notes (where they struggle, questions they ask)
- [ ] 9.5.6 Collect feedback form (satisfaction, ease of use, suggestions)
- [ ] 9.5.7 Compile feedback report
- [ ] 9.5.8 Prioritize bugs/improvements from feedback

#### 9.6 Correções de Bugs
- [ ] 9.6.1 Review all bugs found in tests (9.1-9.5)
- [ ] 9.6.2 Create task list of bugs (prioritize: critical, high, medium, low)
- [ ] 9.6.3 Fix critical bugs (blockers for production)
- [ ] 9.6.4 Fix high priority bugs (major issues)
- [ ] 9.6.5 Document medium/low bugs for post-launch fixes
- [ ] 9.6.6 Re-run all tests after fixes

#### 9.7 Deploy em Staging
- [ ] 9.7.1 Create Vercel account and link repository
- [ ] 9.7.2 Configure environment variables in Vercel (staging Supabase)
- [ ] 9.7.3 Deploy to staging: `vercel --env=staging`
- [ ] 9.7.4 Verify deployment: visit URL, test basic flows
- [ ] 9.7.5 Run smoke tests in staging environment
- [ ] 9.7.6 Share staging URL with stakeholders for final approval

#### 9.8 Deploy em Produção
- [ ] 9.8.1 Get stakeholder approval to deploy
- [ ] 9.8.2 Configure environment variables in Vercel (production Supabase)
- [ ] 9.8.3 Deploy to production: `vercel --prod`
- [ ] 9.8.4 Verify deployment: visit production URL
- [ ] 9.8.5 Test critical flows: Login, Create paciente, Create sessão, View dashboard
- [ ] 9.8.6 Verify sync-biologix cron job is running (check logs next day at 10h)
- [ ] 9.8.7 Monitor for errors in first 24 hours (Vercel logs, Supabase logs)

#### 9.9 Documentação de Uso
- [ ] 9.9.1 Create "Guia do Administrador" (PDF or Markdown)
- [ ] 9.9.2 Document: Como criar usuários, como gerenciar tags, como visualizar logs
- [ ] 9.9.3 Create "Guia da Equipe (Dentistas)"
- [ ] 9.9.4 Document: Como criar pacientes, como registrar sessões, como visualizar evolução
- [ ] 9.9.5 Create "Guia da Recepção"
- [ ] 9.9.6 Document: Como buscar pacientes, como visualizar ações pendentes, como identificar pacientes prioritários
- [ ] 9.9.7 Create "FAQ" (perguntas frequentes)
- [ ] 9.9.8 Share documentation with all users (Google Drive or Notion)

#### 9.10 Treinamento Final
- [ ] 9.10.1 Schedule 1-hour training session with all users
- [ ] 9.10.2 Demo: Walk through all main features
- [ ] 9.10.3 Q&A session: Answer questions
- [ ] 9.10.4 Share documentation and support contact (Slack/WhatsApp)
- [ ] 9.10.5 Schedule follow-up session in 1 week to address issues

#### 9.11 Monitoramento Pós-Deploy
- [ ] 9.11.1 Day 1: Monitor usage intensively (errors, performance, user feedback)
- [ ] 9.11.2 Week 1: Daily check-ins with users, quick fixes for urgent issues
- [ ] 9.11.3 Week 2: Review analytics (usage patterns, most used features)
- [ ] 9.11.4 Week 3: Collect feedback for future improvements
- [ ] 9.11.5 Week 4: Create roadmap for Phase 2 (Alertas + IA)

#### 9.12 Handoff e Celebração
- [ ] 9.12.1 Schedule handoff meeting with stakeholders
- [ ] 9.12.2 Present final metrics: # pacientes, # exames, # sessões, user adoption rate
- [ ] 9.12.3 Review success criteria (100% sync, data migration, user adoption)
- [ ] 9.12.4 Discuss next steps (Phase 2 PRD)
- [ ] 9.12.5 Celebrate launch! 🎉

---

## Completion Checklist

After finishing all tasks, verify:

- [ ] All migrations applied and working in production
- [ ] All 175 pacientes migrated correctly
- [ ] All 479 exames synced and linked
- [ ] Sync-biologix cron runs daily at 10h without errors
- [ ] All 3 user roles can login and access appropriate features
- [ ] Tour guiado works for all roles
- [ ] Dashboard displays correct KPIs
- [ ] Busca global works with CPF/nome/telefone
- [ ] Pacientes CRUD working (create, edit, delete)
- [ ] Sessões CRUD working (create, edit, delete, history)
- [ ] Tags working (create, assign, filter)
- [ ] Gráficos de evolução rendering correctly
- [ ] RLS policies preventing unauthorized access
- [ ] Audit logs capturing all changes
- [ ] Tests passing (unit, integration, E2E)
- [ ] Documentation complete and shared
- [ ] Users trained and using system daily
- [ ] No critical bugs in production
- [ ] Vercel deployment stable
- [ ] Supabase database healthy

---

**END OF TASKS**

