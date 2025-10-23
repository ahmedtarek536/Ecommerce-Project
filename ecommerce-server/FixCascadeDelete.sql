-- Drop existing foreign keys that cause cascade conflicts
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Products_ProductCategory_CategoryId')
BEGIN
    ALTER TABLE [Products] DROP CONSTRAINT [FK_Products_ProductCategory_CategoryId];
END

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Products_ProductSubCategories_SubCategoryId')
BEGIN
    ALTER TABLE [Products] DROP CONSTRAINT [FK_Products_ProductSubCategories_SubCategoryId];
END

IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_ProductSubCategories_ProductCategory_CategoryId')
BEGIN
    ALTER TABLE [ProductSubCategories] DROP CONSTRAINT [FK_ProductSubCategories_ProductCategory_CategoryId];
END

-- Recreate foreign keys with NO ACTION (Restrict)
ALTER TABLE [Products] 
ADD CONSTRAINT [FK_Products_ProductCategory_CategoryId] 
FOREIGN KEY ([CategoryId]) 
REFERENCES [ProductCategory] ([Id]) 
ON DELETE NO ACTION;

ALTER TABLE [Products] 
ADD CONSTRAINT [FK_Products_ProductSubCategories_SubCategoryId] 
FOREIGN KEY ([SubCategoryId]) 
REFERENCES [ProductSubCategories] ([Id]) 
ON DELETE NO ACTION;

ALTER TABLE [ProductSubCategories] 
ADD CONSTRAINT [FK_ProductSubCategories_ProductCategory_CategoryId] 
FOREIGN KEY ([CategoryId]) 
REFERENCES [ProductCategory] ([Id]) 
ON DELETE NO ACTION;

PRINT 'Foreign keys successfully updated with NO ACTION!';
