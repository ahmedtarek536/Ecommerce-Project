-- Sample Data for E-commerce Database

-- Insert Product Categories
SET IDENTITY_INSERT [ProductCategory] ON;
INSERT INTO [ProductCategory] (Id, Name) VALUES
(1, 'Clothing'),
(2, 'Electronics'),
(3, 'Shoes'),
(4, 'Accessories'),
(5, 'Sports');
SET IDENTITY_INSERT [ProductCategory] OFF;

-- Insert Product SubCategories
SET IDENTITY_INSERT [ProductSubCategories] ON;
INSERT INTO [ProductSubCategories] (Id, Name, CategoryId) VALUES
(1, 'T-Shirts', 1),
(2, 'Jeans', 1),
(3, 'Dresses', 1),
(4, 'Smartphones', 2),
(5, 'Laptops', 2),
(6, 'Sneakers', 3),
(7, 'Boots', 3),
(8, 'Watches', 4),
(9, 'Bags', 4),
(10, 'Gym Equipment', 5);
SET IDENTITY_INSERT [ProductSubCategories] OFF;

-- Insert Collections
SET IDENTITY_INSERT [Collections] ON;
INSERT INTO [Collections] (Id, Name, Description, ImageUrl, IsActive, CreatedAt) VALUES
(1, 'Summer Collection', 'Hot summer styles', 'https://example.com/summer.jpg', 1, GETUTCDATE()),
(2, 'Winter Collection', 'Warm winter essentials', 'https://example.com/winter.jpg', 1, GETUTCDATE()),
(3, 'Tech Deals', 'Latest technology products', 'https://example.com/tech.jpg', 1, GETUTCDATE()),
(4, 'Sports & Fitness', 'Get fit with our collection', 'https://example.com/sports.jpg', 1, GETUTCDATE());
SET IDENTITY_INSERT [Collections] OFF;

-- Insert Products
SET IDENTITY_INSERT [Products] ON;
INSERT INTO [Products] (Id, Name, Description, Price, CategoryId, SubCategoryId, CreatedAt) VALUES
(1, 'Classic Cotton T-Shirt', 'Comfortable cotton t-shirt for everyday wear', 19.99, 1, 1, CAST(GETDATE() AS DATE)),
(2, 'Slim Fit Jeans', 'Modern slim fit denim jeans', 49.99, 1, 2, CAST(GETDATE() AS DATE)),
(3, 'Summer Floral Dress', 'Light and breezy floral pattern dress', 39.99, 1, 3, CAST(GETDATE() AS DATE)),
(4, 'Smartphone Pro Max', 'Latest flagship smartphone with advanced features', 999.99, 2, 4, CAST(GETDATE() AS DATE)),
(5, 'Gaming Laptop Ultra', 'High-performance gaming laptop', 1499.99, 2, 5, CAST(GETDATE() AS DATE)),
(6, 'Running Sneakers', 'Lightweight running shoes', 79.99, 3, 6, CAST(GETDATE() AS DATE)),
(7, 'Leather Boots', 'Premium leather winter boots', 129.99, 3, 7, CAST(GETDATE() AS DATE)),
(8, 'Smart Watch Pro', 'Fitness tracking smartwatch', 299.99, 4, 8, CAST(GETDATE() AS DATE)),
(9, 'Designer Backpack', 'Stylish and functional backpack', 89.99, 4, 9, CAST(GETDATE() AS DATE)),
(10, 'Yoga Mat Premium', 'Non-slip premium yoga mat', 34.99, 5, 10, CAST(GETDATE() AS DATE));
SET IDENTITY_INSERT [Products] OFF;

-- Insert Product Variants (Colors)
SET IDENTITY_INSERT [ProductVariants] ON;
INSERT INTO [ProductVariants] (Id, ProductId, Color) VALUES
-- T-Shirt variants
(1, 1, 'White'),
(2, 1, 'Black'),
(3, 1, 'Navy Blue'),
-- Jeans variants
(4, 2, 'Dark Blue'),
(5, 2, 'Light Blue'),
-- Dress variants
(6, 3, 'Pink'),
(7, 3, 'Yellow'),
-- Smartphone variants
(8, 4, 'Space Gray'),
(9, 4, 'Silver'),
-- Laptop variants
(10, 5, 'Black'),
-- Sneakers variants
(11, 6, 'White'),
(12, 6, 'Red'),
-- Boots variants
(13, 7, 'Brown'),
(14, 7, 'Black'),
-- Watch variants
(15, 8, 'Black'),
(16, 8, 'Silver'),
-- Backpack variants
(17, 9, 'Black'),
(18, 9, 'Gray'),
-- Yoga Mat variants
(19, 10, 'Purple'),
(20, 10, 'Green');
SET IDENTITY_INSERT [ProductVariants] OFF;

