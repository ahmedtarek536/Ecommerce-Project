using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Models.Orders
{
    public class OrderDiscount
    {

        public int Id { get; set; }

        [ForeignKey("Order")]
        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; }

        [ForeignKey("Discount")]
        [Required]
        public int DiscountId { get; set; }
        public Discount Discount { get; set; }
    }
}
