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
    public class OrderPaymentsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public OrderPaymentsController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderPayments
        [HttpGet]
        [Authorize(Roles = "Admin")]

        public async Task<ActionResult<GeneralResponse>> GetOrderPayments()
        {
            var orderPayments = await _context.OrderPayments
                .Include(op => op.Order)
                .ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order payments retrieved successfully.",
                Data = orderPayments
            });
        }

        // GET: api/OrderPayments/5
        [HttpGet("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<GeneralResponse>> GetOrderPayment(int id)
        {
            var orderPayment = await _context.OrderPayments
                .Include(op => op.Order)
                .FirstOrDefaultAsync(op => op.Id == id);

            if (orderPayment == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Order payment not found.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order payment retrieved successfully.",
                Data = orderPayment
            });
        }

        // POST: api/OrderPayments
        [HttpPost]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<GeneralResponse>> CreateOrderPayment(OrderPaymentDTO orderPaymentDTO)
        {
            if (!_context.Orders.Any(o => o.Id == orderPaymentDTO.OrderId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid order ID.",
                    Data = null
                });
            }

            var orderPayment = new OrderPayment
            {
                OrderId = orderPaymentDTO.OrderId,
                AmountPaid = orderPaymentDTO.AmountPaid,
                PaymentStatus = orderPaymentDTO.PaymentStatus,
                PaymentDate = orderPaymentDTO.PaymentDate,
                TransactionId = orderPaymentDTO.TransactionId
            };

            _context.OrderPayments.Add(orderPayment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderPayment), new { id = orderPayment.Id }, new GeneralResponse
            {
                Success = true,
                Message = "Order payment created successfully.",
                Data = orderPayment
            });
        }

        // DELETE: api/OrderPayments/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<GeneralResponse>> DeleteOrderPayment(int id)
        {
            var orderPayment = await _context.OrderPayments.FindAsync(id);
            if (orderPayment == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Order payment not found.",
                    Data = null
                });
            }

            _context.OrderPayments.Remove(orderPayment);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order payment deleted successfully.",
                Data = null
            });
        }
    }
}
