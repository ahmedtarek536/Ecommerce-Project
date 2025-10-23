using Ecommerce_Server.Models.Orders;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Orders
{
    public class UpdateOrderDTO
    {
        public int? CustomerId { get; set; }


        [EnumDataType(typeof(OrderStatus))]
        public OrderStatus? Status { get; set; } 

      
        [Range(0.01, double.MaxValue, ErrorMessage = "Total amount must be greater than zero.")]
        public decimal? TotalAmount { get; set; }

     
        [EnumDataType(typeof(PaymentMethod))]
        public PaymentMethod? PaymentMethod { get; set; }

        [MaxLength(1000, ErrorMessage = "Shipping address cannot exceed 1000 characters.")]
        public string? ShippingAddress { get; set; }
    }
}
