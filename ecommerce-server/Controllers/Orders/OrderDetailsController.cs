using Ecommerce_Server.DTO;
using Ecommerce_Server.DTO.Orders;
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

    public class OrderDetailsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public OrderDetailsController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderDetails
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GeneralResponse>> GetOrderDetails()
        {
            var orderDetails = await _context.OrderDetails
                //.Include(od => od.Order)
                //.Include(od => od.Product)
                //.Include(od => od.ProductVariant)
                .ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order details retrieved successfully.",
                Data = orderDetails
            });
        }

        // GET: api/OrderDetails/5
        [HttpGet("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<GeneralResponse>> GetOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails
               // .Include(od => od.Order)
                //.Include(od => od.Product)
                //.Include(od => od.ProductVariant)
                .FirstOrDefaultAsync(od => od.Id == id);

            if (orderDetail == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Order detail not found.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order detail retrieved successfully.",
                Data = orderDetail
            });
        }

        // POST: api/OrderDetails
        [HttpPost]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<GeneralResponse>> CreateOrderDetail(OrderDetailDTO orderDetailDTO)
        {
            if (!_context.Orders.Any(o => o.Id == orderDetailDTO.OrderId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid Order ID.",
                    Data = null
                });
            }

            if (!_context.Products.Any(p => p.Id == orderDetailDTO.ProductId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid Product ID.",
                    Data = null
                });
            }

            if (!_context.ProductVariants.Any(pv => pv.Id == orderDetailDTO.ProductVariantId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid Product Variant ID.",
                    Data = null
                });
            }

            var orderDetail = new OrderDetail
            {
                OrderId = orderDetailDTO.OrderId,
                ProductId = orderDetailDTO.ProductId,
                ProductVariantId = orderDetailDTO.ProductVariantId,
                Quantity = orderDetailDTO.Quantity,
                Price = orderDetailDTO.Price
            };

            _context.OrderDetails.Add(orderDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderDetail), new { id = orderDetail.Id }, new GeneralResponse
            {
                Success = true,
                Message = "Order detail created successfully.",
                Data = orderDetail
            });
        }

        // PUT: api/OrderDetails/5
        [HttpPut("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<GeneralResponse>> UpdateOrderDetail(int id, UpdateOrderDetailDTO orderDetailDTO)
        {
            var orderDetail = await _context.OrderDetails.FindAsync(id);

            if (orderDetail == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Order detail not found.",
                    Data = null
                });
            }

            // Update the fields using the incoming DTO
            orderDetail.OrderId = orderDetailDTO.OrderId ?? orderDetail.OrderId;
            orderDetail.ProductId = orderDetailDTO.ProductId ?? orderDetail.ProductId;
            orderDetail.ProductVariantId = orderDetailDTO.ProductVariantId ?? orderDetail.ProductVariantId;
            orderDetail.Quantity = orderDetailDTO.Quantity ?? orderDetail.Quantity;
            orderDetail.Price = orderDetailDTO.Price ?? orderDetail.Price;

            // Mark entity state as modified
            _context.Entry(orderDetail).State = EntityState.Modified;

            try
            {
                // Save the changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderDetailExists(id))
                {
                    return NotFound(new GeneralResponse
                    {
                        Success = false,
                        Message = "Order detail not found.",
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
                Message = "Order detail updated successfully.",
                Data = orderDetail
            });
        }


        // DELETE: api/OrderDetails/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<GeneralResponse>> DeleteOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails.FindAsync(id);
            if (orderDetail == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Order detail not found.",
                    Data = null
                });
            }

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Order detail deleted successfully.",
                Data = null
            });
        }

        private bool OrderDetailExists(int id)
        {
            return _context.OrderDetails.Any(od => od.Id == id);
        }
    }
}
