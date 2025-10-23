using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Models.Products
{
    public class Inventory
    {

        public int Id { get; set; }

        [ForeignKey("ProductVariant")]
        [Required]
        public int ProductVariantId { get; set; }
        public ProductVariant ProductVariant { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity must be a non-negative value.")]
        public int StockQuantity { get; set; }

        public DateTime LastUpdated { get; set; } = DateTime.Now;
    }
}
