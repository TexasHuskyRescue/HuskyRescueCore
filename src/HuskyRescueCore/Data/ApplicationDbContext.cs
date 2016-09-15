using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using HuskyRescueCore.Models;
using HuskyRescueCore.Models.Types;

namespace HuskyRescueCore.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);

            #region Types
            builder.Entity<AddressType>().HasKey(s => s.Id);
            builder.Entity<AddressType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<AddressType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<AddressType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<ApplicationAdoptionStatusType>().HasKey(s => s.Id);
            builder.Entity<ApplicationAdoptionStatusType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<ApplicationAdoptionStatusType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<ApplicationAdoptionStatusType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<ApplicationFosterStatusType>().HasKey(s => s.Id);
            builder.Entity<ApplicationFosterStatusType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<ApplicationFosterStatusType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<ApplicationFosterStatusType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<ApplicationResidenceOwnershipType>().HasKey(s => s.Id);
            builder.Entity<ApplicationResidenceOwnershipType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<ApplicationResidenceOwnershipType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<ApplicationResidenceOwnershipType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<ApplicationResidencePetDepositCoverageType>().HasKey(s => s.Id);
            builder.Entity<ApplicationResidencePetDepositCoverageType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<ApplicationResidencePetDepositCoverageType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<ApplicationResidencePetDepositCoverageType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<ApplicationResidenceType>().HasKey(s => s.Id);
            builder.Entity<ApplicationResidenceType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<ApplicationResidenceType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<ApplicationResidenceType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<ApplicationStudentType>().HasKey(s => s.Id);
            builder.Entity<ApplicationStudentType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<ApplicationStudentType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<ApplicationStudentType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<EmailType>().HasKey(s => s.Id);
            builder.Entity<EmailType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<EmailType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<EmailType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<EventRegistrationPersonType>().HasKey(s => s.Id);
            builder.Entity<EventRegistrationPersonType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<EventRegistrationPersonType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<EventRegistrationPersonType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<EventType>().HasKey(s => s.Id);
            builder.Entity<EventType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<EventType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<EventType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<PhoneType>().HasKey(s => s.Id);
            builder.Entity<PhoneType>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<PhoneType>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<PhoneType>().Property(s => s.Text).IsRequired().HasMaxLength(400);

            builder.Entity<States>().HasKey(s => s.Id);
            builder.Entity<States>().Property(s => s.Id).ValueGeneratedNever();
            builder.Entity<States>().Property(s => s.Code).IsRequired().HasMaxLength(200);
            builder.Entity<States>().Property(s => s.Text).IsRequired().HasMaxLength(400);
            #endregion

            #region System Settings 
            builder.Entity<SystemSetting>().HasKey(s => s.Id);
            builder.Entity<SystemSetting>().Property(s => s.Id).IsRequired().HasMaxLength(200);
            builder.Entity<SystemSetting>().Property(s => s.Value).IsRequired().HasMaxLength(4000);
            #endregion

            #region Address
            builder.Entity<Address>().HasKey(p => p.Id);
            builder.Entity<Address>().HasOne(p => p.AddressType).WithMany(p => p.Addresses).HasForeignKey(p => p.AddressTypeId);
            builder.Entity<Address>().HasOne(p => p.State).WithMany(p => p.Addresses).HasForeignKey(p => p.StatesId);
            builder.Entity<Address>().HasOne(p => p.Person).WithMany(p => p.Addresses).HasForeignKey(p => p.PersonId);
            builder.Entity<Address>().HasOne(p => p.Business).WithMany(p => p.Addresses).HasForeignKey(p => p.BusinessId);
            builder.Entity<Address>().HasIndex(p => p.AddressTypeId);
            builder.Entity<Address>().Property(p => p.Address1).IsRequired().HasMaxLength(200);
            builder.Entity<Address>().Property(p => p.Address2).HasMaxLength(200);
            builder.Entity<Address>().Property(p => p.Address3).HasMaxLength(200);
            builder.Entity<Address>().Property(p => p.City).HasMaxLength(200);
            builder.Entity<Address>().Property(p => p.ZipCode).HasMaxLength(10);
            #endregion

            #region Email
            builder.Entity<Email>().HasKey(p => p.Id);
            builder.Entity<Email>().HasOne(p => p.EmailType).WithMany(p => p.Emails).HasForeignKey(p => p.EmailTypeId);
            builder.Entity<Email>().HasOne(p => p.Person).WithMany(p => p.Emails).HasForeignKey(p => p.PersonId);
            builder.Entity<Email>().HasOne(p => p.Business).WithMany(p => p.Emails).HasForeignKey(p => p.BusinessId);
            builder.Entity<Email>().HasIndex(p => p.EmailTypeId);
            builder.Entity<Email>().Property(p => p.Address).IsRequired().HasMaxLength(200);
            #endregion

            #region Phone
            builder.Entity<Phone>().HasKey(p => p.Id);
            builder.Entity<Phone>().HasOne(p => p.PhoneType).WithMany(p => p.Phones).HasForeignKey(p => p.PhoneTypeId);
            builder.Entity<Phone>().HasOne(p => p.Person).WithMany(p => p.Phones).HasForeignKey(p => p.PersonId);
            builder.Entity<Phone>().HasOne(p => p.Business).WithMany(p => p.Phones).HasForeignKey(p => p.BusinessId);
            builder.Entity<Phone>().HasIndex(p => p.PhoneTypeId);
            builder.Entity<Phone>().Property(p => p.Number).IsRequired().HasMaxLength(20);
            #endregion

            #region Event
            builder.Entity<Event>().HasDiscriminator<string>("TypeOfEvent").HasValue<Event>("general").HasValue<EventGolf>("golf");

            builder.Entity<Event>().HasKey(p => p.Id);
            builder.Entity<Event>().HasOne(p => p.EventType).WithMany(p => p.Events).HasForeignKey(p => p.EventTypeId);
            builder.Entity<Event>().HasOne(p => p.Business).WithMany(p => p.Events).HasForeignKey(p => p.BusinessId);
            builder.Entity<Event>().HasMany(p => p.EventRegistrations).WithOne(p => p.Event).HasForeignKey(p => p.EventId);
            builder.Entity<Event>().Property(p => p.DateAdded).IsRequired();
            builder.Entity<Event>().Property(p => p.DateOfEvent).IsRequired();
            builder.Entity<Event>().Property(p => p.StartTime).IsRequired();
            builder.Entity<Event>().Property(p => p.EndTime).IsRequired();
            builder.Entity<Event>().Property(p => p.TicketPriceFull).HasColumnType("money");
            builder.Entity<Event>().Property(p => p.TicketPriceDiscount).HasColumnType("money");
            builder.Entity<Event>().Property(p => p.Name).HasMaxLength(200);
            builder.Entity<Event>().Property(p => p.BannerImagePath).HasMaxLength(2000);
            builder.Entity<Event>().Property(p => p.Notes).HasMaxLength(4000);
            builder.Entity<Event>().Property(p => p.PublicDescription).HasMaxLength(4000);
            #endregion

            #region EventGolfFeatures
            builder.Entity<EventGolfFeatures>().HasKey(p => new { p.EventGolfId, p.Id });
            builder.Entity<EventGolfFeatures>().Property(p => p.Feature).IsRequired().HasMaxLength(4000);
            #endregion

            #region EventGolf
            builder.Entity<EventGolf>().Property(p => p.WelcomeMessage).IsRequired().HasMaxLength(8000);
            builder.Entity<EventGolf>().Property(p => p.TournamentType).IsRequired().HasMaxLength(200);
            builder.Entity<EventGolf>().Property(p => p.CostFoursome).HasColumnType("money");
            builder.Entity<EventGolf>().Property(p => p.CostSingle).HasColumnType("money");
            builder.Entity<EventGolf>().Property(p => p.CostBanquet).HasColumnType("money");
            builder.Entity<EventGolf>().HasMany(p => p.WhatGolferGets).WithOne(p => p.EventGolf).HasForeignKey(p => new { p.EventGolfId });
            #endregion

            #region EventRegistration
            builder.Entity<EventRegistration>().HasKey(p => p.Id);
            builder.Entity<EventRegistration>().HasOne(p => p.Event).WithMany(p => p.EventRegistrations).HasForeignKey(p => p.EventId);
            builder.Entity<EventRegistration>().Property(p => p.HasPaid).IsRequired();
            builder.Entity<EventRegistration>().Property(p => p.AmountPaid).HasColumnType("money");
            builder.Entity<EventRegistration>().Property(p => p.CommentsFromRegistrant).HasMaxLength(4000);
            builder.Entity<EventRegistration>().Property(p => p.InternalNotes).HasMaxLength(8000);
            builder.Entity<EventRegistration>().HasMany(p => p.EventRegistrationPersons).WithOne(p => p.EventRegistration).HasForeignKey(p => p.EventRegistrationId);
            #endregion

            #region EventRegistrationPerson
            builder.Entity<EventRegistrationPerson>().HasKey(p => new { p.EventRegistrationId, p.Id });
            builder.Entity<EventRegistrationPerson>().HasOne(p => p.EventRegistration).WithMany(p => p.EventRegistrationPersons).HasForeignKey(p => p.EventRegistrationId);
            builder.Entity<EventRegistrationPerson>().HasOne(p => p.EventRegistrationPersonType).WithMany(p => p.EventRegistrationPersons).HasForeignKey(p => p.EventRegistrationPersonTypeId);
            builder.Entity<EventRegistrationPerson>().Property(p => p.IsPrimaryPerson).IsRequired();
            builder.Entity<EventRegistrationPerson>().Property(p => p.AmountPaid).IsRequired().HasColumnType("money");
            builder.Entity<EventRegistrationPerson>().Property(p => p.FirstName).IsRequired().HasMaxLength(100);
            builder.Entity<EventRegistrationPerson>().Property(p => p.LastName).IsRequired().HasMaxLength(100);
            builder.Entity<EventRegistrationPerson>().Property(p => p.FullName).HasMaxLength(201);//.HasComputedColumnSql("[FirstName]" + " " + "[LastName]");
            builder.Entity<EventRegistrationPerson>().HasOne(p => p.State).WithMany(p => p.EventRegistrationPersons).HasForeignKey(p => p.StatesId);
            builder.Entity<EventRegistrationPerson>().Property(p => p.Address1).IsRequired().HasMaxLength(200);
            builder.Entity<EventRegistrationPerson>().Property(p => p.Address2).HasMaxLength(200);
            builder.Entity<EventRegistrationPerson>().Property(p => p.Address3).HasMaxLength(200);
            builder.Entity<EventRegistrationPerson>().Property(p => p.City).HasMaxLength(200);
            builder.Entity<EventRegistrationPerson>().Property(p => p.ZipCode).HasMaxLength(10);
            builder.Entity<EventRegistrationPerson>().Property(p => p.EmailAddress).IsRequired().HasMaxLength(200);
            builder.Entity<EventRegistrationPerson>().Property(p => p.PhoneNumber).IsRequired().HasMaxLength(20);
            #endregion

            #region Donations
            builder.Entity<Donation>().HasKey(p => p.Id);
            builder.Entity<Donation>().HasOne(p => p.Person).WithMany(p => p.Donations).HasForeignKey(p => p.PersonId);
            builder.Entity<Donation>().Property(p => p.Amount).IsRequired().HasColumnType("money");
            builder.Entity<Donation>().Property(p => p.DonorNote).HasMaxLength(4000);
            builder.Entity<Donation>().Property(p => p.PaymentType).HasMaxLength(20);
            builder.Entity<Donation>().Property(p => p.DateTimeOfDonation).HasColumnType("datetime2(0)").IsRequired();
            #endregion

            #region Business
            builder.Entity<Business>().HasKey(p => p.Id);
            builder.Entity<Business>().HasMany(p => p.Employees);
            builder.Entity<Business>().HasMany(p => p.Owners);
            builder.Entity<Business>().HasMany(p => p.Emails);
            builder.Entity<Business>().HasMany(p => p.Phones);
            builder.Entity<Business>().HasMany(p => p.Addresses);
            builder.Entity<Business>().HasIndex(p => p.IsActive);
            builder.Entity<Business>().Property(p => p.Name).IsRequired().HasMaxLength(200);
            builder.Entity<Business>().Property(p => p.EIN).IsRequired().HasMaxLength(20);
            builder.Entity<Business>().Property(p => p.Notes).HasMaxLength(4000);
            #endregion

            #region Person

            builder.Entity<Person>().HasKey(p => p.Id);
            builder.Entity<Person>().HasMany(p => p.Employers);
            builder.Entity<Person>().HasMany(p => p.Emails);
            builder.Entity<Person>().HasMany(p => p.Phones);
            builder.Entity<Person>().HasMany(p => p.Addresses);
            builder.Entity<Person>().HasMany(p => p.Businesses);
            builder.Entity<Person>().HasMany(p => p.Applications);
            builder.Entity<Person>().HasMany(p => p.Donations);
            //builder.Entity<Person>().HasMany(p => p.ApplicationAdoptions);
            //builder.Entity<Person>().HasMany(p => p.ApplicationFosters);
            //builder.Entity<Person>().HasIndex(p => p.IsActive);
            //builder.Entity<Person>().HasIndex(p => new { p.LastName, p.FirstName });
            //builder.Entity<Person>().HasIndex("IsActive", "LastName", "FirstName");
            builder.Entity<Person>().Property(p => p.FirstName).IsRequired().HasMaxLength(100);
            builder.Entity<Person>().Property(p => p.LastName).IsRequired().HasMaxLength(100);
            builder.Entity<Person>().Property(p => p.DriverLicenseNumber).HasMaxLength(20);
            builder.Entity<Person>().Property(p => p.FullName).HasMaxLength(201);//.HasComputedColumnSql("[FirstName]" + " " + "[LastName]");
            builder.Entity<Person>().Property(p => p.Notes).HasMaxLength(4000);
            #endregion

            #region Application
            builder.Entity<Application>().HasDiscriminator<string>("AppType").HasValue<ApplicationFoster>("foster").HasValue<ApplicationAdoption>("adoption");

            builder.Entity<Application>().HasKey(a => a.Id);
            builder.Entity<Application>().HasOne(a => a.Person).WithMany(a => a.Applications).HasForeignKey(a => a.PersonId);

            builder.Entity<Application>().HasOne(a => a.ApplicationResidenceOwnershipType).WithMany(a => a.Applications).HasForeignKey(a => a.ApplicationResidenceOwnershipTypeId);
            builder.Entity<Application>().HasOne(a => a.ApplicationResidencePetDepositCoverageType).WithMany(a => a.Applications).HasForeignKey(a => a.ApplicationResidencePetDepositCoverageTypeId);
            builder.Entity<Application>().HasOne(a => a.ApplicationResidenceType).WithMany(a => a.Applications).HasForeignKey(a => a.ApplicationResidenceTypeId);
            builder.Entity<Application>().HasOne(a => a.ApplicationStudentType).WithMany(a => a.Applications).HasForeignKey(a => a.ApplicationStudentTypeId);
            builder.Entity<Application>().HasMany(a => a.ApplicationAppAnimals).WithOne(a => a.Application).HasForeignKey(a => a.ApplicantId);
            builder.Entity<Application>().Property(p => p.DateSubmitted).HasColumnType("datetime2(0)").IsRequired();
            builder.Entity<Application>().Property(p => p.AppNameFirst).HasMaxLength(100).IsRequired();
            builder.Entity<Application>().Property(p => p.AppNameLast).HasMaxLength(100).IsRequired();
            builder.Entity<Application>().Property(p => p.AppSpouseNameFirst).HasMaxLength(100);
            builder.Entity<Application>().Property(p => p.AppSpouseNameLast).HasMaxLength(100);
            builder.Entity<Application>().Property(p => p.AppCellPhone).HasMaxLength(20);
            builder.Entity<Application>().Property(p => p.AppHomePhone).HasMaxLength(20);
            builder.Entity<Application>().Property(p => p.AppAddressStreet1).HasMaxLength(50).IsRequired();
            builder.Entity<Application>().Property(p => p.AppAddressCity).HasMaxLength(50).IsRequired();
            builder.Entity<Application>().Property(p => p.AppAddressStateId).IsRequired();
            builder.Entity<Application>().Property(p => p.AppAddressZIP).HasMaxLength(10).IsRequired();
            builder.Entity<Application>().Property(p => p.AppEmail).HasMaxLength(200).IsRequired();
            builder.Entity<Application>().Property(p => p.AppDateBirth).HasColumnType("datetime2(0)").IsRequired();
            builder.Entity<Application>().Property(p => p.AppEmployer).HasMaxLength(100);
            builder.Entity<Application>().Property(p => p.ApplicationResidenceOwnershipTypeId).IsRequired();
            builder.Entity<Application>().Property(p => p.ApplicationResidenceTypeId).IsRequired();
            builder.Entity<Application>().Property(p => p.ResidencePetDepositAmount).HasColumnType("money");
            builder.Entity<Application>().Property(p => p.ResidenceLandlordName).HasMaxLength(100);
            builder.Entity<Application>().Property(p => p.ResidenceLandlordNumber).HasMaxLength(20);
            builder.Entity<Application>().Property(p => p.ResidenceLengthOfResidence).HasMaxLength(100);
            builder.Entity<Application>().Property(p => p.IsAppOrSpouseStudent).IsRequired();
            builder.Entity<Application>().Property(p => p.IsAppTravelFrequent).IsRequired();
            builder.Entity<Application>().Property(p => p.AppTravelFrequency).HasMaxLength(100);
            builder.Entity<Application>().Property(p => p.ResidenceNumberOccupants).HasMaxLength(50);
            builder.Entity<Application>().Property(p => p.ResidenceAgesOfChildren).HasMaxLength(200);
            builder.Entity<Application>().Property(p => p.ResIdenceIsYardFenced).IsRequired();
            builder.Entity<Application>().Property(p => p.ResidenceFenceTypeHeight).HasMaxLength(50);
            builder.Entity<Application>().Property(p => p.PetKeptLocationInOutDoors).HasMaxLength(200);
            builder.Entity<Application>().Property(p => p.PetKeptLocationInOutDoorsExplain).HasMaxLength(4000);
            builder.Entity<Application>().Property(p => p.PetLeftAloneDays).HasMaxLength(50);
            builder.Entity<Application>().Property(p => p.PetLeftAloneHours).HasMaxLength(50);
            builder.Entity<Application>().Property(p => p.PetKeptLocationAloneRestrictionExplain).HasMaxLength(4000);
            builder.Entity<Application>().Property(p => p.PetKeptLocationSleepingRestrictionExplain).HasMaxLength(4000);
            builder.Entity<Application>().Property(p => p.FilterAppCatsOwnedCount).HasMaxLength(100);
            builder.Entity<Application>().Property(p => p.VeterinarianOfficeName).HasMaxLength(100);
            builder.Entity<Application>().Property(p => p.VeterinarianDoctorName).HasMaxLength(100);
            builder.Entity<Application>().Property(p => p.VeterinarianPhoneNumber).HasMaxLength(20);
            #endregion

            #region ApplicationAppAnimal
            builder.Entity<ApplicationAppAnimal>().HasKey(p => new { p.Id, p.ApplicantId });
            builder.Entity<ApplicationAppAnimal>().Property(p => p.Name).IsRequired().HasMaxLength(50);
            builder.Entity<ApplicationAppAnimal>().Property(p => p.Breed).HasMaxLength(50);
            builder.Entity<ApplicationAppAnimal>().Property(p => p.Sex).HasMaxLength(6);
            builder.Entity<ApplicationAppAnimal>().Property(p => p.Age).HasMaxLength(50);
            builder.Entity<ApplicationAppAnimal>().Property(p => p.OwnershipLength).HasMaxLength(50);
            builder.Entity<ApplicationAppAnimal>().Property(p => p.AlteredReason).HasMaxLength(500);
            builder.Entity<ApplicationAppAnimal>().Property(p => p.HwPreventionReason).HasMaxLength(500);
            builder.Entity<ApplicationAppAnimal>().Property(p => p.FullyVaccinatedReason).HasMaxLength(500);
            builder.Entity<ApplicationAppAnimal>().Property(p => p.IsStillOwnedReason).HasMaxLength(500);
            #endregion

            #region ApplicationAdoption
            //builder.Entity<ApplicationAdoption>().HasOne(a => a.Adopter).WithMany(a => a.ApplicationAdoptions).HasForeignKey(a => a.AdopterPersonId);
            builder.Entity<ApplicationAdoption>().HasMany(a => a.ApplicationAdoptionStatuses).WithOne(a => a.ApplicationAdoption).HasForeignKey(a => a.ApplicationAdoptionId);
            builder.Entity<ApplicationAdoption>().Property(p => p.WhatIfMovingPetPlacement).HasMaxLength(4000);
            builder.Entity<ApplicationAdoption>().Property(p => p.WhatIfTravelPetPlacement).HasMaxLength(4000);
            builder.Entity<ApplicationAdoption>().Property(p => p.PetAdoptionReasonExplain).HasMaxLength(4000);
            builder.Entity<ApplicationAdoption>().Property(p => p.FilterAppTraitsDesired).HasMaxLength(4000);
            builder.Entity<ApplicationAdoption>().Property(p => p.FilterAppDogsInterestedIn).HasMaxLength(4000);
            builder.Entity<ApplicationAdoption>().Property(p => p.IsAllAdultsAgreedOnAdoptionReason).HasMaxLength(4000);
            builder.Entity<ApplicationAdoption>().Property(p => p.ApplicationFeeAmount).HasColumnType("money");
            builder.Entity<ApplicationAdoption>().Property(p => p.ApplicationFeePaymentMethod).HasMaxLength(50);
            builder.Entity<ApplicationAdoption>().Property(p => p.ApplicationFeeTransactionId).HasMaxLength(36);
            #endregion

            #region ApplicationAdoptionStatus
            builder.Entity<ApplicationAdoptionStatus>().HasKey(a => new { a.ApplicationAdoptionId, a.Id });
            #endregion

            #region ApplicationFoster
            // builder.Entity<ApplicationFoster>().HasOne(a => a.Foster).WithMany(a => a.ApplicationFosters).HasForeignKey(a => a.FosterPersonId);
            builder.Entity<ApplicationFoster>().HasMany(a => a.ApplicationFosterStatuses).WithOne(a => a.ApplicationFoster).HasForeignKey(a => a.ApplicationFosterId);
            #endregion

            #region ApplicationFosterStatus
            builder.Entity<ApplicationFosterStatus>().HasKey(a => new { a.ApplicationFosterId, a.Id });
            #endregion
        }

        public DbSet<Address> Address { get; set; }
        public DbSet<Application> Application { get; set; }
        public DbSet<ApplicationAdoption> ApplicationAdoption { get; set; }
        public DbSet<ApplicationAdoptionStatus> ApplicationAdoptionStatus { get; set; }
        public DbSet<ApplicationFosterStatus> ApplicationFosterStatus { get; set; }
        public DbSet<ApplicationAppAnimal> ApplicationAppAnimal { get; set; }
        public DbSet<ApplicationFoster> ApplicationFoster { get; set; }
        public DbSet<Business> Business { get; set; }
        public DbSet<Email> Email { get; set; }
        public DbSet<Event> Event { get; set; }
        public DbSet<EventGolf> EventGolf { get; set; }
        public DbSet<EventGolfFeatures> EventGolfFeatures { get; set; }
        public DbSet<EventRegistration> EventRegistration { get; set; }
        public DbSet<EventRegistrationPerson> EventRegistrationPerson { get; set; }
        public DbSet<Person> Person { get; set; }
        public DbSet<Phone> Phone { get; set; }
        public DbSet<SystemSetting> SystemSetting { get; set; }

        public DbSet<AddressType> AddressType { get; set; }
        public DbSet<ApplicationAdoptionStatusType> ApplicationAdoptionStatusType { get; set; }
        public DbSet<ApplicationFosterStatusType> ApplicationFosterStatusType { get; set; }
        public DbSet<ApplicationResidenceOwnershipType> ApplicationResidenceOwnershipType { get; set; }
        public DbSet<ApplicationResidencePetDepositCoverageType> ApplicationResidencePetDepositCoverageType { get; set; }
        public DbSet<ApplicationResidenceType> ApplicationResidenceType { get; set; }
        public DbSet<ApplicationStudentType> ApplicationStudentType { get; set; }
        public DbSet<EmailType> EmailType { get; set; }
        public DbSet<EventRegistrationPersonType> EventRegistrationPersonType { get; set; }
        public DbSet<EventType> EventType { get; set; }
        public DbSet<PhoneType> PhoneType { get; set; }
        public DbSet<States> States { get; set; }
    }
}
