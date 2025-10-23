using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Ecommerce_Server.Models.Products;

namespace Ecommerce_Server.Models.Customers
{

    public class Wishlist
    {

        public int Id { get; set; }

        [ForeignKey("Customer")]
        [Required]
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }

        [ForeignKey("Product")]
        [Required]
        public int ProductId { get; set; }
        public Product Product { get; set; }


        [ForeignKey("ProductVariant")]
        [Required]
        public int ProductVariantId { get; set; }
        public ProductVariant ProductVariant { get; set; }
    }
}