-- Insert Sizes with Quantities
SET IDENTITY_INSERT [Sizes] ON;
INSERT INTO [Sizes] (Id, Name, ProductVariantId, Quantity) VALUES
-- T-Shirt sizes
(1, 'S', 1, 50), (2, 'M', 1, 75), (3, 'L', 1, 60), (4, 'XL', 1, 40),
(5, 'S', 2, 45), (6, 'M', 2, 80), (7, 'L', 2, 55), (8, 'XL', 2, 35),
(9, 'S', 3, 40), (10, 'M', 3, 70), (11, 'L', 3, 50), (12, 'XL', 3, 30),
-- Jeans sizes
(13, '28', 4, 30), (14, '30', 4, 45), (15, '32', 4, 50), (16, '34', 4, 40),
(17, '28', 5, 35), (18, '30', 5, 40), (19, '32', 5, 45), (20, '34', 5, 35),
-- Dress sizes
(21, 'S', 6, 25), (22, 'M', 6, 35), (23, 'L', 6, 30),
(24, 'S', 7, 20), (25, 'M', 7, 30), (26, 'L', 7, 25),
-- Smartphone (One Size)
(27, '128GB', 8, 100), (28, '256GB', 8, 75),
(29, '128GB', 9, 90), (30, '256GB', 9, 80),
-- Laptop (One Size)
(31, '16GB RAM', 10, 50),
-- Sneakers sizes
(32, '8', 11, 40), (33, '9', 11, 50), (34, '10', 11, 45), (35, '11', 11, 35),
(36, '8', 12, 35), (37, '9', 12, 45), (38, '10', 12, 40), (39, '11', 12, 30),
-- Boots sizes
(40, '8', 13, 30), (41, '9', 13, 40), (42, '10', 13, 35), (43, '11', 13, 25),
(44, '8', 14, 25), (45, '9', 14, 35), (46, '10', 14, 30), (47, '11', 14, 20),
-- Watch (One Size)
(48, 'Standard', 15, 60),
(49, 'Standard', 16, 55),
-- Backpack (One Size)
(50, 'Standard', 17, 70),
(51, 'Standard', 18, 65),
-- Yoga Mat (One Size)
(52, 'Standard', 19, 100),
(53, 'Standard', 20, 95);
SET IDENTITY_INSERT [Sizes] OFF;

