# 🧪 Como Executar o Script de Validação Final

## 📋 Pré-requisitos

1. Ter o arquivo `.env.local` configurado na raiz do projeto
2. Ter as variáveis de ambiente necessárias

## 🔧 Passo 1: Configurar o arquivo .env.local

### Se você ainda não tem o arquivo:

1. **Copie o arquivo de exemplo:**
   ```powershell
   Copy-Item env.local.example .env.local
   ```

2. **Abra o arquivo `.env.local` no editor** e preencha com seus valores reais:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### Onde encontrar essas chaves:

1. Acesse o **Supabase Dashboard**: https://app.supabase.com
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (opcional para este script)

## 🚀 Passo 2: Executar o script

No terminal, na raiz do projeto, execute:

```powershell
npx tsx scripts/test-validacao-final.ts
```

## ✅ O que o script faz:

- ✅ Verifica se todos os componentes estão implementados
- ✅ Verifica se as tabelas do banco estão acessíveis
- ✅ Verifica se há dados suficientes para testes
- ✅ Mostra um resumo do status do sistema

## 📝 Exemplo de saída:

```
🔍 Iniciando validação final...

📦 Verificando componentes...
✅ Componente ModalDetalhesExame
   Arquivo encontrado: app/pacientes/components/ModalDetalhesExame.tsx

🗄️  Verificando banco de dados...
✅ Tabela exames
   Tabela exames acessível

📊 Verificando dados para teste...
✅ Exames para teste
   5 exames de ronco e 8 exames de polissonografia disponíveis

============================================================
📋 RESUMO DA VALIDAÇÃO
============================================================
✅ Passou: 12
❌ Falhou: 0
⚠️  Avisos: 0
============================================================

✅ Todas as validações passaram! Sistema pronto para testes manuais.
```

## ❌ Problemas comuns:

### Erro: "Arquivo .env.local não encontrado"
**Solução:** Crie o arquivo `.env.local` na raiz do projeto (mesmo nível do `package.json`)

### Erro: "Variáveis de ambiente não configuradas"
**Solução:** Verifique se você preencheu `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no arquivo `.env.local`

### Erro: "Erro ao acessar tabela"
**Solução:** Verifique se as chaves do Supabase estão corretas e se o projeto está ativo

## 📚 Próximos passos:

Após executar o script com sucesso, siga o documento de validação completa:
- `docs/validacao/VALIDACAO_FINAL_FASE2.md`

Este documento contém todos os testes manuais que precisam ser realizados.

