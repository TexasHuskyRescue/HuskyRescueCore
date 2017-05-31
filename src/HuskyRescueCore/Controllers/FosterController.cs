using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HuskyRescueCore.Models.RescueGroupViewModels;

using HuskyRescueCore.Services;
using HuskyRescueCore.Data;
using Microsoft.Extensions.Logging;
using HuskyRescueCore.Models.FosterViewModels;
using Microsoft.AspNetCore.Mvc.Rendering;
using HuskyRescueCore.Helpers.PostRequestGet;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace HuskyRescueCore.Controllers
{

    public class FosterController : Controller
    {
        private readonly IRescueGroupsService _rescueGroupsService;
        private readonly ApplicationDbContext _context;
        private readonly ISystemSettingService _systemServices;
        private readonly IEmailSender _emailService;
        private readonly IFormSerivce _formService;
        private readonly ILogger<AdoptController> _logger;
        private readonly IStorageService _storageService;

        public FosterController(ApplicationDbContext context,
            ISystemSettingService systemServices, IEmailSender emailService, IRescueGroupsService rescuegroupService,
            IFormSerivce formService, ILogger<AdoptController> logger, IStorageService storageService)
        {
            _systemServices = systemServices;
            _emailService = emailService;
            _context = context;
            _rescueGroupsService = rescuegroupService;
            _formService = formService;
            _logger = logger;
            _storageService = storageService;
        }

        public async Task<IActionResult> Index()
        {
            _logger.LogInformation("Start FosterController.Index Get");
            //var huskies = await _rescueGroupsService.GetFosterableHuskiesAsync();
            var huskies = await _rescueGroupsService.GetAdoptableHuskiesAsync();
            _logger.LogInformation("Cont. FosterController.Index Get: {@huskies}", huskies);
            // using a lookup that will work so that the page will load. Not sure we need this view since the adoptable huskies page has a 'filter' to
            // show dogs that need foster. Otherwise, we need to work around 'animalNeedsFoster' being a volunteer level search, not a public search.
            var model = new RescueGroupAnimals();
            if (huskies != null)
            {
                if (huskies.Count > 0)
                {
                    model = new RescueGroupAnimals { Animals = huskies };
                }
            }
            _logger.LogInformation("End FosterController.Index Get: {@model}", model);
            return View(model);
        }

        public IActionResult Process()
        {
            return View();
        }

        [ImportModelState]
        public IActionResult Apply()
        {
            _logger.LogInformation("Start FosterController.Apply Get");
            var model = new ApplyToFosterViewModel();

            model.AppAddressStateList = new List<SelectListItem>();
            var states = _context.States.ToList();
            model.AppAddressStateList = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();

            model.ResidenceOwnershipList = new List<SelectListItem>();
            var ownershipTypes = _context.ApplicationResidenceOwnershipType.ToList();
            foreach (var item in ownershipTypes.Where(w => w.Code == "0")) { item.Code = string.Empty; }
            model.ResidenceOwnershipList = (ownershipTypes.Select(i => new SelectListItem { Text = i.Text, Value = i.Code })).AsEnumerable();

            model.ResidencePetDepositCoverageList = new List<SelectListItem>();
            var coverageTypes = _context.ApplicationResidencePetDepositCoverageType.ToList();
            foreach (var item in coverageTypes.Where(w => w.Code == "0")) { item.Code = string.Empty; }
            model.ResidencePetDepositCoverageList = (coverageTypes.Select(i => new SelectListItem { Text = i.Text, Value = i.Code })).AsEnumerable();

            model.ResidenceTypeList = new List<SelectListItem>();
            var residenceTypes = _context.ApplicationResidenceType.ToList();
            foreach (var item in residenceTypes.Where(w => w.Code == "0")) { item.Code = string.Empty; }
            model.ResidenceTypeList = (residenceTypes.Select(i => new SelectListItem { Text = i.Text, Value = i.Code })).AsEnumerable();

            model.StudentTypeList = new List<SelectListItem>();
            var studentTypes = _context.ApplicationStudentType.ToList();
            foreach (var item in studentTypes.Where(w => w.Code == "0")) { item.Code = string.Empty; }
            model.StudentTypeList = (studentTypes.Select(i => new SelectListItem { Text = i.Text, Value = i.Code })).AsEnumerable();

            model.AppDateBirth = DateTime.Now.AddYears(-21);

            _logger.LogInformation("End Foster Apply Get: {@model}", model);
            _logger.LogInformation("End FosterController.Apply Get: {@model}", model);
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ExportModelState]
        public async Task<IActionResult> Apply(ApplyToFosterViewModel model)
        {
            _logger.LogInformation("Start FosterController.Apply POST: {@model}", model);
            // TODO: add exception handling and display error message to user

            try
            {
                // get model state errors
                var errors = ModelState.Values.SelectMany(v => v.Errors);

                _logger.LogInformation("Cont. FosterController.Apply POST: {@ModelStateErrors}", errors);
                // if paying with a credit card the fields for credit card number/cvs/month/year will be invalid because we do not send them to the server
                // so count the errors on the field validation that do not start with 'card ' (comes from the property attributes in the model class Apply.cs)
                // TODO validate if this is still needed - all card validation has been removed b/c client side validation requires 'name' properties
                //      which have been removed for PCI compliance. 
                var errorCount = errors.Count(m => !m.ErrorMessage.StartsWith("card "));

                if (errorCount == 0)
                {
                    var result = new ServiceResult();

                    #region Database
                    _logger.LogInformation("Cont. FosterController.Apply POST - Datbase Start");

                    var personId = Guid.NewGuid();
                    var applicantId = Guid.NewGuid();

                    #region Copy ViewModel to database Model
                    var dbFosterApplicant = new Models.ApplicationFoster
                    {
                        Id = applicantId,
                        PersonId = personId,
                        AppAddressStateId = model.AppAddressStateId,
                        AppAddressCity = model.AppAddressCity,
                        AppAddressStreet1 = model.AppAddressStreet1,
                        AppAddressZIP = model.AppAddressZip,
                        AppCellPhone = model.AppCellPhone,
                        AppDateBirth = model.AppDateBirth,
                        AppEmail = model.AppEmail,
                        AppEmployer = model.AppEmployer,
                        AppHomePhone = model.AppHomePhone,
                        AppNameFirst = model.AppNameFirst,
                        AppNameLast = model.AppNameLast,
                        AppSpouseNameFirst = model.AppSpouseNameFirst,
                        AppSpouseNameLast = model.AppSpouseNameLast,
                        AppTravelFrequency = model.AppTravelFrequency,
                        FilterAppCatsOwnedCount = model.FilterAppCatsOwnedCount,
                        FilterAppDogsInterestedIn = model.FilterAppDogsInterestedIn,
                        FilterAppHasOwnedHuskyBefore = model.FilterAppHasOwnedHuskyBefore != null && model.FilterAppHasOwnedHuskyBefore.Value,
                        FilterAppIsAwareHuskyAttributes = model.FilterAppIsAwareHuskyAttributes != null && model.FilterAppIsAwareHuskyAttributes.Value,
                        FilterAppIsCatOwner = model.FilterAppIsCatOwner != null && model.FilterAppIsCatOwner.Value,
                        FilterAppTraitsDesired = model.FilterAppTraitsDesired,
                        DateSubmitted = DateTime.Today,
                        IsAllAdultsAgreedOnAdoption = model.IsAllAdultsAgreedOnAdoption,
                        IsAllAdultsAgreedOnAdoptionReason = model.IsAllAdultsAgreedOnAdoptionReason,
                        IsAppOrSpouseStudent = model.IsAppOrSpouseStudent != null && model.IsAppOrSpouseStudent.Value,
                        IsAppTravelFrequent = model.IsAppTravelFrequent != null && model.IsAppTravelFrequent.Value,
                        //IsPetAdoptionReasonCompanionChild = model.IsPetAdoptionReasonCompanionChild,
                        //IsPetAdoptionReasonCompanionPet = model.IsPetAdoptionReasonCompanionPet,
                        //IsPetAdoptionReasonGift = model.IsPetAdoptionReasonGift,
                        //IsPetAdoptionReasonGuardDog = model.IsPetAdoptionReasonGuardDog,
                        //IsPetAdoptionReasonHousePet = model.IsPetAdoptionReasonHousePet,
                        //IsPetAdoptionReasonJoggingPartner = model.IsPetAdoptionReasonJoggingPartner,
                        //IsPetAdoptionReasonOther = model.IsPetAdoptionReasonOther,
                        //IsPetAdoptionReasonWatchDog = model.IsPetAdoptionReasonWatchDog,
                        //PetAdoptionReasonExplain = model.PetAdoptionReasonExplain,
                        IsPetKeptLocationAloneRestrictionBasement = model.IsPetKeptLocationAloneRestrictionBasement,
                        IsPetKeptLocationAloneRestrictionCratedIndoors = model.IsPetKeptLocationAloneRestrictionCratedIndoors,
                        IsPetKeptLocationAloneRestrictionCratedOutdoors = model.IsPetKeptLocationAloneRestrictionCratedOutdoors,
                        IsPetKeptLocationAloneRestrictionGarage = model.IsPetKeptLocationAloneRestrictionGarage,
                        IsPetKeptLocationAloneRestrictionLooseInBackyard = model.IsPetKeptLocationAloneRestrictionLooseInBackyard,
                        IsPetKeptLocationAloneRestrictionLooseIndoors = model.IsPetKeptLocationAloneRestrictionLooseIndoors,
                        IsPetKeptLocationAloneRestrictionOther = model.IsPetKeptLocationAloneRestrictionOther,
                        IsPetKeptLocationAloneRestrictionOutsideKennel = model.IsPetKeptLocationAloneRestrictionOutsideKennel,
                        IsPetKeptLocationAloneRestrictionTiedUpOutdoors = model.IsPetKeptLocationAloneRestrictionTiedUpOutdoors,
                        IsPetKeptLocationInOutDoorMostlyOutside = model.IsPetKeptLocationInOutDoorMostlyOutsides,
                        IsPetKeptLocationInOutDoorsMostlyInside = model.IsPetKeptLocationInOutDoorsMostlyInside,
                        IsPetKeptLocationInOutDoorsTotallyInside = model.IsPetKeptLocationInOutDoorsTotallyInside,
                        IsPetKeptLocationInOutDoorsTotallyOutside = model.IsPetKeptLocationInOutDoorsTotallyOutside,
                        IsPetKeptLocationSleepingRestrictionBasement = model.IsPetKeptLocationSleepingRestrictionBasement,
                        IsPetKeptLocationSleepingRestrictionCratedIndoors = model.IsPetKeptLocationSleepingRestrictionCratedIndoors,
                        IsPetKeptLocationSleepingRestrictionCratedOutdoors = model.IsPetKeptLocationSleepingRestrictionCratedOutdoors,
                        IsPetKeptLocationSleepingRestrictionGarage = model.IsPetKeptLocationSleepingRestrictionGarage,
                        IsPetKeptLocationSleepingRestrictionInBedOwner = model.IsPetKeptLocationSleepingRestrictionBedWithOwner,
                        IsPetKeptLocationSleepingRestrictionLooseInBackyard = model.IsPetKeptLocationSleepingRestrictionLooseInBackyard,
                        IsPetKeptLocationSleepingRestrictionLooseIndoors = model.IsPetKeptLocationSleepingRestrictionLooseIndoors,
                        IsPetKeptLocationSleepingRestrictionOther = model.IsPetKeptLocationSleepingRestrictionOther,
                        IsPetKeptLocationSleepingRestrictionOutsideKennel = model.IsPetKeptLocationSleepingRestrictionOutsideKennel,
                        IsPetKeptLocationSleepingRestrictionTiedUpOutdoors = model.IsPetKeptLocationSleepingRestrictionTiedUpOutdoors,
                        ResIdenceIsYardFenced = model.ResidenceIsYardFenced != null && model.ResidenceIsYardFenced.Value,
                        ResidenceAgesOfChildren = model.ResidenceAgesOfChildren,
                        ResidenceFenceTypeHeight = model.ResidenceFenceTypeHeight,
                        ResidenceIsPetAllowed = model.ResidenceIsPetAllowed,
                        ResidenceIsPetDepositPaid = model.ResidenceIsPetDepositPaid,
                        ResidenceIsPetDepositRequired = model.ResidenceIsPetDepositRequired,
                        ResidenceLandlordName = model.ResidenceLandlordName,
                        ResidenceLandlordNumber = model.ResidenceLandlordNumber,
                        ResidenceLengthOfResidence = model.ResidenceLengthOfResidence,
                        ResidenceNumberOccupants = model.ResidenceNumberOccupants,
                        ApplicationResidenceOwnershipTypeId = model.ResidenceOwnershipId,
                        ResidencePetDepositAmount = model.ResidencePetDepositAmount,
                        ApplicationResidencePetDepositCoverageTypeId = model.ResidencePetDepositCoverageId,
                        ResidencePetSizeWeightLimit = model.ResidencePetSizeWeightLimit,
                        ApplicationResidenceTypeId = model.ResidenceTypeId,
                        PetLeftAloneDays = model.PetLeftAloneDays,
                        PetLeftAloneHours = model.PetLeftAloneHours,
                        ApplicationStudentTypeId = model.StudentTypeId,
                        PetKeptLocationAloneRestriction = model.PetKeptLocationAloneRestriction,
                        PetKeptLocationAloneRestrictionExplain = model.PetKeptLocationAloneRestrictionExplain,
                        PetKeptLocationInOutDoors = model.PetKeptLocationInOutDoors,
                        PetKeptLocationInOutDoorsExplain = model.PetKeptLocationInOutDoorsExplain,
                        PetKeptLocationSleepingRestriction = model.PetKeptLocationSleepingRestriction,
                        PetKeptLocationSleepingRestrictionExplain = model.PetKeptLocationSleepingRestrictionExplain,
                        WhatIfMovingPetPlacement = model.WhatIfMovingPetPlacement,
                        WhatIfTravelPetPlacement = model.WhatIfTravelPetPlacement,
                        Comments = model.Comments,
                        VeterinarianDoctorName = model.VeterinarianDoctorName,
                        VeterinarianOfficeName = model.VeterinarianOfficeName,
                        VeterinarianPhoneNumber = model.PhoneNumber
                    };

                    dbFosterApplicant.ApplicationFosterStatuses = new List<Models.ApplicationFosterStatus> {
                            new Models.ApplicationFosterStatus {
                                Id = 0,
                                ApplicationFosterId = applicantId,
                                ApplicationFosterStatusTypeId = 0,
                                Timestamp = DateTime.Now
                            }
                        };

                    dbFosterApplicant.ApplicationAppAnimals = new List<Models.ApplicationAppAnimal>();

                    if (!string.IsNullOrEmpty(model.Name1))
                    {
                        dbFosterApplicant.ApplicationAppAnimals.Add(new Models.ApplicationAppAnimal
                        {
                            Id = Guid.NewGuid(),
                            ApplicantId = applicantId,
                            Age = model.Age1,
                            Breed = model.Breed1,
                            Sex = model.Sex1,
                            OwnershipLength = model.OwnershipLength1,
                            Name = model.Name1,
                            IsAltered = model.IsAltered1 != null && model.IsAltered1.Value,
                            AlteredReason = model.AlteredReason1,
                            IsFullyVaccinated = model.IsFullyVaccinated1 != null && model.IsFullyVaccinated1.Value,
                            FullyVaccinatedReason = model.FullyVaccinatedReason1,
                            IsHwPrevention = model.IsHwPrevention1 != null && model.IsHwPrevention1.Value,
                            HwPreventionReason = model.HwPreventionReason1,
                            IsStillOwned = model.IsStillOwned1 != null && model.IsStillOwned1.Value,
                            IsStillOwnedReason = model.IsStillOwnedReason1
                        });
                    }
                    if (!string.IsNullOrEmpty(model.Name2))
                    {
                        dbFosterApplicant.ApplicationAppAnimals.Add(new Models.ApplicationAppAnimal
                        {
                            Id = Guid.NewGuid(),
                            ApplicantId = applicantId,
                            Age = model.Age2,
                            Breed = model.Breed2,
                            Sex = model.Sex2,
                            OwnershipLength = model.OwnershipLength2,
                            Name = model.Name2,
                            IsAltered = model.IsAltered2 != null && model.IsAltered2.Value,
                            AlteredReason = model.AlteredReason2,
                            IsFullyVaccinated = model.IsFullyVaccinated2 != null && model.IsFullyVaccinated2.Value,
                            FullyVaccinatedReason = model.FullyVaccinatedReason2,
                            IsHwPrevention = model.IsHwPrevention2 != null && model.IsHwPrevention2.Value,
                            HwPreventionReason = model.HwPreventionReason2,
                            IsStillOwned = model.IsStillOwned2 != null && model.IsStillOwned2.Value,
                            IsStillOwnedReason = model.IsStillOwnedReason2
                        });
                    }
                    if (!string.IsNullOrEmpty(model.Name3))
                    {
                        dbFosterApplicant.ApplicationAppAnimals.Add(new Models.ApplicationAppAnimal
                        {
                            Id = Guid.NewGuid(),
                            ApplicantId = applicantId,
                            Age = model.Age3,
                            Breed = model.Breed3,
                            Sex = model.Sex3,
                            OwnershipLength = model.OwnershipLength3,
                            Name = model.Name3,
                            IsAltered = model.IsAltered3 != null && model.IsAltered3.Value,
                            AlteredReason = model.AlteredReason3,
                            IsFullyVaccinated = model.IsFullyVaccinated3 != null && model.IsFullyVaccinated3.Value,
                            FullyVaccinatedReason = model.FullyVaccinatedReason3,
                            IsHwPrevention = model.IsHwPrevention3 != null && model.IsHwPrevention3.Value,
                            HwPreventionReason = model.HwPreventionReason3,
                            IsStillOwned = model.IsStillOwned3 != null && model.IsStillOwned3.Value,
                            IsStillOwnedReason = model.IsStillOwnedReason3
                        });
                    }
                    if (!string.IsNullOrEmpty(model.Name4))
                    {
                        dbFosterApplicant.ApplicationAppAnimals.Add(new Models.ApplicationAppAnimal
                        {
                            Id = Guid.NewGuid(),
                            ApplicantId = applicantId,
                            Age = model.Age4,
                            Breed = model.Breed4,
                            Sex = model.Sex4,
                            OwnershipLength = model.OwnershipLength4,
                            Name = model.Name4,
                            IsAltered = model.IsAltered4 != null && model.IsAltered4.Value,
                            AlteredReason = model.AlteredReason4,
                            IsFullyVaccinated = model.IsFullyVaccinated4 != null && model.IsFullyVaccinated4.Value,
                            FullyVaccinatedReason = model.FullyVaccinatedReason4,
                            IsHwPrevention = model.IsHwPrevention4 != null && model.IsHwPrevention4.Value,
                            HwPreventionReason = model.HwPreventionReason4,
                            IsStillOwned = model.IsStillOwned4 != null && model.IsStillOwned4.Value,
                            IsStillOwnedReason = model.IsStillOwnedReason4
                        });
                    }
                    if (!string.IsNullOrEmpty(model.Name5))
                    {
                        dbFosterApplicant.ApplicationAppAnimals.Add(new Models.ApplicationAppAnimal
                        {
                            Id = Guid.NewGuid(),
                            ApplicantId = applicantId,
                            Age = model.Age5,
                            Breed = model.Breed5,
                            Sex = model.Sex5,
                            OwnershipLength = model.OwnershipLength5,
                            Name = model.Name5,
                            IsAltered = model.IsAltered5 != null && model.IsAltered5.Value,
                            AlteredReason = model.AlteredReason5,
                            IsFullyVaccinated = model.IsFullyVaccinated5 != null && model.IsFullyVaccinated5.Value,
                            FullyVaccinatedReason = model.FullyVaccinatedReason5,
                            IsHwPrevention = model.IsHwPrevention5 != null && model.IsHwPrevention5.Value,
                            HwPreventionReason = model.HwPreventionReason5,
                            IsStillOwned = model.IsStillOwned5 != null && model.IsStillOwned5.Value,
                            IsStillOwnedReason = model.IsStillOwnedReason5
                        });
                    }

                    var dbPerson = new Models.Person
                    {
                        Id = personId,
                        CreatedTimestamp = DateTime.Today,
                        FirstName = model.AppNameFirst,
                        LastName = model.AppNameLast,
                        IsActive = true,
                        IsAdopter = true,
                        FullName = model.AppFullName,
                        CanEmail = model.IsEmailable.HasValue ? model.IsEmailable.Value : false
                    };

                    dbPerson.Addresses = new List<Models.Address> {
                            new Models.Address
                            {
                                Id = Guid.NewGuid(),
                                PersonId = personId,
                                Address1 = model.AppAddressStreet1,
                                StatesId = model.AppAddressStateId,
                                AddressTypeId = 1, //Primary
                                City = model.AppAddressCity,
                                IsShippingAddress = true,
                                ZipCode = model.AppAddressZip,

                            }
                        };

                    if (!string.IsNullOrEmpty(model.AppEmail))
                    {
                        dbPerson.Emails = new List<Models.Email>
                                        {
                                            new Models.Email
                                            {
                                                Id = Guid.NewGuid(),
                                                PersonId = personId,
                                                Address = model.AppEmail,
                                                EmailTypeId = 0
                                            }
                                        };
                    }

                    if (!string.IsNullOrEmpty(model.AppHomePhone) || !string.IsNullOrEmpty(model.AppCellPhone))
                    {
                        dbPerson.Phones = new List<Models.Phone>();
                        if (!string.IsNullOrEmpty(model.AppHomePhone))
                        {
                            dbPerson.Phones.Add(new Models.Phone
                            {
                                Id = Guid.NewGuid(),
                                PersonId = personId,
                                Number = model.AppHomePhone,
                                PhoneTypeId = 1
                            });
                        }
                        if (!string.IsNullOrEmpty(model.AppCellPhone))
                        {
                            dbPerson.Phones.Add(new Models.Phone
                            {
                                Id = Guid.NewGuid(),
                                PersonId = personId,
                                Number = model.AppCellPhone,
                                PhoneTypeId = 1
                            });
                        }
                    }
                    #endregion

                    _logger.LogInformation("Cont. FosterController.Apply POST - Datbase Cont. - {@dbApplicant}", dbFosterApplicant);
                    _logger.LogInformation("Cont. FosterController.Apply POST - Datbase Cont. - {@dbPerson}", dbPerson);

                    #region Add to Database
                    _context.Add(dbFosterApplicant);
                    _context.Add(dbPerson);
                    #endregion

                    #region Save to Database and check exceptions
                    try
                    {
                        _logger.LogInformation("Cont. FosterController.Apply POST - Datbase Cont. - Saving application to database: {@dbApplicant}", dbFosterApplicant);
                        var numChanges = _context.SaveChanges();
                        if (numChanges > 0)
                        {
                            result.IsSuccess = true;
                        }
                    }
                    catch (DbUpdateException ex)
                    {
                        _logger.LogError("Cont. FosterController.Apply POST - Datbase Cont. - Database Update Exception saving Applicant - {@DbUpdateException}", ex);
                    }
                    catch (InvalidOperationException ex)
                    {
                        _logger.LogError("Cont. FosterController.Apply POST - Datbase Cont. - Invalid Operation Exception saving Applicant - {@InvalidOperationException}", ex);
                    }
                    #endregion
                    _logger.LogInformation("Cont. FosterController.Apply POST - Datbase end");
                    #endregion

                    #region Generate PDF
                    _logger.LogInformation("Cont. FosterController.Apply POST - PDF Gen Start");
                    var newPdfFileName = await _formService.CreateFosterApplicationPdf(dbFosterApplicant);
                    _logger.LogInformation("Cont. FosterController.Apply POST - PDF Gen End");
                    #endregion

                    #region Send Emails
                    _logger.LogInformation("Cont. FosterController.Apply POST - Emails Send Start");

                    var groupEmail = _systemServices.GetSetting("Email-Contact").Value;

                    var subject = string.Join(" - ", "[TXHR Web Foster App]", model.AppFullName);

                    var bodyText = string.Format(@"Thank you for your foster application.
                                Attached is a copy of your foster application sent to Texas Husky Rescue, Inc.
                                You can respond back to this email if you have any further questions or comments for us.
                                We will get back to you within the next 7 days regarding your foster application.");

                    byte[] pdfContentBytes;

                    _logger.LogInformation("Cont. FosterController.Apply POST - Emails Send Cont - Start Get Application from Storage");
                    using (var stream = new MemoryStream())
                    {
                        await _storageService.GetAppFoster(newPdfFileName, stream);
                        pdfContentBytes = stream.ToArray();
                    }
                    _logger.LogInformation("Cont. FosterController.Apply POST - Emails Send Cont - End Get Application from Storage");

                    var attachment = new PostmarkDotNet.PostmarkMessageAttachment
                    {
                        Content = Convert.ToBase64String(pdfContentBytes),
                        ContentId = Path.GetFileName(newPdfFileName),
                        ContentType = "application/pdf",
                        Name = Path.GetFileName(newPdfFileName)
                    };

                    var attachments = new List<PostmarkDotNet.PostmarkMessageAttachment> { attachment };

                    // Send email to the adopter
                    _logger.LogInformation("Cont. FosterController.Apply POST - Emails Send Cont - Start send email to the adopter");
                    var emailAppResult = await _emailService.SendEmailAsync(model.AppEmail, groupEmail, groupEmail, subject, bodyText, "foster", attachments);
                    _logger.LogInformation("Cont. FosterController.Apply POST - Emails Send Cont - End send email to the adopter");

                    bodyText = "Dogs interested in: " + model.FilterAppDogsInterestedIn + Environment.NewLine + Environment.NewLine;
                    bodyText += "Comments from app: " + model.Comments;

                    _logger.LogInformation("Cont. FosterController.Apply POST - Emails Send Cont - Start send email to the rescue");
                    var emailGroupResult = await _emailService.SendEmailAsync(groupEmail, groupEmail, groupEmail, subject, bodyText, "foster", attachments);
                    _logger.LogInformation("Cont. FosterController.Apply POST - Emails Send Cont - End send email to the rescue");

                    _logger.LogInformation("Cont. FosterController.Apply POST - Emails Send End");
                    #endregion

                    if (result.IsSuccess)
                    {
                        _logger.LogInformation("End FosterController.Apply POST - Success - Redirecto to ThankYou");
                        return RedirectToAction("ThankYou");
                    }
                    else
                    {
                        _logger.LogInformation("Cont. FosterController.Apply POST - Failure - Redirecto to Apply with errors");
                        foreach (var error in result.Messages)
                        {
                            ModelState.AddModelError(error.GetHashCode().ToString(), error);
                            _logger.LogError("Cont. FosterController.Apply POST - Failure - {FosterApplicationError}", error);
                        }

                        _logger.LogError("End FosterController.Apply POST - Failure - {@FosterApplication}", model);
                        return View(model);
                    }
                }
                _logger.LogInformation("Foster App Model Errors {@app}", model);
                foreach (var error in errors.ToList())
                {
                    _logger.LogError("Cont. FosterController.Apply POST - Failure - {FosterApplicationError}", error);
                }
                _logger.LogInformation("End FosterController.Apply POST - Foster App Model Errors {@FosterApplication}", model);
                return View(model);
            }
            catch (Exception dex)
            {
                //Log the error (uncomment dex variable name and add a line here to write a log.
                ModelState.AddModelError("", "Unable to save changes. Try again, and if the problem persists see your system administrator.");
                _logger.LogError("End FosterController.Apply POST - Data Exception saving Foster Application {@exception} - {@FosterApplication}", dex, model);
            }

            return View(model);
        }


        public IActionResult ThankYou()
        {
            return View();
        }
    }
}