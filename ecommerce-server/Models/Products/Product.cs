using System.ComponentModel.DataAnnotations;
using Ecommerce_Server.Models.Customers;
using Ecommerce_Server.Models.Orders;

namespace Ecommerce_Server.Models.Products
{
    public class Product
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Product name is required.")]
        [StringLength(100, ErrorMessage = "Product name cannot be longer than 100 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Description is required.")]
        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Price is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal Price { get; set; }
        public DateOnly CreatedAt { get; set; } = DateOnly.FromDateTime(DateTime.Now);

        [Required(ErrorMessage = "Category ID is required.")]
        public int CategoryId { get; set; }
  

        [Required(ErrorMessage = "Sub Category ID is required.")]
        public int SubCategoryId { get; set; }
        public ProductCategory Category { get; set; }
        public ProductSubCategory SubCategory { get; set; }

        public ICollection<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
        public ICollection<ProductReview> ProductReviews { get; set; } = new List<ProductReview>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
        public ICollection<CustomerInteraction> CustomerInteractions { get; set; } = new List<CustomerInteraction>();
        public ICollection<Bag> Bags { get; set; } = new List<Bag>();
        public ICollection<CollectionProducts> CollectionProducts { get; set; } = new List<CollectionProducts>();
        public ICollection<Collection> Collections { get; set; }
    }
}
