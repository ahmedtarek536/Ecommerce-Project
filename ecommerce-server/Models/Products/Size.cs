using System.ComponentModel.DataAnnotations;
using Ecommerce_Server.Models.Customers;

namespace Ecommerce_Server.Models.Products
{
    public class Size
    {
        public int Id { get; set; }

        [Required]
        public int ProductVariantId { get; set; }

        [Required(ErrorMessage = "Size name is required.")]
        [StringLength(50, ErrorMessage = "Size name cannot be longer than 50 characters.")]
        public string Name { get; set; }


        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be a non-negative number.")]
        public int Quantity { get; set; }

        ProductVariant ProductVariant { get; set; }
        public ICollection<Bag> Bags { get; set; } = new List<Bag>();



    }
}
