using Ecommerce_Server.DTO.Products;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_Server.Controllers.Products
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class CollectionsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public CollectionsController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/Collections
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<object>>> GetCollections()
        {
            var collections = await _context.Collections
                .Include(c => c.Products)
                .ToListAsync();

            var result = collections.Select(c => new {
                c.Id,
                c.Name,
                c.Description,
                ImageUrl = c.ImageUrl,
                c.CreatedAt,
                Products = c.Products.Select(p => new {
                    p.Id,
                    p.Name
                })
            });

            return Ok(result);
        }

        // GET: api/Collections/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetCollection(int id)
        {
            var collection = await _context.Collections
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (collection == null)
            {
                return NotFound(new { Success = false, Message = "Collection not found!" });
            }

            var result = new {
                collection.Id,
                collection.Name,
                collection.Description,
                ImageUrl = collection.ImageUrl,
                collection.CreatedAt,
                Products = collection.Products.Select(p => new {
                    p.Id,
                    p.Name
                })
            };

            return Ok(result);
        }

        // POST: api/Collections
        [HttpPost]
        public async Task<ActionResult<Collection>> CreateCollection(CollectionDTO collectionDTO)
        {
            var collection = new Collection
            {
                Name = collectionDTO.Name,
                Description = collectionDTO.Description,
                ImageUrl = collectionDTO.Image
            };

            _context.Collections.Add(collection);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCollection), new { id = collection.Id }, collection);
        }

        // PUT: api/Collections/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCollection(int id, UpdateCollectionDTO updateDTO)
        {
            var collection = await _context.Collections.FindAsync(id);
            if (collection == null)
            {
                return NotFound(new { Success = false, Message = "Collection not found!" });
            }

            collection.Name = updateDTO.Name ?? collection.Name;
            collection.Description = updateDTO.Description ?? collection.Description;
            collection.ImageUrl = updateDTO.Image ?? collection.ImageUrl;

            await _context.SaveChangesAsync();
            return Ok(new { Success = true, Message = "Collection updated successfully!" });
        }

        // DELETE: api/Collections/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCollection(int id)
        {
            var collection = await _context.Collections
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (collection == null)
            {
                return NotFound(new { Success = false, Message = "Collection not found!" });
            }

            if (collection.Products.Any())
            {
                return BadRequest(new { Success = false, Message = "Cannot delete a collection that has associated products." });
            }

            _context.Collections.Remove(collection);
            await _context.SaveChangesAsync();

            return Ok(new { Success = true, Message = "Collection deleted successfully!" });
        }
    }
}
