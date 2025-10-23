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
    public class ProductImagesController : ControllerBase
    {

        private readonly EcommerceDbContext _context;

        public ProductImagesController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductImages
        [HttpGet]
        public async Task<ActionResult<GeneralResponse>> GetProductImages()
        {
            GeneralResponse response = new GeneralResponse
            {
                Success = true,
                Message = "Get All Product Images Successful",
                Data = await _context.ProductImages.ToListAsync()
            };
            return response;
        }

        // GET: api/ProductImages/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<GeneralResponse>> GetProductImage(int id)
        {
            var productImage = await _context.ProductImages.FirstOrDefaultAsync(i => i.Id == id);

            GeneralResponse response = new GeneralResponse();
            if (productImage == null)
            {
                response.Message = "Product Image not found.";
                response.Success = false;
                return NotFound(response);
            }

            response.Success = true;
            response.Message = "Get Product Image Successful";
            response.Data = productImage;
            return response;
        }

        // PUT: api/ProductImages/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductImage(int id, UpdateProductImageDTO updateProductImageDTO)
        {
       
            var productImage = await _context.ProductImages.FindAsync(id);
            if (productImage == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Product Image not found.",
                    Data = null
                });
            }

         
            productImage.ProductVariantId = updateProductImageDTO.ProductVariantId ?? productImage.ProductVariantId;
          
            productImage.ImageUrl = updateProductImageDTO.ImageUrl ?? productImage.ImageUrl;
            

            
            _context.ProductImages.Update(productImage);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Product Image updated successfully.",
                Data = productImage
            });
        }


        // POST: api/ProductImages
        [HttpPost]
        public async Task<ActionResult<GeneralResponse>> CreateProductImage(ProductImageDTO productImageDTO)
        {
            // Ensure the related Product exists
            if (!_context.ProductVariants.Any(p => p.Id == productImageDTO.ProductVariantId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid Product ID.",
                    Data = null
                });
            }

            ProductImage productImage = new ProductImage
            {
                
                ImageUrl = productImageDTO.ImageUrl,
                ProductVariantId = productImageDTO.ProductVariantId,
              
            };

            _context.ProductImages.Add(productImage);
            await _context.SaveChangesAsync();

            GeneralResponse response = new GeneralResponse
            {
                Success = true,
                Message = "Product Image created successfully.",
                Data = productImage
            };
            return CreatedAtAction(nameof(GetProductImage), new { id = productImage.Id }, response);
        }

        // DELETE: api/ProductImages/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductImage(int id)
        {
            var productImage = await _context.ProductImages.FindAsync(id);
            if (productImage == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Product Image not found.",
                    Data = null
                });
            }

            _context.ProductImages.Remove(productImage);
            await _context.SaveChangesAsync();

            GeneralResponse response = new GeneralResponse
            {
                Success = true,
                Message = "Product Image deleted successfully.",
                Data = null
            };
            return Ok(response);
        }

        private bool ProductImageExists(int id)
        {
            return _context.ProductImages.Any(e => e.Id == id);
        }
    }
}
