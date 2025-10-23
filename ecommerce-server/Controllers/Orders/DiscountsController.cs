using Ecommerce_Server.DTO;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]

    public class DiscountsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public DiscountsController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/Discounts
        [HttpGet]
        public async Task<ActionResult<GeneralResponse>> GetDiscounts()
        {
            var discounts = await _context.Discounts.ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Discounts retrieved successfully.",
                Data = discounts
            });
        }

        // GET: api/Discounts/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<GeneralResponse>> GetDiscount(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);

            if (discount == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Discount not found.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Discount retrieved successfully.",
                Data = discount
            });
        }

        // POST: api/Discounts
        [HttpPost]
        public async Task<ActionResult<GeneralResponse>> CreateDiscount(DiscountDTO discountDTO)
        {
            if (_context.Discounts.Any(d => d.Code == discountDTO.Code))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Discount code already exists.",
                    Data = null
                });
            }

            var discount = new Discount
            {
                Code = discountDTO.Code,
                Description = discountDTO.Description,
                DiscountType = discountDTO.DiscountType,
                DiscountValue = discountDTO.DiscountValue,
                StartDate = discountDTO.StartDate,
                EndDate = discountDTO.EndDate,
                MinOrderAmount = discountDTO.MinOrderAmount
            };

            _context.Discounts.Add(discount);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDiscount), new { id = discount.Id }, new GeneralResponse
            {
                Success = true,
                Message = "Discount created successfully.",
                Data = discount
            });
        }

        // PUT: api/Discounts/5
        [HttpPut("{id}")]
        public async Task<ActionResult<GeneralResponse>> UpdateDiscount(int id, UpdateDiscountDTO discountDTO)
        {
            var discount = await _context.Discounts.FindAsync(id);

            if (discount == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Discount not found.",
                    Data = null
                });
            }

            // Update properties using ternary operator to ensure non-null values are considered
            discount.Code = !string.IsNullOrEmpty(discountDTO?.Code) ? discountDTO.Code : discount.Code;
            discount.Description = !string.IsNullOrEmpty(discountDTO?.Description) ? discountDTO.Description : discount.Description;
            discount.DiscountType = discountDTO?.DiscountType ?? discount.DiscountType;
            discount.DiscountValue = discountDTO?.DiscountValue >= 0 ? discountDTO.DiscountValue.Value : discount.DiscountValue;
            discount.StartDate = discountDTO?.StartDate ?? discount.StartDate;
            discount.EndDate = discountDTO?.EndDate ?? discount.EndDate;
            discount.MinOrderAmount = discountDTO?.MinOrderAmount >= 0 ? discountDTO.MinOrderAmount.Value : discount.MinOrderAmount;

            // Mark the entity as modified
            _context.Entry(discount).State = EntityState.Modified;

            try
            {
                // Save the changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DiscountExists(id))
                {
                    return NotFound(new GeneralResponse
                    {
                        Success = false,
                        Message = "Discount not found.",
                        Data = null
                    });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Discount updated successfully.",
                Data = discount
            });
        }


        // DELETE: api/Discounts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<GeneralResponse>> DeleteDiscount(int id)
        {
            var discount = await _context.Discounts.FindAsync(id);
            if (discount == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Discount not found.",
                    Data = null
                });
            }

            _context.Discounts.Remove(discount);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Discount deleted successfully.",
                Data = null
            });
        }

        private bool DiscountExists(int id)
        {
            return _context.Discounts.Any(d => d.Id == id);
        }
    }
}
