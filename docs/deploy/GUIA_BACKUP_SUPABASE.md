# 💾 Guia: Como Criar Backup do Banco Supabase

## 10.1.4 - Criar backup completo do banco de dados Supabase

**Data:** 2025-12-02  
**Status:** ✅ Guia criado

---

## 📋 Métodos de Backup

### Método 1: Via Supabase Dashboard (Recomendado)

**Para Backup Completo (Schema + Dados):**

1. Acesse Supabase Dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Database** → **Backups**
4. Clique em **"Create Backup"** ou **"Download Backup"**
5. Escolha tipo:
   - **Full Backup**: Schema + dados
   - **Schema Only**: Apenas estrutura
   - **Data Only**: Apenas dados

**Vantagens:**
- ✅ Mais fácil
- ✅ Interface gráfica
- ✅ Backups automáticos disponíveis

---

### Método 2: Via pg_dump (CLI)

**Requisitos:**
- PostgreSQL client instalado (`psql`, `pg_dump`)
- Connection string do Supabase

**Passo a passo:**

1. **Obter connection string:**
   - Supabase Dashboard → Settings → Database
   - Copie "Connection String" (modo Transaction)

2. **Exportar schema completo:**
```bash
pg_dump "[connection-string]" \
  --schema-only \
  --no-owner \
  --no-acl \
  > backup-schema-$(date +%Y%m%d).sql
```

3. **Exportar dados:**
```bash
pg_dump "[connection-string]" \
  --data-only \
  --no-owner \
  --no-acl \
  > backup-data-$(date +%Y%m%d).sql
```

4. **Exportar tudo (schema + dados):**
```bash
pg_dump "[connection-string]" \
  --no-owner \
  --no-acl \
  > backup-full-$(date +%Y%m%d).sql
```

---

### Método 3: Via Supabase CLI

**Passo a passo:**

1. **Link ao projeto:**
```bash
npx supabase link --project-ref [project-id]
```

2. **Criar backup:**
```bash
npx supabase db dump -f backup-$(date +%Y%m%d).sql
```

---

## 🎯 Backup antes do Deploy

### Backup de Staging

**Quando fazer:**
- Antes do primeiro deploy em staging
- Antes de aplicar migrations em staging
- Antes de mudanças significativas

**O que incluir:**
- ✅ Schema completo (tabelas, funções, triggers)
- ✅ Dados de usuários
- ✅ Dados de pacientes (se houver)
- ✅ Configurações (tags, etc)

---

### Backup de Produção

**Quando fazer:**
- **OBRIGATÓRIO:** Antes do deploy em produção
- Antes de aplicar migrations em produção
- Antes de mudanças significativas
- Regularmente (semanal ou mensal)

**O que incluir:**
- ✅ Schema completo
- ✅ Todos os dados (pacientes, exames, sessões)
- ✅ Usuários e configurações
- ✅ Edge Functions (código)

---

## 📦 Checklist de Backup

### Antes do Deploy em Staging

- [ ] Backup do banco staging criado
- [ ] Backup salvo em local seguro
- [ ] Backup testado (pode restaurar se necessário)
- [ ] Data do backup documentada

### Antes do Deploy em Produção

- [ ] Backup completo do banco produção criado
- [ ] Backup salvo em local seguro (múltiplas cópias)
- [ ] Backup testado (pode restaurar se necessário)
- [ ] Data/hora do backup documentada
- [ ] Edge Functions backup (código fonte)
- [ ] Variáveis de ambiente documentadas

---

## 🔄 Como Restaurar um Backup

### Via Supabase Dashboard

1. Acesse Supabase Dashboard
2. Vá em **Settings** → **Database** → **Backups**
3. Selecione o backup desejado
4. Clique em **"Restore"**
5. Confirme a restauração

**⚠️ ATENÇÃO:** Restaurar substitui todos os dados atuais!

---

### Via SQL (pg_restore)

```bash
psql "[connection-string]" < backup-full-YYYYMMDD.sql
```

**⚠️ ATENÇÃO:** Isso substituirá todos os dados!

---

## 📁 Estrutura Recomendada de Backups

```
backups/
├── staging/
│   ├── 2025-12-02-before-deploy.sql
│   └── 2025-12-02-schema-only.sql
├── production/
│   ├── 2025-12-02-before-production-deploy.sql
│   └── weekly/
│       └── 2025-12-02-weekly-backup.sql
└── README.md
```

---

## ⏰ Frequência Recomendada

- **Staging:** Antes de cada deploy significativo
- **Produção:** 
  - Diário (automático via Supabase)
  - Manual antes de cada deploy
  - Semanal (backup completo)
  - Mensal (backup arquivado)

---

## 🔐 Segurança dos Backups

- ✅ Armazenar backups em local seguro
- ✅ Não commitar backups no Git
- ✅ Criptografar backups sensíveis
- ✅ Ter múltiplas cópias (local + cloud)
- ✅ Testar restauração periodicamente

---

## 📝 Script de Backup Automatizado

**Criar script:** `scripts/backup-database.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import * as util from 'util';

const execPromise = util.promisify(exec);

async function backupDatabase() {
  const connectionString = process.env.DATABASE_URL;
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `backup-${timestamp}.sql`;
  const backupDir = path.join(process.cwd(), 'backups');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const filepath = path.join(backupDir, filename);
  
  console.log('Creating backup...');
  
  try {
    await execPromise(
      `pg_dump "${connectionString}" --no-owner --no-acl > "${filepath}"`
    );
    
    console.log(`✅ Backup created: ${filepath}`);
  } catch (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }
}

backupDatabase();
```

---

## ✅ Conclusão

**Antes do deploy em produção:**
1. ✅ Criar backup completo do banco
2. ✅ Salvar backup em local seguro
3. ✅ Documentar data/hora do backup
4. ✅ Testar capacidade de restaurar

**Recomendação:** Sempre fazer backup antes de qualquer mudança em produção!

---

**Guia criado em:** 2025-12-02

