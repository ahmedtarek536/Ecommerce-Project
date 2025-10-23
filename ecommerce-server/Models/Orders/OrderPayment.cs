using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Models.Orders
{
    public class OrderPayment
    {

        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount paid must be greater than zero.")]
        public decimal AmountPaid { get; set; }

        [Required]
        [EnumDataType(typeof(PaymentStatus))]
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

        [Required]
        public DateTime PaymentDate { get; set; } = DateTime.Now;

        [MaxLength(100, ErrorMessage = "Transaction ID cannot exceed 100 character" +
            "s.")]
        public string TransactionId { get; set; }

        public Order Order { get; set; }
    }

}
