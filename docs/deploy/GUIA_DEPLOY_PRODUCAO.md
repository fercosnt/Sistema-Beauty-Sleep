# 🚀 Guia: Deploy em Produção

## 10.3 - Deploy em Produção

**Data:** 2025-01-27  
**Status:** 📋 Guia criado - Pronto para execução

---

## ⚠️ IMPORTANTE: Antes de Começar

**NUNCA faça deploy em produção sem:**
- ✅ Aprovação explícita dos stakeholders
- ✅ Backup completo do banco de dados
- ✅ Testes completos em staging
- ✅ Todas as configurações verificadas

---

## 📋 Checklist de Deploy em Produção

### 10.3.1 - Obter aprovação dos stakeholders

**Ação necessária:**
- [ ] Enviar email/solicitação formal para stakeholders
- [ ] Incluir resumo do que será deployado
- [ ] Incluir URL de staging para revisão
- [ ] Aguardar aprovação explícita por escrito
- [ ] Documentar aprovação recebida

**Template de solicitação:**
```
Assunto: Solicitação de Aprovação - Deploy em Produção - Beauty Sleep System

Prezados,

Solicito aprovação para fazer deploy do Beauty Sleep System em produção.

Resumo:
- Sistema completo de gestão de pacientes
- Dashboard com KPIs e gráficos
- Sincronização automática com Biologix
- Gestão de sessões e exames
- 3 níveis de acesso (Admin, Equipe, Recepção)

Staging URL: [URL do staging]
Data proposta: [DATA]

Aguardando aprovação.

Atenciosamente,
[SEU NOME]
```

**Status:** ⏳ Ação manual necessária

---

### 10.3.2 - Criar backup final do banco de dados

**Passo a passo:**

1. **Acesse Supabase Dashboard:**
   - Vá para https://supabase.com/dashboard
   - Selecione projeto de produção: `qigbblypwkgflwnrrhzg`

2. **Criar snapshot:**
   - Vá em **Database** → **Backups**
   - Clique em **"Create Backup"**
   - Nome: `backup-pre-deploy-[DATA]`
   - Descrição: "Backup antes do deploy em produção"

3. **Ou via SQL (backup manual):**
   ```sql
   -- Exportar dados críticos
   COPY pacientes TO '/tmp/pacientes_backup.csv' CSV HEADER;
   COPY exames TO '/tmp/exames_backup.csv' CSV HEADER;
   COPY sessoes TO '/tmp/sessoes_backup.csv' CSV HEADER;
   COPY users TO '/tmp/users_backup.csv' CSV HEADER;
   ```

4. **Verificar backup:**
   - [ ] Backup criado com sucesso
   - [ ] Tamanho do backup verificado
   - [ ] Data/hora do backup documentada

**Status:** ⏳ Ação manual necessária

**Guia completo:** Ver `docs/deploy/GUIA_BACKUP_SUPABASE.md`

---

### 10.3.3 - Configurar variáveis de ambiente no Vercel (produção)

**Passo a passo:**

1. **Acesse Vercel Dashboard:**
   - Vá para o projeto
   - Settings → Environment Variables

2. **Adicionar variáveis para ambiente "Production":**

```
NEXT_PUBLIC_SUPABASE_URL=https://qigbblypwkgflwnrrhzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[production-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[production-service-role-key]
NEXT_PUBLIC_SITE_URL=https://[production-domain].com
```

**Como obter valores:**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Dashboard → Settings → API → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Dashboard → Settings → API → anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard → Settings → API → service_role key (secreto)

**⚠️ IMPORTANTE:**
- Marque como "Production" environment
- `SUPABASE_SERVICE_ROLE_KEY` deve ser marcado como "Sensitive"
- Verifique que os valores são do projeto de **produção** (não staging)

**Verificação:**
- [ ] Todas as variáveis configuradas
- [ ] Valores corretos (produção)
- [ ] Ambiente marcado como "Production"

**Status:** ⏳ Ação manual necessária

**Guia completo:** Ver `docs/deploy/CONFIGURACOES_AMBIENTE.md`

---

### 10.3.4 - Configurar Supabase Auth para produção

**Passo a passo:**

1. **Acesse Supabase Dashboard (projeto produção):**
   - Authentication → URL Configuration

2. **Configurar URLs:**

```
Site URL: https://[production-domain].com

Redirect URLs (adicionar todas):
  - https://[production-domain].com/auth/callback
  - https://[production-domain].com/dashboard
  - https://[production-domain].com/*
```

