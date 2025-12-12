# Script para organizar documentação
# Move arquivos .md da raiz para a pasta docs organizada

$rootPath = Get-Location
$docsPath = Join-Path $rootPath "docs"

# Criar pastas se não existirem
$folders = @("guias", "relatorios", "resumos", "configuracao", "testes-antigos")
foreach ($folder in $folders) {
    $folderPath = Join-Path $docsPath $folder
    if (-not (Test-Path $folderPath)) {
        New-Item -ItemType Directory -Path $folderPath -Force | Out-Null
    }
}

# Mover guias
$guias = @(
    "CONFIGURACAO_BIOLOGIX.md",
    "CONFIGURAR_CREDENCIAIS_TESTE.md",
    "CONFIGURAR_ENV_LOCAL.md",
    "CORRECAO_ENV_LOCAL_SEGURO.md",
    "CRON_JOB_MONITORAMENTO.md",
    "DEPLOY_CHECKLIST.md",
    "DEPLOY_EDGE_FUNCTION.md",
    "GUIA_*.md",
    "INSTRUCOES_DEPLOY_RAPIDO.md",
    "LIMPEZA_ARQUIVOS_LOG.md",
    "SCRIPTS_DISPONIVEIS.md",
    "SETUP_CRON_SECRETS.md",
    "TROUBLESHOOTING_EDGE_FUNCTION.md"
)

foreach ($pattern in $guias) {
    Get-ChildItem -Path $rootPath -Filter $pattern -ErrorAction SilentlyContinue | 
        Where-Object { $_.Name -ne "README.md" } |
        Move-Item -Destination (Join-Path $docsPath "guias\") -Force -ErrorAction SilentlyContinue
}

# Mover relatórios
$relatorios = @(
    "RELATORIO_*.md",
    "RESULTADO_*.md"
)

foreach ($pattern in $relatorios) {
    Get-ChildItem -Path $rootPath -Filter $pattern -ErrorAction SilentlyContinue |
        Move-Item -Destination (Join-Path $docsPath "relatorios\") -Force -ErrorAction SilentlyContinue
}

# Mover resumos
$resumos = @(
    "RESUMO_*.md"
)

foreach ($pattern in $resumos) {
    Get-ChildItem -Path $rootPath -Filter $pattern -ErrorAction SilentlyContinue |
        Move-Item -Destination (Join-Path $docsPath "resumos\") -Force -ErrorAction SilentlyContinue
}

# Mover testes antigos
$testes = @(
    "TESTES_*.md",
    "PROBLEMAS_*.md"
)

foreach ($pattern in $testes) {
    Get-ChildItem -Path $rootPath -Filter $pattern -ErrorAction SilentlyContinue |
        Move-Item -Destination (Join-Path $docsPath "testes-antigos\") -Force -ErrorAction SilentlyContinue
}

# Mover arquivos de testes antigos de docs/ para docs/testes-antigos/
$testesDocs = @(
    "ANALISE_*.md",
    "CORRECAO_*.md",
    "CORRECOES_*.md",
    "ERRO_*.md",
    "GUIA_DEBUG_*.md",
    "ONDE_*.md",
    "PROBLEMA_*.md",
    "PROBLEMAS_*.md",
    "PROGRESSO_*.md",
    "RESUMO_PROBLEMAS_*.md",
    "TESTES_*.md"
)

foreach ($pattern in $testesDocs) {
    Get-ChildItem -Path $docsPath -Filter $pattern -ErrorAction SilentlyContinue |
        Move-Item -Destination (Join-Path $docsPath "testes-antigos\") -Force -ErrorAction SilentlyContinue
}

# Mover resumos de docs/ para docs/resumos/
$resumosDocs = @(
    "GAMIFICACAO_*.md",
    "GUIA_CORRECOES_*.md",
    "GUIA_MIGRACAO_*.md",
    "PLANO_*.md",
    "VALIDACAO_*.md",
    "RESUMO_CORRECOES_*.md",
    "STATUS_TAREFAS.md",
    "TESTING.md"
)

foreach ($pattern in $resumosDocs) {
    Get-ChildItem -Path $docsPath -Filter $pattern -ErrorAction SilentlyContinue |
        Move-Item -Destination (Join-Path $docsPath "resumos\") -Force -ErrorAction SilentlyContinue
}

Write-Host "Documentação organizada com sucesso!" -ForegroundColor Green
Write-Host "Estrutura:" -ForegroundColor Yellow
Write-Host "  docs/guias/ - Guias de configuração e uso" -ForegroundColor Cyan
Write-Host "  docs/relatorios/ - Relatórios de verificação" -ForegroundColor Cyan
Write-Host "  docs/resumos/ - Resumos de tarefas e correções" -ForegroundColor Cyan
Write-Host "  docs/testes-antigos/ - Documentação antiga de testes" -ForegroundColor Cyan

