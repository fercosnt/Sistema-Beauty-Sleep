# 🧪 Re-execução de Testes Após Correções

## 9.6.6 - Re-run all tests after fixes

**Data:** 2025-12-02  
**Status:** ✅ Guia criado

---

## 📋 Checklist de Re-execução

### 1. Testes Unitários (Jest)
```bash
npm test
```

**Esperado:**
- ✅ Todos os 52 testes passando
- ✅ Cobertura > 80%

**Verificar:**
- [ ] Todos os testes passam
- [ ] Nenhum teste foi quebrado
- [ ] Cobertura mantida ou melhorada

---

### 2. Testes de Integração (Playwright)
```bash
npx playwright test integration
```

**Esperado:**
- ✅ Teste de autenticação passa
- ✅ Teste de criação de paciente passa
- ✅ Teste de validação de ID do Paciente passa
- ✅ Teste de duplicação passa
- ✅ Teste de criação de sessão passa
- ✅ Teste de mudança de status passa
- ✅ Teste de busca passa

**Verificar:**
- [ ] Todos os testes de integração passam
- [ ] Teste de ID do Paciente funciona corretamente
- [ ] Validações funcionam como esperado

---

### 3. Testes E2E - Fluxo Completo
```bash
npx playwright test e2e/complete-flow
```

**Esperado:**
- ✅ Login funciona
- ✅ Criação de Lead funciona
- ✅ Sincronização de exame funciona
- ✅ Criação de sessões funciona
- ✅ Mudança de status funciona
- ✅ Cálculo de próxima_manutencao funciona

**Verificar:**
- [ ] Fluxo completo funciona
- [ ] Não há problemas de página fechada
- [ ] Status atualiza corretamente

---

### 4. Testes E2E - Permissões
```bash
# Primeiro criar usuários de teste
npx tsx scripts/create-test-users.ts

# Depois executar testes
npx playwright test e2e/permissions
```

**Esperado:**
- ✅ Admin pode acessar /usuarios e /logs
- ✅ Equipe não pode acessar /usuarios e /logs
- ✅ Recepcao vê "--" no dashboard
- ✅ Recepcao não pode criar paciente
- ✅ Equipe não pode editar sessão de outro
- ✅ Admin pode editar qualquer sessão

**Verificar:**
- [ ] Todos os testes de permissão passam
- [ ] Permissões RLS funcionam corretamente
- [ ] Roles são respeitadas

---

## 📊 Resultado Esperado

### Testes Unitários
```
✓ 52 tests passing
✓ Coverage: > 80%
```

### Testes de Integração
```
✓ 7+ tests passing
✓ All integration flows working
```

### Testes E2E
```
✓ Complete flow test passing
✓ Permissions tests passing
✓ All critical paths verified
```

---

## ⚠️ Se Algum Teste Falhar

1. **Identificar qual teste falhou**
   - Verificar mensagem de erro
   - Verificar stack trace

2. **Verificar se é problema real ou teste**
   - É bug no código? → Corrigir código
   - É problema no teste? → Ajustar teste

3. **Documentar problema**
   - Criar issue/documentação
   - Adicionar à lista de bugs se necessário

4. **Re-executar teste específico**
   ```bash
   npx playwright test [caminho-do-teste] -g "[nome-do-teste]"
   ```

---

## ✅ Critérios de Sucesso

- [ ] Todos os testes unitários passam
- [ ] Todos os testes de integração passam
- [ ] Todos os testes E2E passam
- [ ] Cobertura de código mantida
- [ ] Nenhum regressão introduzida

---

## 📝 Notas

- Executar todos os testes antes de fazer merge
- Documentar quaisquer falhas encontradas
- Atualizar documentação se necessário

---

**Guia criado em:** 2025-12-02  
**Última execução:** [Data/Hora]

