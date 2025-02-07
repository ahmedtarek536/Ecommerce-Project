using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO
{
    public class ProductImageDTO
    {
        

        [Required(ErrorMessage = "Product ID is required.")]
        public int ProductVariantId { get; set; }


        [Required(ErrorMessage = "Image URL is required.")]
        [StringLength(255, ErrorMessage = "Image URL cannot exceed 255 characters.")]
        [Url(ErrorMessage = "Invalid URL format.")]
        public string ImageUrl { get; set; }

      
    }
}
