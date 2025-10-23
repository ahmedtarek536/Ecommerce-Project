using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Models.Orders
{
    public class Shipping
    {

        public int Id { get; set; }

        [ForeignKey("Order")]
        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; }

        [Required]
        [StringLength(100)]
        public string Carrier { get; set; }

        [StringLength(100)]
        public string TrackingNumber { get; set; }

        [Required]
        public ShippingMethod ShippingMethod { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        [Range(0, double.MaxValue)]
        public decimal ShippingCost { get; set; } = 0.00m;

        public ShippingStatus ShippingStatus { get; set; } = ShippingStatus.Pending;

        public DateTime? ShippedDate { get; set; }

        public DateTime? EstimatedDelivery { get; set; }
    }

    public enum ShippingMethod
    {
        Standard,
        Express,
        Overnight
    }

    public enum ShippingStatus
    {
        Pending,
        Shipped,
        Delivered
    }

}
