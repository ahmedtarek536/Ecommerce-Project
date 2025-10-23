using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Products
{
    public class SubCategoryDTO
    {
       
            [Required]
            public int  CategoryId { get; set; }

            [Required(ErrorMessage = "Category name is required.")]
            [MinLength(2)]
           public String Name { get; set; }
        
    }
}
