#!/usr/bin/env tsx
/**
 * Script de Validação Final - Fase 2
 * 
 * Este script verifica se todas as funcionalidades estão implementadas
 * e prontas para testes manuais.
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Carregar variáveis de ambiente do .env.local
const envPath = path.join(process.cwd(), '.env.local')

if (!fs.existsSync(envPath)) {
  console.error('❌ Erro: Arquivo .env.local não encontrado!')
  console.error('   Crie o arquivo .env.local na raiz do projeto')
  console.error('   Você pode copiar do exemplo: Copy-Item env.local.example .env.local')
  process.exit(1)
}

// Carregar .env.local usando dotenv
config({ path: envPath })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variáveis de ambiente não configuradas')
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local')
  console.error('\nExemplo de .env.local:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface ValidationResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: any
}

const results: ValidationResult[] = []

async function checkFileExists(filePath: string, description: string) {
  const fullPath = path.join(process.cwd(), filePath)
  const exists = fs.existsSync(fullPath)
  
  results.push({
    name: description,
    status: exists ? 'pass' : 'fail',
    message: exists ? `Arquivo encontrado: ${filePath}` : `Arquivo não encontrado: ${filePath}`
  })
  
  return exists
}

async function checkComponentExists(componentPath: string, componentName: string) {
  return checkFileExists(componentPath, `Componente ${componentName}`)
}

async function checkDatabaseTable(tableName: string) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1)
    
    results.push({
      name: `Tabela ${tableName}`,
      status: error ? 'fail' : 'pass',
      message: error ? `Erro ao acessar tabela: ${error.message}` : `Tabela ${tableName} acessível`
    })
    
    return !error
  } catch (error: any) {
    results.push({
      name: `Tabela ${tableName}`,
      status: 'fail',
      message: `Erro: ${error.message}`
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
      results.push({
        name: 'Tabela alertas',
        status: 'fail',
        message: `Erro ao acessar: ${error.message}`
      })
      return false
    }
    
    const tipos = new Set(data?.map(a => a.tipo) || [])
    const urgencias = new Set(data?.map(a => a.urgencia) || [])
    const statuses = new Set(data?.map(a => a.status) || [])
    
    results.push({
      name: 'Tabela alertas',
      status: 'pass',
      message: `Tabela acessível com ${data?.length || 0} alertas`,
      details: {
        tipos: Array.from(tipos),
        urgencias: Array.from(urgencias),
        statuses: Array.from(statuses)
      }
    })
    
    return true
  } catch (error: any) {
    results.push({
      name: 'Tabela alertas',
      status: 'fail',
      message: `Erro: ${error.message}`
    })
    return false
  }
}

async function checkExamesForTesting() {
  try {
    // Verificar exames tipo 0 (Ronco)
    const { data: examesRonco, error: errorRonco } = await supabase
      .from('exames')
      .select('id, tipo, score_ronco')
      .eq('tipo', 0)
      .not('score_ronco', 'is', null)
      .limit(3)
    
    // Verificar exames tipo 1 (Polissonografia)
    const { data: examesPolissonografia, error: errorPolissonografia } = await supabase
      .from('exames')
      .select('id, tipo, ido, spo2_min')
      .eq('tipo', 1)
      .not('ido', 'is', null)
      .limit(3)
    
    const roncoCount = examesRonco?.length || 0
    const polissonografiaCount = examesPolissonografia?.length || 0
    
    results.push({
      name: 'Exames para teste',
      status: roncoCount >= 3 && polissonografiaCount >= 3 ? 'pass' : 'warning',
      message: `${roncoCount} exames de ronco e ${polissonografiaCount} exames de polissonografia disponíveis`,
      details: {
        examesRonco: roncoCount,
        examesPolissonografia: polissonografiaCount,
        suficiente: roncoCount >= 3 && polissonografiaCount >= 3
      }
    })
    
    return roncoCount >= 3 && polissonografiaCount >= 3
  } catch (error: any) {
    results.push({
      name: 'Exames para teste',
      status: 'fail',
      message: `Erro: ${error.message}`
    })
    return false
  }
}

async function checkPacientesForEvolution() {
  try {
    // Verificar pacientes com múltiplos exames
    const { data, error } = await supabase
      .from('exames')
      .select('paciente_id')
      .limit(1000)
    
    if (error) {
      results.push({
        name: 'Pacientes para evolução',
        status: 'fail',
        message: `Erro: ${error.message}`
      })
      return false
    }
    
    // Contar exames por paciente
    const examesPorPaciente = new Map<string, number>()
    data?.forEach(exame => {
      if (exame.paciente_id) {
        examesPorPaciente.set(
          exame.paciente_id,
          (examesPorPaciente.get(exame.paciente_id) || 0) + 1
        )
      }
    })
    
    const pacientesComMultiplosExames = Array.from(examesPorPaciente.entries())
      .filter(([_, count]) => count >= 5)
      .length
    
    results.push({
      name: 'Pacientes para evolução',
      status: pacientesComMultiplosExames > 0 ? 'pass' : 'warning',
      message: `${pacientesComMultiplosExames} pacientes com 5+ exames disponíveis para teste de evolução`,
      details: {
        pacientesComMultiplosExames,
        totalPacientes: examesPorPaciente.size
      }
    })
    
    return pacientesComMultiplosExames > 0
  } catch (error: any) {
    results.push({
      name: 'Pacientes para evolução',
      status: 'fail',
      message: `Erro: ${error.message}`
    })
    return false
  }
}

async function main() {
  console.log('🔍 Iniciando validação final...\n')
  
  // Verificar componentes principais
  console.log('📦 Verificando componentes...')
  await checkComponentExists('app/pacientes/components/ModalDetalhesExame.tsx', 'ModalDetalhesExame')
  await checkComponentExists('app/pacientes/[id]/components/TabEvolucao.tsx', 'TabEvolucao')
  await checkComponentExists('app/pacientes/[id]/components/ComparacaoExames.tsx', 'ComparacaoExames')
  await checkComponentExists('components/ui/NotificationCenter.tsx', 'NotificationCenter')
  await checkComponentExists('components/ui/NotificationBadge.tsx', 'NotificationBadge')
  await checkComponentExists('app/alertas/page.tsx', 'Página de Alertas')
  await checkComponentExists('app/alertas/components/AlertasFilters.tsx', 'AlertasFilters')
  await checkComponentExists('app/alertas/components/AlertaCard.tsx', 'AlertaCard')
  await checkComponentExists('app/alertas/components/AlertasList.tsx', 'AlertasList')
  
  // Verificar funções Edge
  console.log('\n⚡ Verificando Edge Functions...')
  await checkFileExists('supabase/functions/sync-biologix/index.ts', 'Edge Function sync-biologix')
  
  // Verificar tabelas do banco
  console.log('\n🗄️  Verificando banco de dados...')
  await checkDatabaseTable('exames')
  await checkDatabaseTable('pacientes')
  await checkAlertasTable()
  
  // Verificar dados para teste
  console.log('\n📊 Verificando dados para teste...')
  await checkExamesForTesting()
  await checkPacientesForEvolution()
  
  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('📋 RESUMO DA VALIDAÇÃO')
  console.log('='.repeat(60))
  
  const passed = results.filter(r => r.status === 'pass').length
  const failed = results.filter(r => r.status === 'fail').length
  const warnings = results.filter(r => r.status === 'warning').length
  
  results.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️'
    console.log(`${icon} ${result.name}`)
    console.log(`   ${result.message}`)
    if (result.details) {
      console.log(`   Detalhes:`, JSON.stringify(result.details, null, 2))
    }
    console.log()
  })
  
  console.log('='.repeat(60))
  console.log(`✅ Passou: ${passed}`)
  console.log(`❌ Falhou: ${failed}`)
  console.log(`⚠️  Avisos: ${warnings}`)
  console.log('='.repeat(60))
  
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

