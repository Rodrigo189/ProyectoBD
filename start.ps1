param(
  [switch]$RecreateMongo = $false,
  [switch]$Seed = $true
)

$root = $PSScriptRoot
$seedPath = (Resolve-Path "$root\mongo_data").Path

Write-Host "==> Iniciando Mongo (Docker)..." -ForegroundColor Cyan
$exists = docker ps -a --format "{{.Names}}" | Select-String -SimpleMatch "eleam-mongo"
if ($exists -and $RecreateMongo) {
  docker rm -f eleam-mongo | Out-Null
  $exists = $null
}
if (-not $exists) {
  docker run -d --name eleam-mongo -p 27017:27017 -v "${seedPath}:/data/seed" mongo:7 | Out-Null
} else {
  docker start eleam-mongo | Out-Null
}

# Esperar a que Mongo esté listo
for ($i = 0; $i -lt 30; $i++) {
  docker exec eleam-mongo mongosh --quiet --eval "db.runCommand({ ping: 1 }).ok" 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) { break }
  Start-Sleep -Seconds 1
}
Write-Host "Mongo OK." -ForegroundColor Green

if ($Seed) {
  Write-Host "==> Importando JSON..." -ForegroundColor Cyan
  $imports = @(
    @{ c = "funcionarios"; f = "funcionarios.json" },
    @{ c = "probabilidades"; f = "probabilidades.json" },
    @{ c = "riesgos"; f = "riesgos.json" },
    @{ c = "sis"; f = "sis.json" }
  )
  foreach ($it in $imports) {
    $file = "/data/seed/$($it.f)"
    Write-Host ("  - {0} <- {1}" -f $it.c, $it.f)
    docker exec eleam-mongo mongoimport --db eleam --collection $($it.c) --drop --jsonArray --file $file | Out-Null
  }
  Write-Host "Importación completa." -ForegroundColor Green
}

# Backend
Write-Host "==> Iniciando backend (Flask)..." -ForegroundColor Cyan
$backendCmd = @"
cd `"$root\backend`"
if (!(Test-Path .venv)) { python -m venv .venv }
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
`$env:FLASK_ENV = 'development'
python app.py
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd | Out-Null

# Frontend
Write-Host "==> Iniciando frontend (React)..." -ForegroundColor Cyan
$frontendCmd = @"
cd `"$root\frontend`"
if (!(Test-Path node_modules)) { npm install }
npm start
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd | Out-Null

Write-Host "`nListo:" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:5000"
Write-Host "  Frontend: http://localhost:3000"
Write-Host "  Mongo:    mongodb://localhost:27017/eleam"
Write-Host "`nUsa -RecreateMongo para borrar y recrear el contenedor, -Seed:$false para no reimportar."