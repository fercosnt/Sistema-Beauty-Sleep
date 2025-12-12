# Guia: Atualizar ModalNovoPaciente para usar ID do Paciente

**Arquivo:** `app/pacientes/components/ModalNovoPaciente.tsx`

---

## 📋 O que precisa ser alterado

### 1. **Adicionar campo "ID do Paciente" (biologix_id) na interface FormData**

**Localização:** Linha 14-23

**Alterar:**
```typescript
interface FormData {
  cpf: string
  nome: string
  // ... outros campos
}
```

**Para:**
```typescript
interface FormData {
  idPaciente: string  // NOVO: ID do Paciente (biologix_id) - OBRIGATÓRIO
  cpf: string         // Agora OPCIONAL (para validação e busca)
  nome: string
  // ... outros campos
}
```

---

### 2. **Adicionar estado para validação de ID do Paciente**

**Localização:** Linha 36-40

**Adicionar após linha 40:**
```typescript
const [idPacienteValidating, setIdPacienteValidating] = useState(false)
const [idPacienteExists, setIdPacienteExists] = useState(false)
const [existingPacienteById, setExistingPacienteById] = useState<{ id: string; nome: string } | null>(null)
```

---

### 3. **Atualizar reset do form para incluir idPaciente**

**Localização:** Linha 42-58

**Alterar o reset do formData para incluir:**
```typescript
setFormData({
  idPaciente: '',  // NOVO
  cpf: '',
  nome: '',
  // ... outros campos
})
```

---

### 4. **Adicionar função para verificar se ID do Paciente já existe**

**Localização:** Após a função `checkCPFExists` (linha 156)

**Adicionar:**
```typescript
const checkIdPacienteExists = async (idPaciente: string) => {
  if (!idPaciente || idPaciente.trim() === '') {
    return null
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('pacientes')
      .select('id, nome')
      .eq('biologix_id', idPaciente.trim())
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Erro ao verificar ID do Paciente:', error)
      return null
    }

    return data || null
  } catch (error) {
    console.error('Erro inesperado ao verificar ID do Paciente:', error)
    return null
  }
}
```

---

### 5. **Adicionar handler para blur do campo ID do Paciente**

**Localização:** Após `handleCPFBlur` (linha 199)

**Adicionar:**
```typescript
const handleIdPacienteBlur = async () => {
  const idPaciente = formData.idPaciente.trim()
  
  if (!idPaciente) {
    setErrors({ ...errors, idPaciente: 'ID do Paciente é obrigatório' })
    setIdPacienteExists(false)
    setExistingPacienteById(null)
    return
  }

  setIdPacienteValidating(true)

  // Verificar se ID do Paciente já existe
  const existing = await checkIdPacienteExists(idPaciente)
  if (existing) {
    setIdPacienteExists(true)
    setExistingPacienteById(existing)
    setErrors({ ...errors, idPaciente: `ID do Paciente já cadastrado para: ${existing.nome}` })
  } else {
    setIdPacienteExists(false)
    setExistingPacienteById(null)
    setErrors({ ...errors, idPaciente: undefined })
  }

  setIdPacienteValidating(false)
}
```

---

### 6. **Atualizar validação no handleSubmit**

**Localização:** Linha 201-226

