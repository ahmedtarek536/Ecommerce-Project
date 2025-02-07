using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Customers
{
    public class UpdateBagDTO
    {
        public int? CustomerId { get; set; }

        public int? ProductId { get; set; }
      
        public int? ProductVariantId { get; set; }
    
        public int? SizeId { get; set; }
  
        public int? Quantity { get; set; }
    }
}
