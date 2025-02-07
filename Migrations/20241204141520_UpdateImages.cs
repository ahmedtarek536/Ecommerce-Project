using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce_Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductImages_Products_ProductId",
                table: "ProductImages");

            migrationBuilder.DropForeignKey(
                name: "FK_Sizes_ProductVariants_ProductVariantId",
                table: "Sizes");

            migrationBuilder.DropColumn(
                name: "ProductVaraintId",
                table: "Sizes");

            migrationBuilder.DropColumn(
                name: "Color",
                table: "ProductImages");

            migrationBuilder.DropColumn(
                name: "IsPrimary",
                table: "ProductImages");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "ProductImages",
                newName: "ProductVariantId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductImages_ProductId",
                table: "ProductImages",
                newName: "IX_ProductImages_ProductVariantId");

            migrationBuilder.AlterColumn<int>(
                name: "ProductVariantId",
                table: "Sizes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductImages_ProductVariants_ProductVariantId",
                table: "ProductImages",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sizes_ProductVariants_ProductVariantId",
                table: "Sizes",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductImages_ProductVariants_ProductVariantId",
                table: "ProductImages");

            migrationBuilder.DropForeignKey(
                name: "FK_Sizes_ProductVariants_ProductVariantId",
                table: "Sizes");

            migrationBuilder.RenameColumn(
                name: "ProductVariantId",
                table: "ProductImages",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_ProductImages_ProductVariantId",
                table: "ProductImages",
                newName: "IX_ProductImages_ProductId");

            migrationBuilder.AlterColumn<int>(
                name: "ProductVariantId",
                table: "Sizes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "ProductVaraintId",
                table: "Sizes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Color",
                table: "ProductImages",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsPrimary",
                table: "ProductImages",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductImages_Products_ProductId",
                table: "ProductImages",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Sizes_ProductVariants_ProductVariantId",
                table: "Sizes",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id");
        }
    }
}
