using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce_Server.Migrations
{
    /// <inheritdoc />
    public partial class updateCustomerInBag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bags_Customers_CustomerId1",
                table: "Bags");

            migrationBuilder.DropIndex(
                name: "IX_Bags_CustomerId1",
                table: "Bags");

            migrationBuilder.DropColumn(
                name: "CustomerId1",
                table: "Bags");

            migrationBuilder.AlterColumn<int>(
                name: "CustomerId",
                table: "Bags",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Bags_CustomerId",
                table: "Bags",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bags_Customers_CustomerId",
                table: "Bags",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bags_Customers_CustomerId",
                table: "Bags");

            migrationBuilder.DropIndex(
                name: "IX_Bags_CustomerId",
                table: "Bags");

            migrationBuilder.AlterColumn<string>(
                name: "CustomerId",
                table: "Bags",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CustomerId1",
                table: "Bags",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Bags_CustomerId1",
                table: "Bags",
                column: "CustomerId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Bags_Customers_CustomerId1",
                table: "Bags",
                column: "CustomerId1",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
