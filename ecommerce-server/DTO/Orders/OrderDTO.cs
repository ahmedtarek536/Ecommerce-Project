using Ecommerce_Server.Models.Orders;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Ecommerce_Server.DTO.Orders
{
    public class OrderDTO
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        [EnumDataType(typeof(OrderStatus))]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Total amount must be greater than zero.")]
        public decimal TotalAmount { get; set; }

        [Required]
        [EnumDataType(typeof(PaymentMethod))]
        public PaymentMethod PaymentMethod { get; set; }

        [Required]
        [MaxLength(1000, ErrorMessage = "Shipping address cannot exceed 1000 characters.")]
        public string ShippingAddress { get; set; }

        public List<OrderItemDTO> Items { get; set; }
    }

    public class OrderItemDTO
    {
        public int ProductId { get; set; }
        public int ProductVariantId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
