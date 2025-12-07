Param(
    [Alias('Host')] [string]$DbHost = "127.0.0.1",
    [Alias('Port')] [int]$DbPort = 3306,
    [Alias('User')] [string]$DbUser = "root",
    [Alias('Password')] [string]$DbPassword = "rootpass",
    [Alias('File')] [string]$SqlFile
)

# Runs the db_init.sql script against the configured MySQL instance.
# Requires the mysql client installed and available on PATH.

$mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
$useDocker = $false

if (-not $mysqlCmd) {
    if ($dockerCmd) {
        # Fallback: use mysql client inside running container 'elearning-mysql'
        $useDocker = $true
    } else {
        Write-Error "MySQL client ('mysql') not found on PATH and Docker is not available. Please install a MySQL client or start the compose stack."
        exit 1
    }
}

$defaultFile = Join-Path $PSScriptRoot "..\db_init.sql"
$targetFile = if ([string]::IsNullOrWhiteSpace($SqlFile)) { $defaultFile } else { $SqlFile }
if (-not [System.IO.Path]::IsPathRooted($targetFile)) {
    $targetFile = Join-Path $PSScriptRoot $targetFile
}

if (-not (Test-Path $targetFile)) {
    Write-Error "SQL file not found at '$targetFile'."
    exit 1
}

$env:MYSQL_PWD = $DbPassword

if ($useDocker) {
    # Use mysql client inside the MySQL container
    $cmdArgs = @("exec", "-i", "elearning-mysql", "mysql", "-u$DbUser", "-p$DbPassword")
    Get-Content -Raw $targetFile | & $dockerCmd @cmdArgs
} else {
    $cmdArgs = @("-h", $DbHost, "-P", $DbPort, "-u$DbUser")
    Get-Content -Raw $targetFile | & $mysqlCmd @cmdArgs
}
if ($LASTEXITCODE -ne 0) {
    Write-Error "MySQL import failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Database initialized successfully."