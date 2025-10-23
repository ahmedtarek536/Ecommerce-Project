using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Models.Products
{
    public class ProductImage
    {

        public int Id { get; set; }

        [Required]
        public int ProductVariantId { get; set; }

        [Required]
        [StringLength(255)]
        public string ImageUrl { get; set; }

        public ProductVariant ProductVariant { get; set; }
    }
}
