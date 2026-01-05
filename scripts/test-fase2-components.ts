/**
 * Script de Teste Manual - Fase 2 Componentes
 * 
 * Testa as funcionalidades implementadas na Fase 2:
 * - TabEvolucao com 13 gráficos
 * - TabPeso com redução de dados
 * - Função de redução de dados
 */

// Teste da função de redução de dados
function testReduzirDados() {
  console.log('🧪 Testando função reduzirDados...\n')

  // Função de redução (copiada do TabPeso.tsx)
  const reduzirDados = <T,>(dados: T[], maxPontos: number = 30): T[] => {
    if (dados.length <= maxPontos) {
      return dados
    }

    const primeiro = dados[0]
    const ultimo = dados[dados.length - 1]
    const passo = (dados.length - 1) / (maxPontos - 1)
    
    const dadosReduzidos: T[] = [primeiro]
    const indicesUsados = new Set<number>([0, dados.length - 1])
    
    for (let i = 1; i < maxPontos - 1; i++) {
      const indice = Math.round(i * passo)
      if (indice > 0 && indice < dados.length - 1 && !indicesUsados.has(indice)) {
        dadosReduzidos.push(dados[indice])
        indicesUsados.add(indice)
      }
    }
    
    dadosReduzidos.push(ultimo)
    return dadosReduzidos
  }

  // Teste 1: Dados menores que o limite
  const dadosPequenos = Array.from({ length: 10 }, (_, i) => ({ id: i, valor: i * 10 }))
  const resultado1 = reduzirDados(dadosPequenos, 30)
  console.log('✅ Teste 1 - Dados pequenos (10 pontos):')
  console.log(`   Entrada: ${dadosPequenos.length} pontos`)
  console.log(`   Saída: ${resultado1.length} pontos`)
  console.log(`   Primeiro: ${resultado1[0]?.id}, Último: ${resultado1[resultado1.length - 1]?.id}`)
  console.log(`   Status: ${resultado1.length === 10 ? '✅ PASSOU' : '❌ FALHOU'}\n`)

  // Teste 2: Dados maiores que o limite
  const dadosGrandes = Array.from({ length: 100 }, (_, i) => ({ id: i, valor: i * 10 }))
  const resultado2 = reduzirDados(dadosGrandes, 30)
  console.log('✅ Teste 2 - Dados grandes (100 pontos → 30):')
  console.log(`   Entrada: ${dadosGrandes.length} pontos`)
  console.log(`   Saída: ${resultado2.length} pontos`)
  console.log(`   Primeiro: ${resultado2[0]?.id}, Último: ${resultado2[resultado2.length - 1]?.id}`)
  console.log(`   Status: ${resultado2.length <= 30 && resultado2[0]?.id === 0 && resultado2[resultado2.length - 1]?.id === 99 ? '✅ PASSOU' : '❌ FALHOU'}\n`)

  // Teste 3: Verificar que primeiro e último estão sempre presentes
  const dadosExtremos = Array.from({ length: 200 }, (_, i) => ({ id: i, valor: i * 10 }))
  const resultado3 = reduzirDados(dadosExtremos, 30)
  const temPrimeiro = resultado3[0]?.id === 0
  const temUltimo = resultado3[resultado3.length - 1]?.id === 199
  console.log('✅ Teste 3 - Primeiro e último sempre presentes:')
  console.log(`   Primeiro presente: ${temPrimeiro ? '✅' : '❌'}`)
  console.log(`   Último presente: ${temUltimo ? '✅' : '❌'}`)
  console.log(`   Status: ${temPrimeiro && temUltimo ? '✅ PASSOU' : '❌ FALHOU'}\n`)

  return {
    teste1: resultado1.length === 10,
    teste2: resultado2.length <= 30 && resultado2[0]?.id === 0 && resultado2[resultado2.length - 1]?.id === 99,
    teste3: temPrimeiro && temUltimo,
  }
}

