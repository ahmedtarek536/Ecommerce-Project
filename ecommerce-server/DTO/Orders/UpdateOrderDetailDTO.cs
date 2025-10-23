using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Orders
{
    public class UpdateOrderDetailDTO
    {
        public int? OrderId { get; set; }

        public int? ProductVariantId { get; set; }

        public int? ProductId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int? Quantity { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal? Price { get; set; }
    }
}
