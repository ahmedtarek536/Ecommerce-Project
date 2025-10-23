using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Products
{
    public class UpdateProductVariantDTO
    {

      
        public int? ProductId { get; set; }

        [StringLength(50, ErrorMessage = "Color cannot exceed 50 characters.")]
        public string? Color { get; set; }

     
    }
}