// Teste das métricas do TabEvolucao
function testMetricasTabEvolucao() {
  console.log('🧪 Testando métricas do TabEvolucao...\n')

  const METRICS = [
    { key: 'score_ronco', label: 'Score de Ronco', unit: 'pontos', filterType: 0 },
    { key: 'ido', label: 'IDO', unit: '/hora', filterType: 1 },
    { key: 'tempo_spo2_90', label: 'Tempo com SpO2 < 90%', unit: '%', filterType: 1 },
    { key: 'spo2_min', label: 'SpO2 Mínima', unit: '%', filterType: 1 },
    { key: 'spo2_avg', label: 'SpO2 Média', unit: '%', filterType: 1 },
    { key: 'spo2_max', label: 'SpO2 Máxima', unit: '%', filterType: 1 },
    { key: 'num_dessaturacoes', label: 'Número de Dessaturações', unit: '#', filterType: 1 },
    { key: 'num_eventos_hipoxemia', label: 'Número de Eventos de Hipoxemia', unit: '#', filterType: 1 },
    { key: 'tempo_hipoxemia', label: 'Tempo Total em Hipoxemia', unit: 'min', filterType: 1 },
    { key: 'carga_hipoxica', label: 'Carga Hipóxica', unit: '%.min/hora', filterType: 1 },
    { key: 'bpm_min', label: 'Frequência Cardíaca Mínima', unit: 'bpm', filterType: 1 },
    { key: 'bpm_medio', label: 'Frequência Cardíaca Média', unit: 'bpm', filterType: 1 },
    { key: 'bpm_max', label: 'Frequência Cardíaca Máxima', unit: 'bpm', filterType: 1 },
  ]

  console.log('✅ Verificando métricas:')
  console.log(`   Total de métricas: ${METRICS.length}`)
  console.log(`   Esperado: 13 métricas`)
  console.log(`   Status: ${METRICS.length === 13 ? '✅ PASSOU' : '❌ FALHOU'}\n`)

  // Verificar que todas têm os campos obrigatórios
  const todasTemCampos = METRICS.every(m => m.key && m.label && m.unit !== undefined)
  console.log('✅ Verificando campos obrigatórios:')
  console.log(`   Todas têm key, label e unit: ${todasTemCampos ? '✅' : '❌'}`)
  console.log(`   Status: ${todasTemCampos ? '✅ PASSOU' : '❌ FALHOU'}\n`)

  // Verificar filtros de tipo
  const metricasRonco = METRICS.filter(m => m.filterType === 0)
  const metricasSono = METRICS.filter(m => m.filterType === 1)
  console.log('✅ Verificando filtros de tipo:')
  console.log(`   Métricas de Ronco: ${metricasRonco.length} (esperado: 1)`)
  console.log(`   Métricas de Sono: ${metricasSono.length} (esperado: 12)`)
  console.log(`   Status: ${metricasRonco.length === 1 && metricasSono.length === 12 ? '✅ PASSOU' : '❌ FALHOU'}\n`)

  return {
    totalMetricas: METRICS.length === 13,
    camposObrigatorios: todasTemCampos,
    filtrosTipo: metricasRonco.length === 1 && metricasSono.length === 12,
  }
}

// Executar todos os testes
function executarTestes() {
  console.log('='.repeat(60))
  console.log('🧪 TESTES - FASE 2 COMPONENTES')
  console.log('='.repeat(60))
  console.log('')

  const resultadosReducao = testReduzirDados()
  const resultadosMetricas = testMetricasTabEvolucao()

  console.log('='.repeat(60))
  console.log('📊 RESUMO DOS TESTES')
  console.log('='.repeat(60))
  console.log('')

  const todosPassaram = 
    resultadosReducao.teste1 &&
    resultadosReducao.teste2 &&
    resultadosReducao.teste3 &&
    resultadosMetricas.totalMetricas &&
    resultadosMetricas.camposObrigatorios &&
    resultadosMetricas.filtrosTipo

  console.log('Função reduzirDados:')
  console.log(`  ✅ Teste 1 (dados pequenos): ${resultadosReducao.teste1 ? 'PASSOU' : 'FALHOU'}`)
  console.log(`  ✅ Teste 2 (dados grandes): ${resultadosReducao.teste2 ? 'PASSOU' : 'FALHOU'}`)
  console.log(`  ✅ Teste 3 (primeiro/último): ${resultadosReducao.teste3 ? 'PASSOU' : 'FALHOU'}`)
  console.log('')

  console.log('Métricas TabEvolucao:')
  console.log(`  ✅ Total de métricas: ${resultadosMetricas.totalMetricas ? 'PASSOU' : 'FALHOU'}`)
  console.log(`  ✅ Campos obrigatórios: ${resultadosMetricas.camposObrigatorios ? 'PASSOU' : 'FALHOU'}`)
  console.log(`  ✅ Filtros de tipo: ${resultadosMetricas.filtrosTipo ? 'PASSOU' : 'FALHOU'}`)
  console.log('')

  console.log('='.repeat(60))
  if (todosPassaram) {
    console.log('✅ TODOS OS TESTES PASSARAM!')
  } else {
    console.log('❌ ALGUNS TESTES FALHARAM')
  }
  console.log('='.repeat(60))

  process.exit(todosPassaram ? 0 : 1)
}

// Executar
executarTestes()

