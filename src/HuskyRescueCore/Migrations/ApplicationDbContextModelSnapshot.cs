using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using HuskyRescueCore.Data;

namespace HuskyRescueCore.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.0.1")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("HuskyRescueCore.Models.Address", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address1")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Address2")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Address3")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<int>("AddressTypeId");

                    b.Property<Guid?>("BusinessId");

                    b.Property<string>("City")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("CountryId");

                    b.Property<bool>("IsBillingAddress");

                    b.Property<bool>("IsShippingAddress");

                    b.Property<Guid?>("PersonId");

                    b.Property<int>("StatesId");

                    b.Property<string>("ZipCode")
                        .HasAnnotation("MaxLength", 10);

                    b.HasKey("Id");

                    b.HasIndex("AddressTypeId");

                    b.HasIndex("BusinessId");

                    b.HasIndex("PersonId");

                    b.HasIndex("StatesId");

                    b.ToTable("Address");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Application", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AppAddressCity")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<int>("AppAddressStateId");

                    b.Property<string>("AppAddressStreet1")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("AppAddressZIP")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 10);

                    b.Property<string>("AppCellPhone")
                        .HasAnnotation("MaxLength", 20);

                    b.Property<DateTime?>("AppDateBirth")
                        .IsRequired()
                        .HasColumnType("datetime2(0)");

                    b.Property<string>("AppEmail")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("AppEmployer")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("AppHomePhone")
                        .HasAnnotation("MaxLength", 20);

                    b.Property<string>("AppNameFirst")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("AppNameLast")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("AppSpouseNameFirst")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("AppSpouseNameLast")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("AppTravelFrequency")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("AppType")
                        .IsRequired();

                    b.Property<int>("ApplicationResidenceOwnershipTypeId");

                    b.Property<int?>("ApplicationResidencePetDepositCoverageTypeId");

                    b.Property<int>("ApplicationResidenceTypeId");

                    b.Property<int?>("ApplicationStudentTypeId");

                    b.Property<string>("Comments");

                    b.Property<DateTime>("DateSubmitted")
                        .HasColumnType("datetime2(0)");

                    b.Property<string>("FilterAppCatsOwnedCount")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<bool>("FilterAppHasOwnedHuskyBefore");

                    b.Property<bool>("FilterAppIsAwareHuskyAttributes");

                    b.Property<bool>("FilterAppIsCatOwner");

                    b.Property<bool?>("IsAppOrSpouseStudent")
                        .IsRequired();

                    b.Property<bool>("IsAppTravelFrequent");

                    b.Property<bool>("IsPetKeptLocationAloneRestrictionBasement");

                    b.Property<bool>("IsPetKeptLocationAloneRestrictionCratedIndoors");

                    b.Property<bool>("IsPetKeptLocationAloneRestrictionCratedOutdoors");

                    b.Property<bool>("IsPetKeptLocationAloneRestrictionGarage");

                    b.Property<bool>("IsPetKeptLocationAloneRestrictionLooseInBackyard");

                    b.Property<bool>("IsPetKeptLocationAloneRestrictionLooseIndoors");

                    b.Property<bool>("IsPetKeptLocationAloneRestrictionOther");

                    b.Property<bool>("IsPetKeptLocationAloneRestrictionOutsideKennel");

                    b.Property<bool>("IsPetKeptLocationAloneRestrictionTiedUpOutdoors");

                    b.Property<bool>("IsPetKeptLocationInOutDoorMostlyOutside");

                    b.Property<bool>("IsPetKeptLocationInOutDoorsMostlyInside");

                    b.Property<bool>("IsPetKeptLocationInOutDoorsTotallyInside");

                    b.Property<bool>("IsPetKeptLocationInOutDoorsTotallyOutside");

                    b.Property<bool>("IsPetKeptLocationSleepingRestrictionBasement");

                    b.Property<bool>("IsPetKeptLocationSleepingRestrictionCratedIndoors");

                    b.Property<bool>("IsPetKeptLocationSleepingRestrictionCratedOutdoors");

                    b.Property<bool>("IsPetKeptLocationSleepingRestrictionGarage");

                    b.Property<bool>("IsPetKeptLocationSleepingRestrictionInBedOwner");

                    b.Property<bool>("IsPetKeptLocationSleepingRestrictionLooseInBackyard");

                    b.Property<bool>("IsPetKeptLocationSleepingRestrictionLooseIndoors");

                    b.Property<bool>("IsPetKeptLocationSleepingRestrictionOther");

                    b.Property<bool>("IsPetKeptLocationSleepingRestrictionOutsideKennel");

                    b.Property<bool>("IsPetKeptLocationSleepingRestrictionTiedUpOutdoors");

                    b.Property<Guid>("PersonId");

                    b.Property<string>("PetKeptLocationAloneRestriction");

                    b.Property<string>("PetKeptLocationAloneRestrictionExplain")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<string>("PetKeptLocationInOutDoors")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("PetKeptLocationInOutDoorsExplain")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<string>("PetKeptLocationSleepingRestriction");

                    b.Property<string>("PetKeptLocationSleepingRestrictionExplain")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<string>("PetLeftAloneDays")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("PetLeftAloneHours")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<bool>("ResIdenceIsYardFenced");

                    b.Property<string>("ResidenceAgesOfChildren")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("ResidenceFenceTypeHeight")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<bool?>("ResidenceIsPetAllowed");

                    b.Property<bool?>("ResidenceIsPetDepositPaid");

                    b.Property<bool?>("ResidenceIsPetDepositRequired");

                    b.Property<string>("ResidenceLandlordName")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("ResidenceLandlordNumber")
                        .HasAnnotation("MaxLength", 20);

                    b.Property<string>("ResidenceLengthOfResidence")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("ResidenceNumberOccupants")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<decimal?>("ResidencePetDepositAmount")
                        .HasColumnType("money");

                    b.Property<bool?>("ResidencePetSizeWeightLimit");

                    b.Property<int?>("StateId");

                    b.Property<string>("VeterinarianDoctorName")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("VeterinarianOfficeName")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("VeterinarianPhoneNumber")
                        .HasAnnotation("MaxLength", 20);

                    b.HasKey("Id");

                    b.HasIndex("ApplicationResidenceOwnershipTypeId");

                    b.HasIndex("ApplicationResidencePetDepositCoverageTypeId");

                    b.HasIndex("ApplicationResidenceTypeId");

                    b.HasIndex("ApplicationStudentTypeId");

                    b.HasIndex("PersonId");

                    b.HasIndex("StateId");

                    b.ToTable("Application");

                    b.HasDiscriminator<string>("AppType").HasValue("Application");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.ApplicationAdoptionStatus", b =>
                {
                    b.Property<Guid>("ApplicationAdoptionId");

                    b.Property<int>("Id");

                    b.Property<int>("ApplicationAdoptionStatusTypeId");

                    b.Property<DateTime>("Timestamp");

                    b.HasKey("ApplicationAdoptionId", "Id");

                    b.HasIndex("ApplicationAdoptionId");

                    b.HasIndex("ApplicationAdoptionStatusTypeId");

                    b.ToTable("ApplicationAdoptionStatus");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.ApplicationAppAnimal", b =>
                {
                    b.Property<Guid>("Id");

                    b.Property<Guid>("ApplicantId");

                    b.Property<string>("Age")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("AlteredReason")
                        .HasAnnotation("MaxLength", 500);

                    b.Property<string>("Breed")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("FullyVaccinatedReason")
                        .HasAnnotation("MaxLength", 500);

                    b.Property<string>("HwPreventionReason")
                        .HasAnnotation("MaxLength", 500);

                    b.Property<bool>("IsAltered");

                    b.Property<bool>("IsFullyVaccinated");

                    b.Property<bool>("IsHwPrevention");

                    b.Property<bool>("IsStillOwned");

                    b.Property<string>("IsStillOwnedReason")
                        .HasAnnotation("MaxLength", 500);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("OwnershipLength")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("Sex")
                        .HasAnnotation("MaxLength", 6);

                    b.HasKey("Id", "ApplicantId");

                    b.HasIndex("ApplicantId");

                    b.ToTable("ApplicationAppAnimal");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.ApplicationFosterStatus", b =>
                {
                    b.Property<Guid>("ApplicationFosterId");

                    b.Property<int>("Id");

                    b.Property<int>("ApplicationFosterStatusTypeId");

                    b.Property<DateTime>("Timestamp");

                    b.HasKey("ApplicationFosterId", "Id");

                    b.HasIndex("ApplicationFosterId");

                    b.HasIndex("ApplicationFosterStatusTypeId");

                    b.ToTable("ApplicationFosterStatus");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.ApplicationUser", b =>
                {
                    b.Property<string>("Id");

                    b.Property<int>("AccessFailedCount");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Email")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<bool>("EmailConfirmed");

                    b.Property<bool>("LockoutEnabled");

                    b.Property<DateTimeOffset?>("LockoutEnd");

                    b.Property<string>("NormalizedEmail")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("NormalizedUserName")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("PasswordHash");

                    b.Property<string>("PhoneNumber");

                    b.Property<bool>("PhoneNumberConfirmed");

                    b.Property<string>("SecurityStamp");

                    b.Property<bool>("TwoFactorEnabled");

                    b.Property<string>("UserName")
                        .HasAnnotation("MaxLength", 256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedEmail")
                        .HasName("EmailIndex");

                    b.HasIndex("NormalizedUserName")
                        .IsUnique()
                        .HasName("UserNameIndex");

                    b.ToTable("AspNetUsers");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Business", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("CanEmail");

                    b.Property<bool>("CanSnailMail");

                    b.Property<DateTime>("CreatedTimestamp");

                    b.Property<string>("EIN")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 20);

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsAnimalClinic");

                    b.Property<bool>("IsBoardingPlace");

                    b.Property<bool>("IsDeleted");

                    b.Property<bool>("IsDoNotUse");

                    b.Property<bool>("IsDonor");

                    b.Property<bool>("IsGrantGiver");

                    b.Property<bool>("IsSponsor");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Notes")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<Guid?>("PersonId");

                    b.Property<Guid?>("PersonId1");

                    b.Property<DateTime>("UpdatedTimestamp");

                    b.HasKey("Id");

                    b.HasIndex("IsActive");

                    b.HasIndex("PersonId");

                    b.HasIndex("PersonId1");

                    b.ToTable("Business");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Donation", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<decimal>("Amount")
                        .HasColumnType("money");

                    b.Property<DateTime>("DateTimeOfDonation")
                        .HasColumnType("datetime2(0)");

                    b.Property<string>("DonorNote")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<string>("PaymentType")
                        .HasAnnotation("MaxLength", 20);

                    b.Property<Guid>("PersonId");

                    b.HasKey("Id");

                    b.HasIndex("PersonId");

                    b.ToTable("Donation");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Email", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<Guid?>("BusinessId");

                    b.Property<int>("EmailTypeId");

                    b.Property<Guid?>("PersonId");

                    b.HasKey("Id");

                    b.HasIndex("BusinessId");

                    b.HasIndex("EmailTypeId");

                    b.HasIndex("PersonId");

                    b.ToTable("Email");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Event", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("AreTicketsSold");

                    b.Property<string>("BannerImagePath")
                        .HasAnnotation("MaxLength", 2000);

                    b.Property<Guid>("BusinessId");

                    b.Property<DateTime>("DateAdded");

                    b.Property<DateTime?>("DateDeleted");

                    b.Property<DateTime>("DateOfEvent");

                    b.Property<DateTime?>("DateUpdated");

                    b.Property<TimeSpan>("EndTime");

                    b.Property<int>("EventTypeId");

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsDeleted");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Notes")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<string>("PublicDescription")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<TimeSpan>("StartTime");

                    b.Property<decimal>("TicketPriceDiscount")
                        .HasColumnType("money");

                    b.Property<decimal>("TicketPriceFull")
                        .HasColumnType("money");

                    b.Property<string>("TypeOfEvent")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("BusinessId");

                    b.HasIndex("EventTypeId");

                    b.ToTable("Event");

                    b.HasDiscriminator<string>("TypeOfEvent").HasValue("general");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.EventGolfFeatures", b =>
                {
                    b.Property<Guid>("EventGolfId");

                    b.Property<int>("Id");

                    b.Property<string>("Feature")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 4000);

                    b.HasKey("EventGolfId", "Id");

                    b.HasIndex("EventGolfId");

                    b.ToTable("EventGolfFeatures");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.EventRegistration", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<decimal>("AmountPaid")
                        .HasColumnType("money");

                    b.Property<string>("CommentsFromRegistrant")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<Guid>("EventId");

                    b.Property<bool>("HasPaid");

                    b.Property<string>("InternalNotes")
                        .HasAnnotation("MaxLength", 8000);

                    b.Property<int>("NumberTicketsBought");

                    b.Property<DateTime>("SubmittedTimestamp");

                    b.HasKey("Id");

                    b.HasIndex("EventId");

                    b.ToTable("EventRegistration");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.EventRegistrationPerson", b =>
                {
                    b.Property<Guid>("EventRegistrationId");

                    b.Property<int>("Id");

                    b.Property<string>("Address1")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Address2")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Address3")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<decimal>("AmountPaid")
                        .HasColumnType("money");

                    b.Property<string>("City")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("EmailAddress")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<int>("EventRegistrationPersonTypeId");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("FullName")
                        .HasAnnotation("MaxLength", 201);

                    b.Property<bool>("IsPrimaryPerson");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 20);

                    b.Property<int>("StatesId");

                    b.Property<string>("ZipCode")
                        .HasAnnotation("MaxLength", 10);

                    b.HasKey("EventRegistrationId", "Id");

                    b.HasIndex("EventRegistrationId");

                    b.HasIndex("EventRegistrationPersonTypeId");

                    b.HasIndex("StatesId");

                    b.ToTable("EventRegistrationPerson");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Person", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid?>("BusinessId");

                    b.Property<Guid?>("BusinessId1");

                    b.Property<bool>("CanEmail");

                    b.Property<bool>("CanSnailMail");

                    b.Property<DateTime>("CreatedTimestamp");

                    b.Property<string>("DriverLicenseNumber")
                        .HasAnnotation("MaxLength", 20);

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("FullName")
                        .HasAnnotation("MaxLength", 201);

                    b.Property<bool>("IsActive");

                    b.Property<bool>("IsAdopter");

                    b.Property<bool>("IsAvailableFoster");

                    b.Property<bool>("IsBoardMember");

                    b.Property<bool>("IsDeleted");

                    b.Property<bool>("IsDoNotAdopt");

                    b.Property<bool>("IsDonor");

                    b.Property<bool>("IsFoster");

                    b.Property<bool>("IsSponsor");

                    b.Property<bool>("IsSystemUser");

                    b.Property<bool>("IsVolunteer");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("Notes")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<DateTime>("UpdatedTimestamp");

                    b.HasKey("Id");

                    b.HasIndex("BusinessId");

                    b.HasIndex("BusinessId1");

                    b.ToTable("Person");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Phone", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<Guid?>("BusinessId");

                    b.Property<string>("Number")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 20);

                    b.Property<Guid?>("PersonId");

                    b.Property<int>("PhoneTypeId");

                    b.HasKey("Id");

                    b.HasIndex("BusinessId");

                    b.HasIndex("PersonId");

                    b.HasIndex("PhoneTypeId");

                    b.ToTable("Phone");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.SystemSetting", b =>
                {
                    b.Property<string>("Id")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 4000);

                    b.HasKey("Id");

                    b.ToTable("SystemSetting");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.AddressType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("AddressType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.ApplicationAdoptionStatusType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("ApplicationAdoptionStatusType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.ApplicationFosterStatusType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("ApplicationFosterStatusType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.ApplicationResidenceOwnershipType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("ApplicationResidenceOwnershipType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.ApplicationResidencePetDepositCoverageType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("ApplicationResidencePetDepositCoverageType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.ApplicationResidenceType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("ApplicationResidenceType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.ApplicationStudentType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("ApplicationStudentType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.EmailType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("EmailType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.EventRegistrationPersonType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("EventRegistrationPersonType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.EventType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("EventType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.PhoneType", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("PhoneType");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Types.States", b =>
                {
                    b.Property<int>("Id");

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 400);

                    b.HasKey("Id");

                    b.ToTable("States");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole", b =>
                {
                    b.Property<string>("Id");

                    b.Property<string>("ConcurrencyStamp")
                        .IsConcurrencyToken();

                    b.Property<string>("Name")
                        .HasAnnotation("MaxLength", 256);

                    b.Property<string>("NormalizedName")
                        .HasAnnotation("MaxLength", 256);

                    b.HasKey("Id");

                    b.HasIndex("NormalizedName")
                        .HasName("RoleNameIndex");

                    b.ToTable("AspNetRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("RoleId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("RoleId");

                    b.ToTable("AspNetRoleClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ClaimType");

                    b.Property<string>("ClaimValue");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserClaims");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.Property<string>("LoginProvider");

                    b.Property<string>("ProviderKey");

                    b.Property<string>("ProviderDisplayName");

                    b.Property<string>("UserId")
                        .IsRequired();

                    b.HasKey("LoginProvider", "ProviderKey");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserLogins");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("RoleId");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.HasIndex("UserId");

                    b.ToTable("AspNetUserRoles");
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserToken<string>", b =>
                {
                    b.Property<string>("UserId");

                    b.Property<string>("LoginProvider");

                    b.Property<string>("Name");

                    b.Property<string>("Value");

                    b.HasKey("UserId", "LoginProvider", "Name");

                    b.ToTable("AspNetUserTokens");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.ApplicationAdoption", b =>
                {
                    b.HasBaseType("HuskyRescueCore.Models.Application");

                    b.Property<decimal?>("ApplicationFeeAmount")
                        .HasColumnType("money");

                    b.Property<string>("ApplicationFeePaymentMethod")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("ApplicationFeeTransactionId")
                        .HasAnnotation("MaxLength", 36);

                    b.Property<string>("FilterAppDogsInterestedIn")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<string>("FilterAppTraitsDesired")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<bool>("IsAllAdultsAgreedOnAdoption");

                    b.Property<string>("IsAllAdultsAgreedOnAdoptionReason")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<bool>("IsPetAdoptionReasonCompanionChild");

                    b.Property<bool>("IsPetAdoptionReasonCompanionPet");

                    b.Property<bool>("IsPetAdoptionReasonGift");

                    b.Property<bool>("IsPetAdoptionReasonGuardDog");

                    b.Property<bool>("IsPetAdoptionReasonHousePet");

                    b.Property<bool>("IsPetAdoptionReasonJoggingPartner");

                    b.Property<bool>("IsPetAdoptionReasonOther");

                    b.Property<bool>("IsPetAdoptionReasonWatchDog");

                    b.Property<string>("PetAdoptionReasonExplain")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<string>("WhatIfMovingPetPlacement")
                        .HasAnnotation("MaxLength", 4000);

                    b.Property<string>("WhatIfTravelPetPlacement")
                        .HasAnnotation("MaxLength", 4000);

                    b.ToTable("ApplicationAdoption");

                    b.HasDiscriminator().HasValue("adoption");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.ApplicationFoster", b =>
                {
                    b.HasBaseType("HuskyRescueCore.Models.Application");


                    b.ToTable("ApplicationFoster");

                    b.HasDiscriminator().HasValue("foster");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.EventGolf", b =>
                {
                    b.HasBaseType("HuskyRescueCore.Models.Event");

                    b.Property<TimeSpan>("BanquetStartTime");

                    b.Property<decimal>("CostBanquet")
                        .HasColumnType("money");

                    b.Property<decimal>("CostFoursome")
                        .HasColumnType("money");

                    b.Property<decimal>("CostSingle")
                        .HasColumnType("money");

                    b.Property<TimeSpan>("GolfingStartTime");

                    b.Property<TimeSpan>("RegistrationStartTime");

                    b.Property<string>("TournamentType")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("WelcomeMessage")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 8000);

                    b.ToTable("EventGolf");

                    b.HasDiscriminator().HasValue("golf");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Address", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.Types.AddressType", "AddressType")
                        .WithMany("Addresses")
                        .HasForeignKey("AddressTypeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.Business", "Business")
                        .WithMany("Addresses")
                        .HasForeignKey("BusinessId");

                    b.HasOne("HuskyRescueCore.Models.Person", "Person")
                        .WithMany("Addresses")
                        .HasForeignKey("PersonId");

                    b.HasOne("HuskyRescueCore.Models.Types.States", "State")
                        .WithMany("Addresses")
                        .HasForeignKey("StatesId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Application", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.Types.ApplicationResidenceOwnershipType", "ApplicationResidenceOwnershipType")
                        .WithMany("Applications")
                        .HasForeignKey("ApplicationResidenceOwnershipTypeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.Types.ApplicationResidencePetDepositCoverageType", "ApplicationResidencePetDepositCoverageType")
                        .WithMany("Applications")
                        .HasForeignKey("ApplicationResidencePetDepositCoverageTypeId");

                    b.HasOne("HuskyRescueCore.Models.Types.ApplicationResidenceType", "ApplicationResidenceType")
                        .WithMany("Applications")
                        .HasForeignKey("ApplicationResidenceTypeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.Types.ApplicationStudentType", "ApplicationStudentType")
                        .WithMany("Applications")
                        .HasForeignKey("ApplicationStudentTypeId");

                    b.HasOne("HuskyRescueCore.Models.Person", "Person")
                        .WithMany("Applications")
                        .HasForeignKey("PersonId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.Types.States", "State")
                        .WithMany()
                        .HasForeignKey("StateId");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.ApplicationAdoptionStatus", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.ApplicationAdoption", "ApplicationAdoption")
                        .WithMany("ApplicationAdoptionStatuses")
                        .HasForeignKey("ApplicationAdoptionId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.Types.ApplicationAdoptionStatusType", "ApplicationAdoptionStatusType")
                        .WithMany("ApplicationAdoptionStatuses")
                        .HasForeignKey("ApplicationAdoptionStatusTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HuskyRescueCore.Models.ApplicationAppAnimal", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.Application", "Application")
                        .WithMany("ApplicationAppAnimals")
                        .HasForeignKey("ApplicantId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HuskyRescueCore.Models.ApplicationFosterStatus", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.ApplicationFoster", "ApplicationFoster")
                        .WithMany("ApplicationFosterStatuses")
                        .HasForeignKey("ApplicationFosterId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.Types.ApplicationFosterStatusType", "ApplicationFosterStatusType")
                        .WithMany("ApplicationFosterStatuses")
                        .HasForeignKey("ApplicationFosterStatusTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Business", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.Person")
                        .WithMany("Employers")
                        .HasForeignKey("PersonId");

                    b.HasOne("HuskyRescueCore.Models.Person")
                        .WithMany("Businesses")
                        .HasForeignKey("PersonId1");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Donation", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.Person", "Person")
                        .WithMany("Donations")
                        .HasForeignKey("PersonId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Email", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.Business", "Business")
                        .WithMany("Emails")
                        .HasForeignKey("BusinessId");

                    b.HasOne("HuskyRescueCore.Models.Types.EmailType", "EmailType")
                        .WithMany("Emails")
                        .HasForeignKey("EmailTypeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.Person", "Person")
                        .WithMany("Emails")
                        .HasForeignKey("PersonId");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Event", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.Business", "Business")
                        .WithMany("Events")
                        .HasForeignKey("BusinessId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.Types.EventType", "EventType")
                        .WithMany("Events")
                        .HasForeignKey("EventTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HuskyRescueCore.Models.EventGolfFeatures", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.EventGolf", "EventGolf")
                        .WithMany("WhatGolferGets")
                        .HasForeignKey("EventGolfId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HuskyRescueCore.Models.EventRegistration", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.Event", "Event")
                        .WithMany("EventRegistrations")
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HuskyRescueCore.Models.EventRegistrationPerson", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.EventRegistration", "EventRegistration")
                        .WithMany("EventRegistrationPersons")
                        .HasForeignKey("EventRegistrationId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.Types.EventRegistrationPersonType", "EventRegistrationPersonType")
                        .WithMany("EventRegistrationPersons")
                        .HasForeignKey("EventRegistrationPersonTypeId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.Types.States", "State")
                        .WithMany("EventRegistrationPersons")
                        .HasForeignKey("StatesId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Person", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.Business")
                        .WithMany("Employees")
                        .HasForeignKey("BusinessId");

                    b.HasOne("HuskyRescueCore.Models.Business")
                        .WithMany("Owners")
                        .HasForeignKey("BusinessId1");
                });

            modelBuilder.Entity("HuskyRescueCore.Models.Phone", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.Business", "Business")
                        .WithMany("Phones")
                        .HasForeignKey("BusinessId");

                    b.HasOne("HuskyRescueCore.Models.Person", "Person")
                        .WithMany("Phones")
                        .HasForeignKey("PersonId");

                    b.HasOne("HuskyRescueCore.Models.Types.PhoneType", "PhoneType")
                        .WithMany("Phones")
                        .HasForeignKey("PhoneTypeId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRoleClaim<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Claims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserClaim<string>", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.ApplicationUser")
                        .WithMany("Claims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserLogin<string>", b =>
                {
                    b.HasOne("HuskyRescueCore.Models.ApplicationUser")
                        .WithMany("Logins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityUserRole<string>", b =>
                {
                    b.HasOne("Microsoft.AspNetCore.Identity.EntityFrameworkCore.IdentityRole")
                        .WithMany("Users")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("HuskyRescueCore.Models.ApplicationUser")
                        .WithMany("Roles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
