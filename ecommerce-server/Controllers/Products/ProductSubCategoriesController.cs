using Ecommerce_Server.DTO.Products;
using Ecommerce_Server.DTO;
using Ecommerce_Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Ecommerce_Server.Models.Products;

namespace Ecommerce_Server.Controllers.Products
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ProductSubCategoriesController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public ProductSubCategoriesController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductSubCategories
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<GeneralResponse>> GetProductSubCategories()
        {
            GeneralResponse response = new GeneralResponse();
            response.Success = true;
            response.Message = "Get All Sub Categories Successful";
            response.Data = await _context.ProductSubCategories.ToListAsync();

            return response;
        }

        // GET: api/ProductCategories/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<GeneralResponse>> GetProductCategory(int id)
        {
            var productCategory = await _context.ProductSubCategories.FirstOrDefaultAsync(c => c.Id == id);

            GeneralResponse response = new GeneralResponse();
            if (productCategory == null)
            {
                response.Message = "SubCategory not found!!";
                response.Success = false;

                return NotFound(response);
            }
            response.Success = true;
            response.Message = "Get SubCategory Successful";
            response.Data = productCategory;
            return response;
        }

        // PUT: api/ProductCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductCategory(int id, UpdateCategoryDTO updateCategoryDTO)
        {

            var productCategory = await _context.ProductSubCategories.FirstOrDefaultAsync(cat => cat.Id == id);

            if (productCategory == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "SubCategory not found!",
                    Data = null
                });
            }


            productCategory.Name = updateCategoryDTO.Name ?? productCategory.Name;


            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "SubCategory updated successfully!",
                Data = productCategory
            });
        }

        // POST: api/ProductCategories
        [HttpPost]
        public async Task<IActionResult> CreateProductCategory(SubCategoryDTO category)
        {

            ProductSubCategory productCategory = new ProductSubCategory() { Name = category.Name , CategoryId = category.CategoryId };
            _context.ProductSubCategories.Add(productCategory);
            await _context.SaveChangesAsync();

            GeneralResponse response = new GeneralResponse();
            response.Success = true;
            response.Message = "Create SubCategory Succesful";

            return Created(string.Empty, response);
        }

        // DELETE: api/ProductCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductCategory(int id)
        {
            var productCategory = await _context.ProductSubCategories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);


            GeneralResponse response = new GeneralResponse();
            response.Success = false;
            if (productCategory == null)
            {
                response.Message = "SubCategory not found!!";
                return NotFound(response);
            }

            if (productCategory.Products.Any())
            {
                response.Message = "Cannot delete a subcategory that has associated products.";
                return BadRequest(response);
            }

            _context.ProductSubCategories.Remove(productCategory);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Delete SubCategory Successful.";
            return Ok(response);
        }

        private bool ProductCategoryExists(int id)
        {
            return _context.ProductCategories.Any(e => e.Id == id);
        }
    }
}
