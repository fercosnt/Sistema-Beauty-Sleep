# Script para adicionar datas aos commits
# Este script usa git rebase para editar mensagens de commit

Write-Host "Adicionando datas aos commits anteriores..." -ForegroundColor Yellow

# Lista de commits e suas datas correspondentes
$commits = @(
    @{hash="8591cb7"; date="25/11/2025"; message="feat: Adicionar README e configurar repositório Git"},
    @{hash="3590597"; date="25/11/2025"; message="Atualizar tasks-beauty-sleep-sistema-base.md"},
    @{hash="22e4fc6"; date="25/11/2025"; message="feat(beauty-sleep): Fase 0 - Feature Branch"}
)

Write-Host "`nCommits que serão atualizados:" -ForegroundColor Cyan
foreach ($commit in $commits) {
    Write-Host "  - $($commit.hash): $($commit.message) -> $($commit.date)" -ForegroundColor Gray
}

Write-Host "`nPara adicionar datas aos commits, execute manualmente:" -ForegroundColor Yellow
Write-Host "git rebase -i HEAD~3" -ForegroundColor White
Write-Host "`nNo editor, mude 'pick' para 'reword' nos commits que deseja editar," -ForegroundColor Gray
Write-Host "e adicione a data no formato: [DD/MM/YYYY] no início da mensagem." -ForegroundColor Gray


