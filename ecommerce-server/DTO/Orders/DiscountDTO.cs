using Ecommerce_Server.Models.Orders;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO
{
    public class DiscountDTO
    {


        [Required]
        [StringLength(50, ErrorMessage = "Code cannot exceed 50 characters.")]
        public string Code { get; set; }

        public string Description { get; set; }

        [Required]
        public DiscountType DiscountType { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Discount value must be non-negative.")]
        public decimal DiscountValue { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Minimum order amount must be non-negative.")]
        public decimal MinOrderAmount { get; set; } = 0.00m;
    }
}
