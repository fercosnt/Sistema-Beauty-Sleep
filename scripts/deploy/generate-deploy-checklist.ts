#!/usr/bin/env tsx
/**
 * Script para gerar checklist de deploy baseado no estado atual do projeto
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

console.log('📋 Gerando checklist de deploy...\n')

const checklist: string[] = []

// Verificar branch atual
try {
  const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim()
  checklist.push(`- [ ] Verificar branch atual: ${branch}`)
  if (branch !== 'main') {
    checklist.push(`  ⚠️  Recomendado: fazer merge para main antes de deploy`)
  }
} catch {
  checklist.push(`- [ ] Verificar branch atual`)
}

// Verificar mudanças não commitadas
try {
  const status = execSync('git status --porcelain', { encoding: 'utf-8' })
  if (status.trim()) {
    checklist.push(`- [ ] ⚠️  Há mudanças não commitadas - fazer commit ou stash`)
  } else {
    checklist.push(`- [x] Nenhuma mudança pendente`)
  }
} catch {
  checklist.push(`- [ ] Verificar mudanças não commitadas`)
}

// Verificar build
checklist.push(`- [ ] Executar build: npm run build`)
checklist.push(`- [ ] Verificar que build foi bem-sucedido`)

// Verificar testes
checklist.push(`- [ ] Executar testes: npm test`)
checklist.push(`- [ ] Verificar que todos os testes passaram`)

// Verificar variáveis de ambiente
const envLocalPath = join(process.cwd(), '.env.local')
if (existsSync(envLocalPath)) {
  checklist.push(`- [x] .env.local encontrado`)
} else {
  checklist.push(`- [ ] ⚠️  .env.local não encontrado - configurar no Vercel Dashboard`)
}

checklist.push(`- [ ] Configurar variáveis de ambiente no Vercel:`)
checklist.push(`  - [ ] NEXT_PUBLIC_SUPABASE_URL`)
checklist.push(`  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY`)
checklist.push(`  - [ ] SUPABASE_SERVICE_ROLE_KEY`)
checklist.push(`  - [ ] NEXT_PUBLIC_SITE_URL`)

// Verificar Supabase Auth
checklist.push(`- [ ] Configurar Supabase Auth no Dashboard:`)
checklist.push(`  - [ ] Site URL: https://[production-domain].com`)
checklist.push(`  - [ ] Redirect URLs:`)
checklist.push(`    - [ ] https://[production-domain].com/auth/callback`)
checklist.push(`    - [ ] https://[production-domain].com/dashboard`)

// Backup
checklist.push(`- [ ] Criar backup do banco de dados no Supabase Dashboard`)

// Deploy
checklist.push(`- [ ] Fazer deploy: vercel --prod`)
checklist.push(`- [ ] Verificar deployment no Vercel Dashboard`)

// Verificações pós-deploy
checklist.push(`- [ ] Verificar URL de produção`)
checklist.push(`- [ ] Testar fluxos críticos:`)
checklist.push(`  - [ ] Login`)
checklist.push(`  - [ ] Criar Paciente`)
checklist.push(`  - [ ] Criar Sessão`)
checklist.push(`  - [ ] Dashboard`)
checklist.push(`- [ ] Verificar logs do Vercel (sem erros críticos)`)
checklist.push(`- [ ] Verificar logs do Supabase (sem erros críticos)`)
checklist.push(`- [ ] Verificar cron job sync-biologix (no dia seguinte às 10h)`)

// Monitoramento
checklist.push(`- [ ] Monitorar erros nas primeiras 24 horas`)
checklist.push(`- [ ] Documentar problemas encontrados`)

// Gerar arquivo
const output = `# Checklist de Deploy em Produção

**Gerado em:** ${new Date().toLocaleString('pt-BR')}

## Pré-Deploy

${checklist.join('\n')}

## Pós-Deploy

- [ ] Dia 1: Monitoramento intensivo
- [ ] Semana 1: Check-ins diários
- [ ] Semana 2: Revisão de analytics
- [ ] Semana 3: Coletar feedback
- [ ] Semana 4: Criar roadmap Fase 2

## Handoff

- [ ] Agendar reunião de handoff
- [ ] Preparar apresentação de métricas
- [ ] Revisar critérios de sucesso
- [ ] Discutir próximos passos (Fase 2)
- [ ] Celebrar lançamento! 🎉

---

**Guia completo:** docs/deploy/GUIA_DEPLOY_PRODUCAO.md
`

const outputPath = join(process.cwd(), 'DEPLOY_CHECKLIST.md')
require('fs').writeFileSync(outputPath, output, 'utf-8')

console.log('✅ Checklist gerado: DEPLOY_CHECKLIST.md')
console.log('\n📝 Próximos passos:')
console.log('1. Revisar checklist gerado')
console.log('2. Seguir os passos em ordem')
console.log('3. Marcar itens conforme completados')
console.log('\n💡 Dica: Use "npm run deploy:check" para verificar prontidão')


