using Ecommerce_Server.DTO;
using Ecommerce_Server.DTO.Orders;
using Ecommerce_Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class OrdersController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public OrdersController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GeneralResponse>> GetOrders()
        {
            var orders = await _context.Orders
                //.Include(o => o.Customer)
                .ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Orders retrieved successfully.",
                Data = orders
            });
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<GeneralResponse>> GetOrder(int id)
        {
            var order = await _context.Orders
                //.Include(o => o.Customer)
                //.Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Order not found.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order retrieved successfully.",
                Data = order
            });
        }

        // POST: api/Orders
        [HttpPost]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<GeneralResponse>> CreateOrder(OrderDTO orderDTO)
        {
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == orderDTO.CustomerId);
            if (!customerExists)
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid Customer ID.",
                    Data = null
                });
            }

            var order = new Order
            {
                CustomerId = orderDTO.CustomerId,
                Status = orderDTO.Status,
                TotalAmount = orderDTO.TotalAmount,
                PaymentMethod = orderDTO.PaymentMethod,
                ShippingAddress = orderDTO.ShippingAddress,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, new GeneralResponse
            {
                Success = true,
                Message = "Order created successfully.",
                Data = order
            });
        }


        // PUT: api/Orders/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GeneralResponse>> UpdateOrder(int id, UpdateOrderDTO orderDTO)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Order not found.",
                    Data = null
                });
            }

            // Update the fields using the incoming DTO
            order.CustomerId = orderDTO.CustomerId ?? order.CustomerId;
            order.Status = orderDTO.Status ?? order.Status;
            order.TotalAmount = orderDTO.TotalAmount ?? order.TotalAmount;
            order.PaymentMethod = orderDTO.PaymentMethod ?? order.PaymentMethod;
            order.ShippingAddress = orderDTO.ShippingAddress ?? order.ShippingAddress;
            order.UpdatedAt = DateTime.Now;

            // Mark entity state as modified
            _context.Entry(order).State = EntityState.Modified;

            try
            {
                // Save the changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound(new GeneralResponse
                    {
                        Success = false,
                        Message = "Order not found.",
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
                Message = "Order updated successfully.",
                Data = order
            });
        }


        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "User,Admin")]

        public async Task<ActionResult<GeneralResponse>> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Order not found.",
                    Data = null
                });
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order deleted successfully.",
                Data = null
            });
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(o => o.Id == id);
        }
    }
}
