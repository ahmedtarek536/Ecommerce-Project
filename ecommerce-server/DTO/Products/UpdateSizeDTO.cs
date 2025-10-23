using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Products
{
    public class UpdateSizeDTO
    {
        public int? ProductVariantId { get; set; }

        
        public string? Name { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be a non-negative number.")]
        public int? Quantity { get; set; }
    }
}
