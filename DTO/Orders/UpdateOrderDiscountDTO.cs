using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Orders
{
    public class UpdateOrderDiscountDTO
    {
        public int? OrderId { get; set; }

      
        public int? DiscountId { get; set; }
    }
}
