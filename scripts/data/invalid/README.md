# Arquivos de Dados Inválidos

Este diretório contém arquivos CSV gerados automaticamente pelo script de migração com os registros que não puderam ser migrados.

## 📋 Arquivos Gerados

### `pacientes_invalidos.csv`
Contém todos os pacientes do Airtable que foram rejeitados durante a migração devido a:
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

## 🔍 Como Usar

1. **Abra os arquivos CSV** em Excel, Google Sheets ou outro editor
2. **Revise os registros** e identifique:
   - Quais podem ser corrigidos (CPF faltando dígitos, formato errado)
   - Quais devem ser descartados (dados de teste, duplicados)
   - Quais precisam de ação manual (buscar CPF correto)
3. **Corrija os dados** no Airtable ou diretamente nos CSVs
4. **Re-execute a migração** após correções

## 📝 Próximos Passos

Após revisar os arquivos:

1. **Se encontrar CPFs corrigíveis:**
   - Corrija no Airtable
   - Re-exporte os CSVs
   - Execute a migração novamente

2. **Se encontrar registros para descartar:**
   - Anote quais devem ser removidos
   - A migração já os ignorou automaticamente

3. **Se encontrar registros que precisam de ação manual:**
   - Busque o CPF correto
   - Atualize no Airtable
   - Re-execute a migração

## ⚠️ Importante

- Estes arquivos são gerados automaticamente a cada execução do script
- Arquivos anteriores serão sobrescritos
- Faça backup se precisar manter histórico

