using Ecommerce_Server.DTO;
using Ecommerce_Server.DTO.Products;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace Ecommerce_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class SizesController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public SizesController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/Sizes
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Size>>> GetSizes()
        {
            var sizes = await _context.Sizes.ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Sizes retrieved successfully.",
                Data = sizes
            });
        }

        // GET: api/Sizes/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Size>> GetSize(int id)
        {
            var size = await _context.Sizes.FindAsync(id);

            if (size == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Size not found.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Size retrieved successfully.",
                Data = size
            });
        }

       

        // POST: api/Sizes
        [HttpPost]
        public async Task<ActionResult<Size>> CreateSize(SizeDTO sizeDTO)
        {
            
            Size size = new Size() { Name = sizeDTO.Name , ProductVariantId = sizeDTO.ProductVariantId , Quantity = sizeDTO.Quantity };
            _context.Sizes.Add(size);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSize), new { id = size.Id }, new GeneralResponse
            {
                Success = true,
                Message = "Size created successfully.",
                Data = size
            });
        }

        // PUT: api/Sizes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSize(int id, UpdateSizeDTO updateSizeDTO)
        {
            // Find the existing size by id
            var size = await _context.Sizes.FindAsync(id);

            // Check if the size exists
            if (size == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Size not found for update.",
                    Data = null
                });
            }

           

            // Update the size name from DTO
            size.Name =  updateSizeDTO.Name != null ?  updateSizeDTO.Name : size.Name;
            size.ProductVariantId = updateSizeDTO?.ProductVariantId ?? size.ProductVariantId;
            size.Quantity = updateSizeDTO.Quantity ?? size.Quantity;


            // Mark the entity as modified
            _context.Entry(size).State = EntityState.Modified;

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle concurrency exceptions
                if (!SizeExists(id))
                {
                    return NotFound(new GeneralResponse
                    {
                        Success = false,
                        Message = "Size not found for update.",
                        Data = null
                    });
                }
                else
                {
                    throw;
                }
            }

            // Return success response
            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Size updated successfully.",
                Data = size
            });
        }


        // DELETE: api/Sizes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSize(int id)
        {
            var size = await _context.Sizes.FindAsync(id);
            if (size == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Size not found for deletion.",
                    Data = null
                });
            }

            _context.Sizes.Remove(size);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Size deleted successfully.",
                Data = null
            });
        }

        private bool SizeExists(int id)
        {
            return _context.Sizes.Any(e => e.Id == id);
        }
    }
}