**Se usar domínio customizado:**
```
Site URL: https://beautysleep.com.br

Redirect URLs:
  - https://beautysleep.com.br/auth/callback
  - https://beautysleep.com.br/dashboard
  - https://beautysleep.com.br/*
```

**Verificação:**
- [ ] Site URL configurado
- [ ] Redirect URLs adicionadas
- [ ] URLs testadas (sem erros)

**Status:** ⏳ Ação manual necessária

**Guia completo:** Ver `GUIA_CONFIGURACAO_SUPABASE_AUTH.md`

---

### 10.3.5 - Deploy para produção

**Opção 1: Via Vercel Dashboard (Recomendado)**

1. Acesse Vercel Dashboard
2. Vá para o projeto
3. Clique em **"Deployments"**
4. Clique em **"..."** no último deployment de staging
5. Selecione **"Promote to Production"**

**Opção 2: Via CLI**

```bash
# Instalar Vercel CLI (se ainda não instalado)
npm install -g vercel

# Login (se ainda não logado)
vercel login

# Link projeto (se ainda não linkado)
vercel link

# Deploy para produção
vercel --prod
```

**Opção 3: Via Git Push (se configurado)**

```bash
# Fazer merge para branch main
git checkout main
git merge staging
git push origin main

# Vercel fará deploy automaticamente se configurado
```

**Verificação:**
- [ ] Deploy iniciado
- [ ] Build bem-sucedido (sem erros)
- [ ] Deployment concluído
- [ ] URL de produção acessível

**Status:** ⏳ Ação manual necessária

---

### 10.3.6 - Verificar deployment

**Checklist de verificação:**

**Básico:**
- [ ] Visitar URL produção: https://[production-domain].com
- [ ] Página carrega sem erros
- [ ] Não há erros no console do navegador
- [ ] Verificar logs no Vercel Dashboard (sem erros críticos)

**Funcionalidades:**
- [ ] Homepage redireciona para /login
- [ ] Página de login aparece corretamente
- [ ] Estilos carregam (CSS/Tailwind)
- [ ] Imagens carregam

**Performance:**
- [ ] Tempo de carregamento < 3s
- [ ] Lighthouse score > 80
- [ ] Sem erros de rede

**Status:** ⏳ Ação manual necessária

---

### 10.3.7 - Testar fluxos críticos

**Fluxos a testar:**

1. **Login → Dashboard:**
   - [ ] Login funciona com credenciais válidas
   - [ ] Erro exibido para credenciais inválidas
   - [ ] Redireciona para /dashboard após login
   - [ ] Dashboard carrega corretamente
   - [ ] KPIs aparecem (ou "--" para recepção)

2. **Criar Paciente:**
   - [ ] Botão "Novo Paciente" visível (Admin/Equipe)
   - [ ] Modal abre corretamente
   - [ ] Formulário funciona
   - [ ] Validações funcionam (CPF, ID Paciente)
   - [ ] Paciente criado com sucesso
   - [ ] Aparece na lista imediatamente

3. **Criar Sessão:**
   - [ ] Acessar perfil do paciente
   - [ ] Botão "Nova Sessão" funciona
   - [ ] Modal abre corretamente
   - [ ] Formulário funciona
   - [ ] Validações funcionam (contadores)
   - [ ] Sessão criada com sucesso
   - [ ] Status muda para "ativo" (se era "lead")
   - [ ] Contador de sessões atualiza

4. **Visualizar Dashboard:**
   - [ ] KPIs corretos
   - [ ] Gráficos renderizam
   - [ ] Ações pendentes aparecem
   - [ ] Navegação funciona

5. **Busca Global:**
   - [ ] Busca por CPF funciona
   - [ ] Busca por nome funciona
   - [ ] Busca por telefone funciona
   - [ ] Resultados aparecem corretamente

**Status:** ⏳ Ação manual necessária

---

### 10.3.8 - Verificar sync-biologix cron job

**Passo a passo:**

1. **Verificar configuração do cron:**
   ```sql
   SELECT * FROM cron.job WHERE jobname = 'sync-biologix-daily';
   ```

2. **Verificar última execução:**
   - Acesse Supabase Dashboard → Edge Functions → sync-biologix
   - Vá em "Logs"
   - Verifique última execução (deve ser às 10h BRT / 13h UTC)

3. **Testar manualmente:**
   - Acesse Supabase Dashboard → Edge Functions → sync-biologix
   - Clique em "Invoke function"
   - Verifique logs (deve retornar 200 OK)