-- Insert Product Images
SET IDENTITY_INSERT [ProductImages] ON;
INSERT INTO [ProductImages] (Id, ImageUrl, ProductVariantId) VALUES
-- T-Shirt images
(1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 1),
(2, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a', 2),
(3, 'https://images.unsplash.com/photo-1622445275576-721325763afe', 3),
-- Jeans images
(4, 'https://images.unsplash.com/photo-1542272604-787c3835535d', 4),
(5, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246', 5),
-- Dress images
(6, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', 6),
(7, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1', 7),
-- Smartphone images
(8, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 8),
(9, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5', 9),
-- Laptop images
(10, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 10),
-- Sneakers images
(11, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 11),
(12, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77', 12),
-- Boots images
(13, 'https://images.unsplash.com/photo-1605812860427-4024433a70fd', 13),
(14, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f', 14),
-- Watch images
(15, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 15),
(16, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d', 16),
-- Backpack images
(17, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', 17),
(18, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3', 18),
-- Yoga Mat images
(19, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f', 19),
(20, 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2', 20);
SET IDENTITY_INSERT [ProductImages] OFF;

-- Insert Customers
SET IDENTITY_INSERT [Customers] ON;
INSERT INTO [Customers] (Id, FirstName, LastName, Email, Password, Role, PhoneNumber, Address, CreatedAt, UpdateAt) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', 'password123', 'User', '555-0101', '123 Main St, New York, NY 10001', CAST(GETDATE() AS DATE), CAST(GETDATE() AS DATE)),
(2, 'Jane', 'Smith', 'jane.smith@example.com', 'password123', 'User', '555-0102', '456 Oak Ave, Los Angeles, CA 90001', CAST(GETDATE() AS DATE), CAST(GETDATE() AS DATE)),
(3, 'Admin', 'User', 'admin@example.com', 'admin123', 'Admin', '555-0100', '789 Admin Blvd, Chicago, IL 60601', CAST(GETDATE() AS DATE), CAST(GETDATE() AS DATE)),
(4, 'Alice', 'Johnson', 'alice.j@example.com', 'password123', 'User', '555-0103', '321 Elm St, Houston, TX 77001', CAST(GETDATE() AS DATE), CAST(GETDATE() AS DATE)),
(5, 'Bob', 'Williams', 'bob.w@example.com', 'password123', 'User', '555-0104', '654 Pine Rd, Phoenix, AZ 85001', CAST(GETDATE() AS DATE), CAST(GETDATE() AS DATE));
SET IDENTITY_INSERT [Customers] OFF;

-- Insert Orders
SET IDENTITY_INSERT [Orders] ON;
INSERT INTO [Orders] (Id, CustomerId, OrderDate, Status, TotalAmount, PaymentMethod, ShippingAddress, CreatedAt, UpdatedAt) VALUES
(1, 1, GETDATE(), 2, 149.97, 0, '123 Main St, New York, NY 10001', GETDATE(), GETDATE()),
(2, 2, GETDATE(), 1, 999.99, 1, '456 Oak Ave, Los Angeles, CA 90001', GETDATE(), GETDATE()),
(3, 4, GETDATE(), 0, 89.98, 2, '321 Elm St, Houston, TX 77001', GETDATE(), GETDATE());
SET IDENTITY_INSERT [Orders] OFF;

-- Insert Order Details
SET IDENTITY_INSERT [OrderDetails] ON;
INSERT INTO [OrderDetails] (Id, OrderId, ProductId, ProductVariantId, Quantity, Price, UnitPrice) VALUES
(1, 1, 1, 1, 2, 39.98, 19.99),
(2, 1, 6, 11, 1, 79.99, 79.99),
(3, 1, 10, 19, 1, 34.99, 34.99),
(4, 2, 4, 8, 1, 999.99, 999.99),
(5, 3, 9, 17, 1, 89.99, 89.99);
SET IDENTITY_INSERT [OrderDetails] OFF;

-- Insert Product Reviews
SET IDENTITY_INSERT [ProductReviews] ON;
INSERT INTO [ProductReviews] (Id, ProductId, CustomerId, Rating, Review, ReviewDate) VALUES
(1, 1, 1, 5, 'Great quality t-shirt! Very comfortable and fits perfectly.', GETDATE()),
(2, 6, 1, 4, 'Good running shoes, but took a while to break in.', GETDATE()),
(3, 4, 2, 5, 'Amazing smartphone! Best purchase this year.', GETDATE()),
(4, 9, 4, 4, 'Nice backpack with plenty of storage space.', GETDATE()),
(5, 10, 1, 5, 'Perfect yoga mat, great grip and cushioning.', GETDATE());
SET IDENTITY_INSERT [ProductReviews] OFF;

-- Link Products to Collections
INSERT INTO [CollectionProduct] (CollectionsId, ProductsId) VALUES
(1, 1), (1, 3), (1, 6),  -- Summer Collection
(2, 2), (2, 7),          -- Winter Collection
(3, 4), (3, 5), (3, 8),  -- Tech Deals
(4, 6), (4, 10);         -- Sports & Fitness

-- Insert Wishlists
SET IDENTITY_INSERT [Wishlists] ON;
INSERT INTO [Wishlists] (Id, CustomerId, ProductId, ProductVariantId) VALUES
(1, 1, 5, 10),  -- John likes Gaming Laptop
(2, 1, 8, 15),  -- John likes Smart Watch
(3, 2, 3, 6),   -- Jane likes Summer Dress
(4, 4, 7, 13),  -- Alice likes Leather Boots
(5, 5, 4, 8);   -- Bob likes Smartphone
SET IDENTITY_INSERT [Wishlists] OFF;

-- Insert Shopping Bags
SET IDENTITY_INSERT [Bags] ON;
INSERT INTO [Bags] (Id, CustomerId, ProductId, ProductVariantId, SizeId, Quantity, CreatedAt, UpdatedAt) VALUES
(1, 2, 2, 4, 15, 1, GETUTCDATE(), GETUTCDATE()),
(2, 4, 1, 2, 6, 2, GETUTCDATE(), GETUTCDATE()),
(3, 5, 6, 12, 37, 1, GETUTCDATE(), GETUTCDATE());
SET IDENTITY_INSERT [Bags] OFF;

PRINT 'Sample data inserted successfully!';
PRINT '-----------------------------------';
PRINT 'Categories: 5';
PRINT 'SubCategories: 10';
PRINT 'Products: 10';
PRINT 'Product Variants: 20';
PRINT 'Sizes: 53';
PRINT 'Images: 20';
PRINT 'Customers: 5';
PRINT 'Orders: 3';
PRINT 'Reviews: 5';
PRINT 'Collections: 4';
PRINT '-----------------------------------';
