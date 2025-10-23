using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Products;

namespace Ecommerce_Server.Controllers
{
    [ApiController]
    [Route("api/CollectionsManagement")]
    [Authorize]
    public class CollectionsManagementController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public CollectionsManagementController(EcommerceDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCollections()
        {
            try
            {
                var collections = await _context.Collections
                    .Include(c => c.Products)
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Description,
                        c.ImageUrl,
                        c.IsActive,
                        c.CreatedAt,
                        c.UpdatedAt,
                        ProductCount = c.Products.Count
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = collections });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCollection(int id)
        {
            try
            {
                var collection = await _context.Collections
                    .Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (collection == null)
                    return NotFound(new { success = false, message = "Collection not found" });

                return Ok(new { success = true, data = collection });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateCollection([FromBody] Collection collection)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Invalid collection data" });

                collection.CreatedAt = DateTime.UtcNow;
                _context.Collections.Add(collection);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetCollection), new { id = collection.Id }, 
                    new { success = true, data = collection });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCollection(int id, [FromBody] Collection collection)
        {
            try
            {
                if (id != collection.Id)
                    return BadRequest(new { success = false, message = "Invalid collection ID" });

                var existingCollection = await _context.Collections.FindAsync(id);
                if (existingCollection == null)
                    return NotFound(new { success = false, message = "Collection not found" });

                existingCollection.Name = collection.Name;
                existingCollection.Description = collection.Description;
                existingCollection.ImageUrl = collection.ImageUrl;
                existingCollection.IsActive = collection.IsActive;
                existingCollection.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, data = existingCollection });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCollection(int id)
        {
            try
            {
                var collection = await _context.Collections.FindAsync(id);
                if (collection == null)
                    return NotFound(new { success = false, message = "Collection not found" });

                _context.Collections.Remove(collection);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Collection deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{collectionId}/products/{productId}")]
        public async Task<IActionResult> AddProductToCollection(int collectionId, int productId)
        {
            try
            {
                var collection = await _context.Collections
                    .Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.Id == collectionId);

                if (collection == null)
                    return NotFound(new { success = false, message = "Collection not found" });

                var product = await _context.Products.FindAsync(productId);
                if (product == null)
                    return NotFound(new { success = false, message = "Product not found" });

                if (collection.Products.Any(p => p.Id == productId))
                    return BadRequest(new { success = false, message = "Product already in collection" });

                collection.Products.Add(product);
                collection.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Product added to collection successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{collectionId}/products/{productId}")]
        public async Task<IActionResult> RemoveProductFromCollection(int collectionId, int productId)
        {
            try
            {
                var collection = await _context.Collections
                    .Include(c => c.Products)
                    .FirstOrDefaultAsync(c => c.Id == collectionId);

                if (collection == null)
                    return NotFound(new { success = false, message = "Collection not found" });

                var product = collection.Products.FirstOrDefault(p => p.Id == productId);
                if (product == null)
                    return NotFound(new { success = false, message = "Product not found in collection" });

                collection.Products.Remove(product);
                collection.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Product removed from collection successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
} 