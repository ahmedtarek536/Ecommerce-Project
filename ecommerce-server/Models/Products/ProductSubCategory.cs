using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Models.Products
{
    public class ProductSubCategory
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Sub Category name is required.")]
        [StringLength(100, ErrorMessage = "Sub Category name cannot be longer than 100 characters.")]
        public string Name { get; set; }



        // Foreign key reference to ProductCategory
        public int CategoryId { get; set; }
        public ProductCategory Category { get; set; }  // Navigation property to ProductCategory
        public ICollection<Product> Products { get; set; } = new List<Product>();

    }
}
