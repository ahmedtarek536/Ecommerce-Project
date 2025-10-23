using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce_Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BagItems");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "Bags",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProductVariantId",
                table: "Bags",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "Bags",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SizeId",
                table: "Bags",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Bags_ProductId",
                table: "Bags",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Bags_ProductVariantId",
                table: "Bags",
                column: "ProductVariantId");

            migrationBuilder.CreateIndex(
                name: "IX_Bags_SizeId",
                table: "Bags",
                column: "SizeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bags_ProductVariants_ProductVariantId",
                table: "Bags",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_Bags_Products_ProductId",
                table: "Bags",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);

            migrationBuilder.AddForeignKey(
                name: "FK_Bags_Sizes_SizeId",
                table: "Bags",
                column: "SizeId",
                principalTable: "Sizes",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bags_ProductVariants_ProductVariantId",
                table: "Bags");

            migrationBuilder.DropForeignKey(
                name: "FK_Bags_Products_ProductId",
                table: "Bags");

            migrationBuilder.DropForeignKey(
                name: "FK_Bags_Sizes_SizeId",
                table: "Bags");

            migrationBuilder.DropIndex(
                name: "IX_Bags_ProductId",
                table: "Bags");

            migrationBuilder.DropIndex(
                name: "IX_Bags_ProductVariantId",
                table: "Bags");

            migrationBuilder.DropIndex(
                name: "IX_Bags_SizeId",
                table: "Bags");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "Bags");

            migrationBuilder.DropColumn(
                name: "ProductVariantId",
                table: "Bags");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "Bags");

            migrationBuilder.DropColumn(
                name: "SizeId",
                table: "Bags");

            migrationBuilder.CreateTable(
                name: "BagItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BagId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ProductVariantId = table.Column<int>(type: "int", nullable: false),
                    SizeId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BagItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BagItems_Bags_BagId",
                        column: x => x.BagId,
                        principalTable: "Bags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BagItems_ProductVariants_ProductVariantId",
                        column: x => x.ProductVariantId,
                        principalTable: "ProductVariants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BagItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BagItems_Sizes_SizeId",
                        column: x => x.SizeId,
                        principalTable: "Sizes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BagItems_BagId",
                table: "BagItems",
                column: "BagId");

            migrationBuilder.CreateIndex(
                name: "IX_BagItems_ProductId",
                table: "BagItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_BagItems_ProductVariantId",
                table: "BagItems",
                column: "ProductVariantId");

            migrationBuilder.CreateIndex(
                name: "IX_BagItems_SizeId",
                table: "BagItems",
                column: "SizeId");
        }
    }
}
