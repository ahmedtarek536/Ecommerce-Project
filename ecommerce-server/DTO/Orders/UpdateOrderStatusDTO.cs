using Ecommerce_Server.Models.Orders;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Orders
{
    public class UpdateOrderStatusDTO
    {
        [Required]
        [EnumDataType(typeof(OrderStatus))]
        public OrderStatus Status { get; set; }
    }
} 