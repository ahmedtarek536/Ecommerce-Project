using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Products
{
    public class FullProductSizeDTO
    {
        [Required(ErrorMessage = "Size name is required.")]
        [StringLength(50, ErrorMessage = "Size name cannot be longer than 50 characters.")]
        public string Name { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be a non-negative number.")]
        public int Quantity { get; set; }
    }
}
