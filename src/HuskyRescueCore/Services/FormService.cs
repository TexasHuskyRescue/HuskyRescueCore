using HuskyRescueCore.Data;
using HuskyRescueCore.Models;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Security;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    /// <summary>
    /// 2016-09-11 moved to itext v4 for .NET Core support https://github.com/VahidN/iTextSharp.LGPLv2.Core
    /// 2017-01-06 moved to Syncfusion for PDF support
    /// 2017-05-01 moved back to ItextSharp
    /// </summary>

    public class FormService : IFormSerivce
    {
        private readonly ISystemSettingService _systemServices;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<FormService> _logger;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IStorageService _storageService;
        public IConfiguration _configuration { get; }

        public FormService(ISystemSettingService systemServices, ApplicationDbContext context, ILogger<FormService> logger, IHostingEnvironment hostingEnvironment, IStorageService storageService, IConfiguration configuration)
        {
            _systemServices = systemServices;
            _context = context;
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
            _storageService = storageService;
            _configuration = configuration;
        }

        public async Task<string> CreateAdoptionApplicationPdf(ApplicationAdoption app)
        {
            _logger.LogInformation("Start FormService.CreateAdoptionApplicationPdf - {@adoptionApplication}", app);
            // Path to newly created file based on PDF template
            var pdfNewFilePath = string.Empty;
            var fileName = string.Empty;
            var azureStorageConfig = _configuration.GetSection("azureStorage");
            var googleDriveAdoptionFormUri = azureStorageConfig.GetValue<string>("GoogleDriveAdoptionFormUri");
            try
            {
                // create path to new file that will be generated
                fileName = app.AppNameLast + " - " + app.Id + ".pdf";
                _logger.LogInformation("Cont. FormService.CreateAdoptionApplicationPdf - {@AdoptionApplicationFileName}", fileName);
                using (var webClient = new System.Net.Http.HttpClient())
                {
                    var tempPdfFileStream = await webClient.GetStreamAsync(googleDriveAdoptionFormUri);
                    byte[] tempPdfFileBytes;

                    using (MemoryStream ms = new MemoryStream())
                    {
                        tempPdfFileStream.CopyTo(ms);
                        tempPdfFileBytes = ms.ToArray();
                    }
                    tempPdfFileStream.Dispose();

                    _logger.LogInformation("Cont. FormService.CreateAdoptionApplicationPdf template retrieved from Google Drive");

                    using (var newPdfMemStream = new MemoryStream())
                    {
                        // Open template PDF
                        var pdfReader = new PdfReader(tempPdfFileBytes);

                        // PdfStamper is used to read the field keys and flatten the PDF after generating
                        var pdfStamper = new PdfStamper(pdfReader, newPdfMemStream);
                        try
                        {
                            // if "true" then checkbox and radio buttons will maintain format set in the PDF
                            // available in v5 but moved to v4 for .NET core and no longer have this feature
                            //var saveAppearance = true;

                            // get list of all field names (keys) in the template
                            var pdfFormFields = pdfStamper.AcroFields;
                            //Load the template document to fill a form field
                            _logger.LogInformation("Cont. FormService.CreateAdoptionApplicationPdf template loaded - populate fields");

                            pdfFormFields.SetField("Comments", GetNonNullString(app.Comments));

                            if (!string.IsNullOrEmpty(app.ApplicationFeeTransactionId))
                            {
                                pdfFormFields.SetField("AppFeeAmount", app.ApplicationFeeAmount.ToString());
                                pdfFormFields.SetField("AppFeePaymentMethod", "online");
                                pdfFormFields.SetField("AppFeePaymentTranId", app.ApplicationFeeTransactionId);
                            }

                            pdfFormFields.SetField("AppName", app.AppNameFirst + " " + app.AppNameLast);
                            pdfFormFields.SetField("AppSpouseName", GetNonNullString(app.AppSpouseNameFirst) + " " + GetNonNullString(app.AppSpouseNameLast));
                            pdfFormFields.SetField("AppAddressStreet", app.AppAddressStreet1);
                            var stateName = (_context.States.First(x => x.Id == app.AppAddressStateId)).Text;
                            pdfFormFields.SetField("AppAddressCityStateZip", app.AppAddressCity + ", " + stateName + " " + app.AppAddressZIP);
                            pdfFormFields.SetField("AppHomePhone", GetNonNullString(app.AppHomePhone));
                            pdfFormFields.SetField("AppCellPhone", GetNonNullString(app.AppCellPhone));
                            pdfFormFields.SetField("AppEmail", GetNonNullString(app.AppEmail));
                            pdfFormFields.SetField("AppEmployer", GetNonNullString(app.AppEmployer));
                            pdfFormFields.SetField("AppDateBirth", app.AppDateBirth.Value.ToString("d"));
                            pdfFormFields.SetField("DateSubmitted", DateTime.Today.ToString("d"));
                            pdfFormFields.SetField("IsAllAdultsAgreedOnAdoption", IsTrueFalse(app.IsAllAdultsAgreedOnAdoption));
                            pdfFormFields.SetField("IsAllAdultsAgreedOnAdoptionReason", GetNonNullString(app.IsAllAdultsAgreedOnAdoptionReason));
                            pdfFormFields.SetField("ResidenceOwnership", (_context.ApplicationResidenceOwnershipType.First(x => x.Id == app.ApplicationResidenceOwnershipTypeId)).Code);

                            pdfFormFields.SetField("ResidenceType", (_context.ApplicationResidenceType.First(x => x.Id == app.ApplicationResidenceTypeId)).Code);

                            if (app.ApplicationResidenceOwnershipTypeId.Equals(2))
                            {
                                //Rent
                                pdfFormFields.SetField("ResidenceIsPetAllowed", IsTrueFalse(app.ResidenceIsPetAllowed));
                                pdfFormFields.SetField("ResidenceIsPetDepositRequired", IsTrueFalse(app.ResidenceIsPetDepositRequired));

                                if (app.ResidenceIsPetDepositRequired.HasValue)
                                {
                                    if (app.ResidenceIsPetDepositRequired.Value)
                                    {
                                        pdfFormFields.SetField("ResidencePetDepositAmount", app.ResidencePetDepositAmount.ToString());
                                        if (app.ApplicationResidencePetDepositCoverageTypeId.HasValue)
                                        {
                                            pdfFormFields.SetField("ResidencePetDepositCoverage", (_context.ApplicationResidencePetDepositCoverageType.First(x => x.Id == app.ApplicationResidencePetDepositCoverageTypeId)).Code);
                                        }
                                        pdfFormFields.SetField("ResidenceIsPetDepositPaid", IsTrueFalse(app.ResidenceIsPetDepositPaid));
                                    }
                                }
                                pdfFormFields.SetField("ResidenceIsPetSizeWeightLimit", IsTrueFalse(app.ResidencePetSizeWeightLimit));
                                pdfFormFields.SetField("ResidenceLandlordName", GetNonNullString(app.ResidenceLandlordName));
                                pdfFormFields.SetField("ResidenceLandlordNumber", GetNonNullString(app.ResidenceLandlordNumber));
                            }
                            pdfFormFields.SetField("ResidenceLengthOfResidence", GetNonNullString(app.ResidenceLengthOfResidence));
                            pdfFormFields.SetField("WhatIfMovingPetPlacement", GetNonNullString(app.WhatIfMovingPetPlacement));
                            if (app.IsAppOrSpouseStudent.HasValue)
                            {
                                pdfFormFields.SetField("IsAppOrSpouseStudent", IsTrueFalse(app.IsAppOrSpouseStudent));
                                if (app.ApplicationStudentTypeId != null && app.IsAppOrSpouseStudent.Value)
                                {
                                    pdfFormFields.SetField("StudentType", (_context.ApplicationStudentType.First(x => x.Id == app.ApplicationStudentTypeId)).Code);
                                }
                            }
                            pdfFormFields.SetField("IsAppTravelFrequent", IsTrueFalse(app.IsAppTravelFrequent));
                            pdfFormFields.SetField("AppTravelFrequency", GetNonNullString(app.AppTravelFrequency));
                            pdfFormFields.SetField("WhatIfTravelPetPlacement", GetNonNullString(app.WhatIfTravelPetPlacement));
                            pdfFormFields.SetField("ResidenceNumberOccupants", GetNonNullString(app.ResidenceNumberOccupants));
                            pdfFormFields.SetField("ResidenceAgesOfChildren", GetNonNullString(app.ResidenceAgesOfChildren));
                            pdfFormFields.SetField("ResidenceIsYardFenced", IsTrueFalse(app.ResIdenceIsYardFenced));
                            pdfFormFields.SetField("ResidenceFenceType", GetNonNullString(app.ResidenceFenceTypeHeight));

                            pdfFormFields.SetField("IsPetKeptLocationInOutDoorsTotallyInside", IsYesNo(app.IsPetKeptLocationInOutDoorsTotallyInside));
                            pdfFormFields.SetField("IsPetKeptLocationInOutDoorsMostlyInside", IsYesNo(app.IsPetKeptLocationInOutDoorsMostlyInside));
                            pdfFormFields.SetField("IsPetKeptLocationInOutDoorsTotallyOutside", IsYesNo(app.IsPetKeptLocationInOutDoorsTotallyOutside));
                            pdfFormFields.SetField("IsPetKeptLocationInOutDoorMostlyOutsides", IsYesNo(app.IsPetKeptLocationInOutDoorMostlyOutside));
                            pdfFormFields.SetField("PetKeptLocationInOutDoorsExplain", GetNonNullString(app.PetKeptLocationInOutDoorsExplain));

                            pdfFormFields.SetField("PetKeptAloneHoursPerDay", GetNonNullString(app.PetLeftAloneHours));
                            pdfFormFields.SetField("PetKeptAloneNumberDays", GetNonNullString(app.PetLeftAloneDays));

                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionLooseIndoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionLooseIndoors));
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionGarage", IsYesNo(app.IsPetKeptLocationAloneRestrictionGarage));
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionOutsideKennel", IsYesNo(app.IsPetKeptLocationAloneRestrictionOutsideKennel));
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionCratedIndoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionCratedIndoors));
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionLooseInBackyard", IsYesNo(app.IsPetKeptLocationAloneRestrictionLooseInBackyard));
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionTiedUpOutdoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionTiedUpOutdoors));
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionBasement", IsYesNo(app.IsPetKeptLocationAloneRestrictionBasement));
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionCratedOutdoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionCratedOutdoors));
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionOther", IsYesNo(app.IsPetKeptLocationAloneRestrictionOther));
                            pdfFormFields.SetField("PetKeptLocationAloneRestrictionExplain", GetNonNullString(app.PetKeptLocationAloneRestrictionExplain));

                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionLooseIndoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionLooseIndoors));
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionGarage", IsYesNo(app.IsPetKeptLocationSleepingRestrictionGarage));
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionOutsideKennel", IsYesNo(app.IsPetKeptLocationSleepingRestrictionOutsideKennel));
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionCratedIndoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionCratedIndoors));
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionLooseInBackyard", IsYesNo(app.IsPetKeptLocationSleepingRestrictionLooseInBackyard));
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionTiedUpOutdoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionTiedUpOutdoors));
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionBasement", IsYesNo(app.IsPetKeptLocationSleepingRestrictionBasement));
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionCratedOutdoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionCratedOutdoors));
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionOther", IsYesNo(app.IsPetKeptLocationSleepingRestrictionOther));
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionBedWithOwner", IsYesNo(app.IsPetKeptLocationSleepingRestrictionInBedOwner));
                            pdfFormFields.SetField("PetKeptLocationSleepingRestrictionExplain", GetNonNullString(app.PetKeptLocationSleepingRestrictionExplain));

                            pdfFormFields.SetField("IsPetAdoptionReasonHousePet", IsYesNo(app.IsPetAdoptionReasonHousePet));
                            pdfFormFields.SetField("IsPetAdoptionReasonGuardDog", IsYesNo(app.IsPetAdoptionReasonGuardDog));
                            pdfFormFields.SetField("IsPetAdoptionReasonWatchDog", IsYesNo(app.IsPetAdoptionReasonWatchDog));
                            pdfFormFields.SetField("IsPetAdoptionReasonGift", IsYesNo(app.IsPetAdoptionReasonGift));
                            pdfFormFields.SetField("IsPetAdoptionReasonCompanionChild", IsYesNo(app.IsPetAdoptionReasonCompanionChild));
                            pdfFormFields.SetField("IsPetAdoptionReasonCompanionPet", IsYesNo(app.IsPetAdoptionReasonCompanionPet));
                            pdfFormFields.SetField("IsPetAdoptionReasonJoggingPartner", IsYesNo(app.IsPetAdoptionReasonJoggingPartner));
                            pdfFormFields.SetField("IsPetAdoptionReasonOther", IsYesNo(app.IsPetAdoptionReasonOther));
                            pdfFormFields.SetField("PetAdoptionReasonExplain", GetNonNullString(app.PetAdoptionReasonExplain));

                            pdfFormFields.SetField("FilterAppHasOwnedHuskyBefore", IsTrueFalse(app.FilterAppHasOwnedHuskyBefore));
                            pdfFormFields.SetField("FilterAppIsAwareHuskyAttributes", IsTrueFalse(app.FilterAppIsAwareHuskyAttributes));

                            pdfFormFields.SetField("FilterAppTraitsDesired", GetNonNullString(app.FilterAppTraitsDesired));

                            pdfFormFields.SetField("FilterAppIsCatOwner", IsTrueFalse(app.FilterAppIsCatOwner));
                            pdfFormFields.SetField("FilterAppCatsOwnedCount", GetNonNullString(app.FilterAppCatsOwnedCount));

                            pdfFormFields.SetField("FilterAppDogsInterestedIn", GetNonNullString(app.FilterAppDogsInterestedIn));

                            pdfFormFields.SetField("Veterinarian.NameOffice", GetNonNullString(app.VeterinarianOfficeName));
                            pdfFormFields.SetField("Veterinarian.NameDr", GetNonNullString(app.VeterinarianDoctorName));
                            pdfFormFields.SetField("Veterinarian.PhoneNumber", GetNonNullString(app.VeterinarianPhoneNumber));

                            if (app.ApplicationAppAnimals != null)
                            {
                                var i = 1;
                                foreach (var pet in app.ApplicationAppAnimals)
                                {
                                    if (!string.IsNullOrEmpty(pet.Name))
                                    {
                                        pdfFormFields.SetField("AdopterAnimal.Name" + i, GetNonNullString(pet.Name));
                                        pdfFormFields.SetField("AdopterAnimal.Breed" + i, GetNonNullString(pet.Breed));
                                        pdfFormFields.SetField("AdopterAnimal.Gender" + i, GetNonNullString(pet.Sex));
                                        pdfFormFields.SetField("AdopterAnimal.Age" + i, GetNonNullString(pet.Age));
                                        pdfFormFields.SetField("AdopterAnimal.OwnershipLengthMonths" + i, GetNonNullString(pet.OwnershipLength));
                                        pdfFormFields.SetField("AdopterAnimal.IsAltered", IsTrueFalse(pet.IsAltered));
                                        pdfFormFields.SetField("AdopterAnimal.AlteredReason" + i, GetNonNullString(pet.AlteredReason));
                                        pdfFormFields.SetField("AdopterAnimal.IsHwPrevention", IsTrueFalse(pet.IsHwPrevention));
                                        pdfFormFields.SetField("AdopterAnimal.HwPreventionReason" + i, GetNonNullString(pet.HwPreventionReason));
                                        pdfFormFields.SetField("AdopterAnimal.IsFullyVaccinated", IsTrueFalse(pet.IsFullyVaccinated));
                                        pdfFormFields.SetField("AdopterAnimal.FullyVaccinatedReason" + i, GetNonNullString(pet.FullyVaccinatedReason));
                                        pdfFormFields.SetField("AdopterAnimal.IsStillOwned", IsTrueFalse(pet.IsStillOwned));
                                        pdfFormFields.SetField("AdopterAnimal.IsStillOwnedReason" + i, GetNonNullString(pet.IsStillOwnedReason));
                                        i++;
                                    }
                                }
                            }
                            _logger.LogInformation("Cont. FormService.CreateAdoptionApplicationPdf template loaded - populate fields completed");
                        }
                        catch (DocumentException pdfEx)
                        {
                            // handle pdf document exception if any
                            _logger.LogError("Cont. FormService.CreateAdoptionApplicationPdf - App PDF Gen Error 1 - {@DocumentException}", pdfEx);
                        }
                        catch (IOException ioEx)
                        {
                            // handle IO exception
                            _logger.LogError(new EventId(2), ioEx, "Cont. FormService.CreateAdoptionApplicationPdf - App PDF Gen Error 1 - {@IOException}", ioEx);
                        }
                        catch (Exception ex)
                        {
                            // handle other exception
                            _logger.LogError("Cont. FormService.CreateAdoptionApplicationPdf - App PDF Gen Error 1 - {@GeneralException}", ex);
                        }
                        finally
                        {
                            pdfStamper.FormFlattening = true;
                        }

                        pdfStamper.Close();

                        newPdfMemStream.Position = 0;
                        _logger.LogInformation("Cont. FormService.CreateAdoptionApplicationPdf - Start Save to Storage Service");
                        await _storageService.AddAppAdoption(newPdfMemStream, fileName);
                        pdfReader.Close();
                        _logger.LogInformation("Cont. FormService.CreateAdoptionApplicationPdf - End Save to Storage Service");
                    }
                }
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError("Cont. FormService.CreateAdoptionApplicationPdf - App PDF Gen Error 2 - {@ArgumentNullException}", ex);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError("Cont. FormService.CreateAdoptionApplicationPdf - App PDF Gen Error 2 - {@ArgumentException}", ex);
            }
            catch (SecurityException ex)
            {
                _logger.LogError("Cont. FormService.CreateAdoptionApplicationPdf - App PDF Gen Error 2 - {@SecurityException}", ex);
            }
            catch (FileNotFoundException ex)
            {
                _logger.LogError("Cont. FormService.CreateAdoptionApplicationPdf - App PDF Gen Error 2 - {@FileNotFoundException}", ex);
            }
            catch (DirectoryNotFoundException ex)
            {
                _logger.LogError("Cont. FormService.CreateAdoptionApplicationPdf - App PDF Gen Error 2 - {@DirectoryNotFoundException}", ex);
            }
            catch (IOException ex)
            {
                _logger.LogError("Cont. FormService.CreateAdoptionApplicationPdf - App PDF Gen Error 2 - {@IOException}", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Cont. FormService.CreateAdoptionApplicationPdf - App PDF Gen Error 2 - {@generalException}", ex);
            }

            _logger.LogInformation("End FormService.CreateAdoptionApplicationPdf - {@adoptionApplicationFileName}", fileName);
            return fileName;
        }

        public async Task<string> CreateFosterApplicationPdf(ApplicationFoster app)
        {
            _logger.LogInformation("Start FormService.CreateFosterApplicationPdf - {@adoptionApplication}", app);
            // Path to newly created file based on PDF template
            var pdfNewFilePath = string.Empty;
            var fileName = string.Empty;
            var azureStorageConfig = _configuration.GetSection("azureStorage");
            var googleDriveFosterFormUri = azureStorageConfig.GetValue<string>("GoogleDriveFosterFormUri");
            try
            {
                // create path to new file that will be generated
                fileName = app.AppNameLast + " - " + app.Id + ".pdf";
                _logger.LogInformation("Cont. FormService.CreateFosterApplicationPdf - {@FosterApplicationFileName}", fileName);
                using (var webClient = new System.Net.Http.HttpClient())
                {
                    var tempPdfFileStream = await webClient.GetStreamAsync(googleDriveFosterFormUri);
                    byte[] tempPdfFileBytes;

                    using (MemoryStream ms = new MemoryStream())
                    {
                        tempPdfFileStream.CopyTo(ms);
                        tempPdfFileBytes = ms.ToArray();
                    }
                    tempPdfFileStream.Dispose();
                    _logger.LogInformation("Cont. FormService.CreateAdoptionApplicationPdf template retrieved from Google Drive");

                    using (var newPdfMemStream = new MemoryStream())
                    {
                        // Open template PDF
                        var pdfReader = new PdfReader(tempPdfFileBytes);

                        // PdfStamper is used to read the field keys and flatten the PDF after generating
                        var pdfStamper = new PdfStamper(pdfReader, newPdfMemStream);
                        try
                        {
                            // if "true" then checkbox and radio buttons will maintain format set in the PDF
                            // available in v5 but moved to v4 for .NET core and no longer have this feature
                            //var saveAppearance = true;

                            // get list of all field names (keys) in the template
                            var pdfFormFields = pdfStamper.AcroFields;

                            _logger.LogInformation("Cont. FormService.CreateAdoptionApplicationPdf template loaded - populate fields");

                                pdfFormFields.SetField("Comments", GetNonNullString(app.Comments));

                                pdfFormFields.SetField("AppName", app.AppNameFirst + " " + app.AppNameLast);
                                pdfFormFields.SetField("AppSpouseName", GetNonNullString(app.AppSpouseNameFirst) + " " + GetNonNullString(app.AppSpouseNameLast));
                                pdfFormFields.SetField("AppAddressStreet", app.AppAddressStreet1);
                                var stateName = (_context.States.First(x => x.Id == app.AppAddressStateId)).Text;
                                pdfFormFields.SetField("AppAddressCityStateZip", app.AppAddressCity + ", " + stateName + " " + app.AppAddressZIP);
                                pdfFormFields.SetField("AppHomePhone", GetNonNullString(app.AppHomePhone));
                                pdfFormFields.SetField("AppCellPhone", GetNonNullString(app.AppCellPhone));
                                pdfFormFields.SetField("AppEmail", GetNonNullString(app.AppEmail));
                                pdfFormFields.SetField("AppEmployer", GetNonNullString(app.AppEmployer));
                                pdfFormFields.SetField("AppDateBirth", app.AppDateBirth.Value.ToString("d"));
                                pdfFormFields.SetField("DateSubmitted", DateTime.Today.ToString("d"));
                                pdfFormFields.SetField("IsAllAdultsAgreedOnAdoption", IsTrueFalse(app.IsAllAdultsAgreedOnAdoption));
                                pdfFormFields.SetField("IsAllAdultsAgreedOnAdoptionReason", GetNonNullString(app.IsAllAdultsAgreedOnAdoptionReason));
                                pdfFormFields.SetField("ResidenceOwnership", (_context.ApplicationResidenceOwnershipType.First(x => x.Id == app.ApplicationResidenceOwnershipTypeId)).Code);

                                pdfFormFields.SetField("ResidenceType", (_context.ApplicationResidenceType.First(x => x.Id == app.ApplicationResidenceTypeId)).Code);

                                if (app.ApplicationResidenceOwnershipTypeId.Equals(2))
                                {
                                    //Rent
                                    pdfFormFields.SetField("ResidenceIsPetAllowed", IsTrueFalse(app.ResidenceIsPetAllowed));
                                    pdfFormFields.SetField("ResidenceIsPetDepositRequired", IsTrueFalse(app.ResidenceIsPetDepositRequired));

                                    if (app.ResidenceIsPetDepositRequired.HasValue)
                                    {
                                        if (app.ResidenceIsPetDepositRequired.Value)
                                        {
                                            pdfFormFields.SetField("ResidencePetDepositAmount", app.ResidencePetDepositAmount.ToString());
                                            if (app.ApplicationResidencePetDepositCoverageTypeId.HasValue)
                                            {
                                                pdfFormFields.SetField("ResidencePetDepositCoverage", (_context.ApplicationResidencePetDepositCoverageType.First(x => x.Id == app.ApplicationResidencePetDepositCoverageTypeId)).Code);
                                            }
                                            pdfFormFields.SetField("ResidenceIsPetDepositPaid", IsTrueFalse(app.ResidenceIsPetDepositPaid));
                                        }
                                    }
                                    pdfFormFields.SetField("ResidenceIsPetSizeWeightLimit", IsTrueFalse(app.ResidencePetSizeWeightLimit));
                                    pdfFormFields.SetField("ResidenceLandlordName", GetNonNullString(app.ResidenceLandlordName));
                                    pdfFormFields.SetField("ResidenceLandlordNumber", GetNonNullString(app.ResidenceLandlordNumber));
                                }
                                pdfFormFields.SetField("ResidenceLengthOfResidence", GetNonNullString(app.ResidenceLengthOfResidence));
                                pdfFormFields.SetField("WhatIfMovingPetPlacement", GetNonNullString(app.WhatIfMovingPetPlacement));
                                if (app.IsAppOrSpouseStudent.HasValue)
                                {
                                    pdfFormFields.SetField("IsAppOrSpouseStudent", IsTrueFalse(app.IsAppOrSpouseStudent));
                                    if (app.ApplicationStudentTypeId != null && app.IsAppOrSpouseStudent.Value)
                                    {
                                        pdfFormFields.SetField("StudentType", (_context.ApplicationStudentType.First(x => x.Id == app.ApplicationStudentTypeId)).Code);
                                    }
                                }
                                pdfFormFields.SetField("IsAppTravelFrequent", IsTrueFalse(app.IsAppTravelFrequent));
                                pdfFormFields.SetField("AppTravelFrequency", GetNonNullString(app.AppTravelFrequency));
                                pdfFormFields.SetField("WhatIfTravelPetPlacement", GetNonNullString(app.WhatIfTravelPetPlacement));
                                pdfFormFields.SetField("ResidenceNumberOccupants", GetNonNullString(app.ResidenceNumberOccupants));
                                pdfFormFields.SetField("ResidenceAgesOfChildren", GetNonNullString(app.ResidenceAgesOfChildren));
                                pdfFormFields.SetField("ResidenceIsYardFenced", IsTrueFalse(app.ResIdenceIsYardFenced));
                                pdfFormFields.SetField("ResidenceFenceType", GetNonNullString(app.ResidenceFenceTypeHeight));

                                pdfFormFields.SetField("IsPetKeptLocationInOutDoorsTotallyInside", IsYesNo(app.IsPetKeptLocationInOutDoorsTotallyInside));
                                pdfFormFields.SetField("IsPetKeptLocationInOutDoorsMostlyInside", IsYesNo(app.IsPetKeptLocationInOutDoorsMostlyInside));
                                pdfFormFields.SetField("IsPetKeptLocationInOutDoorsTotallyOutside", IsYesNo(app.IsPetKeptLocationInOutDoorsTotallyOutside));
                                pdfFormFields.SetField("IsPetKeptLocationInOutDoorMostlyOutsides", IsYesNo(app.IsPetKeptLocationInOutDoorMostlyOutside));
                                pdfFormFields.SetField("PetKeptLocationInOutDoorsExplain", GetNonNullString(app.PetKeptLocationInOutDoorsExplain));

                                pdfFormFields.SetField("PetKeptAloneHoursPerDay", GetNonNullString(app.PetLeftAloneHours));
                                pdfFormFields.SetField("PetKeptAloneNumberDays", GetNonNullString(app.PetLeftAloneDays));

                                pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionLooseIndoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionLooseIndoors));
                                pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionGarage", IsYesNo(app.IsPetKeptLocationAloneRestrictionGarage));
                                pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionOutsideKennel", IsYesNo(app.IsPetKeptLocationAloneRestrictionOutsideKennel));
                                pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionCratedIndoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionCratedIndoors));
                                pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionLooseInBackyard", IsYesNo(app.IsPetKeptLocationAloneRestrictionLooseInBackyard));
                                pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionTiedUpOutdoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionTiedUpOutdoors));
                                pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionBasement", IsYesNo(app.IsPetKeptLocationAloneRestrictionBasement));
                                pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionCratedOutdoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionCratedOutdoors));
                                pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionOther", IsYesNo(app.IsPetKeptLocationAloneRestrictionOther));
                                pdfFormFields.SetField("PetKeptLocationAloneRestrictionExplain", GetNonNullString(app.PetKeptLocationAloneRestrictionExplain));

                                pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionLooseIndoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionLooseIndoors));
                                pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionGarage", IsYesNo(app.IsPetKeptLocationSleepingRestrictionGarage));
                                pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionOutsideKennel", IsYesNo(app.IsPetKeptLocationSleepingRestrictionOutsideKennel));
                                pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionCratedIndoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionCratedIndoors));
                                pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionLooseInBackyard", IsYesNo(app.IsPetKeptLocationSleepingRestrictionLooseInBackyard));
                                pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionTiedUpOutdoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionTiedUpOutdoors));
                                pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionBasement", IsYesNo(app.IsPetKeptLocationSleepingRestrictionBasement));
                                pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionCratedOutdoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionCratedOutdoors));
                                pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionOther", IsYesNo(app.IsPetKeptLocationSleepingRestrictionOther));
                                pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionBedWithOwner", IsYesNo(app.IsPetKeptLocationSleepingRestrictionInBedOwner));
                                pdfFormFields.SetField("PetKeptLocationSleepingRestrictionExplain", GetNonNullString(app.PetKeptLocationSleepingRestrictionExplain));

                                //pdfFormFields.SetField("IsPetAdoptionReasonHousePet", IsYesNo(app.IsPetFosterReasonHousePet));
                                //pdfFormFields.SetField("IsPetAdoptionReasonGuardDog", IsYesNo(app.IsPetFosterReasonGuardDog));
                                //pdfFormFields.SetField("IsPetAdoptionReasonWatchDog", IsYesNo(app.IsPetFosterReasonWatchDog));
                                //pdfFormFields.SetField("IsPetAdoptionReasonGift", IsYesNo(app.IsPetFosterReasonGift));
                                //pdfFormFields.SetField("IsPetAdoptionReasonCompanionChild", IsYesNo(app.IsPetFosterReasonCompanionChild));
                                //pdfFormFields.SetField("IsPetAdoptionReasonCompanionPet", IsYesNo(app.IsPetFosterReasonCompanionPet));
                                //pdfFormFields.SetField("IsPetAdoptionReasonJoggingPartner", IsYesNo(app.IsPetFosterReasonJoggingPartner));
                                //pdfFormFields.SetField("IsPetAdoptionReasonOther", IsYesNo(app.IsPetFosterReasonOther));
                                //pdfFormFields.SetField("PetAdoptionReasonExplain", GetNonNullString(app.PetFosterReasonExplain));

                                pdfFormFields.SetField("FilterAppHasOwnedHuskyBefore", IsTrueFalse(app.FilterAppHasOwnedHuskyBefore));
                                pdfFormFields.SetField("FilterAppIsAwareHuskyAttributes", IsTrueFalse(app.FilterAppIsAwareHuskyAttributes));

                                pdfFormFields.SetField("FilterAppTraitsDesired", GetNonNullString(app.FilterAppTraitsDesired));

                                pdfFormFields.SetField("FilterAppIsCatOwner", IsTrueFalse(app.FilterAppIsCatOwner));
                                pdfFormFields.SetField("FilterAppCatsOwnedCount", GetNonNullString(app.FilterAppCatsOwnedCount));

                                pdfFormFields.SetField("FilterAppDogsInterestedIn", GetNonNullString(app.FilterAppDogsInterestedIn));

                                pdfFormFields.SetField("Veterinarian.NameOffice", GetNonNullString(app.VeterinarianOfficeName));
                                pdfFormFields.SetField("Veterinarian.NameDr", GetNonNullString(app.VeterinarianDoctorName));
                                pdfFormFields.SetField("Veterinarian.PhoneNumber", GetNonNullString(app.VeterinarianPhoneNumber));

                                if (app.ApplicationAppAnimals != null)
                                {
                                    var i = 1;
                                    foreach (var pet in app.ApplicationAppAnimals)
                                    {
                                        if (!string.IsNullOrEmpty(pet.Name))
                                        {
                                            pdfFormFields.SetField("AdopterAnimal.Name" + i, GetNonNullString(pet.Name));
                                            pdfFormFields.SetField("AdopterAnimal.Breed" + i, GetNonNullString(pet.Breed));
                                            pdfFormFields.SetField("AdopterAnimal.Gender" + i, GetNonNullString(pet.Sex));
                                            pdfFormFields.SetField("AdopterAnimal.Age" + i, GetNonNullString(pet.Age));
                                            pdfFormFields.SetField("AdopterAnimal.OwnershipLengthMonths" + i, GetNonNullString(pet.OwnershipLength));
                                            pdfFormFields.SetField("AdopterAnimal.IsAltered", IsTrueFalse(pet.IsAltered));
                                            pdfFormFields.SetField("AdopterAnimal.AlteredReason" + i, GetNonNullString(pet.AlteredReason));
                                            pdfFormFields.SetField("AdopterAnimal.IsHwPrevention", IsTrueFalse(pet.IsHwPrevention));
                                            pdfFormFields.SetField("AdopterAnimal.HwPreventionReason" + i, GetNonNullString(pet.HwPreventionReason));
                                            pdfFormFields.SetField("AdopterAnimal.IsFullyVaccinated", IsTrueFalse(pet.IsFullyVaccinated));
                                            pdfFormFields.SetField("AdopterAnimal.FullyVaccinatedReason" + i, GetNonNullString(pet.FullyVaccinatedReason));
                                            pdfFormFields.SetField("AdopterAnimal.IsStillOwned", IsTrueFalse(pet.IsStillOwned));
                                            pdfFormFields.SetField("AdopterAnimal.IsStillOwnedReason" + i, GetNonNullString(pet.IsStillOwnedReason));
                                            i++;
                                        }
                                    }
                                }
                        }
                        catch (DocumentException pdfEx)
                        {
                            // handle pdf document exception if any
                            _logger.LogError("Cont. FormService.CreateFosterApplicationPdf - App PDF Gen Error 1 - {@DocumentException}", pdfEx);
                        }
                        catch (IOException ioEx)
                        {
                            // handle IO exception
                            _logger.LogError("Cont. FormService.CreateFosterApplicationPdf - App PDF Gen Error 1 - {@IOException}", ioEx);
                        }
                        catch (Exception ex)
                        {
                            // handle other exception
                            _logger.LogError("Cont. FormService.CreateFosterApplicationPdf - App PDF Gen Error 1 - {@GeneralException}", ex);
                        }
                        finally
                        {
                            pdfStamper.FormFlattening = true;
                        }

                        pdfStamper.Close();

                        newPdfMemStream.Position = 0;
                        _logger.LogInformation("Cont. FormService.CreateFosterApplicationPdf - Start Save to Storage Service");
                        await _storageService.AddAppFoster(newPdfMemStream, fileName);
                        pdfReader.Close();
                        _logger.LogInformation("Cont. FormService.CreateFosterApplicationPdf - End Save to Storage Service");
                    }
                }
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError("Cont. FormService.CreateFosterApplicationPdf - App PDF Gen Error 2 - {@ArgumentNullException}", ex);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError("Cont. FormService.CreateFosterApplicationPdf - App PDF Gen Error 2 - {@ArgumentException}", ex);
            }
            catch (SecurityException ex)
            {
                _logger.LogError("Cont. FormService.CreateFosterApplicationPdf - App PDF Gen Error 2 - {@SecurityException}", ex);
            }
            catch (FileNotFoundException ex)
            {
                _logger.LogError("Cont. FormService.CreateFosterApplicationPdf - App PDF Gen Error 2 - {@FileNotFoundException}", ex);
            }
            catch (DirectoryNotFoundException ex)
            {
                _logger.LogError("Cont. FormService.CreateFosterApplicationPdf - App PDF Gen Error 2 - {@DirectoryNotFoundException}", ex);
            }
            catch (IOException ex)
            {
                _logger.LogError("Cont. FormService.CreateFosterApplicationPdf - App PDF Gen Error 2 - {@IOException}", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Cont. FormService.CreateFosterApplicationPdf - App PDF Gen Error 2 - {@generalException}", ex);
            }

            _logger.LogInformation("End FormService.CreateFosterApplicationPdf - {@fosterApplicationFileName}", fileName);
            return fileName;
        }


        /// <summary>
        /// return string literal "true" or "false" from object true or false
        /// </summary>
        /// <param name="value">Boolean true or false</param>
        /// <returns>string "true" or "false"</returns>
        private string IsTrueFalse(bool? value)
        {
            if (value.HasValue)
            {
                return value == true ? "true" : "false";
            }
            return "false";
        }

        /// <summary>
        /// return string literal "yes" or "no" from object true or false
        /// </summary>
        /// <param name="value">Boolean true or false</param>
        /// <returns>string "yes" or "no"</returns>
        private string IsYesNo(bool? value)
        {
            if (value.HasValue)
            {
                return value == true ? "Yes" : "No";
            }
            return "No";
        }
        private string GetNonNullString(string value)
        {
            return string.IsNullOrEmpty(value) ? string.Empty : value;
        }
    }
}
