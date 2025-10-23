using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO
{
    public class UpdateWishlistDTO
    {
       
        public int? CustomerId { get; set; }

       
        public int? ProductId { get; set; }

   
        public int? ProductVariantId { get; set; }
    }
}
