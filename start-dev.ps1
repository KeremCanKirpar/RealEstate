param(
    [int]$BackendPort = 5104,
    [int]$FrontendPort = 5173
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendProject = Join-Path $root "backend\EstateFlow.Api\EstateFlow.Api.csproj"
$frontendDir = Join-Path $root "frontend\EstateFlow.Client"
$backendOut = Join-Path $root "backend-api.out.log"
$backendErr = Join-Path $root "backend-api.err.log"
$frontendOut = Join-Path $root "frontend-vite.out.log"
$frontendErr = Join-Path $root "frontend-vite.err.log"

function Stop-PortProcess([int]$Port) {
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    foreach ($connection in $connections) {
        if ($connection.OwningProcess -and $connection.OwningProcess -ne $PID) {
            $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Port $Port is in use, stopping process: $($process.ProcessName) ($($process.Id))" -ForegroundColor Yellow
                Stop-Process -Id $process.Id -Force
            }
        }
    }
}

Stop-PortProcess $BackendPort
Stop-PortProcess $FrontendPort
Start-Sleep -Seconds 1

$dotnet = "C:\Program Files\dotnet\dotnet.exe"
$npm = "C:\Program Files\nodejs\npm.cmd"

if (-not (Test-Path $dotnet)) { $dotnet = "dotnet" }
if (-not (Test-Path $npm)) { $npm = "npm.cmd" }

Write-Host "Starting backend: http://127.0.0.1:$BackendPort" -ForegroundColor Cyan
Start-Process -FilePath $dotnet `
    -ArgumentList @("run", "--project", $backendProject, "--urls", "http://127.0.0.1:$BackendPort") `
    -WorkingDirectory $root `
    -RedirectStandardOutput $backendOut `
    -RedirectStandardError $backendErr `
    -WindowStyle Hidden

Write-Host "Starting frontend: http://127.0.0.1:$FrontendPort" -ForegroundColor Cyan
Start-Process -FilePath $npm `
    -ArgumentList @("run", "dev", "--", "--host", "127.0.0.1", "--port", "$FrontendPort") `
    -WorkingDirectory $frontendDir `
    -RedirectStandardOutput $frontendOut `
    -RedirectStandardError $frontendErr `
    -WindowStyle Hidden

Start-Sleep -Seconds 3
Write-Host "Customer site: http://127.0.0.1:$FrontendPort/musteri" -ForegroundColor Green
Write-Host "Admin panel: http://127.0.0.1:$FrontendPort/panel" -ForegroundColor Green
Write-Host "Backend API: http://127.0.0.1:$BackendPort" -ForegroundColor Green
Write-Host "Logs: backend-api.*.log and frontend-vite.*.log" -ForegroundColor DarkGray