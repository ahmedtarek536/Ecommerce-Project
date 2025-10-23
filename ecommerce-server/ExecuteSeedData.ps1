# PowerShell script to execute seed data SQL
$connectionString = "Server=DESKTOP-EJDCTI4\MSSQLSERVER5;Database=EcommerceApp;Integrated Security=True;TrustServerCertificate=True"
$sqlScript = Get-Content -Path "SeedSampleData.sql" -Raw

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()
    
    Write-Host "Executing seed data script..." -ForegroundColor Yellow
    
    $command = New-Object System.Data.SqlClient.SqlCommand
    $command.Connection = $connection
    $command.CommandText = $sqlScript
    $command.CommandTimeout = 120
    
    $result = $command.ExecuteNonQuery()
    
    Write-Host "`nSample data inserted successfully!" -ForegroundColor Green
    Write-Host "Database is now populated with test data." -ForegroundColor Green
    
    $connection.Close()
}
catch {
    Write-Host "Error executing seed script: $_" -ForegroundColor Red
}
