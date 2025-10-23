using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Products
{
    public class FullProductVariantDTO
    {
       

        [StringLength(50, ErrorMessage = "Color cannot exceed 50 characters.")]
        public string Color { get; set; }

        [Required(ErrorMessage = "Product Images is required.")]
        public List<FullProductImageDTO> ProductImages { get; set; }

        [Required(ErrorMessage = "Product Sizes is required.")]
        public List<FullProductSizeDTO> Sizes {  get; set; } 

    }
}
