# Questflow — сборка backend + frontend и запуск в одной консоли
#
# Из корня репозитория (D:\test-projects\questflow):
#   .\scripts\build-and-run.ps1
#   .\scripts\build-and-run.ps1 -SkipBuild
#
# Из папки backend:
#   npm run prod              # build + run (рекомендуется)
#   npm run prod:run          # тот же ps1-скрипт
#   ..\scripts\build-and-run.ps1

param(
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..")
$Backend = Join-Path $Root "backend"
$Frontend = Join-Path $Root "frontend"

function Step($Message) {
    Write-Host ""
    Write-Host "==> $Message" -ForegroundColor Cyan
}

if (-not (Test-Path (Join-Path $Backend "package.json"))) {
    throw "Не найден backend: $Backend"
}
if (-not (Test-Path (Join-Path $Frontend "package.json"))) {
    throw "Не найден frontend: $Frontend"
}

if (-not $SkipBuild) {
    Step "Backend: npm run build"
    Push-Location $Backend
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Backend build failed (exit $LASTEXITCODE)" }
    }
    finally {
        Pop-Location
    }

    Step "Frontend: npm run build"
    Push-Location $Frontend
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Frontend build failed (exit $LASTEXITCODE)" }
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "SkipBuild: пропускаем сборку" -ForegroundColor Yellow
}

Step "Запуск API (3000) + frontend preview (5173)"
Write-Host "API:  http://localhost:3000" -ForegroundColor Green
Write-Host "WEB:  http://localhost:5173" -ForegroundColor Green
Write-Host "Swagger: http://localhost:3000/api/docs" -ForegroundColor Green
Write-Host "Остановка: Ctrl+C" -ForegroundColor DarkGray
Write-Host ""

Push-Location $Backend
try {
    npx concurrently `
        -n "API,WEB" `
        -c "blue,magenta" `
        "npm run start:prod" `
        "npm --prefix ../frontend run preview -- --host 0.0.0.0 --port 5173"
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
