using Azure;
using Clerk.BackendAPI.Models.Operations;
using Ecommerce_Server.DTO;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Customers;
using Ecommerce_Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Ecommerce_Server.Controllers.Customers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class CustomersController : ControllerBase
    {
        private readonly EcommerceDbContext _context;
        Authentication authentication;


        public CustomersController(EcommerceDbContext context ,JwtOptions jwtOptions )
        {
            _context = context;
            authentication = new Authentication(jwtOptions);
        }








      
        
        [HttpPost]
        [Route("auth-login")]
        [AllowAnonymous]
        public async Task<ActionResult<GeneralResponse>> LoginUser(AuthenticationRequest request)
        {
            var current_user = _context.Customers.FirstOrDefault(c => c.Email == request.Email && c.Password == request.Password);

            if (current_user == null)
            {      
                return Unauthorized(new GeneralResponse() { Success = false,
                  Message = "Invalid email or password."
                });
            }
           
            string token = authentication.CreateToken(current_user.Id.ToString(), current_user.Email , current_user.Role);

            Response.Cookies.Append("auth-token-ecommerce", token, new CookieOptions
            {
                Secure = false, // Remove this or set it to false in development
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });



            return Ok(new GeneralResponse() { Success = true, Message = "Successful Login!", Data = token });
        }







        [HttpPost]
        [Route("auth-signup")]
        [AllowAnonymous]
        public async Task<ActionResult<GeneralResponse>> SignupUser(AuthenticationSignupRequest request)
        {
            var current_user = _context.Customers.FirstOrDefault(c => c.Email == request.Email);

            if (current_user != null)
            {
                GeneralResponse response = new GeneralResponse();
                response.Success = false;
                response.Message = "This email already exisit!";

                return BadRequest(response);

            }

            var customer = new Customer
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Password = request.Password,
                Role = "User",
               
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();


            string token = authentication.CreateToken(customer.Id.ToString(), customer.Email , customer.Role);


            Response.Cookies.Append("auth-token-ecommerce", token, new CookieOptions
            {
                Secure = false, // Remove this or set it to false in development
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            });

            return Ok(new GeneralResponse() { Success = true, Message = "Successful Sign up!", Data = token });

        }


        [HttpPost]
        [Route("auth-logout")]
        public ActionResult<GeneralResponse>  Logout()
        {
            Response.Cookies.Delete("auth-token-ecommerce");

            return Ok(new GeneralResponse()
            {
                Success = true,
                Message = "Logged out successfully."
            });
        }





        // GET: api/Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            var customers = await _context.Customers.ToListAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Customers retrieved successfully.",
                Data = customers
            });
        }

        // GET: api/Customers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Customer not found.",
                    Data = null
                });
            }

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Customer retrieved successfully.",
                Data = customer
            });
        }

        // PUT: api/Customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, UpdateCustomerDTO updateCustomerDTO)
        {
            // Check if the customer exists
            var existingCustomer = await _context.Customers.FindAsync(id);
            if (existingCustomer == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Customer not found.",
                    Data = null
                });
            }

            // Update fields using null-coalescing logic
            existingCustomer.FirstName = updateCustomerDTO.FirstName ?? existingCustomer.FirstName;
            existingCustomer.LastName = updateCustomerDTO.LastName ?? existingCustomer.LastName;
            existingCustomer.Email = updateCustomerDTO.Email ?? existingCustomer.Email;

            // Always hash the password if provided
            existingCustomer.Password = !string.IsNullOrEmpty(updateCustomerDTO.Password)
                ? updateCustomerDTO.Password
                : existingCustomer.Password;

            existingCustomer.ClerkUserId = updateCustomerDTO.ClerkUserId ?? existingCustomer.ClerkUserId;
            existingCustomer.Role = updateCustomerDTO.Role ?? existingCustomer.Role;
            existingCustomer.PhoneNumber = updateCustomerDTO.PhoneNumber ?? existingCustomer.PhoneNumber;
            existingCustomer.Address = updateCustomerDTO.Address ?? existingCustomer.Address;

            // Mark the entity as modified
            _context.Entry(existingCustomer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CustomerExists(id))
                {
                    return NotFound(new GeneralResponse
                    {
                        Success = false,
                        Message = "Customer not found for update.",
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
                Message = "Customer updated successfully.",
                Data = existingCustomer
            });
        }


        // POST: api/Customers
        [HttpPost]
        public async Task<ActionResult<Customer>> CreateCustomer(CustomerDTO customerDTO)
        {
            if (_context.Customers.Any(c => c.Email == customerDTO.Email))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Email is already registered.",
                    Data = null
                });
            }

            // Map CustomerDTO to Customer entity
            var customer = new Customer
            {
                FirstName = customerDTO.FirstName,
                LastName = customerDTO.LastName,
                Email = customerDTO.Email,
                Password = customerDTO.Password,
                PhoneNumber = customerDTO.PhoneNumber,
                Address = customerDTO.Address,
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, new GeneralResponse
            {
                Success = true,
                Message = "Customer created successfully.",
                Data = customer
            });
        }

        // DELETE: api/Customers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Customer not found for deletion.",
                    Data = null
                });
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Customer deleted successfully.",
                Data = null
            });
        }

        private bool CustomerExists(int id)
        {
            return _context.Customers.Any(e => e.Id == id);
        }
    }
}
