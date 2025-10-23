using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Products;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Ecommerce_Server.Services.SearchServices
{
    public class RecommendationBuilder
    {
        private readonly EcommerceDbContext _context;
        private int _productId;
        private int _customerId;
        private int _numberOfProducts;
        private Product _selectedProduct;
        private List<dynamic> _similarProducts = new();
        private List<dynamic> _boughtTogetherProducts = new();
        private List<dynamic> _userInteractedProducts = new();

        public RecommendationBuilder(EcommerceDbContext context)
        {
            _context = context;
        }

        public RecommendationBuilder WithProductId(int productId)
        {
            _productId = productId;
            return this;
        }

        public RecommendationBuilder WithCustomerId(int customerId)
        {
            _customerId = customerId;
            _numberOfProducts = customerId == 0 ? 10 : 5;
            return this;
        }

        public async Task<RecommendationBuilder> LoadSelectedProductAsync()
        {
            _selectedProduct = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .FirstOrDefaultAsync(p => p.Id == _productId);

            return this;
        }

        public async Task<RecommendationBuilder> LoadSimilarProductsAsync()
        {
            if (_selectedProduct == null) return this;

            _similarProducts = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Where(p => p.Category.Name == _selectedProduct.Category.Name &&
                            p.SubCategory.Name == _selectedProduct.SubCategory.Name &&
                            p.Id != _productId)
                .Take(_numberOfProducts)
                .Select(BuildProductSelector())
                .ToListAsync();

            return this;
        }

        public async Task<RecommendationBuilder> LoadProductsBoughtTogetherAsync()
        {
            var orderIds = await _context.OrderDetails
                .Where(od => od.ProductId == _productId)
                .Select(od => od.OrderId)
                .Distinct()
                .ToListAsync();

            var recommendedIds = await _context.OrderDetails
                .Where(od => orderIds.Contains(od.OrderId) && od.ProductId != _productId)
                .GroupBy(od => od.ProductId)
                .OrderByDescending(g => g.Count())
                .Take(_numberOfProducts)
                .Select(g => g.Key)
                .ToListAsync();

            _boughtTogetherProducts = await _context.Products
                .Where(p => recommendedIds.Contains(p.Id))
                .Select(BuildProductSelector())
                .ToListAsync();

            return this;
        }

        public async Task<RecommendationBuilder> LoadUserInteractionProductsAsync()
        {
            if (_customerId == 0) return this;

            var productIds = await _context.CustomerInteractions
                .Where(ci => ci.CustomerId == _customerId)
                .GroupBy(ci => ci.ProductId)
                .OrderByDescending(g => g.Count())
                .Take(_numberOfProducts)
                .Select(g => g.Key)
                .ToListAsync();

            _userInteractedProducts = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .Select(BuildProductSelector())
                .ToListAsync();

            return this;
        }

        public List<dynamic> Build()
        {
            var all = _similarProducts
                .Concat(_boughtTogetherProducts)
                .Concat(_userInteractedProducts)
                .GroupBy(p => p.Id)
                .Select(g => g.First())
                .ToList();

            return all;
        }

        private Expression<Func<Product, dynamic>> BuildProductSelector()
        {
            return p => new
            {
                p.Id,
                p.Name,
                p.Price,
                Quantity = p.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                Category = new { name = p.Category.Name },
                SubCategory = new { name = p.SubCategory.Name },
                ProductVariants = p.ProductVariants.Select(v => new
                {
                    id = v.Id,
                    Color = v.Color,
                    Quantity = v.Sizes.Sum(s => s.Quantity),
                    Images = v.ProductImages,
                    Favorite = _context.Wishlists.Any(w => w.CustomerId == _customerId && w.ProductVariantId == v.Id)
                })
            };
        }

        public bool IsProductFound() => _selectedProduct != null;
    }

}
