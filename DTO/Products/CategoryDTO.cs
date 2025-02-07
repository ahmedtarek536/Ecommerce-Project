using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO
{
    public class CategoryDTO
    {
        [Required(ErrorMessage = "Category name is required.")]
        [MinLength(2)]
        public String Name { get; set; }
    }
}