**Alterar validação para:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  // Validação básica
  const newErrors: Partial<Record<keyof FormData, string>> = {}

  // ID do Paciente é OBRIGATÓRIO (chave única)
  if (!formData.idPaciente || formData.idPaciente.trim() === '') {
    newErrors.idPaciente = 'ID do Paciente é obrigatório'
  }

  // CPF agora é OPCIONAL (apenas para validação e busca)
  if (formData.cpf && formData.cpf.replace(/\D/g, '').length !== 11) {
    newErrors.cpf = 'CPF deve ter 11 dígitos'
  }

  if (!formData.nome.trim()) {
    newErrors.nome = 'Nome é obrigatório'
  }

  if (formData.status === 'ativo' && formData.sessoesCompradas < 0) {
    newErrors.sessoesCompradas = 'Sessões compradas deve ser um número positivo'
  }

  // Verificar duplicatas
  if (idPacienteExists) {
    newErrors.idPaciente = 'ID do Paciente já cadastrado. Por favor, verifique o paciente existente.'
  }

  if (cpfExists) {
    newErrors.cpf = 'CPF já cadastrado. Por favor, verifique o paciente existente.'
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }

  // ... resto do código
}
```

---

### 7. **Atualizar submit para usar upsert com biologix_id**

**Localização:** Linha 228-280

**Alterar a lógica de insert para upsert:**
```typescript
try {
  const supabase = createClient()
  const cpfLimpo = formData.cpf.replace(/\D/g, '') || null

  const pacienteData: any = {
    biologix_id: formData.idPaciente.trim(),  // NOVO: Chave única
    nome: formData.nome.trim(),
    status: formData.status,
    sessoes_compradas: formData.status === 'ativo' ? formData.sessoesCompradas : 0,
  }

  // CPF é opcional - só adicionar se válido
  if (cpfLimpo && cpfLimpo.length === 11) {
    pacienteData.cpf = cpfLimpo
  }

  // Campos opcionais
  if (formData.email.trim()) {
    pacienteData.email = formData.email.trim()
  }
  if (formData.telefone.replace(/\D/g, '')) {
    pacienteData.telefone = formData.telefone.replace(/\D/g, '')
  }
  if (formData.dataNascimento) {
    pacienteData.data_nascimento = formData.dataNascimento
  }
  if (formData.genero) {
    pacienteData.genero = formData.genero
  }

  // Usar UPSERT com biologix_id como chave única
  const { data, error } = await supabase
    .from('pacientes')
    .upsert(pacienteData, {
      onConflict: 'biologix_id',
      ignoreDuplicates: false
    })
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar/atualizar paciente:', error)
    if (error.code === '23505') {
      // Unique constraint violation
      showError('ID do Paciente já cadastrado no sistema')
    } else {
      showError('Erro ao criar paciente. Tente novamente.')
    }
    setIsSubmitting(false)
    return
  }

  showSuccess('Paciente criado com sucesso!')
  setIsSubmitting(false)
  onSuccess?.()
  onClose()
} catch (error) {
  console.error('Erro inesperado ao criar paciente:', error)
  showError('Erro inesperado ao criar paciente')
  setIsSubmitting(false)
}
```

---

### 8. **Adicionar campo ID do Paciente no formulário**

**Localização:** Após a linha 336 (depois do campo CPF)

**Adicionar o novo campo:**
```typescript
{/* ID do Paciente - OBRIGATÓRIO (chave única) */}
<div>
  <label htmlFor="idPaciente" className="block text-sm font-medium text-black mb-2">
    ID do Paciente <span className="text-danger-600">*</span>
    <span className="text-xs text-gray-500 ml-2">(Identificador único do Biologix)</span>
  </label>
  <input
    id="idPaciente"
    type="text"
    value={formData.idPaciente}
    onChange={(e) => {
      setFormData({ ...formData, idPaciente: e.target.value.trim() })
      if (errors.idPaciente) {
        setErrors({ ...errors, idPaciente: undefined })
      }
      if (idPacienteExists) {
        setIdPacienteExists(false)
        setExistingPacienteById(null)
      }
    }}
    onBlur={handleIdPacienteBlur}
    placeholder="PAC-1234567890"
    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
      errors.idPaciente ? 'border-danger-500' : 'border-gray-300'
    }`}
    disabled={isSubmitting || idPacienteValidating}
  />
  {idPacienteValidating && <p className="mt-1 text-sm text-black">Verificando ID do Paciente...</p>}
  {errors.idPaciente && <p className="mt-1 text-sm text-danger-600">{errors.idPaciente}</p>}
  {idPacienteExists && existingPacienteById && (
    <div className="mt-2 p-3 bg-warning-50 border border-warning-200 rounded-lg">
      <p className="text-sm text-warning-800">
        <strong>Paciente já existe:</strong> {existingPacienteById.nome}
      </p>
      <p className="text-xs text-warning-600 mt-1">
        Considere buscar este paciente na lista ao invés de criar um novo.
      </p>
    </div>
  )}
</div>
```

---

### 9. **Atualizar label do CPF para indicar que é opcional**

**Localização:** Linha 303-304

**Alterar:**
```typescript
<label htmlFor="cpf" className="block text-sm font-medium text-black mb-2">
  CPF <span className="text-danger-600">*</span>
</label>
```

**Para:**
```typescript
<label htmlFor="cpf" className="block text-sm font-medium text-black mb-2">
  CPF <span className="text-xs text-gray-500">(Opcional - usado apenas para validação e busca)</span>
</label>
```

---

### 10. **Atualizar botão submit para verificar idPacienteExists**

**Localização:** Linha 509

**Alterar:**
```typescript
disabled={isSubmitting || cpfExists}
```

**Para:**
```typescript
disabled={isSubmitting || cpfExists || idPacienteExists}
```

---

## 📝 Resumo das Mudanças

### Campos alterados:
1. ✅ **ID do Paciente (biologix_id)** - Adicionado como campo **OBRIGATÓRIO**
2. ✅ **CPF** - Mudado para **OPCIONAL** (usado apenas para validação e busca)

### Lógica alterada:
1. ✅ Validação de duplicata agora verifica `biologix_id` ao invés de CPF
2. ✅ Submit usa `upsert` com `onConflict: 'biologix_id'` ao invés de `insert`
3. ✅ CPF é opcional no insert (só adiciona se válido)

### Ordem dos campos no formulário:
1. **ID do Paciente** (novo, obrigatório, primeiro)
2. CPF (opcional, segundo)
3. Nome (obrigatório)
4. Email, Telefone, etc.

---

## ⚠️ Importante

- O campo **ID do Paciente** deve ser o **primeiro campo** do formulário (antes do CPF)
- CPF agora é **opcional** mas continua sendo validado se preenchido
- O submit usa **upsert** ao invés de **insert** para permitir atualizações

---

**Arquivo completo:** `app/pacientes/components/ModalNovoPaciente.tsx`

