using Ecommerce_Server.DTO;
using Ecommerce_Server.DTO.Customers;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Customers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce_Server.Controllers.Customers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class CustomerInteractionsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public CustomerInteractionsController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/CustomerInteractions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerInteraction>>> GetCustomerInteractions()
        {
            var interactions = await _context.CustomerInteractions.ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Customer interactions retrieved successfully.",
                Data = interactions
            });
        }
        

        // GET: api/CustomerInteractions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerInteraction>> GetCustomerInteraction(int id)
        {
            var interaction = await _context.CustomerInteractions.FirstOrDefaultAsync(ci => ci.Id == id);

            if (interaction == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Customer interaction not found.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Customer interaction retrieved successfully.",
                Data = interaction
            });
        }

        // POST: api/CustomerInteractions
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> CreateCustomerInteraction(CustomerInteractionDTO interactionDTO)
        {
            // Validate customer existence
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == interactionDTO.CustomerId);
            if (!customerExists)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Customer does not exist.",
                    Data = null
                });
            }

            // Validate product existence
            var productExists = await _context.Products.AnyAsync(p => p.Id == interactionDTO.ProductId);
            if (!productExists)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Product does not exist.",
                    Data = null
                });
            }

            // Map DTO to entity
            var newInteraction = new CustomerInteraction
            {
                CustomerId = interactionDTO.CustomerId,
                ProductId = interactionDTO.ProductId,
                InteractionType = interactionDTO.InteractionType,
            };

            // Add and save the interaction
            _context.CustomerInteractions.Add(newInteraction);
            await _context.SaveChangesAsync();

            // Return a successful response
            return CreatedAtAction(nameof(GetCustomerInteraction), new { id = newInteraction.Id }, new GeneralResponse
            {
                Success = true,
                Message = "Customer interaction created successfully.",
                Data = newInteraction
            });
        }

        
        // DELETE: api/CustomerInteractions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomerInteraction(int id)
        {
            var interaction = await _context.CustomerInteractions.FindAsync(id);
            if (interaction == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Customer interaction not found for deletion.",
                    Data = null
                });
            }

            _context.CustomerInteractions.Remove(interaction);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Customer interaction deleted successfully.",
                Data = null
            });
        }


       


    }
}