4. **Aguardar próxima execução automática:**
   - [ ] Verificar logs no dia seguinte às 10h BRT
   - [ ] Confirmar que executou sem erros
   - [ ] Verificar que novos exames foram sincronizados

**Verificação:**
- [ ] Cron job configurado corretamente
- [ ] Última execução bem-sucedida
- [ ] Teste manual funcionou
- [ ] Próxima execução automática agendada

**Status:** ⏳ Ação manual necessária (verificação no dia seguinte)

**Guia completo:** Ver `docs/deploy/EXECUTAR_SINCRONIZACAO_MANUAL.md`

---

### 10.3.9 - Testar proteção de rotas e controle de acesso

**Testes por role:**

1. **Admin:**
   - [ ] Pode acessar /dashboard
   - [ ] Pode acessar /pacientes
   - [ ] Pode acessar /usuarios
   - [ ] Pode acessar /logs
   - [ ] Pode criar/editar/deletar pacientes
   - [ ] Pode criar/editar/deletar sessões
   - [ ] Pode criar/editar/deletar usuários

2. **Equipe:**
   - [ ] Pode acessar /dashboard
   - [ ] Pode acessar /pacientes
   - [ ] NÃO pode acessar /usuarios (redireciona)
   - [ ] NÃO pode acessar /logs (redireciona)
   - [ ] Pode criar/editar pacientes
   - [ ] Pode criar sessões
   - [ ] Pode editar apenas próprias sessões
   - [ ] NÃO pode deletar pacientes/sessões

3. **Recepção:**
   - [ ] Pode acessar /dashboard
   - [ ] Pode acessar /pacientes
   - [ ] NÃO pode acessar /usuarios (redireciona)
   - [ ] NÃO pode acessar /logs (redireciona)
   - [ ] Dashboard mostra "--" para valores numéricos
   - [ ] NÃO pode criar pacientes (botão oculto)
   - [ ] NÃO pode criar/editar sessões
   - [ ] Pode apenas visualizar dados

**Status:** ⏳ Ação manual necessária

---

### 10.3.10 - Monitorar erros nas primeiras 24 horas

**Checklist de monitoramento:**

**Vercel Logs:**
- [ ] Acessar Vercel Dashboard → Deployments → [último deployment]
- [ ] Verificar "Functions" logs (sem erros críticos)
- [ ] Verificar "Build" logs (sem warnings críticos)
- [ ] Configurar alertas (se disponível)

**Supabase Logs:**
- [ ] Acessar Supabase Dashboard → Logs
- [ ] Verificar "API" logs (sem erros 500)
- [ ] Verificar "Auth" logs (sem erros de autenticação)
- [ ] Verificar "Edge Functions" logs (sync-biologix)

**Métricas:**
- [ ] Tempo de resposta < 2s (p95)
- [ ] Taxa de erro < 1%
- [ ] Uptime > 99%

**Ações:**
- [ ] Documentar qualquer erro encontrado
- [ ] Priorizar correções (crítico → alto → médio)
- [ ] Corrigir erros críticos imediatamente
- [ ] Agendar correções de erros não-críticos

**Status:** ⏳ Ação manual necessária (monitoramento contínuo)

**Guia completo:** Ver `docs/deploy/GUIA_MONITORAMENTO.md`

---

## 📋 Resumo do Processo

1. ⏳ Obter aprovação dos stakeholders
2. ⏳ Criar backup do banco de dados
3. ⏳ Configurar variáveis de ambiente no Vercel
4. ⏳ Configurar Supabase Auth URLs
5. ⏳ Fazer deploy para produção
6. ⏳ Verificar deployment
7. ⏳ Testar fluxos críticos
8. ⏳ Verificar cron job (no dia seguinte)
9. ⏳ Testar proteção de rotas
10. ⏳ Monitorar erros (24 horas)

---

## ⚠️ Pontos de Atenção

- ✅ Usar projeto Supabase **produção** (não staging)
- ✅ Variáveis de ambiente corretas para produção
- ✅ URLs de redirect configuradas corretamente
- ✅ Edge Function secrets configurados no Supabase produção
- ✅ Backup criado antes do deploy
- ✅ Testar todos os fluxos antes de considerar completo
- ✅ Monitorar ativamente nas primeiras 24 horas

---

## 📝 Notas

- Sempre fazer deploy em staging primeiro
- Aguardar aprovação antes de produção
- Criar backup antes de qualquer mudança
- Monitorar logs ativamente nas primeiras horas
- Documentar qualquer problema encontrado

---

**Guia criado em:** 2025-01-27  
**Próximo passo:** Seguir o checklist acima para fazer deploy em produção

