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
<<<<<<< HEAD
- **ID do Paciente** (obrigatório - chave única do Biologix, ex: `8229402UM`)
- Nome (obrigatório)
- CPF (opcional - será extraído de "CPF" ou "username" se disponível)
- Email, Telefone, Data Nascimento, Sexo/Genero (opcionais)
- Status (Lead, Ativo, Finalizado, Inativo) - opcional
- Sessões Compradas (número) - opcional
- Observações Gerais - opcional
- Tags (separadas por vírgula) - opcional
- Data Cadastro - opcional
=======
- CPF (obrigatório)
- Nome (obrigatório)
- Email, Telefone, Data Nascimento, Genero (opcionais)
- Status (Lead, Ativo, Finalizado, Inativo)
- Sessões Compradas (número)
- Biologix ID
- Observações Gerais
- Tags (separadas por vírgula)
- Data Cadastro
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)

### Exportar Exames

1. Abra a tabela "Exames"
2. Clique no menu → "Download CSV"
3. Salve como `scripts/data/airtable/exames.csv`

**Colunas necessárias:**
<<<<<<< HEAD
- **ID Exame** (obrigatório - chave única do Biologix, ex: `0927089WF`)
- **ID Pacientes LINK** (obrigatório - deve corresponder ao "ID do Paciente" em pacientes.csv, ex: `8432254AF`)
- Chave Exame (opcional)
- Tipo Exame ou Tipo (Ronco ou Sono) - opcional
- Data do Processamento ou Data Exame (obrigatório)
- Status (número: 6 = DONE) - opcional
- Peso, Altura, Score de Impacto do Ronco, IDO, IDO Cat - opcionais
- spO2 Min, spO2 Médio, spO2 Max - opcionais
=======
- Biologix Exam ID (obrigatório)
- CPF Paciente (obrigatório - deve corresponder ao CPF em pacientes.csv)
- Data Exame (obrigatório)
- Tipo (Ronco ou Sono)
- Status (número: 6 = DONE)
- Peso (kg), Altura (cm), Score Ronco, IDO, IDO Categoria
- SpO2 Min, SpO2 Avg, SpO2 Max
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)

### Exportar Tags (Opcional)

Se você tiver tags personalizadas além das pré-definidas:
1. Abra a tabela "Tags"
2. Clique no menu → "Download CSV"
3. Salve como `scripts/data/airtable/tags.csv`

**Nota:** As tags pré-definidas (Atropina, Vonau, Nasal, Palato, Língua, Combinado) já estão no banco através da migration 005.

## ✅ Passo 2: Verificar Dados

Antes de executar a migração, verifique:

<<<<<<< HEAD
- [ ] Todos os pacientes têm "ID do Paciente" preenchido (chave única)
- [ ] Todos os exames têm "ID Exame" preenchido (chave única)
- [ ] Todos os exames têm "ID Pacientes LINK" preenchido (para vincular ao paciente)
- [ ] Os "ID Pacientes LINK" dos exames correspondem aos "ID do Paciente" dos pacientes
- [ ] As datas estão em formato válido (DD/MM/YYYY ou YYYY-MM-DD)
- [ ] CPF é opcional (será extraído se disponível, mas não é obrigatório)
=======
- [ ] Todos os CPFs têm 11 dígitos (apenas números)
- [ ] As datas estão em formato válido (DD/MM/YYYY ou YYYY-MM-DD)
- [ ] Os CPFs dos exames correspondem aos CPFs dos pacientes
- [ ] Não há CPFs duplicados (o script fará upsert)
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)

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
<<<<<<< HEAD
2. **Extrai CPF opcionalmente** (de "CPF" ou "username" se disponível, mas não é obrigatório)
=======
2. **Valida todos os CPFs** usando a função `validar_cpf()` do Supabase
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)
3. **Transforma os dados** do formato Airtable para o schema Supabase:
   - Mapeia status (Lead → lead, Ativo → ativo, etc.)
   - Mapeia tipo de exame (Ronco → 0, Sono → 1)
   - Mapeia categoria IDO (Normal → 0, Leve → 1, etc.)
<<<<<<< HEAD
   - Formata CPFs (remove caracteres não numéricos) - se disponível
   - Converte datas para formato ISO
