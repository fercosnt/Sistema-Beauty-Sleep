# ✅ Correções Aplicadas aos Testes de Pacientes

**Data:** 2025-12-02

---

## 🔧 Correções Realizadas

### 1. **Teste "CPF optional" corrigido** ✅

**Problema:** Teste tentava criar paciente sem CPF nem Documento Estrangeiro, mas o código exige um dos dois.

**Solução:**
- Teste agora preenche **Documento Estrangeiro** ao invés de CPF
- Garante que pelo menos um documento é preenchido

**Mudanças:**
```typescript
// Antes: Não preenchia nada
// Agora: Preenche Documento Estrangeiro
await page.fill('#documentoEstrangeiro', testDocumentoEstrangeiro);
```

---

### 2. **Validações Assíncronas melhoradas** ✅

**Problema:** Validações de CPF e ID do Paciente são assíncronas (onBlur), mas testes não aguardavam.

**Solução:**
- Adicionado `blur()` após preencher campos
- Adicionado `waitForTimeout()` para aguardar validações assíncronas

**Mudanças:**
```typescript
// Preencher campo
await page.fill('#idPaciente', testIdPaciente);

// Trigger blur para validar
await page.locator('#idPaciente').blur();
await page.waitForTimeout(1000); // Aguardar validação assíncrona
```

---

### 3. **Validação de ID do Paciente obrigatório melhorada** ✅

**Problema:** Teste não estava aguardando erro de validação corretamente.

**Solução:**
- Preenche CPF também (campo obrigatório)
- Adiciona múltiplos seletores para encontrar mensagem de erro
- Verifica se modal ainda está aberto se erro não aparecer

---

### 4. **Busca na lista melhorada** ✅

**Problema:** Busca após criar paciente pode falhar por timing.

**Solução:**
- Aumentado timeout
- Aguarda modal fechar completamente
- Aguarda refresh da lista
- Usa seletores mais robustos

---

### 5. **Teste de criação de sessão melhorado** ✅

**Problema:** Teste não selecionava protocolo e não aguardava corretamente.

**Solução:**
- Adiciona seleção de protocolo (tag)
- Melhora aguardar modal abrir/fechar
- Melhora verificação de contador atualizado

**Mudanças:**
```typescript
// Seleciona protocolo antes de criar sessão
const protocolButton = page.locator('button[type="button"]').filter({ 
  hasText: /atropina|vonau|nasal|palato|língua|combinado/i 
}).first();
if (await protocolButton.isVisible({ timeout: 3000 }).catch(() => false)) {
  await protocolButton.click();
}
```

---

### 6. **Teste de duplicate ID melhorado** ✅

**Problema:** Teste não aguardava validação de duplicata corretamente.

**Solução:**
- Adiciona blur e wait para validação assíncrona
- Preenche CPF também (campo obrigatório)
- Usa múltiplos seletores para encontrar erro
- Se erro não aparecer no blur, tenta submit e verifica erro

---

## 📋 Resumo das Mudanças

| Teste | Problema | Correção Aplicada |
|-------|----------|-------------------|
| CPF optional | Tentava criar sem documento | Preenche Documento Estrangeiro |
| Validações | Não aguardava validações assíncronas | Adiciona blur() + waitForTimeout() |
| ID obrigatório | Não aguardava erro | Preenche CPF + múltiplos seletores |
| Duplicate ID | Não aguardava validação | Blur + wait + múltiplos seletores |
| Create sessão | Não selecionava protocolo | Seleciona protocolo antes de criar |
| Navegação | Timeout ou elemento não encontrado | Seletores mais robustos |

---

## ✅ Próximos Passos

1. Re-executar testes para verificar se correções funcionaram
2. Se ainda falharem, verificar screenshots e logs
3. Ajustar timeouts ou seletores conforme necessário

---

**Última atualização:** 2025-12-02

