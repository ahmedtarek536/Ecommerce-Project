using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Models.Products
{
    public class CollectionProducts
    {
        public int Id { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public int CollectionId { get; set; }

        public Product Product { get; set; }
        public Collection Collection { get; set; }
    }
}
