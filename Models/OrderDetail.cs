using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Models
{
    public class OrderDetail
    {
    
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [Required]
        public int ProductVariantId { get; set; }
        [Required]
        public int ProductId { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal Price { get; set; }

        public decimal Subtotal => Quantity * Price;  

        // Navigation properties
        public Order Order { get; set; }
        public ProductVariant ProductVariant { get; set; }
        public Product Product { get; set; }
    }
}
