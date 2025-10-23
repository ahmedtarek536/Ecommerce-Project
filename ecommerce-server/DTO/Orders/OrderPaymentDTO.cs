using Ecommerce_Server.Models.Orders;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO
{
    public class OrderPaymentDTO
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount paid must be greater than zero.")]
        public decimal AmountPaid { get; set; }

        [Required]
        [EnumDataType(typeof(PaymentStatus))]
        public PaymentStatus PaymentStatus { get; set; }

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.Now;

        [MaxLength(100, ErrorMessage = "Transaction ID cannot exceed 100 characters.")]
        public string TransactionId { get; set; }
    }
}
