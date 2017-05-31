//using Contentful.NET;
//using Contentful.NET.DataModels;
//using Contentful.NET.Search;
//using Contentful.NET.Search.Filters;
using HuskyRescueCore.Data;
using HuskyRescueCore.Helpers.PostRequestGet;
using HuskyRescueCore.Models.AdopterViewModels;
using HuskyRescueCore.Models.RescueGroupViewModels;
using HuskyRescueCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
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
        //private readonly IContentfulClient _contentfulClient;

        private string contentDeliveryApi = "1500acf09a4cde7de8884b0027b6f20a99200f97b2096259e9c0d39f554ab821";
        private string contentPreviewApi = "d194884e8215d8be121dd9f0d931b855d13c93a4b909d9ff28b13020a080f74e";
        private string spaceId = "jf2qd27ic77e";
        private string adoptProcessId = "adoptProcess";

        public AdoptController(ApplicationDbContext context,
            ISystemSettingService systemServices, IEmailSender emailService, IRescueGroupsService rescuegroupService, IBraintreePaymentService paymentService,
            IFormSerivce formService, ILogger<AdoptController> logger, IStorageService storageService)//, IContentfulClient contentfulClient)
        {
            _systemServices = systemServices;
            _emailService = emailService;
            _context = context;
            _rescuegroupService = rescuegroupService;
            _paymentService = paymentService;
            _formService = formService;
            _logger = logger;
            _storageService = storageService;
            //_contentfulClient = contentfulClient;
        }

        public async Task<IActionResult> Index()
        {
            _logger.LogInformation("Start AdoptController.Index Get");
            var huskies = await _rescuegroupService.GetAdoptableHuskiesAsync();
            _logger.LogInformation("Cont. AdoptController.Index Get: {@huskies}", huskies);
            var model = new RescueGroupAnimals();
            if (huskies != null)
            {
                if (huskies.Count > 0)
                {
                    model = new RescueGroupAnimals { Animals = huskies };
                }
            }
            _logger.LogInformation("End AdoptController.Index Get: {@model}", model);
            return View(model);
        }

        public IActionResult Process()
        {
            //CancellationToken cancellationToken = HttpContext?.RequestAborted ?? CancellationToken.None;

            //var results = await _contentfulClient.SearchAsync<Entry>(cancellationToken, new ISearchFilter[]
            //{
            //    new EqualitySearchFilter(BuiltInProperties.ContentType, "adoptProcess")
            //},
            //includeLevels: 1 // Ensure we retrieve the linked assets inside this one request - we want to get the Images for the dogs too
            //);

            ////var results = await _contentfulClient.GetAsync<Entry>(cancellationToken, "5LhgWGQbO8owM2ckGwoagQ"); //Adopt Process
            //ViewBag.Criteria = adoptProcessId;
            ////return View("All", GetAllDogsFromContentfulResult(results));


            //var result = results.Items;
            // Retrieve the ImageId from the linked 'mainPicture' asset
            // NOTE: We could merge all of these Select() statements into one, but this way we only have to call dog.GetLink() and dog.GetString()
            //       once, which improves performance.
            //.Select(leftImg => new
            //{
            //    leftImg.SystemProperties.Id,
            //    ImageId = leftImg.GetLink("leftTopImage").SystemProperties.Id,
            //    Type = leftImg.GetString("dogType")
            //})
            //.Select(rightImg => new
            //{
            //    rightImg.SystemProperties.Id,
            //    ImageId = rightImg.GetLink("rightTopImage").SystemProperties.Id,
            //    Type = rightImg.GetString("dogType")
            //})
            //// Now find the included 'Asset' details from the corresponding ImageId
            //.Select(dog => new
            //{
            //    dog.Id,
            //    ImageUrl =
            //        results.Includes.Assets.First(asset => asset.SystemProperties.Id == dog.ImageId)
            //            .Details.File.Url,
            //    dog.Type
            //})
            //// Now we map our calculated data to our model
            //.Select(dog => new DogItem
            //{
            //    Id = dog.Id,
            //    LargeImageUrl =
            //        ImageHelper.GetResizedImageUrl(dog.ImageUrl, 500, 500, ImageHelper.ImageType.Jpg, 75),
            //    ThumbnailImageUrl =
            //        ImageHelper.GetResizedImageUrl(dog.ImageUrl, 150, 150, ImageHelper.ImageType.Png),
            //    Type = dog.Type
            //});

            return View();
        }

        [ImportModelState]
        public IActionResult Apply()
        {
            _logger.LogInformation("Start AdoptController.Apply Get");
            var model = new ApplyToAdoptViewModel();

            model.AppAddressStateList = new List<SelectListItem>();
            var states = _context.States.ToList();
            model.AppAddressStateList = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();
            //model.BrainTreePayment.States = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();

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

            #region Payment
            // Values needed for submitting a payment to BrainTree
            model.ApplicationFeeAmount = decimal.Parse(_systemServices.GetSetting("AdoptionApplicationFee").Value);
            if (model.ApplicationFeeAmount > 0)
            {
                var token = _paymentService.GetClientToken(string.Empty);
                ViewData.Add("clientToken", token);
                ViewData.Add("merchantId", _systemServices.GetSetting("BraintreeMerchantId").Value);
                ViewData.Add("environment", _systemServices.GetSetting("BraintreeIsProduction").Value);
            }
            #endregion
            _logger.LogInformation("End AdoptController.Apply Get: {@model}", model);
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ExportModelState]
        public async Task<IActionResult> Apply(ApplyToAdoptViewModel model)
        {
            _logger.LogInformation("Start AdoptController.Apply POST: {@model}", model);
            // TODO: add exception handling and display error message to user

            // payment information in an encrypted string rather than sending the payment information to the server from the client
            //if (string.IsNullOrEmpty(model.BrainTreePayment.Nonce) && model.ApplicationFeeAmount > 0)
            //{
            //    ModelState.AddModelError("", "incomplete payment information provided");
            //}
            //else
            //{
            try
            {
                // get model state errors
                var errors = ModelState.Values.SelectMany(v => v.Errors);

                _logger.LogInformation("Cont. AdoptController.Apply POST: {@ModelStateErrors}", errors);

                // if paying with a credit card the fields for credit card number/cvs/month/year will be invalid because we do not send them to the server
                // so count the errors on the field validation that do not start with 'card ' (comes from the property attributes in the model class Apply.cs)
                // TODO validate if this is still needed - all card validation has been removed b/c client side validation requires 'name' properties
                //      which have been removed for PCI compliance. 
                var errorCount = errors.Count(m => !m.ErrorMessage.StartsWith("card "));

                if (errorCount == 0)
                {
                    var result = new ServiceResult();

                    #region Process Payment
                    if (model.ApplicationFeeAmount > 0)
                    {
                        /*
                        var paymentMethod = (Models.BrainTreeViewModels.PaymentTypeEnum)Enum.Parse(typeof(Models.BrainTreeViewModels.PaymentTypeEnum), model.BrainTreePayment.PaymentMethod);
                        var phone = string.IsNullOrEmpty(model.AppCellPhone) ? model.AppHomePhone : model.AppCellPhone;

                        var paymentRequestResult = new ServiceResult();

                        if (paymentMethod == PaymentTypeEnum.Paypal)
                        {
                            paymentRequestResult = _paymentService.SendPayment(model.ApplicationFeeAmount,
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
                            var stateCode = _context.States.First(p => p.Id == model.BrainTreePayment.PayeeAddressStateId).Code;

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
                        */
                    }
                    #endregion

                    #region Database
                    _logger.LogInformation("Cont. AdoptController.Apply POST - Datbase Start");
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
                        //ApplicationFeePaymentMethod = model.BrainTreePayment.PaymentMethod,
                        //ApplicationFeeTransactionId = model.BrainTreePayment.BraintreeTransactionId,
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

                    _logger.LogInformation("Cont. AdoptController.Apply POST - Datbase Cont. - {@dbApplicant}", dbApplicant);
                    _logger.LogInformation("Cont. AdoptController.Apply POST - Datbase Cont. - {@dbPerson}", dbPerson);

                    #region Add to Database
                    _context.Add(dbApplicant);
                    _context.Add(dbPerson);
                    #endregion

                    #region Save to Database and check exceptions
                    try
                    {
                        _logger.LogInformation("Cont. AdoptController.Apply POST - Datbase Cont. - Saving application to database: {@dbApplicant}", dbApplicant);
                        var numChanges = _context.SaveChanges();
                        if (numChanges > 0)
                        {
                            result.IsSuccess = true;
                        }
                    }

                    catch (DbUpdateException ex)
                    {
                        _logger.LogError("Cont. AdoptController.Apply POST - Datbase Cont. - Database Update Exception saving Applicant - {@DbUpdateException}", ex);
                    }
                    catch (InvalidOperationException ex)
                    {
                        _logger.LogError("Cont. AdoptController.Apply POST - Datbase Cont. - Invalid Operation Exception saving Applicant - {@InvalidOperationException}", ex);
                    }
                    #endregion
                    _logger.LogInformation("Cont. AdoptController.Apply POST - Datbase end");
                    #endregion

                    #region Generate PDF
                    _logger.LogInformation("Cont. AdoptController.Apply POST - PDF Gen Start");
                    var newPdfFileName = await _formService.CreateAdoptionApplicationPdf(dbApplicant);
                    _logger.LogInformation("Cont. AdoptController.Apply POST - PDF Gen End");
                    #endregion

                    #region Send Emails
                    _logger.LogInformation("Cont. AdoptController.Apply POST - Emails Send Start");

                    var groupEmail = _systemServices.GetSetting("Email-Contact").Value;

                    var subject = string.Join(" - ", "[TXHR Web Adoption App]", model.AppFullName);

                    var bodyText = string.Empty;
                    if (model.ApplicationFeeAmount > 0)
                    {
                        bodyText = string.Format(@"Thank you for your application.
                                Attached is a copy of your application sent to Texas Husky Rescue, Inc.
                                You can respond back to this email if you have any further questions or comments for us.
                                We will get back to you within the next 7 days regarding your application.
                                You're ${0} application fee will be applied towards your adoption fee if you are approved.
                                The confirmation number for your application fee is {1}", model.ApplicationFeeAmount); //, model.BrainTreePayment.BraintreeTransactionId);
                    }
                    else
                    {
                        bodyText = string.Format(@"Thank you for your application.
                                Attached is a copy of your application sent to Texas Husky Rescue, Inc.
                                You can respond back to this email if you have any further questions or comments for us.
                                We will get back to you within the next 7 days regarding your application.");
                    }
                    byte[] pdfContentBytes;

                    _logger.LogInformation("Cont. AdoptController.Apply POST - Emails Send Cont - Start Get Application from Storage");
                    using (var stream = new MemoryStream())
                    {
                        await _storageService.GetAppAdoption(newPdfFileName, stream);
                        pdfContentBytes = stream.ToArray();
                    }
                    _logger.LogInformation("Cont. AdoptController.Apply POST - Emails Send Cont - End Get Application from Storage");

                    var attachment = new PostmarkDotNet.PostmarkMessageAttachment
                    {
                        Content = Convert.ToBase64String(pdfContentBytes),
                        ContentId = Path.GetFileName(newPdfFileName),
                        ContentType = "application/pdf",
                        Name = Path.GetFileName(newPdfFileName)
                    };

                    var attachments = new List<PostmarkDotNet.PostmarkMessageAttachment> { attachment };

                    // Send email to the adopter
                    _logger.LogInformation("Cont. AdoptController.Apply POST - Emails Send Cont - Start send email to the adopter");
                    var emailAppResult = await _emailService.SendEmailAsync(model.AppEmail, groupEmail, groupEmail, subject, bodyText, "adoption", attachments);
                    _logger.LogInformation("Cont. AdoptController.Apply POST - Emails Send Cont - End send email to the adopter");

                    bodyText = "Dogs interested in: " + model.FilterAppDogsInterestedIn + Environment.NewLine + Environment.NewLine;
                    bodyText += "Comments from app: " + model.Comments;

                    _logger.LogInformation("Cont. AdoptController.Apply POST - Emails Send Cont - Start send email to the rescue");
                    var emailGroupResult = await _emailService.SendEmailAsync(groupEmail, groupEmail, groupEmail, subject, bodyText, "adoption", attachments);
                    _logger.LogInformation("Cont. AdoptController.Apply POST - Emails Send Cont - End send email to the rescue");

                    _logger.LogInformation("Cont. AdoptController.Apply POST - Emails Send End");
                    #endregion

                    if (result.IsSuccess)
                    {
                        _logger.LogInformation("End AdoptController.Apply POST - Success - Redirecto to ThankYou");
                        return RedirectToAction("ThankYou");
                    }
                    else
                    {
                        _logger.LogInformation("Cont. AdoptController.Apply POST - Failure - Redirecto to Apply with errors");
                        foreach (var error in result.Messages)
                        {
                            ModelState.AddModelError(error.GetHashCode().ToString(), error);
                            _logger.LogError("Cont. AdoptController.Apply POST - Failure - {AdoptionApplicationError}", error);
                        }

                        _logger.LogError("End AdoptController.Apply POST - Failure - {@AdoptionApplication}", model);
                        return View(model);
                    }
                }
                foreach (var error in errors.ToList())
                {
                    _logger.LogError("Cont. AdoptController.Apply POST - Failure - {AdoptionApplicationError}", error);
                }
                _logger.LogInformation("End AdoptController.Apply POST - Adoption App Model Errors {@AdoptionApplication}", model);
                return View(model);
            }
            catch (Exception dex)
            {
                //Log the error (uncomment dex variable name and add a line here to write a log.
                ModelState.AddModelError("", "Unable to save changes. Try again, and if the problem persists see your system administrator.");
                _logger.LogError("End AdoptController.Apply POST - Data Exception saving Adoption Application {@AdoptionApplication}", model);
            }
            return View(model);
        }


        public IActionResult ThankYou()
        {
            return View();
        }
    }
}