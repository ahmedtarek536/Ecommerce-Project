using Ecommerce_Server.DTO;
using Ecommerce_Server.DTO.Customers;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Customers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Ecommerce_Server.Controllers.Customers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]
    public class WishlistController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public WishlistController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/Wishlist
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GeneralResponse>> GetAllWishlists()
        {
            var wishlists = await _context.Wishlists
                .Include(w => w.Customer)
                .Include(w => w.Product)
                .Include(w => w.ProductVariant)
                .ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Wishlist records retrieved successfully.",
                Data = wishlists
            });
        }

        // GET: api/Wishlist/Customer/5
        [HttpGet("Customer")]
        public async Task<ActionResult<GeneralResponse>> GetWishlistByCustomer()
        {
            int customerId = Convert.ToInt32(User?.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var wishlist = await _context.Wishlists
                .Where(w => w.CustomerId == customerId)
                .Include(w => w.Product)
                //.Include(w => w.ProductVariant)
                .Select(w => new
                {

                    w.CustomerId,
                    w.ProductVariantId,
                    Product = new
                    {
                        w.Product.Id,
                        w.Product.Name,
                        w.Product.Price,
                        Quantity = w.Product.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                        Category = new
                        {

                            name = w.Product.Category.Name
                        },
                        SubCategory = new
                        {

                            name = w.Product.SubCategory.Name
                        },
                        ProductVariants = w.Product.ProductVariants.Select(v => new
                        {
                            id = v.Id,
                            Color = v.Color,
                            Quantity = v.Sizes.Sum(s => s.Quantity),
                            Images = v.ProductImages,
                            Favorite = _context.Wishlists.Any(list => list.CustomerId == w.CustomerId && list.ProductVariantId == v.Id ),

                        })
                    }
                }
                )
                .ToListAsync();

            if (wishlist == null || !wishlist.Any())
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "No wishlist records found for the customer.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Wishlist records retrieved successfully.",
                Data = wishlist
            });
        }

        // POST: api/Wishlist
        [HttpPost]
        public async Task<ActionResult<GeneralResponse>> AddToWishlist(WishlistDTO wishlistDTO)
        {
            wishlistDTO.CustomerId = Convert.ToInt32(User?.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (!_context.Customers.Any(c => c.Id == wishlistDTO.CustomerId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid customer ID.",
                    Data = null
                });
            }

            if (!_context.Products.Any(p => p.Id == wishlistDTO.ProductId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid product ID.",
                    Data = null
                });
            }

            if (!_context.ProductVariants.Any(pv => pv.Id == wishlistDTO.ProductVariantId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid product variant ID.",
                    Data = null
                });
            }

            if (_context.Wishlists.Any(bag => bag.CustomerId == wishlistDTO.CustomerId && bag.ProductId == wishlistDTO.ProductId && bag.ProductVariantId == wishlistDTO.ProductVariantId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Product aready exsist in the Wishlist.",
                    Data = null
                });
            }

            var wishlist = new Wishlist
            {
                CustomerId = wishlistDTO.CustomerId,
                ProductId = wishlistDTO.ProductId,
                ProductVariantId = wishlistDTO.ProductVariantId
            };

            _context.Wishlists.Add(wishlist);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWishlistByCustomer), new { customerId = wishlist.CustomerId }, new GeneralResponse
            {
                Success = true,
                Message = "Item added to wishlist successfully.",
                Data = wishlist
            });
        }

        // DELETE: api/Wishlist/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<GeneralResponse>> RemoveFromWishlist(int id)
        {
            int customerId = Convert.ToInt32(User?.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var wishlist =  _context.Wishlists.FirstOrDefault(list => list.ProductVariantId == id && list.CustomerId == customerId);

            if (wishlist == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Wishlist item not found.",
                    Data = null
                });
            }

            _context.Wishlists.Remove(wishlist);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Item removed from wishlist successfully.",
                Data = null
            });
        }
    }
}
