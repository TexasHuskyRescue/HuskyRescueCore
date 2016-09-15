using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using HuskyRescueCore.Data;

namespace HuskyRescueCore.Models
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                // seed the database
                // https://docs.asp.net/en/dev/tutorials/first-mvc-app/working-with-sql.html

                #region Types
                #region ApplicationAdoptionStatusType
                if (!context.ApplicationAdoptionStatusType.Any())
                {
                    context.ApplicationAdoptionStatusType.AddRange(
                        new Types.ApplicationAdoptionStatusType { Id = 0, Text = "New", Code = "0" },
                        new Types.ApplicationAdoptionStatusType { Id = 1, Text = "Adopted", Code = "1" },
                        new Types.ApplicationAdoptionStatusType { Id = 2, Text = "Adopted Elsewhere", Code = "2" },
                        new Types.ApplicationAdoptionStatusType { Id = 3, Text = "App In Review", Code = "3" },
                        new Types.ApplicationAdoptionStatusType { Id = 4, Text = "App On Hold", Code = "4" },
                        new Types.ApplicationAdoptionStatusType { Id = 5, Text = "Approved", Code = "5" },
                        new Types.ApplicationAdoptionStatusType { Id = 6, Text = "Approved - Pending Home Check", Code = "6" },
                        new Types.ApplicationAdoptionStatusType { Id = 7, Text = "Need to Call App", Code = "7" },
                        new Types.ApplicationAdoptionStatusType { Id = 8, Text = "App Canceled", Code = "8" },
                        new Types.ApplicationAdoptionStatusType { Id = 9, Text = "On Trial", Code = "9" },
                        new Types.ApplicationAdoptionStatusType { Id = 10, Text = "Need Vet Check", Code = "10" }
                        );
                }
                #endregion
                #region ApplicationFosterStatusType
                if (!context.ApplicationFosterStatusType.Any())
                {
                    context.ApplicationFosterStatusType.AddRange(
                        new Types.ApplicationFosterStatusType { Id = 0, Text = "New", Code = "0" },
                        new Types.ApplicationFosterStatusType { Id = 1, Text = "App In Review", Code = "3" },
                        new Types.ApplicationFosterStatusType { Id = 2, Text = "App On Hold", Code = "4" },
                        new Types.ApplicationFosterStatusType { Id = 3, Text = "Approved", Code = "5" },
                        new Types.ApplicationFosterStatusType { Id = 4, Text = "Approved - Pending Home Check", Code = "6" },
                        new Types.ApplicationFosterStatusType { Id = 5, Text = "Need to Call App", Code = "7" },
                        new Types.ApplicationFosterStatusType { Id = 6, Text = "App Canceled", Code = "8" },
                        new Types.ApplicationFosterStatusType { Id = 7, Text = "Need Vet Check", Code = "10" }
                        );
                }
                #endregion
                #region ApplicationResidenceOwnershipType
                if (!context.ApplicationResidenceOwnershipType.Any())
                {
                    context.ApplicationResidenceOwnershipType.AddRange(
                        new Types.ApplicationResidenceOwnershipType { Id = 0, Text = "", Code = "0" },
                        new Types.ApplicationResidenceOwnershipType { Id = 1, Text = "Own", Code = "1" },
                        new Types.ApplicationResidenceOwnershipType { Id = 2, Text = "Rent", Code = "2" }
                        );
                }
                #endregion
                #region ApplicationResidencePetDepositCoverageType
                if (!context.ApplicationResidencePetDepositCoverageType.Any())
                {
                    context.ApplicationResidencePetDepositCoverageType.AddRange(
                        new Types.ApplicationResidencePetDepositCoverageType { Id = 0, Text = "", Code = "0" },
                        new Types.ApplicationResidencePetDepositCoverageType { Id = 1, Text = "per pet", Code = "1" },
                        new Types.ApplicationResidencePetDepositCoverageType { Id = 2, Text = "per household", Code = "2" }
                        );
                }
                #endregion
                #region ApplicationResidenceType
                if (!context.ApplicationResidenceType.Any())
                {
                    context.ApplicationResidenceType.AddRange(
                        new Types.ApplicationResidenceType { Id = 0, Text = "", Code = "0" },
                        new Types.ApplicationResidenceType { Id = 1, Text = "House", Code = "1" },
                        new Types.ApplicationResidenceType { Id = 2, Text = "Apartment", Code = "2" },
                        new Types.ApplicationResidenceType { Id = 3, Text = "Mobile Home", Code = "3" },
                        new Types.ApplicationResidenceType { Id = 4, Text = "Duplex", Code = "4" },
                        new Types.ApplicationResidenceType { Id = 5, Text = "Condo", Code = "5" }
                        );
                }
                #endregion
                #region ApplicationStudentType
                if (!context.ApplicationStudentType.Any())
                {
                    context.ApplicationStudentType.AddRange(
                        new Types.ApplicationStudentType { Id = 0, Text = "", Code = "0" },
                        new Types.ApplicationStudentType { Id = 1, Text = "Full Time", Code = "1" },
                        new Types.ApplicationStudentType { Id = 2, Text = "Part Time", Code = "2" }
                        );
                }
                #endregion
                #region EmailType
                if (!context.EmailType.Any())
                {
                    context.EmailType.AddRange(
                        new Types.EmailType { Id = 0, Text = "", Code = "0" },
                        new Types.EmailType { Id = 1, Text = "Home", Code = "1" },
                        new Types.EmailType { Id = 2, Text = "Work", Code = "2" },
                        new Types.EmailType { Id = 3, Text = "School", Code = "3" },
                        new Types.EmailType { Id = 4, Text = "Other", Code = "4" }
                        );
                }
                #endregion
                #region EventRegistrationPersonType
                if (!context.EventRegistrationPersonType.Any())
                {
                    context.EventRegistrationPersonType.AddRange(
                        new Types.EventRegistrationPersonType { Id = 0, Text = "", Code = "0" },
                        new Types.EventRegistrationPersonType { Id = 1, Text = "Regular", Code = "1" },
                        new Types.EventRegistrationPersonType { Id = 2, Text = "Partial", Code = "2" }
                        );
                }
                #endregion
                #region EventType
                if (!context.EventType.Any())
                {
                    context.EventType.AddRange(
                        new Types.EventType { Id = 0, Text = "", Code = "0" },
                        new Types.EventType { Id = 1, Text = "Fundraiser", Code = "1" },
                        new Types.EventType { Id = 2, Text = "Meet & Greet", Code = "2" }
                        );
                }
                #endregion
                #region PhoneType
                if (!context.PhoneType.Any())
                {
                    context.PhoneType.AddRange(
                        new Types.PhoneType { Id = 0, Text = "", Code = "0" },
                        new Types.PhoneType { Id = 1, Text = "Home", Code = "1" },
                        new Types.PhoneType { Id = 2, Text = "Work", Code = "2" },
                        new Types.PhoneType { Id = 3, Text = "Mobile", Code = "3" },
                        new Types.PhoneType { Id = 4, Text = "Fax", Code = "4" },
                        new Types.PhoneType { Id = 5, Text = "Other", Code = "5" }
                        );
                }
                #endregion
                #region Address Types
                if (!context.AddressType.Any())
                {
                    context.AddressType.AddRange(
                        new Types.AddressType { Id = 0, Text = "", Code = "0" },
                        new Types.AddressType { Id = 1, Text = "Primary", Code = "1" },
                        new Types.AddressType { Id = 2, Text = "Mailing", Code = "2" },
                        new Types.AddressType { Id = 3, Text = "Other", Code = "3" },
                        new Types.AddressType { Id = 4, Text = "Billing", Code = "4" }
                        );
                }
                #endregion
                #region States
                if (!context.States.Any())
                {
                    context.States.AddRange(
                        new Types.States { Id = 1, Text = "Alabama", Code = "AL" },
                        new Types.States { Id = 2, Text = "Alaska", Code = "AK" },
                        new Types.States { Id = 3, Text = "Arizona", Code = "AZ" },
                        new Types.States { Id = 4, Text = "Arkansas", Code = "AR" },
                        new Types.States { Id = 5, Text = "California", Code = "CA" },
                        new Types.States { Id = 6, Text = "Colorado", Code = "CO" },
                        new Types.States { Id = 7, Text = "Connecticut", Code = "CT" },
                        new Types.States { Id = 8, Text = "Delaware", Code = "DE" },
                        new Types.States { Id = 9, Text = "Florida", Code = "FL" },
                        new Types.States { Id = 10, Text = "Georgia", Code = "GA" },
                        new Types.States { Id = 11, Text = "Hawaii", Code = "HI" },
                        new Types.States { Id = 12, Text = "Idaho", Code = "ID" },
                        new Types.States { Id = 13, Text = "Illinois", Code = "IL" },
                        new Types.States { Id = 14, Text = "Indiana", Code = "IN" },
                        new Types.States { Id = 15, Text = "Iowa", Code = "IA" },
                        new Types.States { Id = 16, Text = "Kansas", Code = "KS" },
                        new Types.States { Id = 17, Text = "Kentucky", Code = "KY" },
                        new Types.States { Id = 18, Text = "Louisiana", Code = "LA" },
                        new Types.States { Id = 19, Text = "Maine", Code = "ME" },
                        new Types.States { Id = 20, Text = "Maryland", Code = "MD" },
                        new Types.States { Id = 21, Text = "Massachusetts", Code = "MA" },
                        new Types.States { Id = 22, Text = "Michigan", Code = "MI" },
                        new Types.States { Id = 23, Text = "Minnesota", Code = "MN" },
                        new Types.States { Id = 24, Text = "Mississippi", Code = "MS" },
                        new Types.States { Id = 25, Text = "Missouri", Code = "MO" },
                        new Types.States { Id = 26, Text = "Montana", Code = "MT" },
                        new Types.States { Id = 27, Text = "Nebraska", Code = "NE" },
                        new Types.States { Id = 28, Text = "Nevada", Code = "NV" },
                        new Types.States { Id = 29, Text = "New Hampshire", Code = "NH" },
                        new Types.States { Id = 30, Text = "New Jersey", Code = "NJ" },
                        new Types.States { Id = 31, Text = "New Mexico", Code = "NM" },
                        new Types.States { Id = 32, Text = "New York", Code = "NY" },
                        new Types.States { Id = 33, Text = "North Carolina", Code = "NC" },
                        new Types.States { Id = 34, Text = "North Dakota", Code = "ND" },
                        new Types.States { Id = 35, Text = "Ohio", Code = "OH" },
                        new Types.States { Id = 36, Text = "Oklahoma", Code = "OK" },
                        new Types.States { Id = 37, Text = "Oregon", Code = "OR" },
                        new Types.States { Id = 38, Text = "Pennsylvania", Code = "PA" },
                        new Types.States { Id = 39, Text = "Rhode Island", Code = "RI" },
                        new Types.States { Id = 40, Text = "South Carolina", Code = "SC" },
                        new Types.States { Id = 41, Text = "South Dakota", Code = "SD" },
                        new Types.States { Id = 42, Text = "Tennessee", Code = "TN" },
                        new Types.States { Id = 43, Text = "Texas", Code = "TX" },
                        new Types.States { Id = 44, Text = "Utah", Code = "UT" },
                        new Types.States { Id = 45, Text = "Vermont", Code = "VT" },
                        new Types.States { Id = 46, Text = "Virginia", Code = "VA" },
                        new Types.States { Id = 47, Text = "Washington", Code = "WA" },
                        new Types.States { Id = 48, Text = "West Virginia", Code = "WV" },
                        new Types.States { Id = 49, Text = "Wisconsin", Code = "WI" },
                        new Types.States { Id = 50, Text = "Wyoming", Code = "WY" },
                        new Types.States { Id = 51, Text = "Washington DC", Code = "DC" },
                        new Types.States { Id = 52, Text = "Wyoming", Code = "WY" }
                    );
                }
                #endregion
                #endregion

                #region SystemSettings
                if (!context.SystemSetting.Any())
                {
                    context.SystemSetting.AddRange(
                       new SystemSetting
                       {
                           Id = "AdoptionApplicationFee",
                           Value = "25.00"
                       },
                       new SystemSetting
                       {
                           Id = "AdoptionApplicationFormPath",
                           Value = ""
                       },
                       new SystemSetting
                       {
                           Id = "AdoptionApplicationOutputPath",
                           Value = "Undefined"
                       },
                       new SystemSetting
                       {
                           Id = "BraintreeIsProduction",
                           Value = "false"
                       },
                       new SystemSetting
                       {
                           Id = "BraintreeMerchantId",
                           Value = "sv97kx3h33r9g7xd"
                       },
                       new SystemSetting
                       {
                           Id = "BraintreePrivateKey",
                           Value = "c0d2f2b49050183746c590597a9c58a2"
                       },
                       new SystemSetting
                       {
                           Id = "BraintreePublicKey",
                           Value = "8t8p2x7j2mm8cqr7"
                       },
                       new SystemSetting
                       {
                           Id = "Email-Admin",
                           Value = "web-testers@texashuskyrescue.org"
                       },
                       new SystemSetting
                       {
                           Id = "Email-Board",
                           Value = "web-testers@texashuskyrescue.org"
                       },
                       new SystemSetting
                       {
                           Id = "Email-Contact",
                           Value = "web-testers@texashuskyrescue.org"
                       },
                       new SystemSetting
                       {
                           Id = "Email-Golf",
                           Value = "web-testers@texashuskyrescue.org"
                       },
                       new SystemSetting
                       {
                           Id = "Email-Intake",
                           Value = "web-testers@texashuskyrescue.org"
                       },
                       new SystemSetting
                       {
                           Id = "Email-RoughRiders",
                           Value = "web-testers@texashuskyrescue.org"
                       },
                       new SystemSetting
                       {
                           Id = "Email-WebAdmin",
                           Value = "web-testers@texashuskyrescue.org"
                       },
                       new SystemSetting
                       {
                           Id = "facebook-app-id",
                           Value = "321434264706690"
                       },
                       new SystemSetting
                       {
                           Id = "facebook-app-secret",
                           Value = "fa8a5de929ba2be2c3603de0a58cfa10"
                       },
                       new SystemSetting
                       {
                           Id = "GolfBanquetTicketCost",
                           Value = "35.00"
                       },
                       new SystemSetting
                       {
                           Id = "GolfTicketCost",
                           Value = "125.00"
                       },
                       new SystemSetting
                       {
                           Id = "GolfTournamentId",
                           Value = "Undefined"
                       },
                       new SystemSetting
                       {
                           Id = "PostMarkKey",
                           Value = "4a882cd4-ddd1-4b19-af75-98ac1608be2a"
                       },
                       new SystemSetting
                       {
                           Id = "RecaptchaPrivateKey",
                           Value = "6LdZlt8SAAAAAFzt3c8ofJfCTcgmw5_mOtkBi3iC"
                       },
                       new SystemSetting
                       {
                           Id = "RecaptchaPublicKey",
                           Value = "6LdZlt8SAAAAAFNr2_gJ-E-jB57p8J3FxCiputxE"
                       },
                       new SystemSetting
                       {
                           Id = "RescueGroups-Api-Key",
                           Value = "v7YZ2Eh3"
                       },
                       new SystemSetting
                       {
                           Id = "RescueGroups-Api-Uri",
                           Value = "https://api.rescuegroups.org/http/json"
                       }
                    );
                    context.SaveChanges();
                }
                #endregion

                #region Golf Event
                if (!context.EventGolf.Any())
                {
                    var golfEventId = Guid.NewGuid();
                    var businessId = Guid.NewGuid();

                    var setting = context.SystemSetting.Single(s => s.Id == "GolfTournamentId");
                    setting.Value = golfEventId.ToString();
                    context.Update(setting);

                    context.Business.Add(
                        new Business
                        {
                            Id = businessId,
                            CanEmail = true,
                            CanSnailMail = false,
                            EIN = "11-1111111",
                            IsActive = true,
                            IsDeleted = false,
                            IsAnimalClinic = false,
                            IsBoardingPlace = false,
                            IsDonor = false,
                            IsDoNotUse = false,
                            IsGrantGiver = false,
                            IsSponsor = false,
                            Name = "Coyote Ridge Golf Club",
                            CreatedTimestamp = DateTime.Now
                        });

                    context.Address.Add(
                        new Address
                        {
                            Id = Guid.NewGuid(),
                            BusinessId = businessId,
                            Address1 = "1640 West Hebron Parkway",
                            City = "Carrollton",
                            StatesId = 43,
                            ZipCode = "75010",
                            IsBillingAddress = false,
                            IsShippingAddress = true,
                            CountryId = "US",
                            AddressTypeId = 1
                        });

                    context.Phone.Add(
                        new Phone
                        {
                            Id = Guid.NewGuid(),
                            BusinessId = businessId,
                            Number = "9723950786",
                            PhoneTypeId = 1
                        });

                    context.EventGolf.Add(
                        new EventGolf
                        {
                            Id = golfEventId,
                            BusinessId = businessId,
                            AreTicketsSold = false,
                            BannerImagePath = string.Empty,
                            BanquetStartTime = new TimeSpan(18, 00, 0),
                            GolfingStartTime = new TimeSpan(12, 0, 0),
                            RegistrationStartTime = new TimeSpan(11, 30, 0),
                            StartTime = new TimeSpan(11, 30, 0),
                            EndTime = new TimeSpan(21, 0, 0),
                            CostBanquet = 35,
                            CostFoursome = 500,
                            CostSingle = 125,
                            DateAdded = DateTime.Now,
                            DateOfEvent = new DateTime(2016, 9, 30),
                            EventTypeId = 1, //Fundraiser
                            IsActive = true,
                            IsDeleted = false,
                            Name = "2016 Golf Tournament",
                            PublicDescription = @"We'd like to invite you to be part of Texas Husky Rescue's 6<sup>th</sup> Annual Golf Tournament.  This is a great opportunity for you and your business to gain great exposure all while helping a worthy cause.  And what an outstanding course to play - <a href='http://www.coyoteridgegolfclub.com/' target='_blank'>Coyote Ridge Golf Club</a>!  You don't want to miss this opportunity, so please consider supporting us by playing, sponsoring or donating.",
                            TournamentType = "Shotgun",
                            WelcomeMessage = ""
                        });
                    #endregion
                }
                context.SaveChanges();
            }
        }
    }
}

