/**
 * Teste Completo - Fase 2 Componentes
 * 
 * Valida todas as funcionalidades implementadas:
 * - TabEvolucao: 13 gráficos, seletor, filtros, marcadores
 * - TabPeso: Redução de dados, otimizações
 * - Verificação de imports e tipos
 */

import * as fs from 'fs'
import * as path from 'path'

console.log('='.repeat(70))
console.log('🧪 TESTE COMPLETO - FASE 2 COMPONENTES')
console.log('='.repeat(70))
console.log('')

let totalTestes = 0
let testesPassados = 0
let testesFalhados = 0

function teste(nome: string, condicao: boolean, detalhes?: string) {
  totalTestes++
  if (condicao) {
    testesPassados++
    console.log(`✅ ${nome}`)
    if (detalhes) console.log(`   ${detalhes}`)
  } else {
    testesFalhados++
    console.log(`❌ ${nome}`)
    if (detalhes) console.log(`   ${detalhes}`)
  }
  console.log('')
}

// 1. Verificar se os arquivos existem
console.log('📁 Verificando arquivos...\n')

const arquivos = [
  'app/pacientes/[id]/components/TabEvolucao.tsx',
  'app/pacientes/[id]/components/TabPeso.tsx',
  'app/pacientes/[id]/components/TabHistoricoStatus.tsx',
  'supabase/migrations/013_add_exam_extended_fields.sql',
]

arquivos.forEach(arquivo => {
  const caminho = path.join(process.cwd(), arquivo)
  const existe = fs.existsSync(caminho)
  teste(`Arquivo existe: ${arquivo}`, existe)
})

// 2. Verificar conteúdo do TabEvolucao
console.log('📊 Verificando TabEvolucao.tsx...\n')

const tabEvolucaoPath = path.join(process.cwd(), 'app/pacientes/[id]/components/TabEvolucao.tsx')
if (fs.existsSync(tabEvolucaoPath)) {
  const conteudo = fs.readFileSync(tabEvolucaoPath, 'utf-8')
  
  // Verificar imports
  teste(
    'Importa Recharts corretamente',
    conteudo.includes('from \'recharts\'') || conteudo.includes('from "recharts"'),
    'Recharts necessário para gráficos'
  )
  
  teste(
    'Importa componentes UI',
    conteudo.includes('Card') && conteudo.includes('Button'),
    'Componentes UI necessários'
  )
  
  // Verificar métricas
  const metricas = [
    'score_ronco',
    'ido',
    'tempo_spo2_90',
    'spo2_min',
    'spo2_avg',
    'spo2_max',
    'num_dessaturacoes',
    'num_eventos_hipoxemia',
    'tempo_hipoxemia',
    'carga_hipoxica',
    'bpm_min',
    'bpm_medio',
    'bpm_max',
  ]
  
  metricas.forEach(metrica => {
    teste(
      `Métrica configurada: ${metrica}`,
      conteudo.includes(metrica),
      `Métrica ${metrica} deve estar presente`
    )
  })
  
  // Verificar funcionalidades
  teste(
    'Seletor de métrica implementado',
    conteudo.includes('selectedMetric') && conteudo.includes('setSelectedMetric'),
    'Estado para seleção de métrica'
  )
  
  teste(
    'Filtro de período implementado',
    conteudo.includes('dateRange') && conteudo.includes('setDateRange'),
    'Filtros: Todo, 6 meses, 12 meses'
  )
  
  teste(
    'Marcadores de sessões implementados',
    conteudo.includes('sessionMarkers') || conteudo.includes('ReferenceLine'),
    'Marcadores visuais de sessões'
  )
  
  teste(
    'Query busca todos os campos necessários',
    conteudo.includes('select(\'*\')') || conteudo.includes('bpm_min') && conteudo.includes('carga_hipoxica'),
    'Query completa para buscar dados'
  )
}

// 3. Verificar TabPeso
console.log('⚖️ Verificando TabPeso.tsx...\n')

const tabPesoPath = path.join(process.cwd(), 'app/pacientes/[id]/components/TabPeso.tsx')
if (fs.existsSync(tabPesoPath)) {
  const conteudo = fs.readFileSync(tabPesoPath, 'utf-8')
  
  teste(
    'Função reduzirDados implementada',
    conteudo.includes('reduzirDados'),
    'Função para otimizar gráficos com muitos dados'
  )
  
  teste(
    'Redução aplicada aos dados de peso',
    conteudo.includes('chartDataPeso') && conteudo.includes('reduzirDados'),
    'Dados de peso são reduzidos quando necessário'
  )
  
  teste(
    'Redução aplicada aos dados de IMC',
    conteudo.includes('chartDataIMC') && conteudo.includes('reduzirDados'),
    'Dados de IMC são reduzidos quando necessário'
  )
  
  teste(
    'Indicador de redução implementado',
    conteudo.includes('Mostrando') && conteudo.includes('pontos'),
    'Usuário é informado quando dados são reduzidos'
  )
  
  teste(
    'Eixos X rotacionados para muitos dados',
    conteudo.includes('angle') && conteudo.includes('-45'),
    'Melhor legibilidade com muitos pontos'
  )
}

// 4. Verificar Migration
console.log('🗄️ Verificando Migration 013...\n')

const migrationPath = path.join(process.cwd(), 'supabase/migrations/013_add_exam_extended_fields.sql')
if (fs.existsSync(migrationPath)) {
  const conteudo = fs.readFileSync(migrationPath, 'utf-8')
  
  const campos = [
    'bpm_min',
    'bpm_medio',
    'bpm_max',
    'tempo_spo2_90_seg',
    'num_dessaturacoes',
    'num_eventos_hipoxemia',
    'tempo_hipoxemia_seg',
    'carga_hipoxica',
  ]
  
  campos.forEach(campo => {
    teste(
      `Campo na migration: ${campo}`,
      conteudo.includes(campo),
      `Campo ${campo} necessário para gráficos`
    )
  })
}

// 5. Verificar TabHistoricoStatus (ajustes de padding)
console.log('📜 Verificando TabHistoricoStatus.tsx...\n')

const tabHistoricoPath = path.join(process.cwd(), 'app/pacientes/[id]/components/TabHistoricoStatus.tsx')
if (fs.existsSync(tabHistoricoPath)) {
  const conteudo = fs.readFileSync(tabHistoricoPath, 'utf-8')
  
  teste(
    'Padding ajustado (pt-16)',
    conteudo.includes('pt-16') || conteudo.includes('pt-16 pb-8'),
    'Padding superior aumentado para melhor visualização'
  )
}

// Resumo
console.log('='.repeat(70))
console.log('📊 RESUMO DOS TESTES')
console.log('='.repeat(70))
console.log('')
console.log(`Total de testes: ${totalTestes}`)
console.log(`✅ Passou: ${testesPassados}`)
console.log(`❌ Falhou: ${testesFalhados}`)
console.log(`📈 Taxa de sucesso: ${((testesPassados / totalTestes) * 100).toFixed(1)}%`)
console.log('')

if (testesFalhados === 0) {
  console.log('='.repeat(70))
  console.log('✅ TODOS OS TESTES PASSARAM!')
  console.log('='.repeat(70))
  process.exit(0)
} else {
  console.log('='.repeat(70))
  console.log('⚠️  ALGUNS TESTES FALHARAM')
  console.log('='.repeat(70))
  console.log('')
  console.log('Verifique os detalhes acima e corrija os problemas encontrados.')
  process.exit(1)
}

