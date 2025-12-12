# 🔧 Guia: Como Selecionar o Projeto Correto no Supabase

## Situação Atual

Você está vendo uma lista de projetos e precisa selecionar o **"Projeto Biologix"**.

```
Select a project:

    1. isljnozzlvckrgjjbjwp [name: Sistema de Recrutamento, org: mourmtierwrhutzogwoe, region: us-east-1]

  >  2. qigbblypwkgflwnrrhzg [name: Projeto Biologix, org: mourmtierwrhutzogwoe, region: us-east-1]
```

## ✅ Solução: Selecionar o Projeto 2

### Opção 1: Durante a Interação Ativa (Recomendado)

Se você está vendo essa tela **agora**, simplesmente:

1. **Pressione a tecla `2`** ou use as **setas para baixo** para selecionar a opção 2
2. **Pressione Enter** para confirmar

Isso selecionará o projeto `qigbblypwkgflwnrrhzg` (Projeto Biologix).

### Opção 2: Via Link Manual do Projeto

Se você já passou da tela ou quer configurar permanentemente:

#### Passo 1: Linkar o Projeto

```bash
npx supabase link --project-ref qigbblypwkgflwnrrhzg
```

Este comando vai:
- Conectar seu projeto local ao projeto remoto "Projeto Biologix"
- Salvar a configuração no arquivo `.supabase/config.toml`

#### Passo 2: Verificar o Link

```bash
npx supabase projects list
```

Você deve ver o projeto `qigbblypwkgflwnrrhzg` listado.

#### Passo 3: Verificar Configuração Local

Verifique se o projeto está linkado:

```bash
# Ver configuração do projeto linkado
npx supabase status
```

Ou verifique o arquivo de configuração:

```bash
# Windows PowerShell
Get-Content .supabase\config.toml

# Linux/Mac
cat .supabase/config.toml
```

## 📋 Comandos Úteis

### Ver Todos os Projetos Disponíveis

```bash
npx supabase projects list
```

### Trocar de Projeto

```bash
npx supabase link --project-ref qigbblypwkgflwnrrhzg
```

### Verificar Status do Projeto Linkado

```bash
npx supabase status
```

### Ver Informações do Projeto

```bash
npx supabase projects list --linked
```

## 🔍 Verificação Rápida

Depois de linkar, você pode verificar se está usando o projeto correto:

```bash
# Este comando deve mostrar informações do "Projeto Biologix"
npx supabase projects list
```

## 📝 Informações do Projeto Correto

- **Project ID**: `qigbblypwkgflwnrrhzg`
- **Nome**: Projeto Biologix
- **URL**: `https://qigbblypwkgflwnrrhzg.supabase.co`
- **Organization**: mourmtierwrhutzogwoe
- **Region**: us-east-1

## ⚠️ Importante

- ✅ **SEMPRE use o projeto**: `qigbblypwkgflwnrrhzg` (Projeto Biologix)
- ❌ **NÃO use o projeto**: `isljnozzlvckrgjjbjwp` (Sistema de Recrutamento)

O projeto "Sistema de Recrutamento" é outro projeto e não deve ser usado para o Beauty Sleep.

## 🚀 Próximos Passos Após Selecionar o Projeto

Depois de selecionar/linkar o projeto correto, você pode:

1. **Fazer deploy de Edge Functions:**
   ```bash
   npx supabase functions deploy sync-biologix
   ```

2. **Verificar migrations:**
   ```bash
   npx supabase db remote list
   ```

3. **Ver logs:**
   ```bash
   npx supabase functions logs sync-biologix
   ```

---

**Resumo:** Simplesmente **pressione `2` e Enter** na tela de seleção para escolher o "Projeto Biologix"!

