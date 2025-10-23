using Ecommerce_Server.DTO;
using Ecommerce_Server.DTO.Products;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Products;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace Ecommerce_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "User")]
    public class ProductReviewsController : ControllerBase
    {

        private readonly EcommerceDbContext _context;

        public ProductReviewsController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/ProductReviews
        [HttpGet]
        public async Task<ActionResult<GeneralResponse>> GetProductReviews()
        {
            GeneralResponse response = new GeneralResponse
            {
                Success = true,
                Message = "Get All Product Reviews Successful",
                Data = await _context.ProductReviews.ToListAsync()
            };
            return response;
        }

        // GET: api/ProductReviews/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<GeneralResponse>> GetProductReview(int id)
        {
            var productReview = await _context.ProductReviews.FirstOrDefaultAsync(r => r.Id == id);

            GeneralResponse response = new GeneralResponse();
            if (productReview == null)
            {
                response.Message = "Product Review not found.";
                response.Success = false;
                return NotFound(response);
            }

            response.Success = true;
            response.Message = "Get Product Review Successful";
            response.Data = productReview;
            return response;
        }

        // PUT: api/ProductReviews/5
        [HttpPut("{id}")]

        public async Task<IActionResult> UpdateProductReview(int id, UpdateProductReviewDTO updateProductReviewDTO)
        {
  
            var productReview = await _context.ProductReviews.FindAsync(id);
            if (productReview == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Product Review not found.",
                    Data = null
                });
            }

      
            productReview.ProductId = updateProductReviewDTO.ProductId ?? productReview.ProductId;
            productReview.CustomerId = updateProductReviewDTO.CustomerId ?? productReview.CustomerId;
            productReview.Rating = updateProductReviewDTO.Rating ?? productReview.Rating;
            productReview.Review = updateProductReviewDTO.Review ?? productReview.Review;

          
            _context.ProductReviews.Update(productReview);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Product Review updated successfully.",
                Data = productReview
            });
        }

        // POST: api/ProductReviews
        [HttpPost]
        public async Task<ActionResult<GeneralResponse>> CreateProductReview(ProductReviewDTO productReviewDTO)
        {
            int CustomerId = Convert.ToInt32(User?.FindFirst(ClaimTypes.NameIdentifier)?.Value);

            if (!ModelState.IsValid)
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid input data.",
                    Data = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
                });
            }

            // Ensure the related Product exists
            if (!_context.Products.Any(p => p.Id == productReviewDTO.ProductId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid Product ID.",
                    Data = null
                });
            }

            // Ensure the related Customer exists
            if (!_context.Customers.Any(c => c.Id == CustomerId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid Customer ID.",
                    Data = null
                });
            }

            ProductReview productReview = new ProductReview
            {
                Rating = productReviewDTO.Rating,
                Review = productReviewDTO.Review,
                ProductId = productReviewDTO.ProductId,
                CustomerId = CustomerId
            };

            _context.ProductReviews.Add(productReview);
            await _context.SaveChangesAsync();

            GeneralResponse response = new GeneralResponse
            {
                Success = true,
                Message = "Product Review created successfully.",
                Data = productReview
            };
            return CreatedAtAction(nameof(GetProductReview), new { id = productReview.Id }, response);
        }

        // DELETE: api/ProductReviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductReview(int id)
        {
            var productReview = await _context.ProductReviews.FindAsync(id);
            if (productReview == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Product Review not found.",
                    Data = null
                });
            }

            _context.ProductReviews.Remove(productReview);
            await _context.SaveChangesAsync();

            GeneralResponse response = new GeneralResponse
            {
                Success = true,
                Message = "Product Review deleted successfully.",
                Data = null
            };
            return Ok(response);
        }

        private bool ProductReviewExists(int id)
        {
            return _context.ProductReviews.Any(e => e.Id == id);
        }
    }
}

