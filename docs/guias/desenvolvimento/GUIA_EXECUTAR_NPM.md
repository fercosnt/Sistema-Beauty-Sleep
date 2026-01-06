# Guia: Como Executar npm no PowerShell

## Problema
O PowerShell está bloqueando a execução de scripts npm devido à política de execução.

## Solução: Alterar Política de Execução

### Opção 1: Alterar para CurrentUser (Recomendado - Mais Seguro)

Execute no PowerShell **como Administrador**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Isso permite executar scripts locais e scripts baixados da internet que foram assinados.

### Opção 2: Alterar para Process (Temporário - Apenas para esta sessão)

Execute no PowerShell **normal** (não precisa ser admin):

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

Isso só funciona para a sessão atual do PowerShell.

### Opção 3: Usar CMD ao invés do PowerShell

Se preferir não alterar a política, você pode usar o **Prompt de Comando (CMD)**:

1. Abra o CMD (não PowerShell)
2. Navegue até a pasta do projeto:
   ```cmd
   cd "C:\Users\LuizHenriqueSantosdo\OneDrive - MEDLASER COMERCIO IMPORTACAO E EXPORTACAO LTDA\Documentos\Trabalho BS\Sistema-Beauty-Sleep-main"
   ```
3. Execute:
   ```cmd
   npm run dev
   ```

## Verificar Política Atual

Para ver qual é a política atual:

```powershell
Get-ExecutionPolicy
```

## Após Alterar a Política

Depois de alterar a política, você pode executar normalmente:

```powershell
npm run dev
```

## Recomendação

Use a **Opção 1** (RemoteSigned para CurrentUser) - é mais segura e permanente apenas para seu usuário.

