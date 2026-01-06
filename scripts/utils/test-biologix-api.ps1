# Script de Teste da API Biologix
# Execute: .\scripts\test-biologix-api.ps1
# 
# ⚠️ IMPORTANTE: Configure as variáveis no arquivo .env.local na raiz do projeto

# Função para carregar variáveis do .env.local
function Load-EnvFile {
    $parentDir = Split-Path -Parent $PSScriptRoot
    $envPath = Join-Path $parentDir ".env.local"
    $envPath = Resolve-Path $envPath -ErrorAction SilentlyContinue
    
    if (-not $envPath -or -not (Test-Path $envPath)) {
        Write-Host "❌ Erro: Arquivo .env.local não encontrado!" -ForegroundColor Red
        Write-Host "   Crie o arquivo .env.local na raiz do projeto com as seguintes variáveis:" -ForegroundColor Yellow
        Write-Host "   BIOLOGIX_USERNAME=seu_username" -ForegroundColor Yellow
        Write-Host "   BIOLOGIX_PASSWORD=sua_senha" -ForegroundColor Yellow
        Write-Host "   BIOLOGIX_SOURCE=100" -ForegroundColor Yellow
        Write-Host "   BIOLOGIX_PARTNER_ID=seu_partner_id" -ForegroundColor Yellow
        exit 1
    }
    
    $envVars = @{}
    Get-Content $envPath | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#')) {
            $equalIndex = $line.IndexOf('=')
            if ($equalIndex -gt 0) {
                $key = $line.Substring(0, $equalIndex).Trim()
                $value = $line.Substring($equalIndex + 1).Trim()
                # Remover aspas se existirem
                $value = $value -replace '^["'']|["'']$', ''
                $envVars[$key] = $value
            }
        }
    }
    
    return $envVars
}

# Carregar variáveis de ambiente
$envVars = Load-EnvFile

# Configuracao - Valores do .env.local
$BIOLOGIX_USERNAME = $envVars['BIOLOGIX_USERNAME']
$BIOLOGIX_PASSWORD = $envVars['BIOLOGIX_PASSWORD']
$BIOLOGIX_SOURCE = if ($envVars['BIOLOGIX_SOURCE']) { [int]$envVars['BIOLOGIX_SOURCE'] } else { 100 }
$BIOLOGIX_PARTNER_ID = $envVars['BIOLOGIX_PARTNER_ID']
$BIOLOGIX_BASE_URL = "https://api.biologixsleep.com"

# Validar variáveis obrigatórias
if (-not $BIOLOGIX_USERNAME -or -not $BIOLOGIX_PASSWORD -or -not $BIOLOGIX_PARTNER_ID) {
    Write-Host "❌ Erro: Variáveis obrigatórias não encontradas no .env.local!" -ForegroundColor Red
    Write-Host "   Verifique se as seguintes variáveis estão configuradas:" -ForegroundColor Yellow
    Write-Host "   - BIOLOGIX_USERNAME" -ForegroundColor Yellow
    Write-Host "   - BIOLOGIX_PASSWORD" -ForegroundColor Yellow
    Write-Host "   - BIOLOGIX_PARTNER_ID" -ForegroundColor Yellow
    exit 1
}

Write-Host "=== Teste da API Biologix ===" -ForegroundColor Cyan
Write-Host ""

# 1. Abrir Sessao
Write-Host "[1] Abrindo sessao..." -ForegroundColor Yellow

$authString = "$BIOLOGIX_USERNAME`:$BIOLOGIX_PASSWORD"
$authBytes = [System.Text.Encoding]::UTF8.GetBytes($authString)
$authBase64 = [Convert]::ToBase64String($authBytes)

$sessionBody = @{
    username = $BIOLOGIX_USERNAME
    password = $BIOLOGIX_PASSWORD
    source = $BIOLOGIX_SOURCE
} | ConvertTo-Json

try {
    $sessionResponse = Invoke-RestMethod -Uri "$BIOLOGIX_BASE_URL/v2/sessions" `
        -Method POST `
        -Headers @{
            "Content-Type" = "application/json"
            "Authorization" = "basic $authBase64"
        } `
        -Body $sessionBody `
        -ErrorAction Stop

    Write-Host "[OK] Sessao aberta com sucesso!" -ForegroundColor Green
    Write-Host "  UserId: $($sessionResponse.userId)" -ForegroundColor Gray
    Write-Host "  SessionId: $($sessionResponse.sessionId)" -ForegroundColor Gray
    Write-Host "  CenterId: $($sessionResponse.centerId)" -ForegroundColor Gray
    
} catch {
    Write-Host "[ERRO] Falha ao abrir sessao: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Resposta: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 2. Buscar Exames
Write-Host "[2] Buscando exames..." -ForegroundColor Yellow

$offset = 0
$limit = 10  # Limite para teste

$examsUrl = "$BIOLOGIX_BASE_URL/v2/partners/$BIOLOGIX_PARTNER_ID/exams?offset=$offset&limit=$limit"

try {
    $examsResponse = Invoke-RestMethod -Uri $examsUrl `
        -Method GET `
        -Headers @{
            "Authorization" = "basic $authBase64"
        } `
        -ErrorAction Stop

    Write-Host "[OK] Exames recuperados com sucesso!" -ForegroundColor Green
    Write-Host "  Total de exames: $($examsResponse.total)" -ForegroundColor Gray
    Write-Host "  Exames retornados: $($examsResponse.items.Count)" -ForegroundColor Gray
    
    if ($examsResponse.items.Count -gt 0) {
        Write-Host ""
        Write-Host "Primeiros exames:" -ForegroundColor Cyan
        foreach ($exam in $examsResponse.items[0..([Math]::Min(2, $examsResponse.items.Count - 1))]) {
            Write-Host "  - ID: $($exam.id) | Tipo: $($exam.type) | Status: $($exam.status) | Data: $($exam.examDate)" -ForegroundColor Gray
        }
    }
    
} catch {
    Write-Host "[ERRO] Falha ao buscar exames: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Resposta: $responseBody" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "=== Teste Concluido ===" -ForegroundColor Green

