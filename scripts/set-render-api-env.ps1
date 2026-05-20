# Opens Render API service env page and copies variables to clipboard (password excluded).
# Usage: .\scripts\set-render-api-env.ps1

$apiServiceId = "srv-d86hlcmq1p3s73c18pc0"
$envPage = "https://dashboard.render.com/web/$apiServiceId/env"
$deployPage = "https://dashboard.render.com/web/$apiServiceId/deploys"

$block = @"
SPRING_PROFILES_ACTIVE=prod
# JDBC or postgresql:// both work after latest backend fix
SPRING_DATASOURCE_URL=jdbc:postgresql://ep-sparkling-leaf-aqam8hwa-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
SPRING_DATASOURCE_USERNAME=neondb_owner
SPRING_DATASOURCE_PASSWORD=<paste Neon password here>
JWT_SECRET=OborjV5slcFdIZH0WnKYTxpRz3UuQSCAw2XEiJGN4tam6yD7
APP_ALLOWED_ORIGINS=https://facebook-clone-web.onrender.com
"@

Set-Clipboard -Value $block

Write-Host ""
Write-Host "Copied API env vars to clipboard (replace PASSWORD placeholder)." -ForegroundColor Green
Write-Host "Opening Render Environment page..." -ForegroundColor Cyan
Start-Process $envPage
Start-Sleep -Seconds 2
Write-Host ""
Write-Host "Steps:" -ForegroundColor Yellow
Write-Host "  1. In Render, add/update each variable from clipboard"
Write-Host "  2. Save Changes"
Write-Host "  3. Manual Deploy -> Deploy latest commit (66ebfd4+)"
Write-Host ""
Write-Host "Health check after deploy:" -ForegroundColor Cyan
Write-Host "  https://facebook-clone-api-uaqm.onrender.com/actuator/health"
Write-Host ""

$go = Read-Host "Open deploy page now? (y/n)"
if ($go -eq "y" -or $go -eq "Y") {
    Start-Process $deployPage
}
