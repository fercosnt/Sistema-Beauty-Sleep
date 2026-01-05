/**
 * Funções utilitárias para comparação de exames
 * Usado na Tab Evolução para comparar primeiro/último e pior/melhor exame
 */

export interface ExameComparacao {
  id: string
  data_exame: string
  tipo: number | null
  ido: number | null
  score_ronco: number | null
  spo2_min: number | null
  spo2_avg: number | null
  spo2_max: number | null
  tempo_spo2_90_seg?: number | null
  carga_hipoxica?: number | null
  duracao_total_seg?: number | null
  [key: string]: any
}

export interface ComparacaoMetrica {
  metrica: string
  valorInicial: number | null
  valorFinal: number | null
  variacao: number | null
  melhoraPercentual: number | null
  melhorou: boolean
  menorMelhor: boolean // true se menor valor é melhor (IDO, Score Ronco, etc)
}

/**
 * Calcula a porcentagem de melhora entre dois valores
 * @param valorInicial - Valor inicial
 * @param valorFinal - Valor final
 * @param menorMelhor - true se menor valor é melhor (IDO, Score Ronco), false se maior é melhor (SpO2)
 * @returns Porcentagem de melhora (positiva = melhora, negativa = piora)
 */
export function calcularMelhoraPercentual(
  valorInicial: number | null,
  valorFinal: number | null,
  menorMelhor: boolean = true
): number | null {
  if (valorInicial === null || valorFinal === null) {
    return null
  }

  if (valorInicial === 0) {
    // Se valor inicial é 0, não podemos calcular porcentagem
    // Retornamos a diferença absoluta como indicador
    return valorFinal !== 0 ? (menorMelhor ? -100 : 100) : 0
  }

  if (menorMelhor) {
    // Para métricas onde menor é melhor (IDO, Score Ronco, etc)
    // Melhora = redução do valor
    // % = ((inicial - final) / inicial) * 100
    return ((valorInicial - valorFinal) / valorInicial) * 100
  } else {
    // Para métricas onde maior é melhor (SpO2, etc)
    // Melhora = aumento do valor
    // % = ((final - inicial) / inicial) * 100
    return ((valorFinal - valorInicial) / valorInicial) * 100
  }
}

/**
 * Obtém o primeiro e último exame de um array ordenado por data
 * @param exames - Array de exames ordenado por data_exame
 * @returns Objeto com primeiro e último exame
 */
export function obterPrimeiroUltimoExame(exames: ExameComparacao[]): {
  primeiro: ExameComparacao | null
  ultimo: ExameComparacao | null
} {
  if (exames.length === 0) {
    return { primeiro: null, ultimo: null }
  }

  return {
    primeiro: exames[0],
    ultimo: exames[exames.length - 1],
  }
}

/**
 * Obtém o pior e melhor exame baseado no IDO
 * Pior = maior IDO, Melhor = menor IDO
 * @param exames - Array de exames (apenas tipo 1 - Sono)
 * @returns Objeto com pior e melhor exame
 */
export function obterPiorMelhorExame(exames: ExameComparacao[]): {
  pior: ExameComparacao | null
  melhor: ExameComparacao | null
} {
  // Filtrar apenas exames tipo 1 (Sono) que tenham IDO
  const examesComIDO = exames.filter(
    (e) => e.tipo === 1 && e.ido !== null && e.ido !== undefined
  )

  if (examesComIDO.length === 0) {
    return { pior: null, melhor: null }
  }

  // Encontrar pior (maior IDO) e melhor (menor IDO)
  let pior = examesComIDO[0]
  let melhor = examesComIDO[0]

  for (const exame of examesComIDO) {
    if (exame.ido !== null && pior.ido !== null && exame.ido > pior.ido) {
      pior = exame
    }
    if (exame.ido !== null && melhor.ido !== null && exame.ido < melhor.ido) {
      melhor = exame
    }
  }

  return { pior, melhor }
}

/**
 * Calcula comparação de métricas entre dois exames
 * @param exameInicial - Exame inicial (primeiro ou pior)
 * @param exameFinal - Exame final (último ou melhor)
 * @returns Array de comparações de métricas
 */
