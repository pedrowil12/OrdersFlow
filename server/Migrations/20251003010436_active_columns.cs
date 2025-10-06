using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OrdersFlow.Migrations
{
    /// <inheritdoc />
    public partial class active_columns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "active",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "active",
                table: "Orders",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "active",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "active",
                table: "Orders");
        }
    }
}
