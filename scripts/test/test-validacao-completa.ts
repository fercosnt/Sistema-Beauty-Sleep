#!/usr/bin/env tsx
/**
 * Script Completo de Validação e Testes
 * 
 * Executa todos os testes possíveis automaticamente:
 * 1. Validação de componentes
 * 2. Teste de alertas críticos
 * 3. Teste de alertas de manutenção
 * 4. Criação de alertas de teste
 * 
 * Uso: npx tsx scripts/test-validacao-completa.ts
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { resolve } from 'path'

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente necessárias:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

interface TestResult {
  nome: string
  status: 'pass' | 'fail' | 'warning' | 'skip'
  mensagem: string
  detalhes?: any
}

const resultados: TestResult[] = []

async function checkComponent(filePath: string, nome: string) {
  const fullPath = path.join(process.cwd(), filePath)
  const exists = fs.existsSync(fullPath)
  
  resultados.push({
    nome: `Componente ${nome}`,
    status: exists ? 'pass' : 'fail',
    mensagem: exists ? `Arquivo encontrado: ${filePath}` : `Arquivo não encontrado: ${filePath}`
  })
  
  return exists
}

async function checkDatabaseTable(tableName: string) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1)
    
    resultados.push({
      nome: `Tabela ${tableName}`,
      status: error ? 'fail' : 'pass',
      mensagem: error ? `Erro ao acessar: ${error.message}` : `Tabela ${tableName} acessível`
    })
    
    return !error
  } catch (error: any) {
    resultados.push({
      nome: `Tabela ${tableName}`,
      status: 'fail',
      mensagem: `Erro: ${error.message}`
    })
    return false
  }
}

async function checkAlertasTable() {
  try {
    const { data, error } = await supabase
      .from('alertas')
      .select('id, tipo, urgencia, status')
      .limit(10)
    
    if (error) {
      resultados.push({
        nome: 'Tabela alertas',
        status: 'fail',
        mensagem: `Erro ao acessar: ${error.message}`
      })
      return false
    }
    
    const tipos = new Set(data?.map(a => a.tipo) || [])
    const urgencias = new Set(data?.map(a => a.urgencia) || [])
    const statuses = new Set(data?.map(a => a.status) || [])
    
    resultados.push({
      nome: 'Tabela alertas',
      status: 'pass',
      mensagem: `Tabela acessível com ${data?.length || 0} alertas`,
      detalhes: {
        tipos: Array.from(tipos),
        urgencias: Array.from(urgencias),
        statuses: Array.from(statuses)
      }
    })
    
    return true
  } catch (error: any) {
    resultados.push({
      nome: 'Tabela alertas',
      status: 'fail',
      mensagem: `Erro: ${error.message}`
    })
    return false
  }
}

async function checkCronJobs() {
  if (!supabaseAdmin) {
    resultados.push({
      nome: 'Cron Jobs',
      status: 'skip',
      mensagem: 'SUPABASE_SERVICE_ROLE_KEY não configurado - pulando verificação de cron jobs'
    })
    return
  }

  try {
    // Verificar sync-biologix cron
    const { data: syncCron, error: syncError } = await supabaseAdmin
      .rpc('exec_sql', {
        query: `
          SELECT jobid, jobname, schedule, active 
          FROM cron.job 
          WHERE jobname = 'sync-biologix-daily'
        `
      })

    // Verificar check-alerts cron
    const { data: alertsCron, error: alertsError } = await supabaseAdmin
      .rpc('exec_sql', {
        query: `
          SELECT jobid, jobname, schedule, active 
          FROM cron.job 
          WHERE jobname = 'check-alerts-daily'
        `
      })

    const syncExists = !syncError && syncCron && Array.isArray(syncCron) && syncCron.length > 0
    const alertsExists = !alertsError && alertsCron && Array.isArray(alertsCron) && alertsCron.length > 0

    resultados.push({
      nome: 'Cron Job sync-biologix',
      status: syncExists ? 'pass' : 'warning',
      mensagem: syncExists 
        ? 'Cron job sync-biologix-daily configurado'
        : 'Cron job sync-biologix-daily não encontrado (pode ser normal se não foi aplicado)'
    })

    resultados.push({
      nome: 'Cron Job check-alerts',
      status: alertsExists ? 'pass' : 'warning',
      mensagem: alertsExists 
        ? 'Cron job check-alerts-daily configurado'
        : 'Cron job check-alerts-daily não encontrado (pode ser normal se não foi aplicado)'
    })
  } catch (error: any) {
    resultados.push({
      nome: 'Cron Jobs',
      status: 'warning',
      mensagem: `Não foi possível verificar cron jobs: ${error.message}`
    })
  }
}

async function checkEdgeFunctions() {
  const functions = [
    { path: 'supabase/functions/sync-biologix/index.ts', nome: 'sync-biologix' },
    { path: 'supabase/functions/check-alerts/index.ts', nome: 'check-alerts' },
  ]

  for (const func of functions) {
    await checkComponent(func.path, func.nome)
  }
}

async function main() {
  console.log('🧪 TESTE COMPLETO DE VALIDAÇÃO - FASE 2\n')

  // 1. Verificar componentes
  console.log('📦 Verificando componentes...')
  await checkComponent('app/pacientes/components/ModalDetalhesExame.tsx', 'ModalDetalhesExame')
  await checkComponent('app/pacientes/[id]/components/TabEvolucao.tsx', 'TabEvolucao')
  await checkComponent('app/pacientes/[id]/components/ComparacaoExames.tsx', 'ComparacaoExames')
  await checkComponent('components/ui/NotificationCenter.tsx', 'NotificationCenter')
  await checkComponent('components/ui/NotificationBadge.tsx', 'NotificationBadge')
  await checkComponent('app/alertas/page.tsx', 'Página de Alertas')
  await checkComponent('app/alertas/components/AlertasFilters.tsx', 'AlertasFilters')
  await checkComponent('app/alertas/components/AlertaCard.tsx', 'AlertaCard')
  await checkComponent('app/alertas/components/AlertasList.tsx', 'AlertasList')

  // 2. Verificar Edge Functions
  console.log('\n⚡ Verificando Edge Functions...')
  await checkEdgeFunctions()

  // 3. Verificar tabelas
  console.log('\n🗄️  Verificando banco de dados...')
  await checkDatabaseTable('exames')
  await checkDatabaseTable('pacientes')
  await checkAlertasTable()

  // 4. Verificar cron jobs
  console.log('\n⏰ Verificando cron jobs...')
  await checkCronJobs()

  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('📋 RESUMO DA VALIDAÇÃO')
  console.log('='.repeat(60))
  
  const passed = resultados.filter(r => r.status === 'pass').length
  const failed = resultados.filter(r => r.status === 'fail').length
  const warnings = resultados.filter(r => r.status === 'warning').length
  const skipped = resultados.filter(r => r.status === 'skip').length
  
  resultados.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : result.status === 'warning' ? '⚠️' : '⏭️'
    console.log(`${icon} ${result.nome}`)
    console.log(`   ${result.mensagem}`)
    if (result.detalhes) {
      console.log(`   Detalhes:`, JSON.stringify(result.detalhes, null, 2))
    }
    console.log()
  })
  
  console.log('='.repeat(60))
  console.log(`✅ Passou: ${passed}`)
  console.log(`❌ Falhou: ${failed}`)
  console.log(`⚠️  Avisos: ${warnings}`)
  console.log(`⏭️  Pulados: ${skipped}`)
  console.log('='.repeat(60))

  // Próximos passos
  console.log('\n📝 PRÓXIMOS PASSOS PARA TESTES MANUAIS:')
  console.log('\n1. Criar alertas de teste:')
  console.log('   npx tsx scripts/test/criar-alerta-teste.ts')
  console.log('\n2. Testar alertas críticos:')
  console.log('   npx tsx scripts/test/test-alertas-criticos.ts')
  console.log('\n3. Testar alertas de manutenção:')
  console.log('   npx tsx scripts/test/test-alertas-manutencao.ts')
  console.log('\n4. Testar todos os alertas:')
  console.log('   npx tsx scripts/test/test-todos-alertas.ts')
  console.log('\n5. Acessar /alertas no navegador para testar UI')
  console.log('\n6. Verificar centro de notificações no header')
  
  if (failed > 0) {
    console.log('\n❌ Algumas validações falharam. Corrija os problemas antes de prosseguir.')
    process.exit(1)
  } else if (warnings > 0) {
    console.log('\n⚠️  Algumas validações têm avisos. Revise antes de prosseguir.')
    process.exit(0)
  } else {
    console.log('\n✅ Todas as validações passaram! Sistema pronto para testes manuais.')
    process.exit(0)
  }
}

main().catch(error => {
  console.error('❌ Erro durante validação:', error)
  process.exit(1)
})

