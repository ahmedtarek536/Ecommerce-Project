# PowerShell script to check table names
$connectionString = "Server=DESKTOP-EJDCTI4\MSSQLSERVER5;Database=EcommerceApp;Integrated Security=True;TrustServerCertificate=True"

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()
    
    $command = New-Object System.Data.SqlClient.SqlCommand
    $command.Connection = $connection
    $command.CommandText = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME"
    
    $reader = $command.ExecuteReader()
    
    Write-Host "Tables in database:" -ForegroundColor Green
    while ($reader.Read()) {
        Write-Host "  - $($reader[0])"
    }
    
    $reader.Close()
    $connection.Close()
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
