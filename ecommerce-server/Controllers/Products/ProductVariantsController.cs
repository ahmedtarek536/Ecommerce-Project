using Ecommerce_Server.DTO;
using Ecommerce_Server.DTO.Products;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ProductVariantsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public ProductVariantsController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductVariants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductVariant>>> GetProductVariants()
        {
            var productVariants = await _context.ProductVariants
                //.Include(v => v.Product)
                .ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Product variants retrieved successfully.",
                Data = productVariants
            });
        }

        // GET: api/ProductVariants/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ProductVariant>> GetProductVariant(int id)
        {
            var productVariant = await _context.ProductVariants
                //.Include(v => v.Product)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (productVariant == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Product variant not found.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Product variant retrieved successfully.",
                Data = productVariant
            });
        }

        // PUT: api/ProductVariants/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductVariant(int id, UpdateProductVariantDTO productVariantInput)
        {
            // Check if the IDs match
            if (id != productVariantInput?.ProductId)
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "ProductVariant ID mismatch.",
                    Data = null
                });
            }

            // Find the existing product variant by ID
            var productVariant = await _context.ProductVariants.FindAsync(id);
            if (productVariant == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Product variant not found for update.",
                    Data = null
                });
            }

            // Update properties using ternary operator
          
            productVariant.Color = !string.IsNullOrEmpty(productVariantInput?.Color) ? productVariantInput.Color : productVariant.Color;
            

            // Mark the entity as modified
            _context.Entry(productVariant).State = EntityState.Modified;

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new GeneralResponse
                {
                    Success = false,
                    Message = "Concurrency error while updating product variant.",
                    Data = null
                });
            }

            // Return the updated product variant
            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Product variant updated successfully.",
                Data = productVariant
            });
        }


        // POST: api/ProductVariants
        [HttpPost]
        public async Task<ActionResult<ProductVariant>> CreateProductVariant(ProductVariantDTO productVariantDTO)
        {
            // Ensure the related Product exists
            if (!_context.Products.Any(p => p.Id == productVariantDTO.ProductId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid Product ID.",
                    Data = null
                });
            }

            ProductVariant productVariant = new ProductVariant() { 
                ProductId = productVariantDTO.ProductId,
                 Color = productVariantDTO.Color,
                
               
            };

            _context.ProductVariants.Add(productVariant);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProductVariant), new { id = productVariant.Id }, new GeneralResponse
            {
                Success = true,
                Message = "Product variant created successfully.",
                Data = productVariant
            });
        }

        // DELETE: api/ProductVariants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductVariant(int id)
        {
            var productVariant = await _context.ProductVariants.FindAsync(id);
            if (productVariant == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Product variant not found for deletion.",
                    Data = null
                });
            }

            _context.ProductVariants.Remove(productVariant);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Product variant deleted successfully.",
                Data = null
            });
        }

        private bool ProductVariantExists(int id)
        {
            return _context.ProductVariants.Any(e => e.Id == id);
        }
    }
}