4. **Insere Tags** (se houver arquivo tags.csv)
5. **Insere Pacientes** (268 registros esperados)
   - Faz upsert por **ID do Paciente** (`biologix_id`) - chave única
   - CPF é opcional (será inserido se válido)
   - Associa tags aos pacientes
6. **Insere Exames** (2.522 registros esperados)
   - **Vincula exames aos pacientes pelo ID do Paciente** (`ID Pacientes LINK` → `biologix_id`)
   - Faz upsert por `biologix_exam_id` (ID Exame)
   - Armazena `biologix_paciente_id` no exame para referência
=======
   - Formata CPFs (remove caracteres não numéricos)
   - Converte datas para formato ISO
4. **Insere Tags** (se houver arquivo tags.csv)
5. **Insere Pacientes** (175 registros esperados)
   - Faz upsert por CPF (atualiza se já existir)
   - Associa tags aos pacientes
6. **Insere Exames** (479 registros esperados)
   - Vincula exames aos pacientes pelo CPF
   - Faz upsert por `biologix_exam_id`
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)

## ⚠️ Importante

- **O script usa SERVICE_ROLE_KEY** para bypass RLS durante a migração
<<<<<<< HEAD
- **Pacientes duplicados serão atualizados** (upsert por `ID do Paciente` - `biologix_id`)
- **Exames duplicados serão atualizados** (upsert por `ID Exame` - `biologix_exam_id`)
- **Exames sem paciente correspondente serão ignorados** (quando `ID Pacientes LINK` não encontrar um paciente)
- **CPF é opcional** - pacientes sem CPF válido serão inseridos mesmo assim
- **Nenhum dado é removido** - apenas inserção/atualização (upsert)
=======
- **CPFs duplicados serão atualizados** (não criados novamente)
- **Exames sem paciente correspondente serão ignorados** (com aviso)
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)
- **Faça backup do banco antes de executar em produção**

## 🔍 Passo 4: Validar Migração

Após executar o script, execute o script de validação:

```bash
npx tsx scripts/validate-migration.ts --env=staging
```

Isso verificará:
<<<<<<< HEAD
- Contagem de pacientes (esperado: 268)
- Contagem de exames (esperado: ~2.522)
- Vinculação de exames aos pacientes (via `ID Pacientes LINK` → `biologix_id`)
- Cálculos de IMC e score_ronco
- Verificação de que todos os exames têm paciente vinculado
=======
- Contagem de pacientes (esperado: 175)
- Contagem de exames (esperado: 479)
- Validação de CPFs
- Vinculação de exames aos pacientes
- Cálculos de IMC e score_ronco
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)

## 🐛 Troubleshooting

### Erro: "File not found"
- Verifique se os arquivos CSV estão em `scripts/data/airtable/`
- Verifique se os nomes dos arquivos estão corretos (pacientes.csv, exames.csv)

<<<<<<< HEAD
### Erro: "ID do Paciente não encontrado"
- Verifique se a coluna "ID do Paciente" existe no CSV de pacientes
- Verifique se todos os pacientes têm "ID do Paciente" preenchido

### Erro: "Paciente not found" para exames
- Verifique se o "ID Pacientes LINK" do exame corresponde ao "ID do Paciente" do paciente
- O ID deve estar exatamente igual (ex: `8432254AF`)
- Verifique se o paciente foi inserido antes do exame
=======
### Erro: "Invalid CPF"
- O script valida todos os CPFs antes de inserir
- Corrija os CPFs inválidos no Airtable e exporte novamente

### Erro: "Paciente not found" para exames
- Verifique se o CPF do exame corresponde ao CPF do paciente
- O CPF deve estar no mesmo formato (apenas números, 11 dígitos)
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)

### Erro: "Missing Supabase credentials"
- Configure as variáveis de ambiente no `.env.local`
- Certifique-se de usar `SUPABASE_SERVICE_ROLE_KEY` (não anon key)

## 📝 Próximos Passos

Após a migração bem-sucedida:

1. Execute o script de validação (Fase 1.11)
2. Verifique os dados no Supabase Dashboard
3. Teste a sincronização com a API Biologix
4. Prossiga para a Fase 2 (Autenticação e Layout)

