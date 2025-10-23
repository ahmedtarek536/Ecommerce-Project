using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Products
{
    public class FullProductImageDTO
    {
        [Required(ErrorMessage = "Image URL is required.")]
        [StringLength(255, ErrorMessage = "Image URL cannot exceed 255 characters.")]
        [Url(ErrorMessage = "Invalid URL format.")]
        public string ImageUrl { get; set; }
    }
}
