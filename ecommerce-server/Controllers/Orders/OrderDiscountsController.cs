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
    public class OrderDiscountsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public OrderDiscountsController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderDiscounts
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GeneralResponse>> GetOrderDiscounts()
        {
            var orderDiscounts = await _context.OrderDiscounts
                .Include(od => od.Order)
                .Include(od => od.Discount)
                .ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order discounts retrieved successfully.",
                Data = orderDiscounts
            });
        }

        // GET: api/OrderDiscounts/5
        [HttpGet("{id}")]
        [Authorize(Roles = "User,Admin")]

        public async Task<ActionResult<GeneralResponse>> GetOrderDiscount(int id)
        {
            var orderDiscount = await _context.OrderDiscounts
                .Include(od => od.Order)
                .Include(od => od.Discount)
                .FirstOrDefaultAsync(od => od.Id == id);

            if (orderDiscount == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Order discount not found.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order discount retrieved successfully.",
                Data = orderDiscount
            });
        }

        // POST: api/OrderDiscounts
        [HttpPost]
        [Authorize(Roles = "User,Admin")]

        public async Task<ActionResult<GeneralResponse>> CreateOrderDiscount(OrderDiscountDTO orderDiscountDTO)
        {
            if (!_context.Orders.Any(o => o.Id == orderDiscountDTO.OrderId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid order ID.",
                    Data = null
                });
            }

            if (!_context.Discounts.Any(d => d.Id == orderDiscountDTO.DiscountId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid discount ID.",
                    Data = null
                });
            }

            var orderDiscount = new OrderDiscount
            {
                OrderId = orderDiscountDTO.OrderId,
                DiscountId = orderDiscountDTO.DiscountId
            };

            _context.OrderDiscounts.Add(orderDiscount);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderDiscount), new { id = orderDiscount.Id }, new GeneralResponse
            {
                Success = true,
                Message = "Order discount created successfully.",
                Data = orderDiscount
            });
        }

        // DELETE: api/OrderDiscounts/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "User,Admin")]

        public async Task<ActionResult<GeneralResponse>> DeleteOrderDiscount(int id)
        {
            var orderDiscount = await _context.OrderDiscounts.FindAsync(id);
            if (orderDiscount == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Order discount not found.",
                    Data = null
                });
            }

            _context.OrderDiscounts.Remove(orderDiscount);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order discount deleted successfully.",
                Data = null
            });
        }
    }
}

