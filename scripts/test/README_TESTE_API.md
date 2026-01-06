# Scripts de Teste da API Biologix

Este diretório contém scripts úteis para testar e verificar a integração com a API Biologix.

## 📋 Scripts Disponíveis

### 1. `test-biologix-api.ps1` (PowerShell - Windows)
Script para testar a API Biologix no Windows.

**Uso:**
```powershell
.\scripts\test-biologix-api.ps1
```

### 2. `test-biologix-api.sh` (Bash - Linux/Mac)
Script para testar a API Biologix no Linux ou Mac.

**Uso:**
```bash
bash scripts/test-biologix-api.sh
```

**Pré-requisitos:**
- `curl` instalado
- `jq` instalado (para parsing JSON)

### 3. `test-biologix-api.js` (Node.js)
Script para testar a API Biologix usando Node.js.

**Uso:**
```bash
node scripts/test-biologix-api.js
```

## ⚙️ Configuração

**⚠️ IMPORTANTE:** Os scripts agora leem as credenciais do arquivo `.env.local` na raiz do projeto.

Antes de executar os scripts, configure as variáveis no arquivo `.env.local`:

```env
BIOLOGIX_USERNAME=seu_username_aqui
BIOLOGIX_PASSWORD=sua_senha_aqui
BIOLOGIX_SOURCE=100
BIOLOGIX_PARTNER_ID=seu_partner_id_aqui
```

**Nota:** O arquivo `.env.local` já está no `.gitignore` e não será commitado no Git.

## 🔍 O que os Scripts Fazem

1. **Abrir Sessão:**
   - Autentica com a API Biologix usando Basic Auth
   - Obtém `userId`, `sessionId` e `centerId`

2. **Buscar Exames:**
   - Lista os primeiros 10 exames do parceiro
   - Mostra informações básicas de cada exame

## 📊 Exemplo de Saída

```
=== Teste da API Biologix ===

[1] Abrindo sessao...
[OK] Sessao aberta com sucesso!
  UserId: 5448515RH
  SessionId: [token]
  CenterId: 4798042LW

[2] Buscando exames...
[OK] Exames recuperados com sucesso!
  Total de exames: 56
  Exames retornados: 10

Primeiros exames:
  - ID: 4550615EU | Tipo: 0 | Status: 6 | Data: 2025-11-06
  - ID: 4389886AP | Tipo: 0 | Status: 6 | Data: 2025-11-07
  - ID: 5101972YE | Tipo: 1 | Status: 6 | Data: 2025-11-07

=== Teste Concluido ===
```

## 🔧 Personalização

Você pode modificar os scripts para:
- Alterar o número de exames retornados (variável `limit`)
- Adicionar mais verificações
- Testar outros endpoints da API
- Salvar respostas em arquivos JSON

## ⚠️ Importante

- **Nunca commite credenciais reais no Git!**
- Use variáveis de ambiente ou arquivos `.env` para produção
- Estes scripts são apenas para testes locais

## 📚 Documentação Relacionada

- `CONFIGURACAO_BIOLOGIX.md` - Como obter e configurar credenciais
- `DEPLOY_EDGE_FUNCTION.md` - Deploy da Edge Function
- `TROUBLESHOOTING_EDGE_FUNCTION.md` - Solução de problemas

