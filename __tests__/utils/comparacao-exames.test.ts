import {
  calcularMelhoraPercentual,
  obterPrimeiroUltimoExame,
  obterPiorMelhorExame,
  calcularComparacaoMetricas,
  type ExameComparacao,
} from '@/lib/utils/comparacao-exames'

describe('calcularMelhoraPercentual', () => {
  describe('Métricas onde menor é melhor (IDO, Score Ronco)', () => {
    it('should calculate improvement when value decreases', () => {
      // IDO: 30 → 20 (melhora de 33.33%)
      const result = calcularMelhoraPercentual(30, 20, true)
      expect(result).toBeCloseTo(33.33, 1)
    })

    it('should calculate worsening when value increases', () => {
      // IDO: 20 → 30 (piora de -50%)
      const result = calcularMelhoraPercentual(20, 30, true)
      expect(result).toBeCloseTo(-50, 1)
    })

    it('should return 0 when values are equal', () => {
      const result = calcularMelhoraPercentual(25, 25, true)
      expect(result).toBe(0)
    })

    it('should return null when initial value is null', () => {
      const result = calcularMelhoraPercentual(null, 20, true)
      expect(result).toBeNull()
    })

    it('should return null when final value is null', () => {
      const result = calcularMelhoraPercentual(30, null, true)
      expect(result).toBeNull()
    })

    it('should handle zero initial value', () => {
      // Quando inicial é 0, retorna -100 se final > 0 (piora)
      const result = calcularMelhoraPercentual(0, 10, true)
      expect(result).toBe(-100)
    })
  })

  describe('Métricas onde maior é melhor (SpO2)', () => {
    it('should calculate improvement when value increases', () => {
      // SpO2: 85 → 95 (melhora de 11.76%)
      const result = calcularMelhoraPercentual(85, 95, false)
      expect(result).toBeCloseTo(11.76, 1)
    })

    it('should calculate worsening when value decreases', () => {
      // SpO2: 95 → 85 (piora de -10.53%)
      const result = calcularMelhoraPercentual(95, 85, false)
      expect(result).toBeCloseTo(-10.53, 1)
    })

    it('should return 0 when values are equal', () => {
      const result = calcularMelhoraPercentual(90, 90, false)
      expect(result).toBe(0)
    })
  })
})

describe('obterPrimeiroUltimoExame', () => {
  it('should return first and last exam from sorted array', () => {
    const exames: ExameComparacao[] = [
      { id: '1', data_exame: '2024-01-01', tipo: 1, ido: 30, score_ronco: null, spo2_min: 85, spo2_avg: 90, spo2_max: 95 },
      { id: '2', data_exame: '2024-02-01', tipo: 1, ido: 25, score_ronco: null, spo2_min: 87, spo2_avg: 92, spo2_max: 96 },
      { id: '3', data_exame: '2024-03-01', tipo: 1, ido: 20, score_ronco: null, spo2_min: 90, spo2_avg: 94, spo2_max: 98 },
    ]

    const { primeiro, ultimo } = obterPrimeiroUltimoExame(exames)

    expect(primeiro?.id).toBe('1')
    expect(ultimo?.id).toBe('3')
  })

  it('should return null for both when array is empty', () => {
    const { primeiro, ultimo } = obterPrimeiroUltimoExame([])

    expect(primeiro).toBeNull()
    expect(ultimo).toBeNull()
  })

  it('should return same exam for both when array has one element', () => {
    const exames: ExameComparacao[] = [
      { id: '1', data_exame: '2024-01-01', tipo: 1, ido: 30, score_ronco: null, spo2_min: 85, spo2_avg: 90, spo2_max: 95 },
    ]

    const { primeiro, ultimo } = obterPrimeiroUltimoExame(exames)

    expect(primeiro?.id).toBe('1')
    expect(ultimo?.id).toBe('1')
  })
})

