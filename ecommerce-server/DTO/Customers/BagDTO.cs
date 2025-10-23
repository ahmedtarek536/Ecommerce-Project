using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Customers
{
    public class BagDTO
    {

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int ProductVariantId { get; set; }

        [Required]
        public int SizeId { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
