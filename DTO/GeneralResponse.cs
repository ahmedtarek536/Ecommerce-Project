namespace Ecommerce_Server.DTO
{
    public class GeneralResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public dynamic Data { get; set; }
    }
}
