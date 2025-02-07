using Ecommerce_Server.DTO;
using Ecommerce_Server.DTO.Products;
using Ecommerce_Server.Models;
using Ecommerce_Server.Services.SearchServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using Size = Ecommerce_Server.Models.Size;

namespace Ecommerce_Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ProductsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public ProductsController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: Search Products
        [HttpGet("Search/{query}")]
        public async Task<ActionResult<GeneralResponse>> SearchProduct(string query)
        {
            // Get suggestions from the Trie
            List<string> suggestionQuery = Trie.Search(query);
            var products = new List<dynamic>();

            // Query the products based on suggestions
            foreach (var suggestion in suggestionQuery)
            {
                var matchingProducts = await _context.Products
                                                      .Where(p => p.Name.ToLower().Contains(suggestion.ToLower()))
                                                      .Select(p => new
                                                      {
                                                          p.Id,
                                                          p.Name,
                                                          p.Price,
                                                          Quantity = p.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                                                          Category = new
                                                          {
                                                              name = p.Category.Name
                                                          },
                                                          SubCategory = new
                                                          {
                                                              name = p.SubCategory.Name
                                                          },
                                                          ProductVariants = p.ProductVariants.Select(v => new
                                                          {
                                                              id = v.Id,
                                                              Color = v.Color,
                                                              Quantity = v.Sizes.Sum(s => s.Quantity),
                                                              Images = v.ProductImages,
                                                          })
                                                      }).ToListAsync();

                // Only add the matching products if there are any
                if (matchingProducts.Any())
                {
                    var orderedMatchingProducts = matchingProducts
                          .GroupBy(p => p.Id)
                          .OrderByDescending(g => g.Count())
                          .Select(g => g.First())
                          .ToList();
                    products.AddRange(orderedMatchingProducts);
                }

                // If no exact matches, look for partial matches by splitting the query into tokens
            }
            var tokens = query.Split(' ');
            foreach (var token in tokens)
            {
                        var partialMatchingProducts = await _context.Products
                                                                    .Where(p => p.Name.ToLower().Contains(token.ToLower()))
                                                                    .Select(p => new
                                                                    {
                                                                        p.Id,
                                                                        p.Name,
                                                                        p.Price,
                                                                        Quantity = p.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                                                                        Category = new
                                                                        {
                                                                            name = p.Category.Name
                                                                        },
                                                                        SubCategory = new
                                                                        {
                                                                            name = p.SubCategory.Name
                                                                        },
                                                                        ProductVariants = p.ProductVariants.Select(v => new
                                                                        {
                                                                            id = v.Id,
                                                                            Color = v.Color,
                                                                            Quantity = v.Sizes.Sum(s => s.Quantity),
                                                                            Images = v.ProductImages,
                                                                        })
                                                                    }).ToListAsync();

                        
                        if (partialMatchingProducts.Any())
                        {
                           var orderedPartialMatchingProducts = partialMatchingProducts
                           .GroupBy(p => p.Id) 
                           .OrderByDescending(g => g.Count()) 
                           .Select(g => g.First()) 
                           .ToList();
                           products.AddRange(orderedPartialMatchingProducts);
                        }
            }
            

            // Remove duplicates by product ID
            products = products.GroupBy(p => p.Id)
                               .Select(g => g.First()) 
                               .ToList();

            
            var response = new GeneralResponse
            {
                Success = true,
                Message = "Successful Return Products",
                Data = products
            };

            return Ok(response);  // Return the response with status 200
        }



        // GET: Search Suggestion
        [HttpGet("Suggestion/{query}")]
        public async Task<ActionResult<GeneralResponse>> SugegestionSearch(string query)
        {
            
            List<string> Result = Trie.Search(query);

            return new GeneralResponse() {
                Success = true,
                Message= "Successful Return suggestion search.",
                Data = Result,

            };
        }

        
        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<GeneralResponse>> GetProductss(
            [FromQuery] List<string> category,
            [FromQuery] List<string> subCategory,
            [FromQuery] List<string> colors,
            [FromQuery] List<string> sizes,
            [FromQuery] List<int> rating,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice)
        {
            try
            {
                // Start with the base query
                var query = _context.Products.AsQueryable();

                // Apply filters dynamically
                if (category != null && category.Any())
                {
                    query = query.Where(p => category.Contains(p.Category.Name));
                }

                if (subCategory != null && subCategory.Any())
                {
                    query = query.Where(p => subCategory.Contains(p.SubCategory.Name));
                }

                if (colors != null && colors.Any())
                {
                    query = query.Where(p => p.ProductVariants.Any(v => colors.Contains(v.Color)));
                }

                if (sizes != null && sizes.Any())
                {
                    query = query.Where(p => p.ProductVariants.Any(v => v.Sizes.Any(s => sizes.Contains(s.Name))));
                }

                if (rating != null && rating.Any())
                {
                    query = query.Where(p =>
                        p.ProductReviews.Any() && 
                        rating.Contains(Convert.ToInt16(p.ProductReviews.Sum(r => r.Rating) / p.ProductReviews.Count))
                    );
                }


                if (minPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= minPrice.Value);
                }

                if (maxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= maxPrice.Value);
                }

                // Fetch and map the filtered products
                var products = await query.Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    Quantity = p.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                    Category = new
                    {

                        name = p.Category.Name
                    },
                    SubCategory = new
                    {

                        name = p.SubCategory.Name
                    },
                    ProductVariants = p.ProductVariants.Select(v => new
                    {
                        id = v.Id,
                        Color = v.Color,
                        Quantity = v.Sizes.Sum(s => s.Quantity),
                        Images = v.ProductImages,
                    })
                }).ToListAsync();

                // Prepare the response
                var response = new GeneralResponse
                {
                    Success = true,
                    Message = "Products retrieved successfully",
                    Data = products
                };

                return Ok(response); // Return with status 200
            }
            catch (Exception ex)
            {
                // Handle errors gracefully
                var response = new GeneralResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                };

                return StatusCode(500, response); // Return with status 500
            }
        }
        

        // GET products wihtout filtiration
        /*
        // GET: api/Products
        [HttpGet]
     
        public async Task<ActionResult<GeneralResponse>> GetProducts()
        {
            var products = await _context.Products.Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                Quantity = p.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                Category = new
                {
                   
                    name = p.Category.Name
                },
                SubCategory = new
                {
                 
                    name = p.SubCategory.Name
                },
                ProductVariants = p.ProductVariants.Select(v => new
                {
                    id = v.Id,
                    Color = v.Color,
                    Quantity = v.Sizes.Sum(s => s.Quantity),
                    Images = v.ProductImages,
                })
            }).ToListAsync();



            return new GeneralResponse
            {
                Success = true,
                Message = "Get All Products Successful",
                Data = products
            };
        }
        */


        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GeneralResponse>> GetProduct(int id)
        {
            var product = await _context.Products.Where(p => p.Id == id).Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.Description,
                Quantity = p.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                Category = new
                {

                    name = p.Category.Name
                },
                SubCategory = new
                {

                    name = p.SubCategory.Name
                },

                Sizes = p.ProductVariants.SelectMany(v => v.Sizes).Select(s => s.Name).Distinct().ToList(),

            ProductVariants = p.ProductVariants.Select(v => new
                {
                    Id = v.Id,
                    Color = v.Color,
                    Sizes = v.Sizes,
                    Quantity  = v.Sizes.Sum(s => s.Quantity),
                    Images = v.ProductImages,
                }),
                ProductReviews = p.ProductReviews.Select(r => new {
                    Id = r.Id,
                    Review = r.Review,
                    Rating = r.Rating,
                    ReviewDate = r.ReviewDate,
                    Customer = new {r.Customer.FirstName , r.Customer.LastName},
                }),
            }).FirstOrDefaultAsync();


            GeneralResponse response = new GeneralResponse();
            if (product == null)
            {
                response.Message = "Product not found.";
                response.Success = false;
                return NotFound(response);
            }

            response.Success = true;
            response.Message = "Product retrieved successfully.";
            response.Data = product;
            return response;
        }

       
        [HttpGet("{productId}/recommendations")]
        public async Task<IActionResult> GetRecommendationsAsync(int productId ,[FromQuery] int customerId)
        {
             int NumberProducts = customerId == null ? 10 : 5;
            // Fetch the selected product
            var selectedProduct = await _context.Products
             .Include(p => p.Category)
             .Include(p => p.SubCategory)
             .FirstOrDefaultAsync(p => p.Id == productId);
            if (selectedProduct == null)
                return NotFound(new GeneralResponse() { Success=false , Message= "Product not found." });

            // *** Similar Products ***
            var similarProducts = await _context.Products
                .Include(p => p.Category)      
                .Include(p => p.SubCategory)     
                .Where(p => p.Category.Name == selectedProduct.Category.Name && 
                            p.SubCategory.Name == selectedProduct.SubCategory.Name && 
                            p.Id != productId)
                .Take(NumberProducts)   
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    Quantity = p.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                    Category = new
                    {

                        name = p.Category.Name
                    },
                    SubCategory = new
                    {

                        name = p.SubCategory.Name
                    },
                    ProductVariants = p.ProductVariants.Select(v => new
                    {
                        id = v.Id,
                        Color = v.Color,
                        Quantity = v.Sizes.Sum(s => s.Quantity),
                        Images = v.ProductImages,
                    })
                }).ToListAsync();




            // *** Products Bought Together ***
            var orderIds = await _context.OrderDetails
                .Where(od => od.ProductId == productId)
                .Select(od => od.OrderId)
                .Distinct()
                .ToListAsync();

            
            var recommendedProductIds = await _context.OrderDetails
                .Where(od => orderIds.Contains(od.OrderId) && od.ProductId != productId)
                .GroupBy(od => od.ProductId)
                .OrderByDescending(g => g.Count())
                .Take(NumberProducts)
                .Select(g => g.Key)
                .ToListAsync();
           
            var productsBoughtTogether = await _context.Products
                .Where(p => recommendedProductIds.Contains(p.Id))
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    Quantity = p.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                    Category = new
                    {

                        name = p.Category.Name
                    },
                    SubCategory = new
                    {

                        name = p.SubCategory.Name
                    },
                    ProductVariants = p.ProductVariants.Select(v => new
                    {
                        id = v.Id,
                        Color = v.Color,
                        Quantity = v.Sizes.Sum(s => s.Quantity),
                        Images = v.ProductImages,
                    })
                }).ToListAsync();


            GeneralResponse response = new GeneralResponse();
            response.Success = true;
            response.Message = "Get Product Recommendations Successful";

            if (customerId == null)
            {
                var allRecommendationsWithoutCustomerInteractions = similarProducts
                .Concat(productsBoughtTogether)
                .GroupBy(p => p.Id) // Remove duplicates by grouping by ProductId
                .Select(g => g.First()) // Take the first unique product
                .ToList();

                response.Data = allRecommendationsWithoutCustomerInteractions;
                return Ok(response);
            }

            // *** User Interaction-Based Recommendations ***
            var userInteractedProductIds = await _context.CustomerInteractions
                .Where(ui => ui.CustomerId == customerId)
                .GroupBy(ui => ui.ProductId)
                .OrderByDescending(g => g.Count())
                .Take(NumberProducts)
                .Select(g => g.Key)
                .ToListAsync();

            
            var userInteractedProducts = await _context.Products
                .Where(p => userInteractedProductIds.Contains(p.Id)).Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    Quantity = p.ProductVariants.Sum(v => v.Sizes.Sum(s => s.Quantity)),
                    Category = new
                    {

                        name = p.Category.Name
                    },
                    SubCategory = new
                    {

                        name = p.SubCategory.Name
                    },
                    ProductVariants = p.ProductVariants.Select(v => new
                    {
                        id = v.Id,
                        Color = v.Color,
                        Quantity = v.Sizes.Sum(s => s.Quantity),
                        Images = v.ProductImages,
                    })
                }).ToListAsync();




            // *** Combine Results into One Unified List ***
            var allRecommendations = similarProducts
                .Concat(userInteractedProducts)
                .Concat(productsBoughtTogether)
                .GroupBy(p => p.Id) // Remove duplicates by grouping by ProductId
                .Select(g => g.First()) // Take the first unique product
                .ToList();


            response.Data = allRecommendations;
            return Ok(response);
        }





        // PUT: api/Products/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductDTO productInput)
        {
            // Find the existing product by ID
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Product not found.",
                    Data = null
                });
            }

            // Use ternary operator to update fields if they are provided in the DTO
            product.Name = !string.IsNullOrEmpty(productInput?.Name) ? productInput.Name : product.Name;
            product.Description = !string.IsNullOrEmpty(productInput?.Description) ? productInput.Description : product.Description;
            product.Price = productInput?.Price > 0 ? productInput.Price.Value : product.Price;
            product.CategoryId = productInput?.CategoryId ?? product.CategoryId;
            product.SubCategoryId = productInput?.SubCategoryId ?? product.SubCategoryId;
            // Mark the entity as modified
            _context.Entry(product).State = EntityState.Modified;

            try
            {
                // Save the changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Handle concurrency errors (e.g., if the entity was modified elsewhere)
                return StatusCode(500, new GeneralResponse
                {
                    Success = false,
                    Message = "Concurrency error while updating product.",
                    Data = null
                });
            }

            // Return the updated product
            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Product updated successfully.",
                Data = product
            });
        }


        // POST: api/Products
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GeneralResponse>> CreateProduct(ProductDTO productDTO)
        {
            // Ensure the related Category exists
            if (!_context.ProductCategories.Any(c => c.Id == productDTO.CategoryId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid Category ID.",
                    Data = null
                });
            }
            if (!_context.ProductSubCategories.Any(c => c.Id == productDTO.SubCategoryId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid SubCategory ID.",
                    Data = null
                });
            }

            Product product = new Product
            {
                Name = productDTO.Name,
                Description = productDTO.Description,
                Price = productDTO.Price,
                CategoryId = productDTO.CategoryId,
                SubCategoryId = productDTO.SubCategoryId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            // add product to trie
            Trie.Insert(product.Name);

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, new GeneralResponse
            {
                Success = true,
                Message = "Product created successfully.",
                Data = product
            });
        }

        // POST: api/Products
        [HttpPost("fullproduct")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<GeneralResponse>> CreateFullProduct(FullProductDTO productDTO)
        {
            
            // Ensure the related Category exists
            if (!_context.ProductCategories.Any(c => c.Id == productDTO.CategoryId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid Category ID.",
                    Data = null
                });
            }
            if (!_context.ProductSubCategories.Any(c => c.Id == productDTO.SubCategoryId))
            {
                return BadRequest(new GeneralResponse
                {
                    Success = false,
                    Message = "Invalid SubCategory ID.",
                    Data = null
                });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                Product product = new Product
                {
                    Name = productDTO.Name,
                    Description = productDTO.Description,
                    Price = productDTO.Price,
                    CategoryId = productDTO.CategoryId,
                    SubCategoryId = productDTO.SubCategoryId
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync(); // Save to get ProductId

                foreach (var variant in productDTO.ProductVariants)
                {
                    ProductVariant productVariant = new ProductVariant
                    {
                        ProductId = product.Id,
                        Color = variant.Color
                    };

                    _context.ProductVariants.Add(productVariant);
                    await _context.SaveChangesAsync(); // Save to get ProductVariantId

                    foreach (var size in variant.Sizes)
                    {
                        Size productSize = new Size
                        {
                            Name = size.Name,
                            ProductVariantId = productVariant.Id,
                            Quantity = size.Quantity
                        };
                        _context.Sizes.Add(productSize);
                    }

                    foreach (var image in variant.ProductImages)
                    {
                        ProductImage productImage = new ProductImage
                        {
                            ImageUrl = image.ImageUrl,
                            ProductVariantId = productVariant.Id
                        };
                        _context.ProductImages.Add(productImage);
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, new GeneralResponse
                {
                    Success = true,
                    Message = "Product created successfully.",
                    Data = null
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new GeneralResponse
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}",
                    Data = null
                });
            }
        }


        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound(new GeneralResponse
                {
                    Success = false,
                    Message = "Product not found.",
                    Data = null
                });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new GeneralResponse
            {
                Success = true,
                Message = "Product deleted successfully.",
                Data = null
            });
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}