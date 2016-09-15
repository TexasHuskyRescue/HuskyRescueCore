using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace HuskyRescueCore.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    PasswordHash = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    SecurityStamp = table.Column<string>(nullable: true),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SystemSetting",
                columns: table => new
                {
                    Id = table.Column<string>(maxLength: 200, nullable: false),
                    Value = table.Column<string>(maxLength: 4000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSetting", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AddressType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AddressType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationAdoptionStatusType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationAdoptionStatusType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationFosterStatusType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationFosterStatusType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationResidenceOwnershipType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationResidenceOwnershipType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationResidencePetDepositCoverageType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationResidencePetDepositCoverageType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationResidenceType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationResidenceType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationStudentType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationStudentType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EventRegistrationPersonType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventRegistrationPersonType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EventType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PhoneType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhoneType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "States",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false),
                    Code = table.Column<string>(maxLength: 200, nullable: false),
                    Text = table.Column<string>(maxLength: 400, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_States", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    RoleId = table.Column<string>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationAdoptionStatus",
                columns: table => new
                {
                    ApplicationAdoptionId = table.Column<Guid>(nullable: false),
                    Id = table.Column<int>(nullable: false),
                    ApplicationAdoptionStatusTypeId = table.Column<int>(nullable: false),
                    Timestamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationAdoptionStatus", x => new { x.ApplicationAdoptionId, x.Id });
                    table.ForeignKey(
                        name: "FK_ApplicationAdoptionStatus_ApplicationAdoptionStatusType_ApplicationAdoptionStatusTypeId",
                        column: x => x.ApplicationAdoptionStatusTypeId,
                        principalTable: "ApplicationAdoptionStatusType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicationAppAnimal",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    ApplicantId = table.Column<Guid>(nullable: false),
                    Age = table.Column<string>(maxLength: 50, nullable: true),
                    AlteredReason = table.Column<string>(maxLength: 500, nullable: true),
                    Breed = table.Column<string>(maxLength: 50, nullable: true),
                    FullyVaccinatedReason = table.Column<string>(maxLength: 500, nullable: true),
                    HwPreventionReason = table.Column<string>(maxLength: 500, nullable: true),
                    IsAltered = table.Column<bool>(nullable: false),
                    IsFullyVaccinated = table.Column<bool>(nullable: false),
                    IsHwPrevention = table.Column<bool>(nullable: false),
                    IsStillOwned = table.Column<bool>(nullable: false),
                    IsStillOwnedReason = table.Column<string>(maxLength: 500, nullable: true),
                    Name = table.Column<string>(maxLength: 50, nullable: false),
                    OwnershipLength = table.Column<string>(maxLength: 50, nullable: true),
                    Sex = table.Column<string>(maxLength: 6, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationAppAnimal", x => new { x.Id, x.ApplicantId });
                });

            migrationBuilder.CreateTable(
                name: "ApplicationFosterStatus",
                columns: table => new
                {
                    ApplicationFosterId = table.Column<Guid>(nullable: false),
                    Id = table.Column<int>(nullable: false),
                    ApplicationFosterStatusTypeId = table.Column<int>(nullable: false),
                    Timestamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationFosterStatus", x => new { x.ApplicationFosterId, x.Id });
                    table.ForeignKey(
                        name: "FK_ApplicationFosterStatus_ApplicationFosterStatusType_ApplicationFosterStatusTypeId",
                        column: x => x.ApplicationFosterStatusTypeId,
                        principalTable: "ApplicationFosterStatusType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Address",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Address1 = table.Column<string>(maxLength: 200, nullable: false),
                    Address2 = table.Column<string>(maxLength: 200, nullable: true),
                    Address3 = table.Column<string>(maxLength: 200, nullable: true),
                    AddressTypeId = table.Column<int>(nullable: false),
                    BusinessId = table.Column<Guid>(nullable: true),
                    City = table.Column<string>(maxLength: 200, nullable: true),
                    CountryId = table.Column<string>(nullable: true),
                    IsBillingAddress = table.Column<bool>(nullable: false),
                    IsShippingAddress = table.Column<bool>(nullable: false),
                    PersonId = table.Column<Guid>(nullable: true),
                    StatesId = table.Column<int>(nullable: false),
                    ZipCode = table.Column<string>(maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Address", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Address_AddressType_AddressTypeId",
                        column: x => x.AddressTypeId,
                        principalTable: "AddressType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Address_States_StatesId",
                        column: x => x.StatesId,
                        principalTable: "States",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Email",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Address = table.Column<string>(maxLength: 200, nullable: false),
                    BusinessId = table.Column<Guid>(nullable: true),
                    EmailTypeId = table.Column<int>(nullable: false),
                    PersonId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Email", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Email_EmailType_EmailTypeId",
                        column: x => x.EmailTypeId,
                        principalTable: "EmailType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Event",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    AreTicketsSold = table.Column<bool>(nullable: false),
                    BannerImagePath = table.Column<string>(maxLength: 2000, nullable: true),
                    BusinessId = table.Column<Guid>(nullable: false),
                    DateAdded = table.Column<DateTime>(nullable: false),
                    DateDeleted = table.Column<DateTime>(nullable: true),
                    DateOfEvent = table.Column<DateTime>(nullable: false),
                    DateUpdated = table.Column<DateTime>(nullable: true),
                    EndTime = table.Column<TimeSpan>(nullable: false),
                    EventTypeId = table.Column<int>(nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 200, nullable: false),
                    Notes = table.Column<string>(maxLength: 4000, nullable: true),
                    PublicDescription = table.Column<string>(maxLength: 4000, nullable: true),
                    StartTime = table.Column<TimeSpan>(nullable: false),
                    TicketPriceDiscount = table.Column<decimal>(type: "money", nullable: false),
                    TicketPriceFull = table.Column<decimal>(type: "money", nullable: false),
                    TypeOfEvent = table.Column<string>(nullable: false),
                    BanquetStartTime = table.Column<TimeSpan>(nullable: true),
                    CostBanquet = table.Column<decimal>(type: "money", nullable: true),
                    CostFoursome = table.Column<decimal>(type: "money", nullable: true),
                    CostSingle = table.Column<decimal>(type: "money", nullable: true),
                    GolfingStartTime = table.Column<TimeSpan>(nullable: true),
                    RegistrationStartTime = table.Column<TimeSpan>(nullable: true),
                    TournamentType = table.Column<string>(maxLength: 200, nullable: true),
                    WelcomeMessage = table.Column<string>(maxLength: 8000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Event", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Event_EventType_EventTypeId",
                        column: x => x.EventTypeId,
                        principalTable: "EventType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventGolfFeatures",
                columns: table => new
                {
                    EventGolfId = table.Column<Guid>(nullable: false),
                    Id = table.Column<int>(nullable: false),
                    Feature = table.Column<string>(maxLength: 4000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventGolfFeatures", x => new { x.EventGolfId, x.Id });
                    table.ForeignKey(
                        name: "FK_EventGolfFeatures_Event_EventGolfId",
                        column: x => x.EventGolfId,
                        principalTable: "Event",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventRegistration",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    AmountPaid = table.Column<decimal>(type: "money", nullable: false),
                    CommentsFromRegistrant = table.Column<string>(maxLength: 4000, nullable: true),
                    EventId = table.Column<Guid>(nullable: false),
                    HasPaid = table.Column<bool>(nullable: false),
                    InternalNotes = table.Column<string>(maxLength: 8000, nullable: true),
                    NumberTicketsBought = table.Column<int>(nullable: false),
                    SubmittedTimestamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventRegistration", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventRegistration_Event_EventId",
                        column: x => x.EventId,
                        principalTable: "Event",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EventRegistrationPerson",
                columns: table => new
                {
                    EventRegistrationId = table.Column<Guid>(nullable: false),
                    Id = table.Column<int>(nullable: false),
                    Address1 = table.Column<string>(maxLength: 200, nullable: false),
                    Address2 = table.Column<string>(maxLength: 200, nullable: true),
                    Address3 = table.Column<string>(maxLength: 200, nullable: true),
                    AmountPaid = table.Column<decimal>(type: "money", nullable: false),
                    City = table.Column<string>(maxLength: 200, nullable: true),
                    EmailAddress = table.Column<string>(maxLength: 200, nullable: false),
                    EventRegistrationPersonTypeId = table.Column<int>(nullable: false),
                    FirstName = table.Column<string>(maxLength: 100, nullable: false),
                    FullName = table.Column<string>(maxLength: 201, nullable: true),
                    IsPrimaryPerson = table.Column<bool>(nullable: false),
                    LastName = table.Column<string>(maxLength: 100, nullable: false),
                    PhoneNumber = table.Column<string>(maxLength: 20, nullable: false),
                    StatesId = table.Column<int>(nullable: false),
                    ZipCode = table.Column<string>(maxLength: 10, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventRegistrationPerson", x => new { x.EventRegistrationId, x.Id });
                    table.ForeignKey(
                        name: "FK_EventRegistrationPerson_EventRegistration_EventRegistrationId",
                        column: x => x.EventRegistrationId,
                        principalTable: "EventRegistration",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventRegistrationPerson_EventRegistrationPersonType_EventRegistrationPersonTypeId",
                        column: x => x.EventRegistrationPersonTypeId,
                        principalTable: "EventRegistrationPersonType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EventRegistrationPerson_States_StatesId",
                        column: x => x.StatesId,
                        principalTable: "States",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Person",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    BusinessId = table.Column<Guid>(nullable: true),
                    BusinessId1 = table.Column<Guid>(nullable: true),
                    CanEmail = table.Column<bool>(nullable: false),
                    CanSnailMail = table.Column<bool>(nullable: false),
                    CreatedTimestamp = table.Column<DateTime>(nullable: false),
                    DriverLicenseNumber = table.Column<string>(maxLength: 20, nullable: true),
                    FirstName = table.Column<string>(maxLength: 100, nullable: false),
                    FullName = table.Column<string>(maxLength: 201, nullable: true),
                    IsActive = table.Column<bool>(nullable: false),
                    IsAdopter = table.Column<bool>(nullable: false),
                    IsAvailableFoster = table.Column<bool>(nullable: false),
                    IsBoardMember = table.Column<bool>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    IsDoNotAdopt = table.Column<bool>(nullable: false),
                    IsDonor = table.Column<bool>(nullable: false),
                    IsFoster = table.Column<bool>(nullable: false),
                    IsSponsor = table.Column<bool>(nullable: false),
                    IsSystemUser = table.Column<bool>(nullable: false),
                    IsVolunteer = table.Column<bool>(nullable: false),
                    LastName = table.Column<string>(maxLength: 100, nullable: false),
                    Notes = table.Column<string>(maxLength: 4000, nullable: true),
                    UpdatedTimestamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Application",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    AppAddressCity = table.Column<string>(maxLength: 50, nullable: false),
                    AppAddressStateId = table.Column<int>(nullable: false),
                    AppAddressStreet1 = table.Column<string>(maxLength: 50, nullable: false),
                    AppAddressZIP = table.Column<string>(maxLength: 10, nullable: false),
                    AppCellPhone = table.Column<string>(maxLength: 20, nullable: true),
                    AppDateBirth = table.Column<DateTime>(type: "datetime2(0)", nullable: false),
                    AppEmail = table.Column<string>(maxLength: 200, nullable: false),
                    AppEmployer = table.Column<string>(maxLength: 100, nullable: true),
                    AppHomePhone = table.Column<string>(maxLength: 20, nullable: true),
                    AppNameFirst = table.Column<string>(maxLength: 100, nullable: false),
                    AppNameLast = table.Column<string>(maxLength: 100, nullable: false),
                    AppSpouseNameFirst = table.Column<string>(maxLength: 100, nullable: false),
                    AppSpouseNameLast = table.Column<string>(maxLength: 100, nullable: false),
                    AppTravelFrequency = table.Column<string>(maxLength: 100, nullable: true),
                    AppType = table.Column<string>(nullable: false),
                    ApplicationResidenceOwnershipTypeId = table.Column<int>(nullable: false),
                    ApplicationResidencePetDepositCoverageTypeId = table.Column<int>(nullable: true),
                    ApplicationResidenceTypeId = table.Column<int>(nullable: false),
                    ApplicationStudentTypeId = table.Column<int>(nullable: true),
                    Comments = table.Column<string>(nullable: true),
                    DateSubmitted = table.Column<DateTime>(type: "datetime2(0)", nullable: false),
                    FilterAppCatsOwnedCount = table.Column<string>(maxLength: 100, nullable: true),
                    FilterAppHasOwnedHuskyBefore = table.Column<bool>(nullable: false),
                    FilterAppIsAwareHuskyAttributes = table.Column<bool>(nullable: false),
                    FilterAppIsCatOwner = table.Column<bool>(nullable: false),
                    IsAppOrSpouseStudent = table.Column<bool>(nullable: false),
                    IsAppTravelFrequent = table.Column<bool>(nullable: false),
                    IsPetKeptLocationAloneRestrictionBasement = table.Column<bool>(nullable: false),
                    IsPetKeptLocationAloneRestrictionCratedIndoors = table.Column<bool>(nullable: false),
                    IsPetKeptLocationAloneRestrictionCratedOutdoors = table.Column<bool>(nullable: false),
                    IsPetKeptLocationAloneRestrictionGarage = table.Column<bool>(nullable: false),
                    IsPetKeptLocationAloneRestrictionLooseInBackyard = table.Column<bool>(nullable: false),
                    IsPetKeptLocationAloneRestrictionLooseIndoors = table.Column<bool>(nullable: false),
                    IsPetKeptLocationAloneRestrictionOther = table.Column<bool>(nullable: false),
                    IsPetKeptLocationAloneRestrictionOutsideKennel = table.Column<bool>(nullable: false),
                    IsPetKeptLocationAloneRestrictionTiedUpOutdoors = table.Column<bool>(nullable: false),
                    IsPetKeptLocationInOutDoorMostlyOutside = table.Column<bool>(nullable: false),
                    IsPetKeptLocationInOutDoorsMostlyInside = table.Column<bool>(nullable: false),
                    IsPetKeptLocationInOutDoorsTotallyInside = table.Column<bool>(nullable: false),
                    IsPetKeptLocationInOutDoorsTotallyOutside = table.Column<bool>(nullable: false),
                    IsPetKeptLocationSleepingRestrictionBasement = table.Column<bool>(nullable: false),
                    IsPetKeptLocationSleepingRestrictionCratedIndoors = table.Column<bool>(nullable: false),
                    IsPetKeptLocationSleepingRestrictionCratedOutdoors = table.Column<bool>(nullable: false),
                    IsPetKeptLocationSleepingRestrictionGarage = table.Column<bool>(nullable: false),
                    IsPetKeptLocationSleepingRestrictionInBedOwner = table.Column<bool>(nullable: false),
                    IsPetKeptLocationSleepingRestrictionLooseInBackyard = table.Column<bool>(nullable: false),
                    IsPetKeptLocationSleepingRestrictionLooseIndoors = table.Column<bool>(nullable: false),
                    IsPetKeptLocationSleepingRestrictionOther = table.Column<bool>(nullable: false),
                    IsPetKeptLocationSleepingRestrictionOutsideKennel = table.Column<bool>(nullable: false),
                    IsPetKeptLocationSleepingRestrictionTiedUpOutdoors = table.Column<bool>(nullable: false),
                    LengthPetLeftAloneDaysOfWeek = table.Column<string>(maxLength: 50, nullable: true),
                    LengthPetLeftAloneHoursInDay = table.Column<string>(maxLength: 50, nullable: true),
                    PersonId = table.Column<Guid>(nullable: false),
                    PetKeptLocationAloneRestriction = table.Column<string>(nullable: true),
                    PetKeptLocationAloneRestrictionExplain = table.Column<string>(maxLength: 4000, nullable: true),
                    PetKeptLocationInOutDoors = table.Column<string>(maxLength: 200, nullable: true),
                    PetKeptLocationInOutDoorsExplain = table.Column<string>(maxLength: 4000, nullable: true),
                    PetKeptLocationSleepingRestriction = table.Column<string>(nullable: true),
                    PetKeptLocationSleepingRestrictionExplain = table.Column<string>(maxLength: 4000, nullable: true),
                    PetLeftAloneDays = table.Column<string>(maxLength: 50, nullable: true),
                    PetLeftAloneHours = table.Column<string>(maxLength: 50, nullable: true),
                    ResIdenceIsYardFenced = table.Column<bool>(nullable: false),
                    ResidenceAgesOfChildren = table.Column<string>(maxLength: 200, nullable: true),
                    ResidenceFenceTypeHeight = table.Column<string>(maxLength: 50, nullable: true),
                    ResidenceIsPetAllowed = table.Column<bool>(nullable: true),
                    ResidenceIsPetDepositPaid = table.Column<bool>(nullable: true),
                    ResidenceIsPetDepositRequired = table.Column<bool>(nullable: true),
                    ResidenceLandlordName = table.Column<string>(maxLength: 100, nullable: true),
                    ResidenceLandlordNumber = table.Column<string>(maxLength: 20, nullable: true),
                    ResidenceLengthOfResidence = table.Column<string>(maxLength: 100, nullable: true),
                    ResidenceNumberOccupants = table.Column<string>(maxLength: 50, nullable: true),
                    ResidencePetDepositAmount = table.Column<decimal>(type: "money", nullable: true),
                    ResidencePetSizeWeightLimit = table.Column<bool>(nullable: true),
                    StateId = table.Column<int>(nullable: true),
                    VeterinarianDoctorName = table.Column<string>(maxLength: 100, nullable: true),
                    VeterinarianOfficeName = table.Column<string>(maxLength: 100, nullable: true),
                    VeterinarianPhoneNumber = table.Column<string>(maxLength: 20, nullable: true),
                    ApplicationFeeAmount = table.Column<decimal>(type: "money", nullable: true),
                    ApplicationFeePaymentMethod = table.Column<string>(maxLength: 50, nullable: true),
                    ApplicationFeeTransactionId = table.Column<string>(maxLength: 36, nullable: true),
                    FilterAppDogsInterestedIn = table.Column<string>(maxLength: 4000, nullable: true),
                    FilterAppTraitsDesired = table.Column<string>(maxLength: 4000, nullable: true),
                    IsAllAdultsAgreedOnAdoption = table.Column<bool>(nullable: true),
                    IsAllAdultsAgreedOnAdoptionReason = table.Column<string>(maxLength: 4000, nullable: true),
                    IsPetAdoptionReasonCompanionChild = table.Column<bool>(nullable: true),
                    IsPetAdoptionReasonCompanionPet = table.Column<bool>(nullable: true),
                    IsPetAdoptionReasonGift = table.Column<bool>(nullable: true),
                    IsPetAdoptionReasonGuardDog = table.Column<bool>(nullable: true),
                    IsPetAdoptionReasonHousePet = table.Column<bool>(nullable: true),
                    IsPetAdoptionReasonJoggingPartner = table.Column<bool>(nullable: true),
                    IsPetAdoptionReasonOther = table.Column<bool>(nullable: true),
                    IsPetAdoptionReasonWatchDog = table.Column<bool>(nullable: true),
                    PetAdoptionReasonExplain = table.Column<string>(maxLength: 4000, nullable: true),
                    WhatIfMovingPetPlacement = table.Column<string>(maxLength: 4000, nullable: true),
                    WhatIfTravelPetPlacement = table.Column<string>(maxLength: 4000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Application", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Application_ApplicationResidenceOwnershipType_ApplicationResidenceOwnershipTypeId",
                        column: x => x.ApplicationResidenceOwnershipTypeId,
                        principalTable: "ApplicationResidenceOwnershipType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Application_ApplicationResidencePetDepositCoverageType_ApplicationResidencePetDepositCoverageTypeId",
                        column: x => x.ApplicationResidencePetDepositCoverageTypeId,
                        principalTable: "ApplicationResidencePetDepositCoverageType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Application_ApplicationResidenceType_ApplicationResidenceTypeId",
                        column: x => x.ApplicationResidenceTypeId,
                        principalTable: "ApplicationResidenceType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Application_ApplicationStudentType_ApplicationStudentTypeId",
                        column: x => x.ApplicationStudentTypeId,
                        principalTable: "ApplicationStudentType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Application_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Application_States_StateId",
                        column: x => x.StateId,
                        principalTable: "States",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Business",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CanEmail = table.Column<bool>(nullable: false),
                    CanSnailMail = table.Column<bool>(nullable: false),
                    CreatedTimestamp = table.Column<DateTime>(nullable: false),
                    EIN = table.Column<string>(maxLength: 20, nullable: false),
                    IsActive = table.Column<bool>(nullable: false),
                    IsAnimalClinic = table.Column<bool>(nullable: false),
                    IsBoardingPlace = table.Column<bool>(nullable: false),
                    IsDeleted = table.Column<bool>(nullable: false),
                    IsDoNotUse = table.Column<bool>(nullable: false),
                    IsDonor = table.Column<bool>(nullable: false),
                    IsGrantGiver = table.Column<bool>(nullable: false),
                    IsSponsor = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(maxLength: 200, nullable: false),
                    Notes = table.Column<string>(maxLength: 4000, nullable: true),
                    PersonId = table.Column<Guid>(nullable: true),
                    PersonId1 = table.Column<Guid>(nullable: true),
                    UpdatedTimestamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Business", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Business_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Business_Person_PersonId1",
                        column: x => x.PersonId1,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Donation",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Amount = table.Column<decimal>(type: "money", nullable: false),
                    DateTimeOfDonation = table.Column<DateTime>(type: "datetime2(0)", nullable: false),
                    DonorNote = table.Column<string>(maxLength: 4000, nullable: true),
                    PaymentType = table.Column<string>(maxLength: 20, nullable: true),
                    PersonId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Donation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Donation_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Phone",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    BusinessId = table.Column<Guid>(nullable: true),
                    Number = table.Column<string>(maxLength: 20, nullable: false),
                    PersonId = table.Column<Guid>(nullable: true),
                    PhoneTypeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Phone", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Phone_Business_BusinessId",
                        column: x => x.BusinessId,
                        principalTable: "Business",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Phone_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Phone_PhoneType_PhoneTypeId",
                        column: x => x.PhoneTypeId,
                        principalTable: "PhoneType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Address_AddressTypeId",
                table: "Address",
                column: "AddressTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Address_BusinessId",
                table: "Address",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_Address_PersonId",
                table: "Address",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Address_StatesId",
                table: "Address",
                column: "StatesId");

            migrationBuilder.CreateIndex(
                name: "IX_Application_ApplicationResidenceOwnershipTypeId",
                table: "Application",
                column: "ApplicationResidenceOwnershipTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Application_ApplicationResidencePetDepositCoverageTypeId",
                table: "Application",
                column: "ApplicationResidencePetDepositCoverageTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Application_ApplicationResidenceTypeId",
                table: "Application",
                column: "ApplicationResidenceTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Application_ApplicationStudentTypeId",
                table: "Application",
                column: "ApplicationStudentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Application_PersonId",
                table: "Application",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Application_StateId",
                table: "Application",
                column: "StateId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationAdoptionStatus_ApplicationAdoptionId",
                table: "ApplicationAdoptionStatus",
                column: "ApplicationAdoptionId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationAdoptionStatus_ApplicationAdoptionStatusTypeId",
                table: "ApplicationAdoptionStatus",
                column: "ApplicationAdoptionStatusTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationAppAnimal_ApplicantId",
                table: "ApplicationAppAnimal",
                column: "ApplicantId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationFosterStatus_ApplicationFosterId",
                table: "ApplicationFosterStatus",
                column: "ApplicationFosterId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationFosterStatus_ApplicationFosterStatusTypeId",
                table: "ApplicationFosterStatus",
                column: "ApplicationFosterStatusTypeId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Business_IsActive",
                table: "Business",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Business_PersonId",
                table: "Business",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Business_PersonId1",
                table: "Business",
                column: "PersonId1");

            migrationBuilder.CreateIndex(
                name: "IX_Donation_PersonId",
                table: "Donation",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Email_BusinessId",
                table: "Email",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_Email_EmailTypeId",
                table: "Email",
                column: "EmailTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Email_PersonId",
                table: "Email",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Event_BusinessId",
                table: "Event",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_Event_EventTypeId",
                table: "Event",
                column: "EventTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_EventGolfFeatures_EventGolfId",
                table: "EventGolfFeatures",
                column: "EventGolfId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRegistration_EventId",
                table: "EventRegistration",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRegistrationPerson_EventRegistrationId",
                table: "EventRegistrationPerson",
                column: "EventRegistrationId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRegistrationPerson_EventRegistrationPersonTypeId",
                table: "EventRegistrationPerson",
                column: "EventRegistrationPersonTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRegistrationPerson_StatesId",
                table: "EventRegistrationPerson",
                column: "StatesId");

            migrationBuilder.CreateIndex(
                name: "IX_Person_BusinessId",
                table: "Person",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_Person_BusinessId1",
                table: "Person",
                column: "BusinessId1");

            migrationBuilder.CreateIndex(
                name: "IX_Phone_BusinessId",
                table: "Phone",
                column: "BusinessId");

            migrationBuilder.CreateIndex(
                name: "IX_Phone_PersonId",
                table: "Phone",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Phone_PhoneTypeId",
                table: "Phone",
                column: "PhoneTypeId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_UserId",
                table: "AspNetUserRoles",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationAdoptionStatus_Application_ApplicationAdoptionId",
                table: "ApplicationAdoptionStatus",
                column: "ApplicationAdoptionId",
                principalTable: "Application",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationAppAnimal_Application_ApplicantId",
                table: "ApplicationAppAnimal",
                column: "ApplicantId",
                principalTable: "Application",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationFosterStatus_Application_ApplicationFosterId",
                table: "ApplicationFosterStatus",
                column: "ApplicationFosterId",
                principalTable: "Application",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Address_Business_BusinessId",
                table: "Address",
                column: "BusinessId",
                principalTable: "Business",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Address_Person_PersonId",
                table: "Address",
                column: "PersonId",
                principalTable: "Person",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Email_Business_BusinessId",
                table: "Email",
                column: "BusinessId",
                principalTable: "Business",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Email_Person_PersonId",
                table: "Email",
                column: "PersonId",
                principalTable: "Person",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Event_Business_BusinessId",
                table: "Event",
                column: "BusinessId",
                principalTable: "Business",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Person_Business_BusinessId",
                table: "Person",
                column: "BusinessId",
                principalTable: "Business",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Person_Business_BusinessId1",
                table: "Person",
                column: "BusinessId1",
                principalTable: "Business",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Person_Business_BusinessId",
                table: "Person");

            migrationBuilder.DropForeignKey(
                name: "FK_Person_Business_BusinessId1",
                table: "Person");

            migrationBuilder.DropTable(
                name: "Address");

            migrationBuilder.DropTable(
                name: "ApplicationAdoptionStatus");

            migrationBuilder.DropTable(
                name: "ApplicationAppAnimal");

            migrationBuilder.DropTable(
                name: "ApplicationFosterStatus");

            migrationBuilder.DropTable(
                name: "Donation");

            migrationBuilder.DropTable(
                name: "Email");

            migrationBuilder.DropTable(
                name: "EventGolfFeatures");

            migrationBuilder.DropTable(
                name: "EventRegistrationPerson");

            migrationBuilder.DropTable(
                name: "Phone");

            migrationBuilder.DropTable(
                name: "SystemSetting");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "AddressType");

            migrationBuilder.DropTable(
                name: "ApplicationAdoptionStatusType");

            migrationBuilder.DropTable(
                name: "Application");

            migrationBuilder.DropTable(
                name: "ApplicationFosterStatusType");

            migrationBuilder.DropTable(
                name: "EmailType");

            migrationBuilder.DropTable(
                name: "EventRegistration");

            migrationBuilder.DropTable(
                name: "EventRegistrationPersonType");

            migrationBuilder.DropTable(
                name: "PhoneType");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "ApplicationResidenceOwnershipType");

            migrationBuilder.DropTable(
                name: "ApplicationResidencePetDepositCoverageType");

            migrationBuilder.DropTable(
                name: "ApplicationResidenceType");

            migrationBuilder.DropTable(
                name: "ApplicationStudentType");

            migrationBuilder.DropTable(
                name: "States");

            migrationBuilder.DropTable(
                name: "Event");

            migrationBuilder.DropTable(
                name: "EventType");

            migrationBuilder.DropTable(
                name: "Business");

            migrationBuilder.DropTable(
                name: "Person");
        }
    }
}
