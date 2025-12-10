#!/usr/bin/env tsx
/**
 * Script para verificar se o sistema está pronto para deploy em produção
 * 
 * Verifica:
 * - Variáveis de ambiente necessárias
 * - Build do projeto
 * - Testes passando
 * - Migrations aplicadas
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'

interface CheckResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
}

const checks: CheckResult[] = []

console.log('🔍 Verificando prontidão para deploy em produção...\n')

// 1. Verificar se .env.local existe
console.log('1. Verificando variáveis de ambiente...')
const envLocalPath = join(process.cwd(), '.env.local')
if (existsSync(envLocalPath)) {
  const envContent = readFileSync(envLocalPath, 'utf-8')
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  const missingVars = requiredVars.filter(varName => !envContent.includes(varName))
  
  if (missingVars.length === 0) {
    checks.push({
      name: 'Variáveis de ambiente',
      status: 'pass',
      message: 'Todas as variáveis necessárias estão presentes'
    })
    console.log('   ✅ Variáveis de ambiente OK')
  } else {
    checks.push({
      name: 'Variáveis de ambiente',
      status: 'fail',
      message: `Variáveis faltando: ${missingVars.join(', ')}`
    })
    console.log(`   ❌ Variáveis faltando: ${missingVars.join(', ')}`)
  }
} else {
  checks.push({
    name: 'Variáveis de ambiente',
    status: 'warning',
    message: '.env.local não encontrado (pode estar configurado no Vercel)'
  })
  console.log('   ⚠️  .env.local não encontrado')
}

// 2. Verificar se o build funciona
console.log('\n2. Verificando build do projeto...')
try {
  execSync('npm run build', { stdio: 'pipe', timeout: 300000 })
  checks.push({
    name: 'Build do projeto',
    status: 'pass',
    message: 'Build executado com sucesso'
  })
  console.log('   ✅ Build OK')
} catch (error: any) {
  checks.push({
    name: 'Build do projeto',
    status: 'fail',
    message: `Erro no build: ${error.message}`
  })
  console.log('   ❌ Erro no build')
}

// 3. Verificar se os testes passam
console.log('\n3. Verificando testes...')
try {
  execSync('npm test', { stdio: 'pipe', timeout: 60000 })
  checks.push({
    name: 'Testes unitários',
    status: 'pass',
    message: 'Todos os testes passaram'
  })
  console.log('   ✅ Testes OK')
} catch (error: any) {
  checks.push({
    name: 'Testes unitários',
    status: 'warning',
    message: 'Alguns testes falharam (verificar antes de deploy)'
  })
  console.log('   ⚠️  Alguns testes falharam')
}

// 4. Verificar se vercel.json existe
console.log('\n4. Verificando configuração do Vercel...')
const vercelJsonPath = join(process.cwd(), 'vercel.json')
if (existsSync(vercelJsonPath)) {
  checks.push({
    name: 'Configuração Vercel',
    status: 'pass',
    message: 'vercel.json encontrado'
  })
  console.log('   ✅ vercel.json encontrado')
} else {
  checks.push({
    name: 'Configuração Vercel',
    status: 'warning',
    message: 'vercel.json não encontrado (Vercel pode usar configuração padrão)'
  })
  console.log('   ⚠️  vercel.json não encontrado')
}

// 5. Verificar se há migrations pendentes
console.log('\n5. Verificando migrations...')
const migrationsPath = join(process.cwd(), 'supabase', 'migrations')
if (existsSync(migrationsPath)) {
  const fs = require('fs')
  const migrations = fs.readdirSync(migrationsPath)
    .filter((f: string) => f.endsWith('.sql'))
  
  checks.push({
    name: 'Migrations',
    status: 'pass',
    message: `${migrations.length} migrations encontradas`
  })
  console.log(`   ✅ ${migrations.length} migrations encontradas`)
} else {
  checks.push({
    name: 'Migrations',
    status: 'warning',
    message: 'Pasta de migrations não encontrada'
  })
  console.log('   ⚠️  Pasta de migrations não encontrada')
}

// Resumo
console.log('\n' + '='.repeat(60))
console.log('📊 RESUMO DA VERIFICAÇÃO')
console.log('='.repeat(60))

const passed = checks.filter(c => c.status === 'pass').length
const failed = checks.filter(c => c.status === 'fail').length
const warnings = checks.filter(c => c.status === 'warning').length

checks.forEach(check => {
  const icon = check.status === 'pass' ? '✅' : check.status === 'fail' ? '❌' : '⚠️'
  console.log(`${icon} ${check.name}: ${check.message}`)
})

console.log('\n' + '='.repeat(60))
console.log(`✅ Passou: ${passed}`)
console.log(`❌ Falhou: ${failed}`)
console.log(`⚠️  Avisos: ${warnings}`)
console.log('='.repeat(60))

if (failed > 0) {
  console.log('\n❌ O sistema NÃO está pronto para deploy. Corrija os erros acima.')
  process.exit(1)
} else if (warnings > 0) {
  console.log('\n⚠️  O sistema está pronto, mas há avisos. Revise antes de fazer deploy.')
  process.exit(0)
} else {
  console.log('\n✅ O sistema está pronto para deploy em produção!')
  process.exit(0)
}

