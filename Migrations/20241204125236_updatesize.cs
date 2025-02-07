using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce_Server.Migrations
{
    /// <inheritdoc />
    public partial class updatesize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Size",
                table: "ProductVariants");

            migrationBuilder.AddColumn<int>(
                name: "ProductVaraintId",
                table: "Sizes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProductVariantId",
                table: "Sizes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Sizes_ProductVariantId",
                table: "Sizes",
                column: "ProductVariantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sizes_ProductVariants_ProductVariantId",
                table: "Sizes",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sizes_ProductVariants_ProductVariantId",
                table: "Sizes");

            migrationBuilder.DropIndex(
                name: "IX_Sizes_ProductVariantId",
                table: "Sizes");

            migrationBuilder.DropColumn(
                name: "ProductVaraintId",
                table: "Sizes");

            migrationBuilder.DropColumn(
                name: "ProductVariantId",
                table: "Sizes");

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "ProductVariants",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