export function calcularComparacaoMetricas(
  exameInicial: ExameComparacao | null,
  exameFinal: ExameComparacao | null
): ComparacaoMetrica[] {
  if (!exameInicial || !exameFinal) {
    return []
  }

  const comparacoes: ComparacaoMetrica[] = []

  // 1. IDO (apenas para exames tipo 1 - Sono)
  if (exameInicial.tipo === 1 && exameFinal.tipo === 1) {
    const idoInicial = exameInicial.ido
    const idoFinal = exameFinal.ido
    if (idoInicial !== null && idoFinal !== null) {
      const variacao = idoFinal - idoInicial
      const melhoraPercentual = calcularMelhoraPercentual(idoInicial, idoFinal, true)
      comparacoes.push({
        metrica: 'IDO',
        valorInicial: idoInicial,
        valorFinal: idoFinal,
        variacao,
        melhoraPercentual,
        melhorou: variacao < 0, // IDO menor é melhor
        menorMelhor: true,
      })
    }
  }

  // 2. SpO2 Mínima (apenas para exames tipo 1 - Sono)
  if (exameInicial.tipo === 1 && exameFinal.tipo === 1) {
    const spo2MinInicial = exameInicial.spo2_min
    const spo2MinFinal = exameFinal.spo2_min
    if (spo2MinInicial !== null && spo2MinFinal !== null) {
      const variacao = spo2MinFinal - spo2MinInicial
      const melhoraPercentual = calcularMelhoraPercentual(spo2MinInicial, spo2MinFinal, false)
      comparacoes.push({
        metrica: 'SpO2 Mínima',
        valorInicial: spo2MinInicial,
        valorFinal: spo2MinFinal,
        variacao,
        melhoraPercentual,
        melhorou: variacao > 0, // SpO2 maior é melhor
        menorMelhor: false,
      })
    }
  }

  // 3. Tempo com SpO2 < 90% (apenas para exames tipo 1 - Sono)
  if (exameInicial.tipo === 1 && exameFinal.tipo === 1) {
    const duracaoInicial = exameInicial.duracao_total_seg || 0
    const duracaoFinal = exameFinal.duracao_total_seg || 0
    const tempoSpo2_90Inicial = exameInicial.tempo_spo2_90_seg || 0
    const tempoSpo2_90Final = exameFinal.tempo_spo2_90_seg || 0

    if (duracaoInicial > 0 && duracaoFinal > 0) {
      const pctInicial = (tempoSpo2_90Inicial / duracaoInicial) * 100
      const pctFinal = (tempoSpo2_90Final / duracaoFinal) * 100
      const variacao = pctFinal - pctInicial
      const melhoraPercentual = calcularMelhoraPercentual(pctInicial, pctFinal, true)
      comparacoes.push({
        metrica: 'Tempo com SpO2 < 90%',
        valorInicial: pctInicial,
        valorFinal: pctFinal,
        variacao,
        melhoraPercentual,
        melhorou: variacao < 0, // Menor % é melhor
        menorMelhor: true,
      })
    }
  }

  // 4. Score Ronco (apenas para exames tipo 0 - Ronco)
  if (exameInicial.tipo === 0 && exameFinal.tipo === 0) {
    const scoreInicial = exameInicial.score_ronco
    const scoreFinal = exameFinal.score_ronco
    if (scoreInicial !== null && scoreFinal !== null) {
      const variacao = scoreFinal - scoreInicial
      const melhoraPercentual = calcularMelhoraPercentual(scoreInicial, scoreFinal, true)
      comparacoes.push({
        metrica: 'Score Ronco',
        valorInicial: scoreInicial,
        valorFinal: scoreFinal,
        variacao,
        melhoraPercentual,
        melhorou: variacao < 0, // Score menor é melhor
        menorMelhor: true,
      })
    }
  }

  // 5. Carga Hipóxica (apenas para exames tipo 1 - Sono)
  if (exameInicial.tipo === 1 && exameFinal.tipo === 1) {
    const cargaInicial = exameInicial.carga_hipoxica
    const cargaFinal = exameFinal.carga_hipoxica
    if (cargaInicial !== null && cargaFinal !== null) {
      const variacao = cargaFinal - cargaInicial
      const melhoraPercentual = calcularMelhoraPercentual(cargaInicial, cargaFinal, true)
      comparacoes.push({
        metrica: 'Carga Hipóxica',
        valorInicial: cargaInicial,
        valorFinal: cargaFinal,
        variacao,
        melhoraPercentual,
        melhorou: variacao < 0, // Carga menor é melhor
        menorMelhor: true,
      })
    }
  }

  return comparacoes
}

