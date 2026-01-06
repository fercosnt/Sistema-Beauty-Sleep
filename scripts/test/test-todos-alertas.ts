#!/usr/bin/env tsx
/**
 * Script completo para testar todos os tipos de alertas
 * 
 * Executa todos os testes de alertas em sequência:
 * 1. Alertas críticos (simulando sync)
 * 2. Alertas de manutenção (simulando cron)
 * 3. Alertas de follow-up
 * 
 * Uso: npx tsx scripts/test-todos-alertas.ts
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function executarScript(script: string, descricao: string) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🚀 ${descricao}`)
  console.log('='.repeat(60))
  
  try {
    const { stdout, stderr } = await execAsync(`npx tsx ${script}`)
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)
    return true
  } catch (error: any) {
    console.error(`❌ Erro ao executar ${script}:`, error.message)
    return false
  }
}

async function main() {
  console.log('🧪 TESTE COMPLETO DE ALERTAS')
  console.log('Este script executará todos os testes de alertas em sequência.\n')

  const resultados = []

  // 1. Testar alertas críticos
  resultados.push({
    nome: 'Alertas Críticos',
    sucesso: await executarScript('scripts/test/test-alertas-criticos.ts', 'Testando Alertas Críticos (via sync)')
  })

  // 2. Testar alertas de manutenção
  resultados.push({
    nome: 'Alertas de Manutenção',
    sucesso: await executarScript('scripts/test/test-alertas-manutencao.ts', 'Testando Alertas de Manutenção (via cron)')
  })

  // 3. Criar alertas de teste gerais
  resultados.push({
    nome: 'Alertas de Teste Gerais',
    sucesso: await executarScript('scripts/test/criar-alerta-teste.ts', 'Criando Alertas de Teste Gerais')
  })

  // Resumo final
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO FINAL')
  console.log('='.repeat(60))
  
  const sucessos = resultados.filter((r) => r.sucesso).length
  const falhas = resultados.filter((r) => !r.sucesso).length

  resultados.forEach((r) => {
    const icon = r.sucesso ? '✅' : '❌'
    console.log(`${icon} ${r.nome}`)
  })

  console.log(`\n✅ Sucessos: ${sucessos}/${resultados.length}`)
  console.log(`❌ Falhas: ${falhas}/${resultados.length}`)

  if (sucessos === resultados.length) {
    console.log('\n🎉 Todos os testes de alertas foram executados com sucesso!')
    console.log('💡 Acesse a página /alertas para visualizar todos os alertas criados.')
    console.log('💡 Verifique o centro de notificações no header.')
  } else {
    console.log('\n⚠️  Alguns testes falharam. Revise os erros acima.')
  }
}

main()
  .then(() => {
    console.log('\n✅ Teste completo concluído')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro ao executar testes:', error)
    process.exit(1)
  })

