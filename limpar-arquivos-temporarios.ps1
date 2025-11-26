# Script para remover arquivos temporarios de debug/teste
# Execute: .\limpar-arquivos-temporarios.ps1

Write-Host "=== Limpeza de Arquivos Temporarios ===" -ForegroundColor Cyan
Write-Host ""

# Lista de arquivos temporarios para remover
$arquivosParaRemover = @(
    # Arquivos de analise temporaria
    "ANALISE_COMPARACAO_MANUAL.md",
    "ANALISE_ERRO_403_FINAL.md",
    "ANALISE_LOGS_COMPLETA.md",
    "ANALISE_LOGS_V8.md",
    "CORRECAO_PARTNER_ID.md",
    "CORRECOES_APLICADAS_MANUAL.md",
    "DEBUG_ERRO_500.md",
    "LIMITE_100_EXAMES.md",
    "PARTNER_ID_DESCOBERTO.md",
    "PROBLEMA_PARTNER_ID_IDENTIFICADO.md",
    "RESULTADO_TESTE_V14.md",
    "RESULTADO_TESTE_V15.md",
    "RESULTADO_TESTE_V17.md",
    "RESULTADO_TESTE_V18.md",
    "RESULTADO_TESTE.md",
    "RESUMO_FINAL_AUTENTICACAO.md",
    "STATUS_ETAPA_1.9.md",
    "STATUS_FINAL_ETAPA_1.9.md",
    "STATUS_TESTE_V14.md",
    "TESTE_AUTH_HEADER.md",
    "TESTE_AUTENTICACAO.md",
    "TESTE_EDGE_FUNCTION.md",
    "VERIFICACAO_COMPLETA_MANUAL.md",
    "VERIFICACAO_FLUXO_N8N.md",
    "VERIFICACAO_MANUAL.md",
    "SUCESSO_V21.md",
    "ARQUIVOS_PARA_REMOVER.md",
    "LIMPEZA_ARQUIVOS_TEMPORARIOS.md",
    "RESUMO_LIMPEZA_E_CORRECOES.md",
    
    # Arquivo de comando temporario (scripts de teste foram movidos para scripts/)
    "COMANDO_TERMINAL_POWERSHELL.txt"
)

$removidos = 0
$naoEncontrados = 0

Write-Host "Arquivos a serem removidos:" -ForegroundColor Yellow
foreach ($arquivo in $arquivosParaRemover) {
    Write-Host "  - $arquivo"
}
Write-Host ""

# Confirmar antes de remover
$confirmacao = Read-Host "Deseja continuar e remover estes arquivos? (S/N)"
if ($confirmacao -ne "S" -and $confirmacao -ne "s") {
    Write-Host "Operacao cancelada." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Removendo arquivos..." -ForegroundColor Yellow

foreach ($arquivo in $arquivosParaRemover) {
    if (Test-Path $arquivo) {
        try {
            Remove-Item $arquivo -Force
            Write-Host "  [OK] Removido: $arquivo" -ForegroundColor Green
            $removidos++
        } catch {
            Write-Host "  [ERRO] Erro ao remover: $arquivo - $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "  [-] Nao encontrado: $arquivo" -ForegroundColor Gray
        $naoEncontrados++
    }
}

Write-Host ""
Write-Host "=== Resumo ===" -ForegroundColor Cyan
Write-Host "Arquivos removidos: $removidos" -ForegroundColor Green
Write-Host "Arquivos nao encontrados: $naoEncontrados" -ForegroundColor Gray
Write-Host "Total processado: $($arquivosParaRemover.Count)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Limpeza concluida!" -ForegroundColor Green
