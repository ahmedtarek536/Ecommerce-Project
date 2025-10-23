using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Models.Orders
{
    public class Discount
    {

        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Code { get; set; }

        public string Description { get; set; }

        [Required]
        public DiscountType DiscountType { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        [Required]
        [Range(0, double.MaxValue)]
        public decimal DiscountValue { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Column(TypeName = "decimal(10, 2)")]
        [Range(0, double.MaxValue)]
        public decimal MinOrderAmount { get; set; } = 0.00m;
        public ICollection<OrderDiscount> OrderDiscounts { get; set; } = new List<OrderDiscount>();

    }

    public enum DiscountType
    {
        Percentage,
        Flat
    }
}
