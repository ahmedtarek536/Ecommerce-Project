using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Models.Products
{
    public class ProductCategory
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Category name is required.")]
        [StringLength(100, ErrorMessage = "Category name cannot be longer than 100 characters.")]
        public string Name { get; set; }

        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<ProductSubCategory> ProductSubCategories { get; set; } = new List<ProductSubCategory>();
    }
}
