# Arquivos de Dados Inválidos

Este diretório contém arquivos CSV gerados automaticamente pelo script de migração com os registros que não puderam ser migrados.

## 📋 Arquivos Gerados

### `pacientes_invalidos.csv`
Contém todos os pacientes do Airtable que foram rejeitados durante a migração devido a:
<<<<<<< HEAD
- **ID do Paciente não encontrado** (campo obrigatório ausente)
- ID do Paciente vazio ou inválido

**Colunas:**
- Nome
- ID do Paciente (original do Airtable)
- CPF (opcional - se disponível)
- Email, Telefone, Data Nascimento, etc. (todos os campos originais)
- **Motivo** - Razão pela qual o paciente foi rejeitado

**Nota:** CPF é opcional - pacientes sem CPF válido são inseridos mesmo assim, desde que tenham "ID do Paciente".

### `exames_invalidos.csv`
Contém todos os exames do Airtable que foram rejeitados durante a migração devido a:
- **ID Exame não encontrado** (campo obrigatório ausente)
- **ID Pacientes LINK não encontrado** (campo obrigatório ausente)
- **Paciente não encontrado** (ID Pacientes LINK não existe na tabela de pacientes)

**Colunas:**
- ID Exame
- ID Pacientes LINK
- Chave Exame
- Tipo Exame
- Data do Processamento
- **Motivo** - Razão pela qual o exame foi rejeitado

**Nota:** A ligação principal é feita através do **ID do Paciente** (`ID Pacientes LINK` do exame → `biologix_id` do paciente).
=======
- CPF vazio
- CPF com formato incorreto (não tem 11 dígitos)
- CPF inválido (falha na validação)

**Colunas:**
- Nome
- CPF (original do Airtable)
- Email, Telefone, Data Nascimento, etc. (todos os campos originais)
- **Motivo Invalidez** - Razão pela qual o paciente foi rejeitado
- **CPF Formatado** - CPF após formatação (apenas números)

### `exames_invalidos.csv`
Contém todos os exames do Airtable que foram rejeitados durante a migração devido a:
- CPF vazio ou inválido
- Paciente não encontrado (CPF não existe na tabela de pacientes válidos)

**Colunas:**
- Biologix Exam ID
- CPF Paciente (original do Airtable)
- Todos os campos do exame (Tipo, Status, Data Exame, etc.)
- **Motivo Invalidez** - Razão pela qual o exame foi rejeitado
- **CPF Formatado** - CPF após formatação
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)

## 🔍 Como Usar

1. **Abra os arquivos CSV** em Excel, Google Sheets ou outro editor
2. **Revise os registros** e identifique:
<<<<<<< HEAD
   - Quais podem ser corrigidos (ID do Paciente faltando, ID Pacientes LINK incorreto)
   - Quais devem ser descartados (dados de teste, duplicados)
   - Quais precisam de ação manual (buscar ID do Paciente correto)
=======
   - Quais podem ser corrigidos (CPF faltando dígitos, formato errado)
   - Quais devem ser descartados (dados de teste, duplicados)
   - Quais precisam de ação manual (buscar CPF correto)
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)
3. **Corrija os dados** no Airtable ou diretamente nos CSVs
4. **Re-execute a migração** após correções

## 📝 Próximos Passos

Após revisar os arquivos:

<<<<<<< HEAD
1. **Se encontrar IDs corrigíveis:**
   - Corrija o "ID do Paciente" ou "ID Pacientes LINK" no Airtable
=======
1. **Se encontrar CPFs corrigíveis:**
   - Corrija no Airtable
>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)
   - Re-exporte os CSVs
   - Execute a migração novamente

2. **Se encontrar registros para descartar:**
   - Anote quais devem ser removidos
   - A migração já os ignorou automaticamente

3. **Se encontrar registros que precisam de ação manual:**
<<<<<<< HEAD
   - Busque o "ID do Paciente" correto na API Biologix
   - Atualize no Airtable
   - Re-execute a migração

**Importante:** A ligação principal é feita através do **ID do Paciente** (não CPF). Certifique-se de que os "ID Pacientes LINK" dos exames correspondem aos "ID do Paciente" dos pacientes.

=======
   - Busque o CPF correto
   - Atualize no Airtable
   - Re-execute a migração

>>>>>>> 8591cb7 (feat: Adicionar README e configurar repositório Git)
## ⚠️ Importante

- Estes arquivos são gerados automaticamente a cada execução do script
- Arquivos anteriores serão sobrescritos
- Faça backup se precisar manter histórico

