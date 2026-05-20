# Start full stack locally with Docker Compose
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env from .env.example — set JWT_SECRET before production use."
}

Write-Host "Starting Postgres + API + Web..."
docker compose up --build
