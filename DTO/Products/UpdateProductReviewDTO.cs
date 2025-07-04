﻿using System.ComponentModel.DataAnnotations;

namespace Ecommerce_Server.DTO.Products
{
    public class  UpdateProductReviewDTO
    {
        public int? ProductId { get; set; }

        public int? CustomerId { get; set; }


        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int? Rating { get; set; }

        [StringLength(1000, ErrorMessage = "Review cannot exceed 1000 characters.")]
        public string? Review { get; set; }
    }
}
