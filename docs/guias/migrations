# Guia: Aplicar Migration 014 - Tabela de Alertas

Este guia explica como aplicar a migration que cria a tabela `alertas` no Supabase.

## 📋 Pré-requisitos

- Acesso ao Supabase Dashboard
- Permissões de administrador no projeto

## 🚀 Passo a Passo

### 1. Acessar o SQL Editor

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New query**

### 2. Aplicar a Migration

1. Abra o arquivo `supabase/migrations/014_alertas.sql`
2. Copie todo o conteúdo do arquivo
3. Cole no SQL Editor do Supabase
4. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

### 3. Verificar se foi aplicada corretamente

Execute o script de verificação:

1. Abra o arquivo `scripts/verificar-tabela-alertas.sql`
2. Copie o conteúdo
3. Cole no SQL Editor
4. Execute e verifique os resultados

**Resultados esperados:**

- ✅ Tabela `alertas` deve existir
- ✅ Deve ter 12 colunas (id, tipo, urgencia, titulo, mensagem, paciente_id, exame_id, status, resolvido_por, resolvido_em, dados_extras, created_at, updated_at)
- ✅ Deve ter 7 índices criados
- ✅ RLS deve estar habilitado
- ✅ Deve ter 2 policies RLS (select e update)

### 4. Verificar via Dashboard (Opcional)

1. Vá em **Table Editor** no menu lateral
2. Procure pela tabela `alertas`
3. Verifique se a tabela aparece na lista

## ✅ Checklist

- [ ] Migration aplicada sem erros
- [ ] Tabela `alertas` criada
- [ ] Todos os índices criados
- [ ] RLS habilitado
- [ ] Policies RLS criadas
- [ ] Script de verificação executado com sucesso

## 🔧 Troubleshooting

### Erro: "relation already exists"

Se você receber este erro, significa que a tabela já existe. Você pode:

1. **Opção 1:** Verificar se a tabela está correta usando o script de verificação
2. **Opção 2:** Se precisar recriar, primeiro execute:
   ```sql
   DROP TABLE IF EXISTS alertas CASCADE;
   ```
   E então aplique a migration novamente.

### Erro: "permission denied"

Certifique-se de estar usando uma conta com permissões de administrador.

### Erro: "constraint already exists"

Algumas constraints podem já existir. Isso é normal se você já aplicou parte da migration antes.

## 📝 Próximos Passos

Após aplicar a migration com sucesso:

1. ✅ Marque a tarefa 8.8 como concluída
2. ✅ Execute o script de verificação (tarefa 8.9)
3. ⏭️ Continue com a tarefa 9.0 (Implementar geração de alertas críticos)

