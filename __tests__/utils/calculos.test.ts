import {
  calcular_imc,
  calcular_score_ronco,
  calcular_adesao,
} from '@/lib/utils/calculos';

describe('calcular_imc', () => {
  it('should calculate IMC correctly for normal weight', () => {
    // Weight: 70kg, Height: 175cm
    // IMC = 70 / (1.75 * 1.75) = 70 / 3.0625 = 22.86
    const result = calcular_imc(70, 175);
    expect(result).toBe(22.86);
  });

  it('should calculate IMC correctly for overweight', () => {
    // Weight: 80kg, Height: 170cm
    // IMC = 80 / (1.70 * 1.70) = 80 / 2.89 = 27.68
    const result = calcular_imc(80, 170);
    expect(result).toBe(27.68);
  });

  it('should calculate IMC correctly for obese', () => {
    // Weight: 100kg, Height: 170cm
    // IMC = 100 / (1.70 * 1.70) = 100 / 2.89 = 34.60
    const result = calcular_imc(100, 170);
    expect(result).toBe(34.6);
  });

  it('should calculate IMC correctly for underweight', () => {
    // Weight: 50kg, Height: 175cm
    // IMC = 50 / (1.75 * 1.75) = 50 / 3.0625 = 16.33
    const result = calcular_imc(50, 175);
    expect(result).toBe(16.33);
  });

  it('should return null if peso_kg is null', () => {
    expect(calcular_imc(null, 175)).toBe(null);
  });

  it('should return null if altura_cm is null', () => {
    expect(calcular_imc(70, null)).toBe(null);
  });

  it('should return null if altura_cm is 0', () => {
    expect(calcular_imc(70, 0)).toBe(null);
  });

  it('should return null if altura_cm is negative', () => {
    expect(calcular_imc(70, -10)).toBe(null);
  });

  it('should round to 2 decimal places', () => {
    // Weight: 75.5kg, Height: 180cm
    // IMC = 75.5 / (1.80 * 1.80) = 75.5 / 3.24 = 23.302469...
    const result = calcular_imc(75.5, 180);
    expect(result).toBe(23.3);
  });
});

describe('calcular_score_ronco', () => {
  it('should calculate score correctly with all values', () => {
    // baixo = 30, medio = 40, alto = 30
    // score = (30 * 1 + 40 * 2 + 30 * 3) / 3 = (30 + 80 + 90) / 3 = 200 / 3 = 66.67
    const result = calcular_score_ronco(30, 40, 30);
    expect(result).toBe(66.67);
  });

  it('should calculate score with only baixo', () => {
    // baixo = 100, medio = 0, alto = 0
    // score = (100 * 1 + 0 * 2 + 0 * 3) / 3 = 100 / 3 = 33.33
    const result = calcular_score_ronco(100, 0, 0);
    expect(result).toBe(33.33);
  });

  it('should calculate score with only medio', () => {
    // baixo = 0, medio = 100, alto = 0
    // score = (0 * 1 + 100 * 2 + 0 * 3) / 3 = 200 / 3 = 66.67
    const result = calcular_score_ronco(0, 100, 0);
    expect(result).toBe(66.67);
  });

  it('should calculate score with only alto', () => {
    // baixo = 0, medio = 0, alto = 100
    // score = (0 * 1 + 0 * 2 + 100 * 3) / 3 = 300 / 3 = 100
    const result = calcular_score_ronco(0, 0, 100);
    expect(result).toBe(100);
  });

  it('should return null if all values are zero', () => {
    expect(calcular_score_ronco(0, 0, 0)).toBe(null);
  });

  it('should handle null values as zero', () => {
    // baixo = null (treated as 0), medio = 50, alto = 50
    // score = (0 * 1 + 50 * 2 + 50 * 3) / 3 = (0 + 100 + 150) / 3 = 250 / 3 = 83.33
    const result = calcular_score_ronco(null, 50, 50);
    expect(result).toBe(83.33);
  });

  it('should handle all null values (should return null)', () => {
    expect(calcular_score_ronco(null, null, null)).toBe(null);
  });

  it('should round to 2 decimal places', () => {
    // baixo = 33.33, medio = 33.33, alto = 33.34
    // score = (33.33 * 1 + 33.33 * 2 + 33.34 * 3) / 3 = (33.33 + 66.66 + 100.02) / 3 = 200.01 / 3 = 66.67
    const result = calcular_score_ronco(33.33, 33.33, 33.34);
    expect(result).toBe(66.67);
  });
});

describe('calcular_adesao', () => {
  it('should calculate 0% adherence', () => {
    // 0 sessions used out of 10 total
    const result = calcular_adesao(0, 10);
    expect(result).toBe(0);
  });

  it('should calculate 50% adherence', () => {
    // 5 sessions used out of 10 total
    const result = calcular_adesao(5, 10);
    expect(result).toBe(50);
  });

  it('should calculate 100% adherence', () => {
    // 10 sessions used out of 10 total
    const result = calcular_adesao(10, 10);
    expect(result).toBe(100);
  });

  it('should calculate >100% adherence (more sessions used than total)', () => {
    // 15 sessions used out of 10 total (150%)
    const result = calcular_adesao(15, 10);
    expect(result).toBe(150);
  });

  it('should handle null sessoes_utilizadas as 0', () => {
    // null sessions used out of 10 total
    const result = calcular_adesao(null, 10);
    expect(result).toBe(0);
  });

  it('should return null if sessoes_total is null', () => {
    expect(calcular_adesao(5, null)).toBe(null);
  });

  it('should return null if sessoes_total is 0', () => {
    expect(calcular_adesao(5, 0)).toBe(null);
  });

  it('should return null if sessoes_total is negative', () => {
    expect(calcular_adesao(5, -10)).toBe(null);
  });

  it('should round to 2 decimal places', () => {
    // 3 sessions used out of 7 total
    // 3 / 7 * 100 = 42.857142...%
    const result = calcular_adesao(3, 7);
    expect(result).toBe(42.86);
  });

  it('should calculate with decimal values', () => {
    // 2.5 sessions used out of 5 total
    // 2.5 / 5 * 100 = 50%
    const result = calcular_adesao(2.5, 5);
    expect(result).toBe(50);
  });
});

