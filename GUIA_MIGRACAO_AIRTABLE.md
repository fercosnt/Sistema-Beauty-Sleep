# Guia de Migração: Airtable → Supabase

Este guia explica como migrar dados do Airtable para o Supabase usando o script de migração.

## 📋 Pré-requisitos

1. **Dependências instaladas:**
   ```bash
   npm install
   ```

2. **Variáveis de ambiente configuradas:**
   - `NEXT_PUBLIC_SUPABASE_URL` ou `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Arquivos CSV exportados do Airtable:**
   - `scripts/data/airtable/pacientes.csv`
   - `scripts/data/airtable/exames.csv`
   - `scripts/data/airtable/tags.csv` (opcional)

## 📤 Passo 1: Exportar Dados do Airtable

### Exportar Pacientes

1. Acesse sua base no Airtable
2. Abra a tabela "Pacientes"
3. Clique no menu (três pontos) → "Download CSV"
4. Salve como `scripts/data/airtable/pacientes.csv`

**Colunas necessárias:**
- CPF (obrigatório)
- Nome (obrigatório)
- Email, Telefone, Data Nascimento, Genero (opcionais)
- Status (Lead, Ativo, Finalizado, Inativo)
- Sessões Compradas (número)
- Biologix ID
- Observações Gerais
- Tags (separadas por vírgula)
- Data Cadastro

### Exportar Exames

1. Abra a tabela "Exames"
2. Clique no menu → "Download CSV"
3. Salve como `scripts/data/airtable/exames.csv`

**Colunas necessárias:**
- Biologix Exam ID (obrigatório)
- CPF Paciente (obrigatório - deve corresponder ao CPF em pacientes.csv)
- Data Exame (obrigatório)
- Tipo (Ronco ou Sono)
- Status (número: 6 = DONE)
- Peso (kg), Altura (cm), Score Ronco, IDO, IDO Categoria
- SpO2 Min, SpO2 Avg, SpO2 Max

### Exportar Tags (Opcional)

Se você tiver tags personalizadas além das pré-definidas:
1. Abra a tabela "Tags"
2. Clique no menu → "Download CSV"
3. Salve como `scripts/data/airtable/tags.csv`

**Nota:** As tags pré-definidas (Atropina, Vonau, Nasal, Palato, Língua, Combinado) já estão no banco através da migration 005.

## ✅ Passo 2: Verificar Dados

Antes de executar a migração, verifique:

- [ ] Todos os CPFs têm 11 dígitos (apenas números)
- [ ] As datas estão em formato válido (DD/MM/YYYY ou YYYY-MM-DD)
- [ ] Os CPFs dos exames correspondem aos CPFs dos pacientes
- [ ] Não há CPFs duplicados (o script fará upsert)

## 🚀 Passo 3: Executar Migração

### Em Staging (Recomendado primeiro)

```bash
npx tsx scripts/migrate-from-airtable.ts --env=staging
```

### Em Produção (Após validação)

```bash
npx tsx scripts/migrate-from-airtable.ts --env=production
```

## 📊 O que o Script Faz

1. **Lê os arquivos CSV** do diretório `scripts/data/airtable/`
2. **Valida todos os CPFs** usando a função `validar_cpf()` do Supabase
3. **Transforma os dados** do formato Airtable para o schema Supabase:
   - Mapeia status (Lead → lead, Ativo → ativo, etc.)
   - Mapeia tipo de exame (Ronco → 0, Sono → 1)
   - Mapeia categoria IDO (Normal → 0, Leve → 1, etc.)
   - Formata CPFs (remove caracteres não numéricos)
   - Converte datas para formato ISO
4. **Insere Tags** (se houver arquivo tags.csv)
5. **Insere Pacientes** (175 registros esperados)
   - Faz upsert por CPF (atualiza se já existir)
   - Associa tags aos pacientes
6. **Insere Exames** (479 registros esperados)
   - Vincula exames aos pacientes pelo CPF
   - Faz upsert por `biologix_exam_id`

## ⚠️ Importante

- **O script usa SERVICE_ROLE_KEY** para bypass RLS durante a migração
- **CPFs duplicados serão atualizados** (não criados novamente)
- **Exames sem paciente correspondente serão ignorados** (com aviso)
- **Faça backup do banco antes de executar em produção**

## 🔍 Passo 4: Validar Migração

Após executar o script, execute o script de validação:

```bash
npx tsx scripts/validate-migration.ts --env=staging
```

Isso verificará:
- Contagem de pacientes (esperado: 175)
- Contagem de exames (esperado: 479)
- Validação de CPFs
- Vinculação de exames aos pacientes
- Cálculos de IMC e score_ronco

## 🐛 Troubleshooting

### Erro: "File not found"
- Verifique se os arquivos CSV estão em `scripts/data/airtable/`
- Verifique se os nomes dos arquivos estão corretos (pacientes.csv, exames.csv)

### Erro: "Invalid CPF"
- O script valida todos os CPFs antes de inserir
- Corrija os CPFs inválidos no Airtable e exporte novamente

### Erro: "Paciente not found" para exames
- Verifique se o CPF do exame corresponde ao CPF do paciente
- O CPF deve estar no mesmo formato (apenas números, 11 dígitos)

### Erro: "Missing Supabase credentials"
- Configure as variáveis de ambiente no `.env.local`
- Certifique-se de usar `SUPABASE_SERVICE_ROLE_KEY` (não anon key)

## 📝 Próximos Passos

Após a migração bem-sucedida:

1. Execute o script de validação (Fase 1.11)
2. Verifique os dados no Supabase Dashboard
3. Teste a sincronização com a API Biologix
4. Prossiga para a Fase 2 (Autenticação e Layout)

