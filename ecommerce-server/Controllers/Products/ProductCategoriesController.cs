using Ecommerce_Server.DTO;
using Ecommerce_Server.DTO.Products;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace Ecommerce_Server.Controllers.Products
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class ProductCategoriesController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public ProductCategoriesController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductCategories
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<GeneralResponse>> GetProductCategories()
        {
            GeneralResponse response = new GeneralResponse();
            response.Success = true;
            response.Message = "Get All Categories Successful";
            response.Data = await _context.ProductCategories.Select(c => new { c.Name, c.Id, SubCategories = c.ProductSubCategories.Select(s => new {s.Name, s.Id}) }).Take(3).ToListAsync();
            return response;
        }

        // GET: api/ProductCategories/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<GeneralResponse>> GetProductCategory(int id)
        {
            var productCategory = await _context.ProductCategories.FirstOrDefaultAsync(c => c.Id == id);

            GeneralResponse response = new GeneralResponse();
            if (productCategory == null)
            {
                response.Message = "Category not found!!";
                response.Success = false;

                return NotFound(response);
            }
            response.Success = true;
            response.Message = "Get Category Successful";
            response.Data = productCategory;
            return response;
        }

        // PUT: api/ProductCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductCategory(int id, UpdateCategoryDTO updateCategoryDTO)
        {
           
            var productCategory = await _context.ProductCategories.FirstOrDefaultAsync(cat => cat.Id == id);

            if (productCategory == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Category not found!",
                    Data = null
                });
            }

      
            productCategory.Name = updateCategoryDTO.Name ?? productCategory.Name;

        
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Category updated successfully!",
                Data = productCategory
            });
        }

        // POST: api/ProductCategories
        [HttpPost]
        public async Task<IActionResult> CreateProductCategory(CategoryDTO category)
        {

            ProductCategory productCategory = new ProductCategory() { Name = category.Name };
            _context.ProductCategories.Add(productCategory);
            await _context.SaveChangesAsync();

            GeneralResponse response = new GeneralResponse();
            response.Success = true;
            response.Message = "Create Category Succesful";

            return Created(string.Empty, response);
        }

        // DELETE: api/ProductCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductCategory(int id)
        {
            var productCategory = await _context.ProductCategories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);


            GeneralResponse response = new GeneralResponse();
            response.Success = false;
            if (productCategory == null)
            {
                response.Message = "Category not found!!";
                return NotFound(response);
            }

            if (productCategory.Products.Any())
            {
                response.Message = "Cannot delete a category that has associated products.";
                return BadRequest(response);
            }

            _context.ProductCategories.Remove(productCategory);
            await _context.SaveChangesAsync();

            response.Success = true;
            response.Message = "Delete Category Successful.";
            return Ok(response);
        }

        private bool ProductCategoryExists(int id)
        {
            return _context.ProductCategories.Any(e => e.Id == id);
        }
    }
}
