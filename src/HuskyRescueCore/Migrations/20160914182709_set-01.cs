using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace HuskyRescueCore.Migrations
{
    public partial class set01 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LengthPetLeftAloneDaysOfWeek",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "LengthPetLeftAloneHoursInDay",
                table: "Application");

            migrationBuilder.AlterColumn<string>(
                name: "AppSpouseNameLast",
                table: "Application",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AppSpouseNameFirst",
                table: "Application",
                maxLength: 100,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LengthPetLeftAloneDaysOfWeek",
                table: "Application",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LengthPetLeftAloneHoursInDay",
                table: "Application",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "AppSpouseNameLast",
                table: "Application",
                maxLength: 100,
                nullable: false);

            migrationBuilder.AlterColumn<string>(
                name: "AppSpouseNameFirst",
                table: "Application",
                maxLength: 100,
                nullable: false);
        }
    }
}
