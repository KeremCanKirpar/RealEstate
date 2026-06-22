param(
    [Parameter(Mandatory = $true)]
    [string]$Script,

    [string]$Server = ".\SQLEXPRESS",

    [string]$Database = "EstateFlowDb"
)

$ErrorActionPreference = "Stop"

$scriptPath = Resolve-Path -LiteralPath $Script
$sqlcmd = Get-Command sqlcmd -ErrorAction SilentlyContinue
if (-not $sqlcmd) {
    throw "sqlcmd was not found. Install Microsoft SQL Server command line tools."
}

Write-Host "Running SQL script: $scriptPath" -ForegroundColor Cyan
Write-Host "Server: $Server | Database: $Database | Encoding: UTF-8 (65001) | Encrypt: optional | Trust certificate: true" -ForegroundColor DarkCyan

& $sqlcmd.Source -S $Server -d $Database -E -No -C -f 65001 -i $scriptPath
if ($LASTEXITCODE -ne 0) {
    throw "sqlcmd failed with exit code $LASTEXITCODE."
}