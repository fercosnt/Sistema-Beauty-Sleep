# 🔍 Análise: Testes de Pacientes Falhando

**Data:** 2025-12-02

---

## ⚠️ Testes Falhando (10 testes)

### 1. **should navigate to pacientes page**
- **Erro:** Provavelmente timeout ou elemento não encontrado

### 2. **create paciente: fill form → submit → verify in list** (2x - integration e chromium)
- **Erro:** Formulário pode não estar funcionando corretamente
- **Possíveis causas:**
  - Modal não abre
  - Campos não preenchem
  - Submit não funciona
  - Paciente não aparece na lista

### 3. **ID do Paciente validation: missing ID → error message** (2x)
- **Erro:** Validação não está aparecendo ou teste não está aguardando corretamente

### 4. **CPF validation: invalid CPF → error message** (2x)
- **Erro:** Validação de CPF não está funcionando ou teste não está aguardando

### 5. **duplicate ID do Paciente: create paciente with existing biologix_id → error** (2x)
- **Erro:** Erro de duplicação não está aparecendo ou teste não está aguardando

### 6. **create sessão: open modal → fill → submit → verify count updated** (1x)
- **Erro:** Modal de sessão não funciona ou contador não atualiza

---

## 🔍 Possíveis Problemas

### 1. **Problema com CPF opcional**

O código mostra que CPF **OU** Documento Estrangeiro é obrigatório, mas o teste pode estar tentando criar sem nenhum dos dois.

**Linha 302-307 do ModalNovoPaciente.tsx:**
```typescript
if (!cpfLimpo && !documentoEstrangeiroLimpo) {
  newErrors.cpf = 'CPF ou Documento Estrangeiro é obrigatório'
}
```

**Teste precisa:**
- Preencher CPF OU Documento Estrangeiro

### 2. **Problema com validações assíncronas**

As validações de CPF e ID do Paciente são assíncronas (onBlur). O teste pode não estar aguardando essas validações.

### 3. **Problema com busca na lista**

O teste busca o paciente na lista após criar. Pode estar falhando:
- Lista não atualiza
- Busca não funciona
- Timeout muito curto

---

## ✅ Soluções Sugeridas

### 1. Melhorar testes para aguardar validações

Adicionar waits para validações assíncronas:
```typescript
// Aguardar validação de CPF
await page.fill('#cpf', testCPF);
await page.blur('#cpf'); // Trigger blur
await page.waitForTimeout(1000); // Aguardar validação
```

### 2. Verificar se CPF está sendo preenchido

Garantir que o teste sempre preenche CPF ou Documento Estrangeiro.

### 3. Melhorar busca na lista

Aumentar timeout e usar seletores mais robustos.

---

**Última atualização:** 2025-12-02

