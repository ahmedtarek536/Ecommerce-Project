using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Ecommerce_Server.Models.Products;

namespace Ecommerce_Server.Models.Customers
{
    public class Bag
    {

        public int Id { get; set; }

        [Required]
        public int CustomerId { get; set; }


        [Required]
        public int ProductId { get; set; }

        [Required]
        public int ProductVariantId { get; set; }

        [Required]
        public int SizeId { get; set; }

        [Required]
        public int Quantity { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;



        // Navigation properties
        public Customer Customer { get; set; }
        public Product Product { get; set; }
        public ProductVariant ProductVariant { get; set; }
        public Size Size { get; set; }
    }
}