describe('obterPiorMelhorExame', () => {
  it('should return worst (highest IDO) and best (lowest IDO) exam', () => {
    const exames: ExameComparacao[] = [
      { id: '1', data_exame: '2024-01-01', tipo: 1, ido: 30, score_ronco: null, spo2_min: 85, spo2_avg: 90, spo2_max: 95 },
      { id: '2', data_exame: '2024-02-01', tipo: 1, ido: 15, score_ronco: null, spo2_min: 87, spo2_avg: 92, spo2_max: 96 },
      { id: '3', data_exame: '2024-03-01', tipo: 1, ido: 25, score_ronco: null, spo2_min: 90, spo2_avg: 94, spo2_max: 98 },
    ]

    const { pior, melhor } = obterPiorMelhorExame(exames)

    expect(pior?.id).toBe('1') // IDO = 30 (pior)
    expect(melhor?.id).toBe('2') // IDO = 15 (melhor)
  })

  it('should filter only type 1 (Sono) exams with IDO', () => {
    const exames: ExameComparacao[] = [
      { id: '1', data_exame: '2024-01-01', tipo: 0, ido: null, score_ronco: 2.5, spo2_min: null, spo2_avg: null, spo2_max: null }, // Ronco
      { id: '2', data_exame: '2024-02-01', tipo: 1, ido: 30, score_ronco: null, spo2_min: 85, spo2_avg: 90, spo2_max: 95 }, // Sono com IDO
      { id: '3', data_exame: '2024-03-01', tipo: 1, ido: null, score_ronco: null, spo2_min: 90, spo2_avg: 94, spo2_max: 98 }, // Sono sem IDO
    ]

    const { pior, melhor } = obterPiorMelhorExame(exames)

    // Deve retornar apenas o exame tipo 1 com IDO
    expect(pior?.id).toBe('2')
    expect(melhor?.id).toBe('2')
  })

  it('should return null for both when no type 1 exams with IDO', () => {
    const exames: ExameComparacao[] = [
      { id: '1', data_exame: '2024-01-01', tipo: 0, ido: null, score_ronco: 2.5, spo2_min: null, spo2_avg: null, spo2_max: null },
    ]

    const { pior, melhor } = obterPiorMelhorExame(exames)

    expect(pior).toBeNull()
    expect(melhor).toBeNull()
  })
})

describe('calcularComparacaoMetricas', () => {
  it('should calculate comparison for IDO metric', () => {
    const exameInicial: ExameComparacao = {
      id: '1',
      data_exame: '2024-01-01',
      tipo: 1,
      ido: 30,
      score_ronco: null,
      spo2_min: 85,
      spo2_avg: 90,
      spo2_max: 95,
    }

    const exameFinal: ExameComparacao = {
      id: '2',
      data_exame: '2024-02-01',
      tipo: 1,
      ido: 20,
      score_ronco: null,
      spo2_min: 90,
      spo2_avg: 94,
      spo2_max: 98,
    }

    const comparacoes = calcularComparacaoMetricas(exameInicial, exameFinal)

    const idoComparacao = comparacoes.find((c) => c.metrica === 'IDO')
    expect(idoComparacao).toBeDefined()
    expect(idoComparacao?.valorInicial).toBe(30)
    expect(idoComparacao?.valorFinal).toBe(20)
    expect(idoComparacao?.melhorou).toBe(true) // IDO menor é melhor
    expect(idoComparacao?.melhoraPercentual).toBeCloseTo(33.33, 1)
  })

  it('should calculate comparison for SpO2 Min metric', () => {
    const exameInicial: ExameComparacao = {
      id: '1',
      data_exame: '2024-01-01',
      tipo: 1,
      ido: 30,
      score_ronco: null,
      spo2_min: 85,
      spo2_avg: 90,
      spo2_max: 95,
    }

    const exameFinal: ExameComparacao = {
      id: '2',
      data_exame: '2024-02-01',
      tipo: 1,
      ido: 20,
      score_ronco: null,
      spo2_min: 90,
      spo2_avg: 94,
      spo2_max: 98,
    }

    const comparacoes = calcularComparacaoMetricas(exameInicial, exameFinal)

    const spo2MinComparacao = comparacoes.find((c) => c.metrica === 'SpO2 Mínima')
    expect(spo2MinComparacao).toBeDefined()
    expect(spo2MinComparacao?.valorInicial).toBe(85)
    expect(spo2MinComparacao?.valorFinal).toBe(90)
    expect(spo2MinComparacao?.melhorou).toBe(true) // SpO2 maior é melhor
  })

  it('should return empty array when exams are null', () => {
    const comparacoes = calcularComparacaoMetricas(null, null)
    expect(comparacoes).toEqual([])
  })

  it('should only compare metrics for same exam type', () => {
    const exameRonco: ExameComparacao = {
      id: '1',
      data_exame: '2024-01-01',
      tipo: 0,
      ido: null,
      score_ronco: 2.5,
      spo2_min: null,
      spo2_avg: null,
      spo2_max: null,
    }

    const exameSono: ExameComparacao = {
      id: '2',
      data_exame: '2024-02-01',
      tipo: 1,
      ido: 20,
      score_ronco: null,
      spo2_min: 90,
      spo2_avg: 94,
      spo2_max: 98,
    }

    // Comparar Ronco com Sono não deve retornar IDO ou SpO2
    const comparacoes = calcularComparacaoMetricas(exameRonco, exameSono)
    const idoComparacao = comparacoes.find((c) => c.metrica === 'IDO')
    expect(idoComparacao).toBeUndefined()
  })
})

