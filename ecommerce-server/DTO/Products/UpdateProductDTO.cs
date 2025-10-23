using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Ecommerce_Server.DTO.Products
{
    public class UpdateProductDTO
    {
        [StringLength(100, ErrorMessage = "Product name cannot be longer than 100 characters.")]
        public string? Name { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
        public string? Description { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal? Price { get; set; }

        [AllowNull]
        public int? CategoryId { get; set; }
        [AllowNull]
        public int? SubCategoryId { get; set; }
    }
}
