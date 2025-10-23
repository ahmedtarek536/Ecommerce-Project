using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO
{
    public class WishlistDTO
    {

        public int CustomerId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int ProductVariantId { get; set; }
    }
}
