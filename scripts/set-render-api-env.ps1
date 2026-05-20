# Opens Render API service env page. Paste ONE full Neon string OR separate vars.
# Usage: .\scripts\set-render-api-env.ps1

$apiServiceId = "srv-d86hlcmq1p3s73c18pc0"
$envPage = "https://dashboard.render.com/web/$apiServiceId/env"

$block = @"
# Option A (easiest): paste your full Neon connection string as ONE variable:
SPRING_DATASOURCE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-sparkling-leaf-aqam8hwa.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require

# Option B: separate variables:
# SPRING_DATASOURCE_URL=jdbc:postgresql://ep-sparkling-leaf-aqam8hwa-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require
# SPRING_DATASOURCE_USERNAME=neondb_owner
# SPRING_DATASOURCE_PASSWORD=YOUR_PASSWORD

SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=OborjV5slcFdIZH0WnKYTxpRz3UuQSCAw2XEiJGN4tam6yD7
APP_ALLOWED_ORIGINS=https://facebook-clone-web.onrender.com
"@

Set-Clipboard -Value $block
Write-Host "Copied env template to clipboard. Replace YOUR_PASSWORD with Neon password." -ForegroundColor Green
Start-Process $envPage
Write-Host "After Save -> Manual Deploy latest main commit." -ForegroundColor Yellow
Write-Host "Health: https://facebook-clone-api-uaqm.onrender.com/actuator/health"
