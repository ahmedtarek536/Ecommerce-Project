using Ecommerce_Server.DTO.Products;
using Ecommerce_Server.Models.Products;
using Ecommerce_Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_Server.Controllers.Products
{
    [Route("api/[controller]")]
    [ApiController]
   // [Authorize(Roles = "Admin")]
    public class CollectionProductsController : ControllerBase
    {

        private readonly EcommerceDbContext _context;

        public CollectionProductsController(EcommerceDbContext context)
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
                c.ImageUrl,
                c.CreatedAt,
                Products = _context.CollectionProducts
                    .Where(cp => cp.CollectionId == c.Id)
                    .Include(cp => cp.Product)
                    .Select(cp => new {
                        cp.ProductId,
                        cp.Product.Name
                    }).ToList()
            });

            return Ok(result);
        }

        // GET: api/Collections/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<object>> GetCollection(int id)
        {
            var collection = await _context.Collections
                .FirstOrDefaultAsync(c => c.Id == id);

            if (collection == null)
            {
                return NotFound(new { Success = false, Message = "Collection not found!" });
            }

            var products = await _context.CollectionProducts
                .Where(cp => cp.CollectionId == id)
                .Include(cp => cp.Product)
                .Select(cp => new {
                    cp.ProductId,
                    cp.Product.Name
                }).ToListAsync();

            var result = new {
                collection.Id,
                collection.Name,
                collection.Description,
                collection.ImageUrl,
                collection.CreatedAt,
                Products = products
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

        // POST: api/Collections/AddProduct
        [HttpPost("AddProduct")]
        public async Task<IActionResult> AddProductToCollection(CollectionProductDTO dto)
        {
            var product = await _context.Products.FindAsync(dto.ProductId);
            var collection = await _context.Collections.FindAsync(dto.CollectionId);

            if (product == null || collection == null)
            {
                return NotFound(new { Success = false, Message = "Product or Collection not found!" });
            }

            // Check if the product is already in the collection
            var existingRelation = await _context.CollectionProducts
                .FirstOrDefaultAsync(cp => cp.ProductId == dto.ProductId && cp.CollectionId == dto.CollectionId);

            if (existingRelation != null)
            {
                return BadRequest(new { Success = false, Message = "Product already exists in this collection!" });
            }

            var collectionProduct = new CollectionProducts
            {
                ProductId = dto.ProductId,
                CollectionId = dto.CollectionId
            };

            _context.CollectionProducts.Add(collectionProduct);
            await _context.SaveChangesAsync();

            return Ok(new { Success = true, Message = "Product added to collection successfully!" });
        }

        // DELETE: api/Collections/RemoveProduct
        [HttpDelete("RemoveProduct")]
        public async Task<IActionResult> RemoveProductFromCollection([FromQuery] int productId, [FromQuery] int collectionId)
        {
            var collectionProduct = await _context.CollectionProducts
                .FirstOrDefaultAsync(cp => cp.ProductId == productId && cp.CollectionId == collectionId);

            if (collectionProduct == null)
            {
                return NotFound(new { Success = false, Message = "Product not found in this collection!" });
            }

            _context.CollectionProducts.Remove(collectionProduct);
            await _context.SaveChangesAsync();

            return Ok(new { Success = true, Message = "Product removed from collection successfully!" });
        }
    }
}
