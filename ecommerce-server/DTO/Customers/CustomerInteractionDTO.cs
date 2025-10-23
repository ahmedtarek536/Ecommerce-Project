using Ecommerce_Server.Models.Customers;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Customers
{
    public class CustomerInteractionDTO
    {
        [Required(ErrorMessage = "Customer Id Id is required.")]
        public int CustomerId { get; set; }
        [Required(ErrorMessage = "Product Id is required.")]
        public int ProductId { get; set; }
        [Required(ErrorMessage = "Interaction type is required.")]
        public InteractionType InteractionType { get; set; }
    }
 
}
