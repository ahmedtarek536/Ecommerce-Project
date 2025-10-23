using Ecommerce_Server.Models.Orders;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Orders
{
    public class UpdateOrderPaymentDTO
    {
        public int? OrderId { get; set; }

       
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount paid must be greater than zero.")]
        public decimal? AmountPaid { get; set; }


        [EnumDataType(typeof(PaymentStatus))]
        public PaymentStatus? PaymentStatus { get; set; }

  
        public DateTime? PaymentDate { get; set; }

        [MaxLength(100, ErrorMessage = "Transaction ID cannot exceed 100 characters.")]
        public string? TransactionId { get; set; }
    }
}
