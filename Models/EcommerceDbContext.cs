using Microsoft.EntityFrameworkCore;
using System.Drawing;

namespace Ecommerce_Server.Models
{
    public class EcommerceDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<ProductSubCategory> ProductSubCategories { get; set; }
         public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<Size> Sizes { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<OrderPayment> OrderPayments { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<OrderDiscount> OrderDiscounts { get; set; }
        public DbSet<ProductReview> ProductReviews { get; set; }
        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<CustomerInteraction> CustomerInteractions { get; set; }    
        public DbSet<Bag> Bags { get; set; }    
      

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OrderDiscount>()
                .HasOne(od => od.Order)
                .WithMany(o => o.OrderDiscounts)
                .HasForeignKey(od => od.OrderId);

            modelBuilder.Entity<OrderDiscount>()
                .HasOne(od => od.Discount)
                .WithMany()
                .HasForeignKey(od => od.DiscountId);

            modelBuilder.Entity<ProductReview>()
                .HasCheckConstraint("CK_Rating", "Rating BETWEEN 1 AND 5");

           
        }

    }
}
