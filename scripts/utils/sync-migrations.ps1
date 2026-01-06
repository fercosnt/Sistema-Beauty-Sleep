# Script para sincronizar migrations e aplicar correções de segurança
# Execute este script no PowerShell

Write-Host "Sincronizando histórico de migrations..." -ForegroundColor Yellow

# Lista de migrations remotas que precisam ser marcadas como revertidas
$migrations = @(
    "20251125152109",
    "20251125152126",
    "20251125152130",
    "20251125152145",
    "20251125152157",
    "20251125160010",
    "20251126162630",
    "20251126162755",
    "20251127160946",
    "20251127161032",
    "20251127161103",
    "20251127161147",
    "20251127161205",
    "20251127161353",
    "20251127161817",
    "20251127162031",
    "20251127162350",
    "20251127162446",
    "20251127164054",
    "20251127164555",
    "20251127165450",
    "20251127191747",
    "20251127194754",
    "20251128162835",
    "20251202134304",
    "20251202161447"
)

# Marcar cada migration como revertida
foreach ($migration in $migrations) {
    Write-Host "Marcando migration $migration como revertida..." -ForegroundColor Cyan
    npx supabase migration repair --status reverted $migration
}

Write-Host "`nHistórico sincronizado! Agora você pode aplicar as migrations corrigidas." -ForegroundColor Green
Write-Host "Execute: npx supabase db push" -ForegroundColor Yellow


