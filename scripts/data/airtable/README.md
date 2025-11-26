# Airtable Data Export

Este diretório contém os arquivos CSV exportados do Airtable para migração para o Supabase.

## 📋 Arquivos Necessários

Antes de executar o script de migração, você precisa exportar os seguintes arquivos CSV do Airtable e colocá-los neste diretório:

### 1. `pacientes.csv`
Exporte a tabela de Pacientes do Airtable com as seguintes colunas:
- **username** (obrigatório, minúscula) - O CPF está embutido no username. O script extrai o CPF usando `REGEX_REPLACE({username}, "[^0-9]", "")`. O username deve conter exatamente 11 dígitos para formar um CPF válido.
- **Nome** (obrigatório)
- **Email** (opcional)
- **Telefone** (opcional)
- **Data Nascimento** (opcional, formato: DD/MM/YYYY ou YYYY-MM-DD)
- **Genero** (opcional: M, F)
- **Status** (opcional: Lead, Ativo, Finalizado, Inativo)
- **Sessões Compradas** (opcional, número)
- **Biologix ID** (opcional)
- **Observações Gerais** (opcional)
- **Tags** (opcional, separadas por vírgula: "Atropina, Vonau")
- **Data Cadastro** (opcional, formato: DD/MM/YYYY ou YYYY-MM-DD)

### 2. `exames.csv`
Exporte a tabela de Exames do Airtable com as seguintes colunas:
- **Biologix Exam ID** ou **ID Exames** (obrigatório) - Usado para vincular o exame ao paciente
- **Biologix Exam Key** (opcional)
- **Telefone Paciente** (opcional) - Usado como fallback para encontrar o paciente se o exame não existir no banco
- **Email Paciente** (opcional) - Usado como fallback para encontrar o paciente
- **Nome Paciente** (opcional) - Usado como fallback para encontrar o paciente (menos confiável)

**Estratégias de Vinculação (em ordem de prioridade):**
1. **Por ID do Exame**: Se o exame já existe no banco, usa o `paciente_id` vinculado
2. **Por Telefone**: Normaliza o telefone e busca paciente correspondente
3. **Por Email**: Busca paciente pelo email (case-insensitive)
4. **Por Nome**: Busca paciente pelo nome (só vincula se houver exatamente 1 match)
5. **Por Data do Exame**: Como último recurso, tenta encontrar exames na mesma data

Se nenhuma estratégia funcionar, o exame será marcado como inválido e salvo em `exames_invalidos.csv`.
- **Tipo** (opcional: "Ronco" ou "Sono")
- **Status** (opcional, número: 6 = DONE)
- **Data Exame** (obrigatório, formato: DD/MM/YYYY ou YYYY-MM-DD)
- **Peso (kg)** (opcional, número)
- **Altura (cm)** (opcional, número)
- **Score Ronco** (opcional, número)
- **IDO** (opcional, número)
- **IDO Categoria** (opcional: "Normal", "Leve", "Moderado", "Acentuado")
- **SpO2 Min** (opcional, número)
- **SpO2 Avg** (opcional, número)
- **SpO2 Max** (opcional, número)

### 3. `tags.csv` (OPCIONAL - pode ser ignorado)
**Este arquivo é OPCIONAL!** Se você não tiver tags personalizadas no Airtable, pode pular este arquivo completamente.

Se você tiver tags personalizadas além das pré-definidas, exporte com:
- **Nome** (obrigatório)
- **Cor** (opcional, código hex: #3B82F6)
- **Tipo** (opcional)

**Nota:** As tags pré-definidas (Atropina, Vonau, Nasal, Palato, Língua, Combinado) já estão no banco de dados através da migration 005. O script carregará essas tags automaticamente mesmo sem o arquivo CSV.

## 📤 Como Exportar do Airtable

1. Acesse sua base no Airtable
2. Para cada tabela (Pacientes, Exames, Tags):
   - Clique no menu da tabela (três pontos)
   - Selecione "Download CSV"
   - Salve o arquivo com o nome correto neste diretório

## ✅ Verificação Antes da Migração

Antes de executar o script, verifique:

- [ ] Todos os arquivos CSV estão neste diretório
- [ ] Os nomes dos arquivos estão corretos (pacientes.csv, exames.csv, tags.csv)
- [ ] Os Usernames contêm CPFs válidos (11 dígitos quando extraídos)
- [ ] As datas estão em formato válido (DD/MM/YYYY ou YYYY-MM-DD)
- [ ] Os IDs dos exames (Biologix Exam ID ou ID Exames) estão presentes

## 🚀 Executar Migração

Após colocar os arquivos CSV neste diretório:

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Executar migração em staging
npx tsx scripts/migrate-from-airtable.ts --env=staging

# Executar migração em produção (após validação)
npx tsx scripts/migrate-from-airtable.ts --env=production
```

## ⚠️ Importante

- **Faça backup do banco de dados antes de executar em produção**
- **Teste primeiro em staging**
- **O script usa SERVICE_ROLE_KEY para bypass RLS durante a migração**
- **CPFs duplicados serão atualizados (upsert)**
- **Exames serão vinculados aos pacientes pelo ID do Exame (Biologix Exam ID)**
- **O script busca exames já existentes no banco para vincular aos pacientes**

