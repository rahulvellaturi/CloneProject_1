# One-time cloud deploy helper (Neon + Render)
# Run: .\scripts\deploy-cloud.ps1

$ErrorActionPreference = "Stop"

Write-Host "`n=== Facebook Clone — Cloud deploy helper ===`n" -ForegroundColor Cyan

$jwt = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object { [char]$_ })
$envFile = Join-Path $PSScriptRoot ".." "infra" "cloud-env.local.txt"
$envFile = [System.IO.Path]::GetFullPath($envFile)

$template = @"
# Paste these into Render when the Blueprint asks (do NOT commit this file)
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm")

# --- From Neon (https://console.neon.tech) ---
# Connection string example: postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
SPRING_DATASOURCE_URL=jdbc:postgresql://YOUR_HOST/YOUR_DB?sslmode=require
SPRING_DATASOURCE_USERNAME=YOUR_NEON_USER
SPRING_DATASOURCE_PASSWORD=YOUR_NEON_PASSWORD

# --- API service (facebook-clone-api) ---
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=$jwt
APP_ALLOWED_ORIGINS=https://facebook-clone-web.onrender.com

# --- Frontend service (facebook-clone-web) — set AFTER API is live ---
REACT_APP_API_URL=https://facebook-clone-api.onrender.com/api

# --- Optional: copy from frontend/.env ---
# REACT_APP_FIREBASE_API_KEY=...
# REACT_APP_FIREBASE_AUTH_DOMAIN=...
# REACT_APP_FIREBASE_PROJECT_ID=...
"@

Set-Content -Path $envFile -Value $template -Encoding UTF8
Write-Host "Saved env template (gitignored):" $envFile -ForegroundColor Green
Write-Host "JWT_SECRET pre-generated in that file.`n"

Write-Host "Step 1 — Neon (free Postgres)" -ForegroundColor Yellow
Write-Host "  1. Sign in / create project at neon.tech"
Write-Host "  2. Copy connection string → fill SPRING_DATASOURCE_* in the file above"
Write-Host "  3. JDBC format: jdbc:postgresql://HOST/DB?sslmode=require`n"

Write-Host "Step 2 — Render Blueprint" -ForegroundColor Yellow
Write-Host "  Repo: rahulvellaturi/CloneProject_1  branch: main"
Write-Host "  Dashboard: https://dashboard.render.com/blueprint/new`n"

$open = Read-Host "Open Neon + Render in browser now? (y/n)"
if ($open -eq "y" -or $open -eq "Y") {
    Start-Process "https://console.neon.tech"
    Start-Sleep -Seconds 1
    Start-Process "https://dashboard.render.com/blueprint/new"
}

Write-Host "`nAfter first deploy:" -ForegroundColor Yellow
Write-Host "  1. Set APP_ALLOWED_ORIGINS to your real frontend URL, redeploy API"
Write-Host "  2. Set REACT_APP_API_URL to your real API URL + /api, redeploy web"
Write-Host "  3. Health check: https://facebook-clone-api.onrender.com/actuator/health`n"
Write-Host "Full guide: infra/DEPLOYMENT.md`n"
