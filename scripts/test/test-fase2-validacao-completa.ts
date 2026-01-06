#!/usr/bin/env tsx
/**
 * Script de Validação Completa - Fase 2
 * 
 * Este script valida todas as funcionalidades implementadas na Fase 2:
 * - Modais de exames (Polissonografia e Ronco)
 * - Gráficos de evolução
 * - Comparações de exames
 * - Dashboard (Ronco e Apneia)
 * - Sistema de alertas
 * - Centro de notificações
 * 
 * Uso: npx tsx scripts/test/test-fase2-validacao-completa.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  config({ path: envPath })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas')
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface ValidationResult {
  category: string
  test: string
  status: 'pass' | 'fail' | 'warning' | 'skip'
  message: string
  details?: any
}

const results: ValidationResult[] = []

async function checkComponentExists(componentPath: string, description: string) {
  const fullPath = path.join(process.cwd(), componentPath)
  const exists = fs.existsSync(fullPath)
  
  results.push({
    category: 'Componentes',
    test: description,
    status: exists ? 'pass' : 'fail',
    message: exists ? `✅ ${description} existe` : `❌ ${description} não encontrado`,
    details: { path: componentPath }
  })
  
  return exists
}

async function checkDatabaseTable(tableName: string, description: string) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1)
    
    const exists = !error && data !== null
    
    results.push({
      category: 'Banco de Dados',
      test: description,
      status: exists ? 'pass' : 'fail',
      message: exists ? `✅ Tabela ${tableName} existe e é acessível` : `❌ Erro ao acessar ${tableName}: ${error?.message}`,
      details: { table: tableName, error: error?.message }
    })
    
    return exists
  } catch (error: any) {
    results.push({
      category: 'Banco de Dados',
      test: description,
      status: 'fail',
      message: `❌ Erro ao verificar ${tableName}: ${error.message}`,
      details: { table: tableName, error: error.message }
    })
    return false
  }
}

async function checkMigrationExists(migrationNumber: string, description: string) {
  const migrationPath = path.join(process.cwd(), `supabase/migrations/${migrationNumber}_*.sql`)
  const files = fs.readdirSync(path.join(process.cwd(), 'supabase/migrations'))
  const exists = files.some(f => f.startsWith(migrationNumber))
  
  results.push({
    category: 'Migrations',
    test: description,
    status: exists ? 'pass' : 'fail',
    message: exists ? `✅ Migration ${migrationNumber} existe` : `❌ Migration ${migrationNumber} não encontrada`,
    details: { migration: migrationNumber }
  })
  
  return exists
}

async function checkEdgeFunction(functionName: string, description: string) {
  const functionPath = path.join(process.cwd(), `supabase/functions/${functionName}/index.ts`)
  const exists = fs.existsSync(functionPath)
  
  results.push({
    category: 'Edge Functions',
    test: description,
    status: exists ? 'pass' : 'fail',
    message: exists ? `✅ Edge Function ${functionName} existe` : `❌ Edge Function ${functionName} não encontrada`,
    details: { function: functionName }
  })
  
  return exists
}

async function checkExamsData() {
  try {
    const { data: exames, error } = await supabase
      .from('exames')
      .select('id, tipo, paciente_id')
      .limit(10)
    
    if (error) {
      results.push({
        category: 'Dados',
        test: 'Verificar exames no banco',
        status: 'fail',
        message: `❌ Erro ao buscar exames: ${error.message}`,
        details: { error: error.message }
      })
      return { polissonografia: 0, ronco: 0 }
    }
    
    const polissonografia = exames?.filter(e => e.tipo === 1).length || 0
    const ronco = exames?.filter(e => e.tipo === 2).length || 0
    
    results.push({
      category: 'Dados',
      test: 'Verificar exames no banco',
      status: exames && exames.length > 0 ? 'pass' : 'warning',
      message: exames && exames.length > 0 
        ? `✅ Encontrados ${exames.length} exames (${polissonografia} polissonografia, ${ronco} ronco)`
        : `⚠️ Nenhum exame encontrado no banco`,
      details: { total: exames?.length || 0, polissonografia, ronco }
    })
    
    return { polissonografia, ronco }
  } catch (error: any) {
    results.push({
      category: 'Dados',
      test: 'Verificar exames no banco',
      status: 'fail',
      message: `❌ Erro: ${error.message}`,
      details: { error: error.message }
    })
    return { polissonografia: 0, ronco: 0 }
  }
}

async function checkAlertsData() {
  try {
    const { data: alertas, error } = await supabase
      .from('alertas')
      .select('id, tipo, urgencia, status')
      .limit(10)
    
    if (error) {
      results.push({
        category: 'Alertas',
        test: 'Verificar alertas no banco',
        status: 'fail',
        message: `❌ Erro ao buscar alertas: ${error.message}`,
        details: { error: error.message }
      })
      return false
    }
    
    const pendentes = alertas?.filter(a => a.status === 'pendente').length || 0
    const resolvidos = alertas?.filter(a => a.status === 'resolvido').length || 0
    
    results.push({
      category: 'Alertas',
      test: 'Verificar alertas no banco',
      status: 'pass',
      message: `✅ Encontrados ${alertas?.length || 0} alertas (${pendentes} pendentes, ${resolvidos} resolvidos)`,
      details: { total: alertas?.length || 0, pendentes, resolvidos }
    })
    
    return true
  } catch (error: any) {
    results.push({
      category: 'Alertas',
      test: 'Verificar alertas no banco',
      status: 'fail',
      message: `❌ Erro: ${error.message}`,
      details: { error: error.message }
    })
    return false
  }
}

async function main() {
  console.log('🧪 VALIDAÇÃO COMPLETA - FASE 2')
  console.log('='.repeat(60))
  console.log('')
  
  // 1. Verificar Componentes
  console.log('📦 Verificando componentes...')
  await checkComponentExists('components/ui/GaugeChart.tsx', 'GaugeChart')
  await checkComponentExists('components/ui/HistogramChart.tsx', 'HistogramChart')
  await checkComponentExists('components/ui/RiskBar.tsx', 'RiskBar')
  await checkComponentExists('components/ui/NotificationBadge.tsx', 'NotificationBadge')
  await checkComponentExists('components/ui/NotificationCenter.tsx', 'NotificationCenter')
  await checkComponentExists('app/alertas/page.tsx', 'Página de Alertas')
  await checkComponentExists('app/alertas/components/AlertasList.tsx', 'AlertasList')
  await checkComponentExists('app/alertas/components/AlertaCard.tsx', 'AlertaCard')
  await checkComponentExists('app/alertas/components/AlertasFilters.tsx', 'AlertasFilters')
  await checkComponentExists('app/pacientes/components/ModalDetalhesExame.tsx', 'ModalDetalhesExame')
  await checkComponentExists('app/pacientes/[id]/components/TabEvolucao.tsx', 'TabEvolucao')
  
  // 2. Verificar Migrations
  console.log('🗄️ Verificando migrations...')
  await checkMigrationExists('013', 'Migration 013 - Campos estendidos')
  await checkMigrationExists('014', 'Migration 014 - Tabela de alertas')
  await checkMigrationExists('016', 'Migration 016 - Campos BPM')
  await checkMigrationExists('017', 'Migration 017 - RLS Alertas')
  await checkMigrationExists('018', 'Migration 018 - Limpeza de alertas')
  
  // 3. Verificar Edge Functions
  console.log('⚡ Verificando Edge Functions...')
  await checkEdgeFunction('check-alerts', 'Edge Function check-alerts')
  
  // 4. Verificar Banco de Dados
  console.log('💾 Verificando banco de dados...')
  await checkDatabaseTable('exames', 'Tabela exames')
  await checkDatabaseTable('alertas', 'Tabela alertas')
  await checkDatabaseTable('pacientes', 'Tabela pacientes')
  
  // 5. Verificar Dados
  console.log('📊 Verificando dados...')
  const examesData = await checkExamsData()
  await checkAlertsData()
  
  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO DA VALIDAÇÃO')
  console.log('='.repeat(60))
  
  const byCategory = results.reduce((acc, r) => {
    if (!acc[r.category]) acc[r.category] = []
    acc[r.category].push(r)
    return acc
  }, {} as Record<string, ValidationResult[]>)
  
  let totalPass = 0
  let totalFail = 0
  let totalWarning = 0
  
  Object.entries(byCategory).forEach(([category, tests]) => {
    console.log(`\n📁 ${category}:`)
    tests.forEach(test => {
      const icon = test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : test.status === 'warning' ? '⚠️' : '⏭️'
      console.log(`  ${icon} ${test.message}`)
      
      if (test.status === 'pass') totalPass++
      else if (test.status === 'fail') totalFail++
      else if (test.status === 'warning') totalWarning++
    })
  })
  
  console.log('\n' + '='.repeat(60))
  console.log('📈 ESTATÍSTICAS')
  console.log('='.repeat(60))
  console.log(`✅ Passou: ${totalPass}`)
  console.log(`❌ Falhou: ${totalFail}`)
  console.log(`⚠️ Avisos: ${totalWarning}`)
  console.log(`📊 Total: ${results.length}`)
  
  // Recomendações
  console.log('\n' + '='.repeat(60))
  console.log('💡 PRÓXIMOS PASSOS')
  console.log('='.repeat(60))
  
  if (examesData.polissonografia < 3) {
    console.log('⚠️ Menos de 3 exames de polissonografia encontrados')
    console.log('   Execute: npx tsx scripts/test/criar-alerta-teste.ts (se aplicável)')
  }
  
  if (examesData.ronco < 3) {
    console.log('⚠️ Menos de 3 exames de ronco encontrados')
  }
  
  if (totalFail === 0) {
    console.log('✅ Todas as verificações automáticas passaram!')
    console.log('📝 Próximo passo: Executar testes manuais conforme VALIDACAO_FINAL_FASE2.md')
  } else {
    console.log('❌ Algumas verificações falharam. Corrija antes de prosseguir.')
  }
  
  console.log('\n📖 Para testes manuais completos, consulte:')
  console.log('   docs/validacao/VALIDACAO_FINAL_FASE2.md')
  
  process.exit(totalFail > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error('\n❌ Erro ao executar validação:', error)
  process.exit(1)
})

