Param(
    [string]$Host = "127.0.0.1",
    [int]$Port = 3306,
    [string]$User = "appuser",
    [string]$Password = "apppass",
    [string]$File = "../db_init.sql"
)

# Runs the db_init.sql script against the configured MySQL instance.
# Requires the mysql client installed and available on PATH.

if (-not (Test-Path $File)) {
    Write-Error "SQL file not found at '$File'."
    exit 1
}

$env:MYSQL_PWD = $Password
mysql -h $Host -P $Port -u $User < $File
if ($LASTEXITCODE -ne 0) {
    Write-Error "MySQL import failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
}

Write-Host "Database initialized successfully."