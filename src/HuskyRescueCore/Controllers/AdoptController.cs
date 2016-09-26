using HuskyRescueCore.Data;
using HuskyRescueCore.Helpers.PostRequestGet;
using HuskyRescueCore.Models.AdopterViewModels;
using HuskyRescueCore.Models.BrainTreeViewModels;
using HuskyRescueCore.Models.RescueGroupViewModels;
using HuskyRescueCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PaulMiami.AspNetCore.Mvc.Recaptcha;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Controllers
{
    public class AdoptController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ISystemSettingService _systemServices;
        private readonly IEmailSender _emailService;
        private readonly IRescueGroupsService _rescuegroupService;
        private readonly IBraintreePaymentService _paymentService;
        private readonly IFormSerivce _formService;
        private readonly ILogger<AdoptController> _logger;
        private readonly IStorageService _storageService;

        public AdoptController(ApplicationDbContext context,
            ISystemSettingService systemServices, IEmailSender emailService, IRescueGroupsService rescuegroupService, IBraintreePaymentService paymentService, IFormSerivce formService, ILogger<AdoptController> logger, IStorageService storageService)
        {
            _systemServices = systemServices;
            _emailService = emailService;
            _context = context;
            _rescuegroupService = rescuegroupService;
            _paymentService = paymentService;
            _formService = formService;
            _logger = logger;
            _storageService = storageService;
        }

        public async Task<IActionResult> Index()
        {
            var huskies = await _rescuegroupService.GetAdoptableHuskiesAsync();
            var model = new RescueGroupAnimals { Animals = huskies };
            return View(model);
        }

        public IActionResult Process()
        {
            return View();
        }

        [ImportModelState]
        public IActionResult Apply()
        {
            _logger.LogInformation("Start Apply Get");
            var model = new ApplyToAdoptViewModel();

            model.AppAddressStateList = new List<SelectListItem>();
            var states = _context.States.ToList();
            model.AppAddressStateList = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();
            model.BrainTreePayment.States = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();

            model.ResidenceOwnershipList = new List<SelectListItem>();
            var ownershipTypes = _context.ApplicationResidenceOwnershipType.ToList();
            model.ResidenceOwnershipList = (ownershipTypes.Select(i => new SelectListItem { Text = i.Text, Value = i.Code })).AsEnumerable();

            model.ResidencePetDepositCoverageList = new List<SelectListItem>();
            var coverageTypes = _context.ApplicationResidencePetDepositCoverageType.ToList();
            model.ResidencePetDepositCoverageList = (coverageTypes.Select(i => new SelectListItem { Text = i.Text, Value = i.Code })).AsEnumerable();

            model.ResidenceTypeList = new List<SelectListItem>();
            var residenceTypes = _context.ApplicationResidenceType.ToList();
            model.ResidenceTypeList = (residenceTypes.Select(i => new SelectListItem { Text = i.Text, Value = i.Code })).AsEnumerable();

            model.StudentTypeList = new List<SelectListItem>();
            var studentTypes = _context.ApplicationStudentType.ToList();
            model.StudentTypeList = (studentTypes.Select(i => new SelectListItem { Text = i.Text, Value = i.Code })).AsEnumerable();

            model.AppDateBirth = DateTime.Now.AddYears(-21);

            #region Payment
            // Values needed for submitting a payment to BrainTree
            var token = _paymentService.GetClientToken(string.Empty);
            ViewData.Add("clientToken", token);
            ViewData.Add("merchantId", _systemServices.GetSetting("BraintreeMerchantId").Value);
            ViewData.Add("environment", _systemServices.GetSetting("BraintreeIsProduction").Value);
            model.ApplicationFeeAmount = decimal.Parse(_systemServices.GetSetting("AdoptionApplicationFee").Value);
            #endregion
            _logger.LogInformation("End Apply Get: {@model}", model);
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ExportModelState]
        public async Task<IActionResult> Apply(ApplyToAdoptViewModel model)
        {
            // TODO: add exception handling and display error message to user

            // payment information in an encrypted string rather than sending the payment information to the server from the client
            if (string.IsNullOrEmpty(model.BrainTreePayment.Nonce))
            {
                ModelState.AddModelError("", "incomplete payment information provided");
            }
            else
            {
                try
                {
                    // get model state errors
                    var errors = ModelState.Values.SelectMany(v => v.Errors);

                    // if paying with a credit card the fields for credit card number/cvs/month/year will be invalid because we do not send them to the server
                    // so count the errors on the field validation that do not start with 'card ' (comes from the property attributes in the model class Apply.cs)
                    // TODO validate if this is still needed - all card validation has been removed b/c client side validation requires 'name' properties
                    //      which have been removed for PCI compliance. 
                    var errorCount = errors.Count(m => !m.ErrorMessage.StartsWith("card "));

                    if (errorCount == 0)
                    {
                        var result = new ServiceResult();

                        #region Process Payment
                        var paymentMethod = (Models.BrainTreeViewModels.PaymentTypeEnum)Enum.Parse(typeof(Models.BrainTreeViewModels.PaymentTypeEnum), model.BrainTreePayment.PaymentMethod);
                        var phone = string.IsNullOrEmpty(model.AppCellPhone) ? model.AppHomePhone : model.AppCellPhone;
                        var paymentResult = new ServiceResult();

                        var paymentRequestResult = new ServiceResult();

                        if (paymentMethod == PaymentTypeEnum.Paypal)
                        {
                            paymentResult = _paymentService.SendPayment(model.ApplicationFeeAmount,
                                                    model.BrainTreePayment.Nonce,
                                                    true,
                                                    paymentMethod,
                                                    model.BrainTreePayment.DeviceData,
                                                    "adoption app fee",
                                                    model.Comments,
                                                    model.BrainTreePayment.PayeeFirstName,
                                                    model.BrainTreePayment.PayeeLastName,
                                                    phone,
                                                    model.AppEmail);
                        }
                        else
                        {
                            var stateCode = _context.States.Single(p => p.Id == model.BrainTreePayment.PayeeAddressStateId).Code;

                            paymentRequestResult = _paymentService.SendPayment(model.ApplicationFeeAmount,
                                                    model.BrainTreePayment.Nonce,
                                                    true,
                                                    paymentMethod,
                                                    model.BrainTreePayment.DeviceData,
                                                    "adoption app fee",
                                                    model.Comments,
                                                    model.BrainTreePayment.PayeeFirstName,
                                                    model.BrainTreePayment.PayeeLastName,
                                                    model.BrainTreePayment.PayeeAddressStreet1,
                                                    model.BrainTreePayment.PayeeAddressStreet2,
                                                    model.BrainTreePayment.PayeeAddressCity,
                                                    stateCode,
                                                    model.BrainTreePayment.PayeeAddressPostalCode,
                                                    "US",
                                                    phone,
                                                    model.AppEmail);
                        }

                        if (!paymentRequestResult.IsSuccess)
                        {
                            // TODO: handle failure to pay
                            result.IsSuccess = false;
                            result.Messages.Add("Payment Failure - see below for details: ");
                            result.Messages.AddRange(paymentRequestResult.Messages);

                            _logger.LogError("Adoption App Fee Payment Failed {@AdoptionAppFeePaymentErrors}", result.Messages);
                            ModelState.AddModelError("", "Unable to process your payment. Try again, and if the problem persists see your system administrator.");
                            foreach (var error in paymentRequestResult.Messages)
                            {
                                ModelState.AddModelError("", error);
                            }

                            RedirectToAction("Apply");
                        }

                        // payment is a success. capture the transaction id from braintree
                        model.BrainTreePayment.BraintreeTransactionId = paymentRequestResult.NewKey;
                        #endregion

                        #region Database

                        var personId = Guid.NewGuid();
                        var applicantId = Guid.NewGuid();

                        #region Copy ViewModel to database Model
                        var dbApplicant = new Models.ApplicationAdoption
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
                            IsPetAdoptionReasonCompanionChild = model.IsPetAdoptionReasonCompanionChild,
                            IsPetAdoptionReasonCompanionPet = model.IsPetAdoptionReasonCompanionPet,
                            IsPetAdoptionReasonGift = model.IsPetAdoptionReasonGift,
                            IsPetAdoptionReasonGuardDog = model.IsPetAdoptionReasonGuardDog,
                            IsPetAdoptionReasonHousePet = model.IsPetAdoptionReasonHousePet,
                            IsPetAdoptionReasonJoggingPartner = model.IsPetAdoptionReasonJoggingPartner,
                            IsPetAdoptionReasonOther = model.IsPetAdoptionReasonOther,
                            IsPetAdoptionReasonWatchDog = model.IsPetAdoptionReasonWatchDog,
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
                            IsPetKeptLocationSleepingRestrictionInBedOwner = model.IsPetKeptLocationSleepingRestrictionInBedOwner,
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
                            PetAdoptionReasonExplain = model.PetAdoptionReasonExplain,
                            PetKeptLocationAloneRestriction = model.PetKeptLocationAloneRestriction,
                            PetKeptLocationAloneRestrictionExplain = model.PetKeptLocationAloneRestrictionExplain,
                            PetKeptLocationInOutDoors = model.PetKeptLocationInOutDoors,
                            PetKeptLocationInOutDoorsExplain = model.PetKeptLocationInOutDoorsExplain,
                            PetKeptLocationSleepingRestriction = model.PetKeptLocationSleepingRestriction,
                            PetKeptLocationSleepingRestrictionExplain = model.PetKeptLocationSleepingRestrictionExplain,
                            WhatIfMovingPetPlacement = model.WhatIfMovingPetPlacement,
                            WhatIfTravelPetPlacement = model.WhatIfTravelPetPlacement,
                            ApplicationFeeAmount = model.ApplicationFeeAmount,
                            ApplicationFeePaymentMethod = model.BrainTreePayment.PaymentMethod,
                            ApplicationFeeTransactionId = model.BrainTreePayment.BraintreeTransactionId,
                            Comments = model.Comments,
                            VeterinarianDoctorName = model.VeterinarianDoctorName,
                            VeterinarianOfficeName = model.VeterinarianOfficeName,
                            VeterinarianPhoneNumber = model.PhoneNumber
                        };

                        dbApplicant.ApplicationAdoptionStatuses = new List<Models.ApplicationAdoptionStatus> {
                            new Models.ApplicationAdoptionStatus {
                                Id = 0,
                                ApplicationAdoptionId = applicantId,
                                ApplicationAdoptionStatusTypeId = 0,
                                Timestamp = DateTime.Now
                            }
                        };

                        dbApplicant.ApplicationAppAnimals = new List<Models.ApplicationAppAnimal>();

                        if (!string.IsNullOrEmpty(model.Name1))
                        {
                            dbApplicant.ApplicationAppAnimals.Add(new Models.ApplicationAppAnimal
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
                            dbApplicant.ApplicationAppAnimals.Add(new Models.ApplicationAppAnimal
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
                            dbApplicant.ApplicationAppAnimals.Add(new Models.ApplicationAppAnimal
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
                            dbApplicant.ApplicationAppAnimals.Add(new Models.ApplicationAppAnimal
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
                            dbApplicant.ApplicationAppAnimals.Add(new Models.ApplicationAppAnimal
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

                        #region Add to Database
                        _context.Add(dbApplicant);
                        _context.Add(dbPerson);
                        #endregion

                        #region Save to Database and check exceptions
                        try
                        {
                            _logger.LogInformation("Saving application to database: {@dbApplicant}", dbApplicant);
                            var numChanges = _context.SaveChanges();
                            if(numChanges > 0)
                            {
                                result.IsSuccess = true;
                            }
                        }
                        //catch (DbEntityValidationException ex)
                        //{
                        //    _logger.LogError(ex, "Database Validation Exception saving Applicant");
                        //}
                        catch (DbUpdateException ex)
                        {
                            _logger.LogError(new EventId(1), ex, "Database Update Exception saving Applicant");
                        }
                        catch (InvalidOperationException ex)
                        {
                            _logger.LogError(new EventId(1), ex, "Invalid Operation Exception saving Applicant");
                        }
                        #endregion

                        #endregion

                        #region Generate PDF
                        var newPdfFileName = await _formService.CreateAdoptionApplicationPdf(dbApplicant);
                        #endregion

                        #region Send Emails
                        var groupEmail = _systemServices.GetSetting("Email-Contact").Value;

                        var subject = string.Join(" - ", "[TXHR Web Adoption App]", model.AppFullName);

                        var bodyText = string.Format(@"Thank you for your application.
                                Attached is a copy of your application sent to Texas Husky Rescue, Inc.
                                You can respond back to this email if you have any further questions or comments for us.
                                We will get back to you within the next 7 days regarding your application.
                                You're ${0} application fee will be applied towards your adoption fee if you are approved.
                                The confirmation number for your application fee is {1}", model.ApplicationFeeAmount, model.BrainTreePayment.BraintreeTransactionId);

                        byte[] pdfContentBytes;

                        using (var stream = new MemoryStream())
                        {
                            await _storageService.GetAppAdoption(newPdfFileName, stream);
                            pdfContentBytes = stream.ToArray();
                        }

                        var attachment = new PostmarkDotNet.PostmarkMessageAttachment
                        {
                            Content = Convert.ToBase64String(pdfContentBytes),
                            ContentId = Path.GetFileName(newPdfFileName),
                            ContentType = "application/pdf",
                            Name = Path.GetFileName(newPdfFileName)
                        };

                        var attachments = new List<PostmarkDotNet.PostmarkMessageAttachment> { attachment };

                        // Send email to the adopter
                        var emailAppResult = await _emailService.SendEmailAsync(model.AppEmail, groupEmail, groupEmail, subject, bodyText, "adoption", attachments);

                        bodyText = "Dogs interested in: " + model.FilterAppDogsInterestedIn + Environment.NewLine + Environment.NewLine;
                        bodyText += "Comments from app: " + model.Comments;

                        var emailGroupResult = await _emailService.SendEmailAsync(groupEmail, groupEmail, groupEmail, subject, bodyText, "adoption", attachments);

                        #endregion

                        if (result.IsSuccess)
                        {
                            return RedirectToAction("ThankYou");
                        }
                        else
                        {
                            foreach (var error in result.Messages)
                            {
                                ModelState.AddModelError(error.GetHashCode().ToString(), error);
                                _logger.LogError("Data Exception saving Adoption Application {@app}", model);
                            }

                            return RedirectToAction("Apply");
                        }
                    }
                    _logger.LogInformation("Adoption App Model Errors {@errors} {@app}", errors, model);
                }
                catch (Exception dex)
                {
                    //Log the error (uncomment dex variable name and add a line here to write a log.
                    ModelState.AddModelError("", "Unable to save changes. Try again, and if the problem persists see your system administrator.");
                    _logger.LogError(new EventId (1), dex, "Data Exception saving Adoption Application {@app}", model);
                }
            }
            return RedirectToAction("Apply");
        }


        public IActionResult ThankYou()
        {
            return View();
        }
    }
}