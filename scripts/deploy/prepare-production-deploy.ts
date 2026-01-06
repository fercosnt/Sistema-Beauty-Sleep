#!/usr/bin/env tsx
/**
 * Script para preparar deploy em produção (Windows/Linux/Mac compatível)
 * Verifica pré-requisitos e prepara o ambiente
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const NC = '\x1b[0m' // No Color

console.log('🚀 Preparando deploy em produção...\n')

let hasErrors = false

// 1. Verificar se está na branch main
console.log('1. Verificando branch...')
try {
  const branch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim()
  if (branch !== 'main') {
    console.log(`${YELLOW}⚠️  Você está na branch: ${branch}${NC}`)
    console.log(`${YELLOW}   Recomendado: fazer merge para main antes de deploy${NC}`)
  } else {
    console.log(`${GREEN}✅ Branch: ${branch}${NC}`)
  }
} catch (error) {
  console.log(`${RED}❌ Erro ao verificar branch${NC}`)
  hasErrors = true
}

// 2. Verificar se há mudanças não commitadas
console.log('\n2. Verificando mudanças não commitadas...')
try {
  const status = execSync('git status --porcelain', { encoding: 'utf-8' })
  if (status.trim()) {
    console.log(`${YELLOW}⚠️  Há mudanças não commitadas${NC}`)
    console.log('   Recomendado: fazer commit antes de deploy')
    console.log('   (Continuando mesmo assim...)')
  } else {
    console.log(`${GREEN}✅ Nenhuma mudança pendente${NC}`)
  }
} catch (error) {
  console.log(`${YELLOW}⚠️  Erro ao verificar status do git${NC}`)
  console.log('   (Continuando mesmo assim...)')
}

// 3. Executar testes
console.log('\n3. Executando testes...')
try {
  execSync('npm test', { stdio: 'inherit', timeout: 120000 })
  console.log(`${GREEN}✅ Todos os testes passaram${NC}`)
} catch (error) {
  console.log(`${RED}❌ Testes falharam${NC}`)
  console.log('   Corrija os testes antes de fazer deploy')
  hasErrors = true
}

// 4. Limpar .next e executar build
console.log('\n4. Limpando cache e executando build...')
try {
  // Limpar .next para evitar problemas com OneDrive
  const { rmSync } = require('fs')
  const nextPath = join(process.cwd(), '.next')
  if (existsSync(nextPath)) {
    try {
      rmSync(nextPath, { recursive: true, force: true })
      console.log('   ✅ Cache .next limpo')
    } catch (cleanError) {
      console.log(`${YELLOW}   ⚠️  Não foi possível limpar .next (pode ser problema do OneDrive)${NC}`)
      console.log('   Tentando build mesmo assim...')
    }
  }
  
  execSync('npm run build', { stdio: 'inherit', timeout: 300000 })
  console.log(`${GREEN}✅ Build executado com sucesso${NC}`)
} catch (error: any) {
  console.log(`${RED}❌ Build falhou${NC}`)
  if (error.message?.includes('EINVAL') || error.message?.includes('readlink')) {
    console.log('   ⚠️  Erro relacionado ao OneDrive (problema conhecido)')
    console.log('   💡 Solução: Exclua a pasta .next manualmente e tente novamente')
    console.log('   💡 Ou: Mova o projeto para fora do OneDrive')
  }
  console.log('   Corrija os erros de build antes de continuar')
  hasErrors = true
}

// 5. Verificar variáveis de ambiente
console.log('\n5. Verificando variáveis de ambiente...')
const envLocalPath = join(process.cwd(), '.env.local')
if (existsSync(envLocalPath)) {
  console.log(`${GREEN}✅ .env.local encontrado${NC}`)
} else {
  console.log(`${YELLOW}⚠️  .env.local não encontrado${NC}`)
  console.log('   Certifique-se de configurar as variáveis no Vercel Dashboard')
}

// 6. Verificar vercel.json
console.log('\n6. Verificando configuração do Vercel...')
const vercelJsonPath = join(process.cwd(), 'vercel.json')
if (existsSync(vercelJsonPath)) {
  console.log(`${GREEN}✅ vercel.json encontrado${NC}`)
} else {
  console.log(`${YELLOW}⚠️  vercel.json não encontrado${NC}`)
  console.log('   Vercel usará configuração padrão')
}

// Resumo
console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log(`${RED}❌ Preparação concluída com erros!${NC}`)
  console.log('   Corrija os erros acima antes de fazer deploy')
  process.exit(1)
} else {
  console.log(`${GREEN}✅ Preparação concluída!${NC}`)
  console.log('='.repeat(50))
  console.log('\n📝 Próximos passos:')
  console.log('1. Verificar variáveis de ambiente no Vercel Dashboard')
  console.log('2. Configurar Supabase Auth URLs')
  console.log('3. Fazer deploy: vercel --prod')
  console.log('\n📚 Guia completo: docs/deploy/GUIA_DEPLOY_PRODUCAO.md')
  process.exit(0)
}

