# 🔧 Como Corrigir o Erro: "unexpected character '»' in variable name"

## ❌ Erro

```
failed to parse environment file: .env.local (unexpected character '»' in variable name)
```

## 🔍 Causa

O arquivo `.env.local` tem problemas de encoding (caracteres especiais ou BOM - Byte Order Mark) que causam erro no parsing.

## ✅ Solução Simples

### Opção 1: Recriar do Template (Recomendado)

1. **Fazer backup do arquivo atual:**
   ```powershell
   Copy-Item .env.local .env.local.backup
   ```

2. **Copiar do template:**
   ```powershell
   Copy-Item env.local.example .env.local -Force
   ```

3. **Abrir `.env.local` no VS Code e preencher com SEUS valores:**
   - Obtenha as chaves do Supabase Dashboard: Settings → API
   - Substitua os placeholders pelos valores reais

4. **Salvar como UTF-8 sem BOM:**
   - No VS Code: Clique no encoding no canto inferior direito
   - Selecione "Save with Encoding" → "UTF-8" (NÃO "UTF-8 with BOM")
   - Salve o arquivo

### Opção 2: Corrigir Encoding do Arquivo Atual

1. **Abrir `.env.local` no VS Code**

2. **Verificar encoding:**
   - Olhe no canto inferior direito
   - Se mostrar "UTF-8 with BOM", precisa converter

3. **Converter para UTF-8 sem BOM:**
   - Clique no encoding
   - "Save with Encoding" → "UTF-8"
   - Salve o arquivo

4. **Remover caracteres especiais:**
   - Remova qualquer emoji ou caractere especial dos comentários
   - Use apenas ASCII nos comentários

## 📝 Estrutura Correta do Arquivo

O arquivo `.env.local` deve ter este formato:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[seu-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

# Biologix API Configuration
BIOLOGIX_USERNAME=seu_username_biologix
BIOLOGIX_PASSWORD=sua_senha_aqui
BIOLOGIX_SOURCE=100
BIOLOGIX_PARTNER_ID=seu_partner_id_aqui
```

**Importante:** Substitua `sua_anon_key_aqui` e `sua_senha_aqui` pelos seus valores reais do Dashboard.

## ✅ Verificar se Funcionou

```powershell
Get-Content .env.local
```

O arquivo deve ser exibido sem caracteres estranhos. Se aparecer algo como `Visvel` ou `»`, ainda há problema de encoding.

## ⚠️ IMPORTANTE: Segurança

- ❌ **NUNCA** commite o arquivo `.env.local` no Git (já está no `.gitignore`)
- ❌ **NUNCA** compartilhe suas chaves
- ✅ Use apenas valores do seu próprio Supabase Dashboard
- ✅ O arquivo `.env.local` é local e não será enviado ao repositório
