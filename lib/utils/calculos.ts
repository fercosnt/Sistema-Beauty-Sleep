/**
 * Calculation utilities
 * These functions match the PostgreSQL functions in migration 002_functions.sql
 */

/**
 * Calculates BMI (Body Mass Index)
 * @param peso_kg - Weight in kilograms
 * @param altura_cm - Height in centimeters
 * @returns BMI value rounded to 2 decimal places, or null if invalid
 */
export function calcular_imc(peso_kg: number | null, altura_cm: number | null): number | null {
  if (peso_kg === null || altura_cm === null || altura_cm <= 0) {
    return null;
  }

  const altura_m = altura_cm / 100.0;
  const imc = peso_kg / (altura_m * altura_m);
  
  return Math.round(imc * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculates snoring score: (baixo × 1 + medio × 2 + alto × 3) / 3
 * @param baixo - Low intensity percentage
 * @param medio - Medium intensity percentage
 * @param alto - High intensity percentage
 * @returns Snoring score rounded to 2 decimal places, or null if total is 0
 */
export function calcular_score_ronco(
  baixo: number | null,
  medio: number | null,
  alto: number | null
): number | null {
  const baixoValue = baixo ?? 0;
  const medioValue = medio ?? 0;
  const altoValue = alto ?? 0;

  const total = baixoValue + medioValue + altoValue;
  if (total === 0) {
    return null;
  }

  const score = (baixoValue * 1 + medioValue * 2 + altoValue * 3) / 3;
  return Math.round(score * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculates treatment adherence percentage
 * @param sessoes_utilizadas - Number of sessions used
 * @param sessoes_total - Total number of sessions
 * @returns Adherence percentage rounded to 2 decimal places, or null if invalid
 */
export function calcular_adesao(
  sessoes_utilizadas: number | null,
  sessoes_total: number | null
): number | null {
  if (sessoes_total === null || sessoes_total <= 0) {
    return null;
  }

  const utilizadas = sessoes_utilizadas ?? 0;
  const adesao = (utilizadas / sessoes_total) * 100;
  
  return Math.round(adesao * 100) / 100; // Round to 2 decimal places
}

