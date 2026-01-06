/**
 * Script de Validação de Migração Manual de Sessões
 * 
 * Este script valida todos os dados inseridos durante a migração manual de sessões.
 * Execute após completar a migração manual (Fase 8).
 * 
 * Uso:
 *   tsx scripts/validate-sessions-migration.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import { existsSync } from 'fs'

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  dotenv.config({ path: envPath })
} else {
  console.warn('⚠️  Arquivo .env.local não encontrado. Usando variáveis de ambiente do sistema.')
  dotenv.config()
}

// Carregar variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  console.error('   Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas')
  console.error('   Arquivo .env.local deve estar na raiz do projeto')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface ValidationResult {
  check: string
  status: 'PASS' | 'FAIL' | 'WARNING'
  message: string
  details?: any
}

const results: ValidationResult[] = []

function addResult(check: string, status: 'PASS' | 'FAIL' | 'WARNING', message: string, details?: any) {
  results.push({ check, status, message, details })
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️'
  console.log(`${icon} ${check}: ${message}`)
}

async function validateTotalSessoes() {
  console.log('\n📊 8.3.1: Verificando total de sessões...')
  
  try {
    const { count, error } = await supabase
      .from('sessoes')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      addResult('8.3.1', 'FAIL', `Erro ao contar sessões: ${error.message}`)
      return null
    }
    
    addResult('8.3.1', 'PASS', `Total de sessões registradas: ${count}`, { total: count })
    return count
  } catch (error: any) {
    addResult('8.3.1', 'FAIL', `Erro inesperado: ${error.message}`)
    return null
  }
}

async function compareWithExpected() {
  console.log('\n📊 8.3.2: Comparando com contagem esperada do Airtable...')
  
  try {
    // Buscar total de sessões registradas
    const { count: totalRegistradas, error: countError } = await supabase
      .from('sessoes')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      addResult('8.3.2', 'FAIL', `Erro ao contar sessões: ${countError.message}`)
      return
    }
    
    // Buscar total esperado (soma de sessoes_compradas de pacientes ativos/finalizados)
    const { data: pacientesData, error: pacientesError } = await supabase
      .from('pacientes')
      .select('sessoes_compradas')
      .in('status', ['ativo', 'finalizado'])
    
    if (pacientesError) {
      addResult('8.3.2', 'FAIL', `Erro ao buscar pacientes: ${pacientesError.message}`)
      return
    }
    
    const totalEsperado = pacientesData?.reduce((sum, p) => sum + (p.sessoes_compradas || 0), 0) || 0
    const diferenca = totalEsperado - (totalRegistradas || 0)
    const percentual = totalEsperado > 0 ? ((totalRegistradas || 0) / totalEsperado * 100).toFixed(2) : 0
    
    if (diferenca === 0) {
      addResult('8.3.2', 'PASS', `Contagem exata: ${totalRegistradas} sessões registradas = ${totalEsperado} esperadas`, {
        registradas: totalRegistradas,
        esperadas: totalEsperado,
        diferenca: 0
      })
    } else if (diferenca > 0) {
      addResult('8.3.2', 'WARNING', `${totalRegistradas} sessões registradas de ${totalEsperado} esperadas (${diferenca} faltando, ${percentual}% completo)`, {
        registradas: totalRegistradas,
        esperadas: totalEsperado,
        diferenca,
        percentual: `${percentual}%`
      })
    } else {
      addResult('8.3.2', 'WARNING', `${totalRegistradas} sessões registradas (${Math.abs(diferenca)} a mais que o esperado)`, {
        registradas: totalRegistradas,
        esperadas: totalEsperado,
        diferenca
      })
    }
  } catch (error: any) {
    addResult('8.3.2', 'FAIL', `Erro inesperado: ${error.message}`)
  }
}

async function checkOutliers() {
  console.log('\n📊 8.3.3: Verificando outliers (Contador Final < Contador Inicial)...')
  
  try {
    const { data, error } = await supabase
      .from('sessoes')
      .select('id, paciente_id, contador_pulsos_inicial, contador_pulsos_final')
    
    if (error) {
      addResult('8.3.3', 'FAIL', `Erro ao buscar sessões: ${error.message}`)
      return
    }
    
    const outliers = data?.filter(s => 
      s.contador_pulsos_final <= s.contador_pulsos_inicial
    ) || []
    
    if (outliers.length === 0) {
      addResult('8.3.3', 'PASS', 'Nenhum outlier encontrado (todas as sessões têm contador final > inicial)', {
        total: data?.length || 0,
        outliers: 0
      })
    } else {
      addResult('8.3.3', 'FAIL', `${outliers.length} outliers encontrados (contador final <= inicial)`, {
        total: data?.length || 0,
        outliers: outliers.length,
        details: outliers.map(o => ({
          id: o.id,
          paciente_id: o.paciente_id,
          inicial: o.contador_pulsos_inicial,
          final: o.contador_pulsos_final
        }))
      })
    }
  } catch (error: any) {
    addResult('8.3.3', 'FAIL', `Erro inesperado: ${error.message}`)
  }
}

async function checkMissingDates() {
  console.log('\n📊 8.3.4: Verificando datas faltantes...')
  
  try {
    const { data, error } = await supabase
      .from('sessoes')
      .select('id, paciente_id, data_sessao')
      .is('data_sessao', null)
    
    if (error) {
      addResult('8.3.4', 'FAIL', `Erro ao buscar sessões: ${error.message}`)
      return
    }
    
    if (!data || data.length === 0) {
      addResult('8.3.4', 'PASS', 'Nenhuma sessão com data faltante encontrada', {
        total: 0
      })
    } else {
      addResult('8.3.4', 'FAIL', `${data.length} sessões com data faltante encontradas`, {
        total: data.length,
        details: data.map(s => ({
          id: s.id,
          paciente_id: s.paciente_id
        }))
      })
    }
  } catch (error: any) {
    addResult('8.3.4', 'FAIL', `Erro inesperado: ${error.message}`)
  }
}

async function verifySessoesUtilizadas() {
  console.log('\n📊 8.3.5: Verificando sessoes_utilizadas atualizado corretamente...')
  
  try {
    // Buscar todos os pacientes com suas sessões
    const { data: pacientesData, error: pacientesError } = await supabase
      .from('pacientes')
      .select('id, nome, sessoes_utilizadas')
    
    if (pacientesError) {
      addResult('8.3.5', 'FAIL', `Erro ao buscar pacientes: ${pacientesError.message}`)
      return
    }
    
    const inconsistencies: any[] = []
    
    for (const paciente of pacientesData || []) {
      const { count, error: countError } = await supabase
        .from('sessoes')
        .select('*', { count: 'exact', head: true })
        .eq('paciente_id', paciente.id)
      
      if (countError) {
        console.error(`Erro ao contar sessões para paciente ${paciente.id}:`, countError)
        continue
      }
      
      const countReal = count || 0
      const campoPaciente = paciente.sessoes_utilizadas || 0
      
      if (countReal !== campoPaciente) {
        inconsistencies.push({
          paciente_id: paciente.id,
          nome: paciente.nome,
          campo_paciente: campoPaciente,
          contagem_real: countReal,
          diferenca: countReal - campoPaciente
        })
      }
    }
    
    if (inconsistencies.length === 0) {
      addResult('8.3.5', 'PASS', `Todos os ${pacientesData?.length || 0} pacientes têm sessoes_utilizadas correto`, {
        total_pacientes: pacientesData?.length || 0,
        inconsistencias: 0
      })
    } else {
      addResult('8.3.5', 'FAIL', `${inconsistencies.length} pacientes com sessoes_utilizadas incorreto`, {
        total_pacientes: pacientesData?.length || 0,
        inconsistencias: inconsistencies.length,
        details: inconsistencies.slice(0, 10) // Limitar a 10 para não sobrecarregar
      })
    }
  } catch (error: any) {
    addResult('8.3.5', 'FAIL', `Erro inesperado: ${error.message}`)
  }
}

async function verifySessoesDisponiveis() {
  console.log('\n📊 8.3.6: Verificando sessoes_disponiveis calculado corretamente...')
  
  try {
    const { data: pacientesData, error: pacientesError } = await supabase
      .from('pacientes')
      .select('id, nome, sessoes_compradas, sessoes_adicionadas, sessoes_utilizadas')
    
    if (pacientesError) {
      addResult('8.3.6', 'FAIL', `Erro ao buscar pacientes: ${pacientesError.message}`)
      return
    }
    
    const inconsistencies: any[] = []
    
    for (const paciente of pacientesData || []) {
      const compradas = paciente.sessoes_compradas || 0
      const adicionadas = paciente.sessoes_adicionadas || 0
      const utilizadas = paciente.sessoes_utilizadas || 0
      const disponiveisEsperado = compradas + adicionadas - utilizadas
      
      // Buscar disponíveis calculado (se houver campo)
      // Como não há campo sessoes_disponiveis na tabela, vamos calcular
      const disponiveisCalculado = compradas + adicionadas - utilizadas
      
      // Verificar se o cálculo está correto (sempre deve ser >= 0)
      if (disponiveisCalculado < 0) {
        inconsistencies.push({
          paciente_id: paciente.id,
          nome: paciente.nome,
          compradas,
          adicionadas,
          utilizadas,
          disponiveis_calculado: disponiveisCalculado,
          problema: 'Disponíveis negativo (utilizadas > compradas + adicionadas)'
        })
      }
    }
    
    if (inconsistencies.length === 0) {
      addResult('8.3.6', 'PASS', `Todos os ${pacientesData?.length || 0} pacientes têm cálculo de disponíveis correto`, {
        total_pacientes: pacientesData?.length || 0,
        inconsistencias: 0
      })
    } else {
      addResult('8.3.6', 'FAIL', `${inconsistencies.length} pacientes com cálculo de disponíveis incorreto`, {
        total_pacientes: pacientesData?.length || 0,
        inconsistencias: inconsistencies.length,
        details: inconsistencies.slice(0, 10)
      })
    }
  } catch (error: any) {
    addResult('8.3.6', 'FAIL', `Erro inesperado: ${error.message}`)
  }
}

async function spotCheckRandomPacientes() {
  console.log('\n📊 8.3.7: Spot check de 20 pacientes aleatórios...')
  
  try {
    // Buscar 20 pacientes aleatórios que têm sessões
    const { data: pacientesData, error: pacientesError } = await supabase
      .from('pacientes')
      .select('id, nome, cpf, status, sessoes_compradas, sessoes_adicionadas, sessoes_utilizadas')
      .not('sessoes_utilizadas', 'is', null)
      .gt('sessoes_utilizadas', 0)
      .limit(20)
    
    if (pacientesError) {
      addResult('8.3.7', 'FAIL', `Erro ao buscar pacientes: ${pacientesError.message}`)
      return
    }
    
    if (!pacientesData || pacientesData.length === 0) {
      addResult('8.3.7', 'WARNING', 'Nenhum paciente com sessões encontrado para spot check')
      return
    }
    
    const spotChecks: any[] = []
    
    for (const paciente of pacientesData) {
      // Buscar sessões do paciente
      const { data: sessoesData, error: sessoesError } = await supabase
        .from('sessoes')
        .select('id, data_sessao, contador_pulsos_inicial, contador_pulsos_final, protocolo, observacoes')
        .eq('paciente_id', paciente.id)
        .order('data_sessao', { ascending: false })
      
      if (sessoesError) {
        console.error(`Erro ao buscar sessões para paciente ${paciente.id}:`, sessoesError)
        continue
      }
      
      const totalSessoes = sessoesData?.length || 0
      const sessoesUtilizadasCampo = paciente.sessoes_utilizadas || 0
      
      // Verificar consistência
      const issues: string[] = []
      if (totalSessoes !== sessoesUtilizadasCampo) {
        issues.push(`Contagem: ${totalSessoes} sessões vs ${sessoesUtilizadasCampo} no campo`)
      }
      
      // Verificar sessões com problemas
      const sessoesComProblemas = sessoesData?.filter(s => 
        !s.data_sessao || 
        s.contador_pulsos_final <= s.contador_pulsos_inicial
      ) || []
      
      if (sessoesComProblemas.length > 0) {
        issues.push(`${sessoesComProblemas.length} sessões com problemas`)
      }
      
      spotChecks.push({
        paciente_id: paciente.id,
        nome: paciente.nome,
        cpf: paciente.cpf,
        status: paciente.status,
        sessoes_compradas: paciente.sessoes_compradas,
        sessoes_adicionadas: paciente.sessoes_adicionadas,
        sessoes_utilizadas_campo: sessoesUtilizadasCampo,
        sessoes_contadas: totalSessoes,
        issues: issues.length > 0 ? issues : ['OK']
      })
    }
    
    const pacientesComProblemas = spotChecks.filter(p => p.issues.some((i: string) => i !== 'OK'))
    
    if (pacientesComProblemas.length === 0) {
      addResult('8.3.7', 'PASS', `Spot check de ${spotChecks.length} pacientes: todos OK`, {
        total_verificados: spotChecks.length,
        com_problemas: 0,
        detalhes: spotChecks
      })
    } else {
      addResult('8.3.7', 'WARNING', `Spot check: ${pacientesComProblemas.length} de ${spotChecks.length} pacientes com problemas`, {
        total_verificados: spotChecks.length,
        com_problemas: pacientesComProblemas.length,
        detalhes: spotChecks
      })
    }
  } catch (error: any) {
    addResult('8.3.7', 'FAIL', `Erro inesperado: ${error.message}`)
  }
}

function generateReport() {
  console.log('\n📊 8.3.8: Gerando relatório de validação...')
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportDir = path.join(process.cwd(), 'scripts', 'data', 'validation')
  const reportPath = path.join(reportDir, `sessions-validation-report-${timestamp}.md`)
  
  // Criar diretório se não existir
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true })
  }
  
  const passCount = results.filter(r => r.status === 'PASS').length
  const failCount = results.filter(r => r.status === 'FAIL').length
  const warningCount = results.filter(r => r.status === 'WARNING').length
  const totalChecks = results.length
  const successRate = totalChecks > 0 ? ((passCount / totalChecks) * 100).toFixed(2) : '0.00'
  
  let report = `# Relatório de Validação de Migração de Sessões\n\n`
  report += `**Data:** ${new Date().toLocaleString('pt-BR')}\n`
  report += `**Script:** validate-sessions-migration.ts\n\n`
  report += `---\n\n`
  report += `## 📊 Resumo\n\n`
  report += `- **Total de Verificações:** ${totalChecks}\n`
  report += `- **✅ Passou:** ${passCount}\n`
  report += `- **❌ Falhou:** ${failCount}\n`
  report += `- **⚠️ Avisos:** ${warningCount}\n`
  report += `- **Taxa de Sucesso:** ${successRate}%\n\n`
  report += `---\n\n`
  report += `## 📋 Detalhes das Verificações\n\n`
  
  results.forEach((result, index) => {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⚠️'
    report += `### ${index + 1}. ${result.check}\n\n`
    report += `**Status:** ${icon} ${result.status}\n\n`
    report += `**Mensagem:** ${result.message}\n\n`
    
    if (result.details) {
      report += `**Detalhes:**\n\n`
      report += `\`\`\`json\n${JSON.stringify(result.details, null, 2)}\n\`\`\`\n\n`
    }
    
    report += `---\n\n`
  })
  
  report += `## 📝 Conclusão\n\n`
  
  if (failCount === 0 && warningCount === 0) {
    report += `✅ **Validação completa bem-sucedida!** Todos os dados foram validados e estão corretos.\n\n`
  } else if (failCount === 0) {
    report += `⚠️ **Validação concluída com avisos.** Todos os dados críticos estão corretos, mas há alguns avisos que devem ser revisados.\n\n`
  } else {
    report += `❌ **Validação encontrou problemas.** ${failCount} verificação(ões) falharam e precisam ser corrigidas antes de considerar a migração completa.\n\n`
  }
  
  report += `**Próximos Passos:**\n`
  if (failCount > 0) {
    report += `1. Revisar os problemas identificados\n`
    report += `2. Corrigir os dados incorretos (ver tarefa 8.4)\n`
    report += `3. Re-executar este script de validação\n`
    report += `4. Repetir até que todas as verificações passem\n`
  } else {
    report += `1. Migração de sessões concluída com sucesso!\n`
    report += `2. Prosseguir para próximas fases do projeto\n`
  }
  
  fs.writeFileSync(reportPath, report, 'utf-8')
  
  addResult('8.3.8', 'PASS', `Relatório gerado: ${reportPath}`, {
    report_path: reportPath,
    total_checks: totalChecks,
    pass: passCount,
    fail: failCount,
    warning: warningCount,
    success_rate: `${successRate}%`
  })
  
  console.log(`\n📄 Relatório salvo em: ${reportPath}`)
}

async function main() {
  console.log('🚀 Iniciando validação de migração de sessões...\n')
  console.log('=' .repeat(60))
  
  // Executar todas as validações
  await validateTotalSessoes()
  await compareWithExpected()
  await checkOutliers()
  await checkMissingDates()
  await verifySessoesUtilizadas()
  await verifySessoesDisponiveis()
  await spotCheckRandomPacientes()
  generateReport()
  
  // Resumo final
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 Resumo da Validação:')
  const passCount = results.filter(r => r.status === 'PASS').length
  const failCount = results.filter(r => r.status === 'FAIL').length
  const warningCount = results.filter(r => r.status === 'WARNING').length
  const totalChecks = results.length
  
  console.log(`✅ Passou: ${passCount}`)
  console.log(`❌ Falhou: ${failCount}`)
  console.log(`⚠️  Avisos: ${warningCount}`)
  console.log(`📊 Total: ${totalChecks}`)
  
  if (failCount > 0) {
    console.log('\n❌ Validação encontrou problemas. Revise o relatório e corrija os erros.')
    process.exit(1)
  } else {
    console.log('\n✅ Validação concluída!')
    process.exit(0)
  }
}

main().catch((error) => {
  console.error('❌ Erro fatal:', error)
  process.exit(1)
})

