using Ecommerce_Server.Models;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.Output
{
    public class ProductOutput
    {
        public int Id { get; set; }

      
        public string Name { get; set; }


        
        public decimal Price { get; set; }
        public DateOnly CreatedAt { get; set; } = DateOnly.FromDateTime(DateTime.Now);

        
        public int CategoryId { get; set; }

       
        public int SubCategoryId { get; set; }
      

    }
}
