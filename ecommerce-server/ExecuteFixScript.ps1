# PowerShell script to execute SQL fix
$connectionString = "Server=DESKTOP-EJDCTI4\MSSQLSERVER5;Database=EcommerceApp;Integrated Security=True;TrustServerCertificate=True"
$sqlScript = Get-Content -Path "FixCascadeDelete.sql" -Raw

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()
    
    $command = New-Object System.Data.SqlClient.SqlCommand
    $command.Connection = $connection
    $command.CommandText = $sqlScript
    
    $result = $command.ExecuteNonQuery()
    
    Write-Host "SQL script executed successfully!" -ForegroundColor Green
    Write-Host "Rows affected: $result" -ForegroundColor Green
    
    $connection.Close()
}
catch {
    Write-Host "Error executing SQL script: $_" -ForegroundColor Red
}
