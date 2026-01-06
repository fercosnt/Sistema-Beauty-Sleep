# 🔒 Revisão de Segurança - Dados Sensíveis e Arquivos Desnecessários

**Data:** 2025-01-XX  
**Status:** ⚠️ AÇÃO NECESSÁRIA

---

## 🚨 DADOS SENSÍVEIS ENCONTRADOS

### 1. CPFs de Pacientes Reais em Documentação

#### ❌ Arquivos com CPFs reais que DEVEM ser removidos ou sanitizados:

1. **`docs/relatorios/RESULTADO_FINAL_SUCESSO.md`**
   - CPF: 16303479812 (Fernando de Almeida Brandão)
   - CPF: 26191025882 (Marcia De Queiroz)
   - CPF: 12556328878 (Edna Matta)
   - CPF: 03069152864 (Marcelo Cusnir)
   - **Ação:** Remover ou substituir por CPFs fictícios

2. **`docs/relatorios/RELATORIO_COMPLETO_BIOLOGIX.md`**
   - CPF: 09218264788 (Juliana Kagan Reis)
   - **Ação:** Remover ou substituir por CPF fictício

3. **`docs/resumos/DIAGNOSTICO_CONEXAO_BIOLOGIX.md`**
   - CPF: 09218264788 (Juliana Kagan Reis)
   - **Ação:** Remover ou substituir por CPF fictício

### 2. Informações de Infraestrutura

#### ⚠️ Arquivos que mencionam configurações (mas não expõem valores reais):
- Scripts SQL mencionam `BIOLOGIX_PARTNER_ID` mas não expõem valores
- Scripts mencionam `SUPABASE_SERVICE_ROLE_KEY` mas apenas como variáveis de ambiente
- **Status:** ✅ Seguro (apenas referências, não valores)

---

## 📁 ARQUIVOS DESNECESSÁRIOS PARA GITHUB

### 1. Scripts SQL de Debug/Correção Temporários

Estes scripts foram criados para debug e correção de problemas específicos e podem ser removidos:

```
scripts/
  - corrigir-funcao-wrapper-final.sql
  - corrigir-funcao-wrapper-v2.sql
  - corrigir-funcao-wrapper.sql
  - corrigir-cron-definitivo.sql
  - debug-e-corrigir-cron.sql
  - debug-cron-failures.sql
  - forcar-correcao-cron.sql
  - remover-wrapper-e-verificar.sql
  - solucao-simples-cron.sql
  - solucao-final-cron.sql
  - verificar-e-corrigir-cron.sql
  - verificar-comando-cron.sql
  - verificar-resposta-http.sql
  - verificar-tudo.sql
  - confirmar-e-testar.sql
```

**Recomendação:** Manter apenas scripts úteis para operação/manutenção futura, remover os de debug temporário.

### 2. Documentação de Testes Antigos

A pasta `docs/testes-antigos/` contém 22 arquivos de documentação de problemas já resolvidos:

**Recomendação:** Mover para uma pasta `docs/arquivados/` ou remover completamente.

### 3. Relatórios com Dados Reais

Arquivos de relatórios que contêm dados de pacientes reais:
- `docs/relatorios/RESULTADO_FINAL_SUCESSO.md`
- `docs/relatorios/RELATORIO_COMPLETO_BIOLOGIX.md`
- `docs/resumos/DIAGNOSTICO_CONEXAO_BIOLOGIX.md`

**Recomendação:** Sanitizar (substituir CPFs por fictícios) ou remover.

---

## ✅ ARQUIVOS CORRETOS

### Arquivos que estão corretamente ignorados pelo .gitignore:
- ✅ `.env.local` e variantes
- ✅ Arquivos `.log`
- ✅ `node_modules/`
- ✅ `.next/`
- ✅ Arquivos CSV do Airtable

### Arquivos de exemplo/documentação que estão corretos:
- ✅ `env.local.example` (apenas exemplo, sem valores reais)
- ✅ Scripts de teste que usam dados fictícios
- ✅ Documentação de guias que não expõem dados reais

---

## 🎯 AÇÕES RECOMENDADAS

### Prioridade ALTA (Segurança)

1. **Remover ou sanitizar CPFs reais:**
   ```bash
   # Substituir CPFs reais por fictícios nos arquivos de documentação
   # Exemplo: 16303479812 → 11111111111 (fictício)
   ```

2. **Verificar histórico do Git:**
   ```bash
   # Se esses arquivos já foram commitados, considerar:
   # - git filter-branch ou BFG Repo-Cleaner para remover do histórico
   # - Ou invalidar as chaves/secrets expostos
   ```

### Prioridade MÉDIA (Organização)

3. **Limpar scripts SQL temporários:**
   - Manter apenas scripts úteis para operação
   - Remover ou arquivar scripts de debug temporário

4. **Arquivar documentação antiga:**
   - Mover `docs/testes-antigos/` para `docs/arquivados/`
   - Ou remover se não for mais necessário

### Prioridade BAIXA (Manutenção)

5. **Revisar outros arquivos de documentação:**
   - Verificar se há outros dados sensíveis em outros arquivos .md
   - Criar um processo para sanitizar dados antes de commitar

---

## 📝 CHECKLIST DE AÇÃO

- [ ] Sanitizar CPFs em `docs/relatorios/RESULTADO_FINAL_SUCESSO.md`
- [ ] Sanitizar CPFs em `docs/relatorios/RELATORIO_COMPLETO_BIOLOGIX.md`
- [ ] Sanitizar CPFs em `docs/resumos/DIAGNOSTICO_CONEXAO_BIOLOGIX.md`
- [ ] Revisar e remover scripts SQL temporários desnecessários
- [ ] Arquivar ou remover `docs/testes-antigos/`
- [ ] Atualizar `.gitignore` se necessário
- [ ] Verificar histórico do Git para dados sensíveis já commitados
- [ ] Criar processo de sanitização para futuros commits

---

## 🔐 BOAS PRÁTICAS

1. **Nunca commitar:**
   - CPFs, emails ou dados pessoais reais
   - Chaves de API, tokens ou senhas
   - URLs de produção com credenciais
   - Dados de pacientes reais

2. **Sempre usar:**
   - Dados fictícios em documentação e testes
   - Variáveis de ambiente para secrets
   - Arquivos `.example` para templates
   - `.gitignore` para arquivos sensíveis

3. **Antes de commitar:**
   - Revisar arquivos modificados
   - Verificar se há dados sensíveis
   - Sanitizar dados de teste/documentação

