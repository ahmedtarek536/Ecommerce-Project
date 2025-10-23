using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ecommerce_Server.Models;
using Ecommerce_Server.Models.Orders;
using Ecommerce_Server.Models.Products;

namespace Ecommerce_Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public AnalyticsController(EcommerceDbContext context)
        {
            _context = context;
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.UtcNow);
                var thirtyDaysAgo = today.AddDays(-30);

                // Get total sales
                var totalSales = await _context.Orders
                    .Where(o => o.Status == OrderStatus.Completed)
                    .SumAsync(o => o.TotalAmount);

                // Get total orders
                var totalOrders = await _context.Orders.CountAsync();

                // Get total customers
                var totalCustomers = await _context.Customers.CountAsync();

                // Calculate average order value
                var averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

                // Get sales by category
                var salesByCategory = await _context.OrderDetails
                    .Include(od => od.Product)
                        .ThenInclude(p => p.Category)
                    .Where(od => od.Order.Status == OrderStatus.Completed)
                    .GroupBy(od => od.Product.Category.Name)
                    .Select(g => new
                    {
                        Category = g.Key,
                        Total = g.Sum(od => od.Price * od.Quantity)
                    })
                    .ToListAsync();

                // Get recent orders with customer details
                var recentOrders = await _context.Orders
                    .Include(o => o.Customer)
                    .OrderByDescending(o => o.OrderDate)
                    .Take(10)
                    .Select(o => new
                    {
                        o.Id,
                        CustomerName = o.Customer.FirstName + " " + o.Customer.LastName,
                        o.TotalAmount,
                        Status = o.Status.ToString(),
                        Date = o.OrderDate
                    })
                    .ToListAsync();

                // Get sales over time (last 30 days)
                var salesOverTime = await _context.Orders
                    .Where(o => o.Status == OrderStatus.Completed && 
                           DateOnly.FromDateTime(o.OrderDate) >= thirtyDaysAgo)
                    .GroupBy(o => DateOnly.FromDateTime(o.OrderDate))
                    .Select(g => new
                    {
                        Date = g.Key.ToString("yyyy-MM-dd"),
                        Total = g.Sum(o => o.TotalAmount)
                    })
                    .OrderBy(x => x.Date)
                    .ToListAsync();

                // Get top selling products
                var topProducts = await _context.OrderDetails
                    .Include(od => od.Product)
                    .Include(od => od.ProductVariant)
                    .Where(od => od.Order.Status == OrderStatus.Completed)
                    .GroupBy(od => new { 
                        od.ProductId, 
                        od.Product.Name, 
                        od.ProductVariant.Color
                    })
                    .Select(g => new
                    {
                        ProductId = g.Key.ProductId,
                        Product = new { 
                            g.Key.Name, 
                            g.Key.Color
                        },
                        TotalSold = g.Sum(od => od.Quantity),
                        Revenue = g.Sum(od => od.Price * od.Quantity)
                    })
                    .OrderByDescending(x => x.TotalSold)
                    .Take(10)
                    .ToListAsync();

                var dashboardStats = new
                {
                    TotalSales = totalSales,
                    TotalOrders = totalOrders,
                    TotalCustomers = totalCustomers,
                    AverageOrderValue = averageOrderValue,
                    SalesByCategory = salesByCategory,
                    RecentOrders = recentOrders,
                    SalesOverTime = salesOverTime,
                    TopProducts = topProducts
                };

                return Ok(new { success = true, data = dashboardStats });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("sales-by-category")]
        public async Task<IActionResult> GetSalesByCategory()
        {
            try
            {
                var salesByCategory = await _context.OrderDetails
                    .Include(od => od.Product)
                        .ThenInclude(p => p.Category)
                    .Where(od => od.Order.Status == OrderStatus.Completed)
                    .GroupBy(od => od.Product.Category.Name)
                    .Select(g => new
                    {
                        Category = g.Key,
                        Total = g.Sum(od => od.Price * od.Quantity),
                        OrderCount = g.Select(od => od.OrderId).Distinct().Count()
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = salesByCategory });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("customer-growth")]
        public async Task<IActionResult> GetCustomerGrowth()
        {
            try
            {
                var thirtyDaysAgo = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(-30);

                var customerGrowth = await _context.Customers
                    .Where(c => c.CreatedAt >= thirtyDaysAgo)
                    .GroupBy(c => c.CreatedAt)
                    .Select(g => new
                    {
                        Date = g.Key.ToString("yyyy-MM-dd"),
                        NewCustomers = g.Count(),
                        ActiveCustomers = g.Select(c => c.Id).Distinct().Count()
                    })
                    .OrderBy(x => x.Date)
                    .ToListAsync();

                return Ok(new { success = true, data = customerGrowth });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("top-products")]
        public async Task<IActionResult> GetTopProducts()
        {
            try
            {
                var topProducts = await _context.OrderDetails
                    .Include(od => od.Product)
                    .Include(od => od.ProductVariant)
                    .Where(od => od.Order.Status == OrderStatus.Completed)
                    .GroupBy(od => new { 
                        od.ProductId, 
                        od.Product.Name, 
                        od.ProductVariant.Color
                    })
                    .Select(g => new
                    {
                        ProductId = g.Key.ProductId,
                        Product = new { 
                            g.Key.Name, 
                            g.Key.Color
                        },
                        TotalSold = g.Sum(od => od.Quantity),
                        Revenue = g.Sum(od => od.Price * od.Quantity),
                        AveragePrice = g.Average(od => od.Price)
                    })
                    .OrderByDescending(x => x.TotalSold)
                    .Take(10)
                    .ToListAsync();

                return Ok(new { success = true, data = topProducts });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
} 