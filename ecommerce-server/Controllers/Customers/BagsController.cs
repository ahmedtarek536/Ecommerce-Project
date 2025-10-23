using Clerk.BackendAPI.Models.Components;
using Ecommerce_Server.DTO;
using Ecommerce_Server.DTO.Customers;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Customers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;

namespace Ecommerce_Server.Controllers.Customers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]
    public class BagsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public BagsController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/Bags
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<GeneralResponse>> GetAllBags()
        {
            var bags = await _context.Bags.ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Bag records retrieved successfully.",
                Data = bags
            });
        }
       
        // GET: api/Bags/Customer/5
        [HttpGet("Customer")]
        public async Task<ActionResult<GeneralResponse>> GetBagByCustomer()
        {
            int customerId = Convert.ToInt32(User?.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var bag = await _context.Bags
                .Where(b => b.CustomerId == customerId)
                .Include(b => b.Product)
                    .ThenInclude(p => p.Category)
                .Include(b => b.Product)
                    .ThenInclude(p => p.SubCategory)
                .Include(b => b.Product)
                    .ThenInclude(p => p.ProductVariants)
                        .ThenInclude(pv => pv.ProductImages)
                .Include(b => b.Product)
                    .ThenInclude(p => p.ProductVariants)
                        .ThenInclude(pv => pv.Sizes)
                .Include(b => b.Size)
                .Select(b => new
                {
                    b.Id,
                    b.CustomerId,
                    b.ProductVariantId,
                    b.SizeId,
                    b.Quantity,
                    Size = b.Size != null ? b.Size.Name : "Unknown",
                    Product = new
                    {
                        b.Product.Id,
                        b.Product.Name,
                        b.Product.Price,
                        Quantity = b.Product.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                        Category = new
                        {
                            Name = b.Product.Category != null ? b.Product.Category.Name : "Unknown"
                        },
                        SubCategory = new
                        {
                            Name = b.Product.SubCategory != null ? b.Product.SubCategory.Name : "Unknown"
                        },
                        ProductVariants = b.Product.ProductVariants.Where(v => v.Id == b.ProductVariantId)
                        .Select(v => new
                        {
                            v.Id,
                            v.Color,
                            Quantity = v.Sizes.Sum(s => s.Quantity),
                            Images = v.ProductImages,
                            Favorite = _context.Wishlists.Any(list => list.CustomerId == customerId && list.ProductVariantId == v.Id ),
                        })
                    }
                })
                .ToListAsync();

            if (bag == null || !bag.Any())
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "No bag records found for the customer.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Bag records retrieved successfully.",
                Data = bag
            });
        }

        // POST: api/Bags
        [HttpPost]
        public async Task<ActionResult<GeneralResponse>> AddToBag(BagDTO bagDTO)
        {
            try
            {
                int CustomerId = Convert.ToInt32(User?.FindFirst(ClaimTypes.NameIdentifier)?.Value);

                if (!_context.Customers.Any(c => c.Id == CustomerId))
                {
                    return BadRequest(new GeneralResponse
                    {
                        Success = false,
                        Message = "Invalid customer ID.",
                        Data = null
                    });
                }

                if (!_context.Products.Any(p => p.Id == bagDTO.ProductId))
                {
                    return BadRequest(new GeneralResponse
                    {
                        Success = false,
                        Message = "Invalid product ID.",
                        Data = null
                    });
                }

                if (!_context.ProductVariants.Any(pv => pv.Id == bagDTO.ProductVariantId))
                {
                    return BadRequest(new GeneralResponse
                    {
                        Success = false,
                        Message = "Invalid product variant ID.",
                        Data = null
                    });
                }

                // Validate SizeId exists
                if (!_context.Sizes.Any(s => s.Id == bagDTO.SizeId))
                {
                    return BadRequest(new GeneralResponse
                    {
                        Success = false,
                        Message = "Invalid size ID.",
                        Data = null
                    });
                }

                var productExsistInBag = _context.Bags.FirstOrDefault(bag => bag.CustomerId == CustomerId && bag.ProductId == bagDTO.ProductId && bag.ProductVariantId == bagDTO.ProductVariantId && bag.SizeId == bagDTO.SizeId);
                if (productExsistInBag != null)
                {
                    productExsistInBag.Quantity += bagDTO.Quantity;
                    productExsistInBag.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    var bag = new Bag
                    {
                        CustomerId = CustomerId,
                        ProductId = bagDTO.ProductId,
                        ProductVariantId = bagDTO.ProductVariantId,
                        SizeId = bagDTO.SizeId,
                        Quantity = bagDTO.Quantity
                    };

                    _context.Bags.Add(bag);
                }


                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBagByCustomer), new { customerId = CustomerId }, new GeneralResponse
                {
                    Success = true,
                    Message = "Item added to bag successfully.",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new GeneralResponse
                {
                    Success = false,
                    Message = $"Internal server error: {ex.Message}",
                    Data = null
                });
            }
        }

        // PUT: api/Bags/5
        [HttpPut("{id}")]
        public async Task<ActionResult<GeneralResponse>> UpdateBag(int id, UpdateBagDTO updateBagDTO)
        {
            int customerId = Convert.ToInt32(User?.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var bag = _context.Bags.FirstOrDefault(bag => bag.CustomerId == customerId && bag.Id == id);

          

            if (bag == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Bag not found.",
                    Data = null
                });
            }

            // Update fields if provided
            bag.ProductId = updateBagDTO.ProductId ?? bag.ProductId;
            bag.ProductVariantId = updateBagDTO.ProductVariantId ?? bag.ProductVariantId;
            bag.SizeId = updateBagDTO.SizeId ?? bag.SizeId;
            bag.Quantity = updateBagDTO.Quantity ?? bag.Quantity;

            _context.Bags.Update(bag);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Bag updated successfully.",
                Data = bag
            });
        }

        // DELETE: api/Bags/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<GeneralResponse>> RemoveFromBag(int id)
        {
            int customerId = Convert.ToInt32(User?.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            var bag =  _context.Bags.FirstOrDefault(bag => bag.CustomerId == customerId && bag.Id == id);

            if (bag == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Bag item not found.",
                    Data = null
                });
            }

            _context.Bags.Remove(bag);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Item removed from bag successfully.",
                Data = null
            });
        }
        
    }
}
