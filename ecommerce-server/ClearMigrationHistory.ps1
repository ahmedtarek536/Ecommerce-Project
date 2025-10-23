# Clear migration history from database
$connectionString = "Server=DESKTOP-EJDCTI4\MSSQLSERVER5;Database=EcommerceApp;Integrated Security=True;TrustServerCertificate=True"

try {
    $connection = New-Object System.Data.SqlClient.SqlConnection
    $connection.ConnectionString = $connectionString
    $connection.Open()
    
    $command = New-Object System.Data.SqlClient.SqlCommand
    $command.Connection = $connection
    $command.CommandText = "DELETE FROM [__EFMigrationsHistory]"
    
    $result = $command.ExecuteNonQuery()
    
    Write-Host "Migration history cleared successfully!" -ForegroundColor Green
    Write-Host "Rows deleted: $result" -ForegroundColor Green
    
    $connection.Close()
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
