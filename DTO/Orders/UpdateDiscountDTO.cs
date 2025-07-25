﻿using Ecommerce_Server.Models;
using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO
{
    public class UpdateDiscountDTO
    {
        
        [StringLength(50, ErrorMessage = "Code cannot exceed 50 characters.")]
        public string? Code { get; set; }

        public string? Description { get; set; }

       
        public DiscountType DiscountType { get; set; }

       
        [Range(0, double.MaxValue, ErrorMessage = "Discount value must be non-negative.")]
        public decimal? DiscountValue { get; set; }

       
        public DateTime? StartDate { get; set; }

       
        public DateTime? EndDate { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Minimum order amount must be non-negative.")]
        public decimal? MinOrderAmount { get; set; } 
    }
}
