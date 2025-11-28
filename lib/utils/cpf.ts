/**
 * CPF validation and formatting utilities
 * These functions match the PostgreSQL functions in migration 002_functions.sql
 */

/**
 * Validates CPF using the official Brazilian algorithm
 * @param cpf - CPF string (with or without mask)
 * @returns true if CPF is valid, false otherwise
 */
export function validar_cpf(cpf: string): boolean {
  if (!cpf) return false;

  // Remove non-numeric characters
  const cpfLimpo = cpf.replace(/[^0-9]/g, '');

  // Check if CPF has 11 digits
  if (cpfLimpo.length !== 11) {
    return false;
  }

  // Check if all digits are the same (invalid CPF)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false;
  }

  // Calculate first check digit
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo[i]) * (11 - (i + 1));
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  const digito1 = resto;

  // Check first digit
  if (digito1 !== parseInt(cpfLimpo[9])) {
    return false;
  }

  // Calculate second check digit
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo[i]) * (12 - (i + 1));
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) {
    resto = 0;
  }
  const digito2 = resto;

  // Check second digit
  if (digito2 !== parseInt(cpfLimpo[10])) {
    return false;
  }

  return true;
}

/**
 * Formats CPF as 000.000.000-00
 * @param cpf - CPF string (with or without mask)
 * @returns Formatted CPF or original string if invalid length
 */
export function formatar_cpf(cpf: string): string {
  if (!cpf) return cpf;

  // Remove non-numeric characters
  const cpfLimpo = cpf.replace(/[^0-9]/g, '');

  // Check if CPF has 11 digits
  if (cpfLimpo.length !== 11) {
    return cpf; // Return original if invalid length
  }

  // Format as 000.000.000-00
  return `${cpfLimpo.substring(0, 3)}.${cpfLimpo.substring(3, 6)}.${cpfLimpo.substring(6, 9)}-${cpfLimpo.substring(9, 11)}`;
}

/**
 * Extracts CPF from username using regex
 * @param username - Username string that may contain CPF
 * @returns CPF string (11 digits) or null if not found
 */
export function extract_cpf_from_username(username: string): string | null {
  if (!username) return null;

  // Extract only numbers from username
  const numbers = username.replace(/[^0-9]/g, '');

  // Check if we have exactly 11 digits (CPF length)
  if (numbers.length === 11) {
    return numbers;
  }

  return null;
}

