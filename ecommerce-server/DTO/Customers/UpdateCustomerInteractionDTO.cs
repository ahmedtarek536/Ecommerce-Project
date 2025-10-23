using Ecommerce_Server.Models.Customers;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Customers
{
    public class UpdateCustomerInteractionDTO
    {
       
        public int? CustomerId { get; set; }
 
        public int? ProductId { get; set; }
       
        public InteractionType? InteractionType { get; set; }
    }
   
    
}
