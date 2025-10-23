using System.ComponentModel.DataAnnotations;
using Ecommerce_Server.Models.Products;

namespace Ecommerce_Server.Models.Customers
{
    public class CustomerInteraction
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Customer Id Id is required.")]
        public int CustomerId { get; set; }
        [Required(ErrorMessage = "Product Id is required.")]
        public int ProductId { get; set; }
        [Required(ErrorMessage = "Interaction type is required.")]
        public InteractionType InteractionType { get; set; }
        public DateTime? Date { get; set; } = DateTime.Now;

        public Customer Customer { get; set; }
        public Product Product { get; set; }

    }
    public enum InteractionType
    {
        Purchasing,
        View,
        AddToCard,
        AddToWishlist,
        AddReview,

    }
}
