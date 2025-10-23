using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO
{
    public class OrderDiscountDTO
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        public int DiscountId { get; set; }
    }
}
