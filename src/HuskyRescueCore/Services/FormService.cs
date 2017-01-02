using System;
using System.Threading.Tasks;
using HuskyRescueCore.Models;
using System.IO;
using System.Security;
using iTextSharp.text;
using iTextSharp.text.pdf;
using HuskyRescueCore.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace HuskyRescueCore.Services
{
    /// <summary>
    /// 2016-09-11 moved to itext v4 for .NET Core support https://github.com/VahidN/iTextSharp.LGPLv2.Core
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
            _logger.LogInformation("***** Start FormService.CreateAdoptionApplicationPdf.app: {@app}", app);
            // Path to newly created file based on PDF template
            var pdfNewFilePath = string.Empty;
            var fileName = string.Empty;
            var azureStorageConfig = _configuration.GetSection("azureStorage");
            _logger.LogInformation("***** FormService.CreateAdoptionApplicationPdf.azureStorageConfig: {@azureStorageConfig}", azureStorageConfig);
            var googleDriveAdoptionFormUri = azureStorageConfig.GetValue<string>("GoogleDriveAdoptionFormUri");
            _logger.LogInformation("***** FormService.CreateAdoptionApplicationPdf.googleDriveAdoptionFormUri: {@googleDriveAdoptionFormUri}", googleDriveAdoptionFormUri);
            try
            {
                // create path to new file that will be generated
                fileName = app.AppNameLast + " - " + app.Id + ".pdf";
                _logger.LogInformation("***** FormService.CreateAdoptionApplicationPdf.fileName: {@fileName}", fileName);
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
                    _logger.LogInformation("***** FormService.CreateAdoptionApplicationPdf.tempPdfFileBytes: {@tempPdfFileBytes}", tempPdfFileBytes);
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

                            pdfFormFields.SetField("Comments", app.Comments);

                            pdfFormFields.SetField("AppFeeAmount", app.ApplicationFeeAmount.ToString());
                            pdfFormFields.SetField("AppFeePaymentMethod", "online");// app.PaymentMethod.ToString()); // change to literal as payment is required and this will always be "online"
                            pdfFormFields.SetField("AppFeePaymentTranId", app.ApplicationFeeTransactionId);

                            pdfFormFields.SetField("AppName", app.AppNameFirst + " " + app.AppNameLast);
                            pdfFormFields.SetField("AppSpouseName", app.AppSpouseNameFirst + " " + app.AppSpouseNameLast);
                            pdfFormFields.SetField("AppAddressStreet", app.AppAddressStreet1);
                            var stateName = (_context.States.First(x => x.Id == app.AppAddressStateId)).Text;
                            pdfFormFields.SetField("AppAddressCityStateZip", app.AppAddressCity + ", " + stateName + " " + app.AppAddressZIP);
                            pdfFormFields.SetField("AppHomePhone", app.AppHomePhone);
                            pdfFormFields.SetField("AppCellPhone", app.AppCellPhone);
                            pdfFormFields.SetField("AppEmail", app.AppEmail);
                            pdfFormFields.SetField("AppEmployer", app.AppEmployer);
                            pdfFormFields.SetField("AppDateBirth", app.AppDateBirth.Value.ToString("d"));
                            pdfFormFields.SetField("DateSubmitted", DateTime.Today.ToString("d"));
                            pdfFormFields.SetField("IsAllAdultsAgreedOnAdoption", IsTrueFalse(app.IsAllAdultsAgreedOnAdoption)); //, saveAppearance);
                            pdfFormFields.SetField("IsAllAdultsAgreedOnAdoptionReason", app.IsAllAdultsAgreedOnAdoptionReason); //, saveAppearance);
                            pdfFormFields.SetField("ResidenceOwnership", (_context.ApplicationResidenceOwnershipType.First(x => x.Id == app.ApplicationResidenceOwnershipTypeId)).Code);

                            pdfFormFields.SetField("ResidenceType", (_context.ApplicationResidenceType.First(x => x.Id == app.ApplicationResidenceTypeId)).Code);


                            if (app.ApplicationResidenceOwnershipTypeId.Equals(2))
                            {
                                //Rent
                                pdfFormFields.SetField("ResidenceIsPetAllowed", IsTrueFalse(app.ResidenceIsPetAllowed)); //, saveAppearance);
                                pdfFormFields.SetField("ResidenceIsPetDepositRequired", IsTrueFalse(app.ResidenceIsPetDepositRequired)); //, saveAppearance);

                                if (app.ResidenceIsPetDepositRequired.HasValue)
                                {
                                    if (app.ResidenceIsPetDepositRequired.Value)
                                    {
                                        pdfFormFields.SetField("ResidencePetDepositAmount", app.ResidencePetDepositAmount.ToString());
                                        if (app.ApplicationResidencePetDepositCoverageTypeId.HasValue)
                                        {
                                            pdfFormFields.SetField("ResidencePetDepositCoverage", (_context.ApplicationResidencePetDepositCoverageType.First(x => x.Id == app.ApplicationResidencePetDepositCoverageTypeId)).Code);
                                        }
                                        pdfFormFields.SetField("ResidenceIsPetDepositPaid", IsTrueFalse(app.ResidenceIsPetDepositPaid)); //, saveAppearance);
                                    }
                                }
                                pdfFormFields.SetField("ResidenceIsPetSizeWeightLimit", IsTrueFalse(app.ResidencePetSizeWeightLimit)); //, saveAppearance);
                                pdfFormFields.SetField("ResidenceLandlordName", app.ResidenceLandlordName);
                                pdfFormFields.SetField("ResidenceLandlordNumber", app.ResidenceLandlordNumber);
                            }
                            pdfFormFields.SetField("ResidenceLengthOfResidence", app.ResidenceLengthOfResidence);
                            pdfFormFields.SetField("WhatIfMovingPetPlacement", app.WhatIfMovingPetPlacement);
                            if (app.IsAppOrSpouseStudent.HasValue)
                            {
                                pdfFormFields.SetField("IsAppOrSpouseStudent", IsTrueFalse(app.IsAppOrSpouseStudent)); //, saveAppearance);
                                if (app.ApplicationStudentTypeId != null && app.IsAppOrSpouseStudent.Value)
                                {
                                    pdfFormFields.SetField("StudentType", (_context.ApplicationStudentType.First(x => x.Id == app.ApplicationStudentTypeId)).Code);
                                }
                            }
                            pdfFormFields.SetField("IsAppTravelFrequent", IsTrueFalse(app.IsAppTravelFrequent)); //, saveAppearance);
                            pdfFormFields.SetField("AppTravelFrequency", app.AppTravelFrequency);
                            pdfFormFields.SetField("WhatIfTravelPetPlacement", app.WhatIfTravelPetPlacement);
                            pdfFormFields.SetField("ResidenceNumberOccupants", app.ResidenceNumberOccupants);
                            pdfFormFields.SetField("ResidenceAgesOfChildren", app.ResidenceAgesOfChildren);
                            pdfFormFields.SetField("ResidenceIsYardFenced", IsTrueFalse(app.ResIdenceIsYardFenced)); //, saveAppearance);
                            pdfFormFields.SetField("ResidenceFenceType", app.ResidenceFenceTypeHeight);

                            pdfFormFields.SetField("IsPetKeptLocationInOutDoorsTotallyInside", IsYesNo(app.IsPetKeptLocationInOutDoorsTotallyInside)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationInOutDoorsMostlyInside", IsYesNo(app.IsPetKeptLocationInOutDoorsMostlyInside)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationInOutDoorsTotallyOutside", IsYesNo(app.IsPetKeptLocationInOutDoorsTotallyOutside)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationInOutDoorMostlyOutsides", IsYesNo(app.IsPetKeptLocationInOutDoorMostlyOutside)); //, saveAppearance);
                            pdfFormFields.SetField("PetKeptLocationInOutDoorsExplain", app.PetKeptLocationInOutDoorsExplain);

                            pdfFormFields.SetField("PetKeptAloneHoursPerDay", app.PetLeftAloneHours);
                            pdfFormFields.SetField("PetKeptAloneNumberDays", app.PetLeftAloneDays);

                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionLooseIndoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionLooseIndoors)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionGarage", IsYesNo(app.IsPetKeptLocationAloneRestrictionGarage)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionOutsideKennel", IsYesNo(app.IsPetKeptLocationAloneRestrictionOutsideKennel)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionCratedIndoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionCratedIndoors)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionLooseInBackyard", IsYesNo(app.IsPetKeptLocationAloneRestrictionLooseInBackyard)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionTiedUpOutdoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionTiedUpOutdoors)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionBasement", IsYesNo(app.IsPetKeptLocationAloneRestrictionBasement)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionCratedOutdoors", IsYesNo(app.IsPetKeptLocationAloneRestrictionCratedOutdoors)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionInBedOwner", IsYesNo(app.IsPetKeptLocationSleepingRestrictionInBedOwner)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationAloneRestrictionOther", IsYesNo(app.IsPetKeptLocationAloneRestrictionOther)); //, saveAppearance);
                            pdfFormFields.SetField("PetKeptLocationAloneRestrictionExplain", app.PetKeptLocationAloneRestrictionExplain);

                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionLooseIndoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionLooseIndoors)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionGarage", IsYesNo(app.IsPetKeptLocationSleepingRestrictionGarage)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionOutsideKennel", IsYesNo(app.IsPetKeptLocationSleepingRestrictionOutsideKennel)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionCratedIndoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionCratedIndoors)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionLooseInBackyard", IsYesNo(app.IsPetKeptLocationSleepingRestrictionLooseInBackyard)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionTiedUpOutdoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionTiedUpOutdoors)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionBasement", IsYesNo(app.IsPetKeptLocationSleepingRestrictionBasement)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionCratedOutdoors", IsYesNo(app.IsPetKeptLocationSleepingRestrictionCratedOutdoors)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetKeptLocationSleepingRestrictionOther", IsYesNo(app.IsPetKeptLocationSleepingRestrictionOther)); //, saveAppearance);
                            pdfFormFields.SetField("PetKeptLocationSleepingRestrictionExplain", app.PetKeptLocationSleepingRestrictionExplain);

                            //if (appType.Equals("A"))
                            //{
                            pdfFormFields.SetField("IsPetAdoptionReasonHousePet", IsYesNo(app.IsPetAdoptionReasonHousePet)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetAdoptionReasonGuardDog", IsYesNo(app.IsPetAdoptionReasonGuardDog)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetAdoptionReasonWatchDog", IsYesNo(app.IsPetAdoptionReasonWatchDog)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetAdoptionReasonGift", IsYesNo(app.IsPetAdoptionReasonGift)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetAdoptionReasonCompanionChild", IsYesNo(app.IsPetAdoptionReasonCompanionChild)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetAdoptionReasonCompanionPet", IsYesNo(app.IsPetAdoptionReasonCompanionPet)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetAdoptionReasonJoggingPartner", IsYesNo(app.IsPetAdoptionReasonJoggingPartner)); //, saveAppearance);
                            pdfFormFields.SetField("IsPetAdoptionReasonOther", IsYesNo(app.IsPetAdoptionReasonOther)); //, saveAppearance);
                            pdfFormFields.SetField("PetAdoptionReasonExplain", app.PetAdoptionReasonExplain);
                            //}

                            pdfFormFields.SetField("FilterAppHasOwnedHuskyBefore", IsTrueFalse(app.FilterAppHasOwnedHuskyBefore)); //, saveAppearance);
                            pdfFormFields.SetField("FilterAppIsAwareHuskyAttributes", IsTrueFalse(app.FilterAppIsAwareHuskyAttributes)); //, saveAppearance);

                            pdfFormFields.SetField("FilterAppTraitsDesired", app.FilterAppTraitsDesired);

                            pdfFormFields.SetField("FilterAppIsCatOwner", IsTrueFalse(app.FilterAppIsCatOwner)); //, saveAppearance);
                            pdfFormFields.SetField("FilterAppCatsOwnedCount", app.FilterAppCatsOwnedCount);

                            pdfFormFields.SetField("FilterAppDogsInterestedIn", app.FilterAppDogsInterestedIn);

                            pdfFormFields.SetField("Veterinarian.NameOffice", app.VeterinarianOfficeName);
                            pdfFormFields.SetField("Veterinarian.NameDr", app.VeterinarianDoctorName);
                            pdfFormFields.SetField("Veterinarian.PhoneNumber", app.VeterinarianPhoneNumber);

                            if (app.ApplicationAppAnimals != null)
                            {
                                foreach (var pet in app.ApplicationAppAnimals)
                                {
                                    var i = 1;
                                    if (!string.IsNullOrEmpty(pet.Name))
                                    {
                                        pdfFormFields.SetField("AdopterAnimal.Name" + i, pet.Name);
                                        pdfFormFields.SetField("AdopterAnimal.Breed" + i, pet.Breed);
                                        pdfFormFields.SetField("AdopterAnimal.Gender" + i, pet.Sex);
                                        pdfFormFields.SetField("AdopterAnimal.Age" + i, pet.Age);
                                        pdfFormFields.SetField("AdopterAnimal.OwnershipLengthMonths" + i, pet.OwnershipLength);
                                        pdfFormFields.SetField("AdopterAnimal.IsAltered" + i, IsTrueFalse(pet.IsAltered)); //, saveAppearance);
                                        pdfFormFields.SetField("AdopterAnimal.AlteredReason" + i, pet.AlteredReason);
                                        pdfFormFields.SetField("AdopterAnimal.IsHwPrevention" + i, IsTrueFalse(pet.IsHwPrevention)); //, saveAppearance);
                                        pdfFormFields.SetField("AdopterAnimal.HwPreventionReason" + i, pet.HwPreventionReason);
                                        pdfFormFields.SetField("AdopterAnimal.IsFullyVaccinated" + i, IsTrueFalse(pet.IsFullyVaccinated)); //, saveAppearance);
                                        pdfFormFields.SetField("AdopterAnimal.FullyVaccinatedReason" + i, pet.FullyVaccinatedReason);
                                        pdfFormFields.SetField("AdopterAnimal.IsStillOwned" + i, IsTrueFalse(pet.IsStillOwned)); //, saveAppearance);
                                        pdfFormFields.SetField("AdopterAnimal.IsStillOwnedReason" + i, pet.IsStillOwnedReason);
                                        i++;
                                    }
                                }
                            }
                        }
                        catch (DocumentException docEx)
                        {
                            // handle pdf document exception if any
                            _logger.LogError(new EventId(2), docEx, "ApplicantGen - DocumentException {exception_message}", docEx.Message);
                        }
                        catch (IOException ioEx)
                        {
                            // handle IO exception
                            _logger.LogError(new EventId(2), ioEx, "ApplicantGen - IOException {exception_message}", ioEx.Message);
                        }
                        catch (Exception ex)
                        {
                            // handle other exception
                            _logger.LogError(new EventId(2), ex, "ApplicantGen - GeneralException {exception_message}", ex.Message);
                        }
                        finally
                        {
                            pdfStamper.FormFlattening = true;
                        }

                        pdfStamper.Close();
                        newPdfMemStream.Position = 0;
                        await _storageService.AddAppAdoption(newPdfMemStream, fileName);

                        pdfReader.Close();
                    }
                }
            }
            catch (ArgumentNullException ex)
            {
                _logger.LogError(new EventId(2), ex, "App PDF Gen Error - ArgumentNullException");
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(new EventId(2), ex, "App PDF Gen Error - ArgumentException");
            }
            catch (SecurityException ex)
            {
                _logger.LogError(new EventId(2), ex, "App PDF Gen Error - SecurityException");
            }
            catch (FileNotFoundException ex)
            {
                _logger.LogError(new EventId(2), ex, "App PDF Gen Error - FileNotFoundException");
            }
            catch (DirectoryNotFoundException ex)
            {
                _logger.LogError(new EventId(2), ex, "App PDF Gen Error - DirectoryNotFoundException");
            }
            catch (IOException ex)
            {
                _logger.LogError(new EventId(2), ex, "App PDF Gen Error - IOException");
            }
            catch (Exception ex)
            {
                _logger.LogError(new EventId(2), ex, "App PDF Gen Error");
            }

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
    }
}
