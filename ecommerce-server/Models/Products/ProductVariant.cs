using System.ComponentModel.DataAnnotations;
using Ecommerce_Server.Models.Customers;
using Ecommerce_Server.Models.Orders;

namespace Ecommerce_Server.Models.Products
{
    public class ProductVariant
    {

        public int Id { get; set; }

        [Required(ErrorMessage = "Product Id is required.")]
        public int ProductId { get; set; }

        [StringLength(50, ErrorMessage = "Color cannot exceed 50 characters.")]
        public string Color { get; set; }

        public Product Product { get; set; }

        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

        public ICollection<ProductImage> ProductImages { get; set; } = new List<ProductImage>();

        public ICollection<Size> Sizes { get; set; } = new List<Size>();
        public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
        public ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();
        public ICollection<Bag> Bags { get; set; } = new List<Bag>();



    }
}
