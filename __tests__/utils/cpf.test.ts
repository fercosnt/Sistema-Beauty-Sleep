import { validar_cpf, formatar_cpf, extract_cpf_from_username } from '@/lib/utils/cpf';

describe('validar_cpf', () => {
  describe('valid CPF', () => {
    it('should validate a valid CPF without mask', () => {
      // Valid CPF: 11144477735
      expect(validar_cpf('11144477735')).toBe(true);
    });

    it('should validate a valid CPF with mask', () => {
      // Valid CPF: 111.444.777-35
      expect(validar_cpf('111.444.777-35')).toBe(true);
    });

    it('should validate another valid CPF', () => {
      // Valid CPF: 12345678909
      expect(validar_cpf('12345678909')).toBe(true);
    });

    it('should validate CPF with spaces', () => {
      // Valid CPF with spaces
      expect(validar_cpf('111 444 777 35')).toBe(true);
    });
  });

  describe('invalid CPF', () => {
    it('should reject CPF with wrong length (less than 11 digits)', () => {
      expect(validar_cpf('1234567890')).toBe(false);
    });

    it('should reject CPF with wrong length (more than 11 digits)', () => {
      expect(validar_cpf('123456789012')).toBe(false);
    });

    it('should reject CPF with all same digits', () => {
      expect(validar_cpf('11111111111')).toBe(false);
      expect(validar_cpf('00000000000')).toBe(false);
      expect(validar_cpf('99999999999')).toBe(false);
    });

    it('should reject CPF with invalid check digits', () => {
      // Invalid CPF: 11144477736 (wrong last digit)
      expect(validar_cpf('11144477736')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validar_cpf('')).toBe(false);
    });

    it('should reject null/undefined (treated as empty)', () => {
      expect(validar_cpf(null as any)).toBe(false);
      expect(validar_cpf(undefined as any)).toBe(false);
    });

    it('should reject CPF with only letters', () => {
      expect(validar_cpf('abcdefghijk')).toBe(false);
    });
  });
});

describe('formatar_cpf', () => {
  describe('with mask', () => {
    it('should format CPF without mask to 000.000.000-00', () => {
      expect(formatar_cpf('11144477735')).toBe('111.444.777-35');
    });

    it('should format CPF that already has mask (should re-format)', () => {
      expect(formatar_cpf('111.444.777-35')).toBe('111.444.777-35');
    });

    it('should format CPF with spaces', () => {
      expect(formatar_cpf('111 444 777 35')).toBe('111.444.777-35');
    });

    it('should format another valid CPF', () => {
      expect(formatar_cpf('12345678909')).toBe('123.456.789-09');
    });
  });

  describe('without mask (invalid length)', () => {
    it('should return original string if CPF has less than 11 digits', () => {
      expect(formatar_cpf('1234567890')).toBe('1234567890');
    });

    it('should return original string if CPF has more than 11 digits', () => {
      expect(formatar_cpf('123456789012')).toBe('123456789012');
    });

    it('should return original string if empty', () => {
      expect(formatar_cpf('')).toBe('');
    });
  });
});

describe('extract_cpf_from_username', () => {
  it('should extract CPF from username with 11 digits', () => {
    expect(extract_cpf_from_username('11144477735')).toBe('11144477735');
  });

  it('should extract CPF from username with letters and numbers', () => {
    expect(extract_cpf_from_username('user11144477735')).toBe('11144477735');
  });

  it('should extract CPF from username with special characters', () => {
    expect(extract_cpf_from_username('111.444.777-35')).toBe('11144477735');
  });

  it('should return null if username has less than 11 digits', () => {
    expect(extract_cpf_from_username('1234567890')).toBe(null);
  });

  it('should return null if username has more than 11 digits', () => {
    expect(extract_cpf_from_username('123456789012')).toBe(null);
  });

  it('should return null if username is empty', () => {
    expect(extract_cpf_from_username('')).toBe(null);
  });

  it('should return null if username has no numbers', () => {
    expect(extract_cpf_from_username('username')).toBe(null);
  });
});

