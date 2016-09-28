using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HuskyRescueCore.Data;
using HuskyRescueCore.Models;
using HuskyRescueCore.Models.AdopterViewModels.Admin;
using HuskyRescueCore.Services;
using Microsoft.Extensions.Logging;
using System.IO;

namespace HuskyRescueCore.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class AdoptController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ISystemSettingService _systemServices;
        private readonly IFormSerivce _formService;
        private readonly ILogger<AdoptController> _logger;
        private readonly IStorageService _storageService;

        public AdoptController(ApplicationDbContext context, ISystemSettingService systemServices, IFormSerivce formService, ILogger<AdoptController> logger, IStorageService storageService)
        {
            _systemServices = systemServices;
            _context = context;
            _formService = formService;
            _logger = logger;
            _storageService = storageService;
        }

        // GET: Adopt
        public async Task<IActionResult> Index(string appStatus, string appFirstName, string appLastName, DateTime dateSubmittedStart, DateTime dateSubmittedEnd)
        {
            IQueryable<string> statusQuery = from status in _context.ApplicationAdoptionStatusType select status.Text;

            //var statusTypes = _context.ApplicationAdoptionStatusType.ToList();

            var resultApps = from apps in _context.ApplicationAdoption
                             join status in _context.ApplicationAdoptionStatus on apps.Id equals status.ApplicationAdoptionId
                             join statusType in _context.ApplicationAdoptionStatusType on status.ApplicationAdoptionStatusTypeId equals statusType.Id
                             select new AdoptionListViewModel {
                Id = apps.Id,
                PersonId = apps.PersonId,
                AppNameFull = apps.AppNameFirst + " " + apps.AppNameLast,
                AppSpouseNameFull = string.IsNullOrEmpty(apps.AppSpouseNameFirst) ? string.Empty : apps.AppSpouseNameFirst + " " + apps.AppSpouseNameLast,
                AppCellPhone = string.IsNullOrEmpty(apps.AppCellPhone) ? string.Empty : apps.AppCellPhone,
                AppHomePhone = string.IsNullOrEmpty(apps.AppHomePhone) ? string.Empty : apps.AppHomePhone,
                AppEmail = apps.AppEmail,
                DateSubmitted = apps.DateSubmitted,
                AppAddressFull = string.Join(", ", apps.AppAddressStreet1, apps.AppAddressCity, apps.AppAddressStateId, apps.AppAddressZIP), 
                Status = new AdoptionStatusViewModel
                {
                    Id = status.Id,
                    AdoptionAppId = apps.Id,
                    StatusTypeId = status.ApplicationAdoptionStatusTypeId,
                    UpdatedTimestamp = status.Timestamp,
                    StatusTypeText = statusType.Text,
                    StatusTypeCode = statusType.Code
                }
            };

            if(!string.IsNullOrEmpty(appFirstName))
            {
                resultApps = resultApps.Where(app => app.AppNameFull.ToLower().Contains(appFirstName.ToLower()));
            }
            if (!string.IsNullOrEmpty(appLastName))
            {
                resultApps = resultApps.Where(app => app.AppNameFull.ToLower().Contains(appLastName.ToLower()));
            }
            if (dateSubmittedStart != null && dateSubmittedStart != DateTime.MinValue)
            {
                resultApps = resultApps.Where(app => app.DateSubmitted >= dateSubmittedStart);
            }
            if (dateSubmittedEnd != null && dateSubmittedEnd != DateTime.MinValue)
            {
                resultApps = resultApps.Where(app => app.DateSubmitted <= dateSubmittedEnd);
            }

            if (!string.IsNullOrEmpty(appStatus))
            {
                resultApps = resultApps.Where(app => app.Status.StatusTypeText == appStatus);
            }

            var model = new AdoptionIndexViewModel();


            try
            {
                model.appStatuses = new SelectList(await statusQuery.Distinct().ToListAsync());
                model.apps = await resultApps.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("AdoptController.Index - {@exception}", ex);
            }

            return View(model);
        }

        public async Task<FileContentResult> GeneratePdf(Guid? id)
        {
            //if (id == null)
            //{
            //    return NotFound();
            //}

            ApplicationAdoption ApplicationAdoption = null; ;

            try
            {
                ApplicationAdoption = await _context.ApplicationAdoption.FirstAsync(m => m.Id == id);
            }
            catch(Exception ex)
            {
                _logger.LogError("Admin.AdoptController.GeneratePdf.{@id} [error retrieving adoption app from database] : {@ex}", id, ex);
            }

            //if (ApplicationAdoption == null)
            //{
            //    return NotFound();
            //}
            var fileName = ApplicationAdoption.AppNameLast + " - " + ApplicationAdoption.Id.ToString() + ".pdf";
            byte[] pdfContentBytes;

            var exists = await _storageService.IsAppAdoptionGenerated(fileName);

            if (!exists)
            {
                try
                {
                    fileName = await _formService.CreateAdoptionApplicationPdf(ApplicationAdoption);
                }
                catch (Exception ex)
                {
                    _logger.LogError("Admin.AdoptController.GeneratePdf.{@fileNameAdoptionAppPDF} [error creating pdf] : {@ex}", fileName, ex);
                }
            }

            using (var stream = new MemoryStream())
            {
                await _storageService.GetAppAdoption(fileName, stream);
                stream.Position = 0;
                pdfContentBytes = stream.ToArray();
            }

            HttpContext.Response.ContentType = "application/pdf";
            FileContentResult result = new FileContentResult(pdfContentBytes, "application/pdf")
            {
                FileDownloadName = fileName
            };

            return result;
        }

        // GET: Adopt/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ApplicationAdoption = await _context.ApplicationAdoption.FirstAsync(m => m.Id == id);
            if (ApplicationAdoption == null)
            {
                return NotFound();
            }

            return View(ApplicationAdoption);
        }

        // GET: Adopt/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Adopt/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Status,AppAddressCity,AppAddressStateId,AppAddressStreet1,AppAddressZIP,AppCellPhone,AppDateBirth,AppEmail,AppEmployer,AppHomePhone,AppNameFirst,AppNameLast,AppSpouseNameFirst,AppSpouseNameLast,AppTravelFrequency,ApplicantTypeId,ApplicationFeeAmount,ApplicationFeePaymentMethod,ApplicationFeeTransactionId,Comments,DateSubmitted,FilterAppCatsOwnedCount,FilterAppDogsInterestedIn,FilterAppHasOwnedHuskyBefore,FilterAppIsAwareHuskyAttributes,FilterAppIsCatOwner,FilterAppTraitsDesired,IsAllAdultsAgreedOnAdoption,IsAllAdultsAgreedOnAdoptionReason,IsAppOrSpouseStudent,IsAppTravelFrequent,IsCompleted,IsDeleted,IsPetAdoptionReasonCompanionChild,IsPetAdoptionReasonCompanionPet,IsPetAdoptionReasonGift,IsPetAdoptionReasonGuardDog,IsPetAdoptionReasonHousePet,IsPetAdoptionReasonJoggingPartner,IsPetAdoptionReasonOther,IsPetAdoptionReasonWatchDog,IsPetKeptLocationAloneRestrictionBasement,IsPetKeptLocationAloneRestrictionCratedIndoors,IsPetKeptLocationAloneRestrictionCratedOutdoors,IsPetKeptLocationAloneRestrictionGarage,IsPetKeptLocationAloneRestrictionLooseInBackyard,IsPetKeptLocationAloneRestrictionLooseIndoors,IsPetKeptLocationAloneRestrictionOther,IsPetKeptLocationAloneRestrictionOutsIdeKennel,IsPetKeptLocationAloneRestrictionTiedUpOutdoors,IsPetKeptLocationInOutDoorMostlyOutsIdes,IsPetKeptLocationInOutDoorsMostlyInsIde,IsPetKeptLocationInOutDoorsTotallyInsIde,IsPetKeptLocationInOutDoorsTotallyOutsIde,IsPetKeptLocationSleepingRestrictionBasement,IsPetKeptLocationSleepingRestrictionCratedIndoors,IsPetKeptLocationSleepingRestrictionCratedOutdoors,IsPetKeptLocationSleepingRestrictionGarage,IsPetKeptLocationSleepingRestrictionInBedOwner,IsPetKeptLocationSleepingRestrictionLooseInBackyard,IsPetKeptLocationSleepingRestrictionLooseIndoors,IsPetKeptLocationSleepingRestrictionOther,IsPetKeptLocationSleepingRestrictionOutsIdeKennel,IsPetKeptLocationSleepingRestrictionTiedUpOutdoors,LengthPetLeftAloneDaysOfWeek,LengthPetLeftAloneHoursInDay,PetAdoptionReason,PetAdoptionReasonExplain,PetKeptLocationAloneRestriction,PetKeptLocationAloneRestrictionExplain,PetKeptLocationInOutDoors,PetKeptLocationInOutDoorsExplain,PetKeptLocationSleepingRestriction,PetKeptLocationSleepingRestrictionExplain,PetLeftAloneDays,PetLeftAloneHours,ResIdenceIsYardFenced,ResidenceAgesOfChildren,ResidenceFenceHeight,ResidenceFenceType,ResidenceIsPetAllowed,ResidenceIsPetDepositPaid,ResidenceIsPetDepositRequired,ResidenceLandlordName,ResidenceLandlordNumber,ResidenceLengthOfResidence,ResidenceNumberOccupants,ResidenceOwnershipId,ResidencePetDepositAmount,ResidencePetDepositCoverageId,ResidencePetSizeWeightLimit,ResidenceTypeId,StudentTypeId,WhatIfMovingPetPlacement,WhatIfTravelPetPlacement")] ApplicationAdoption ApplicationAdoption)
        {
            if (ModelState.IsValid)
            {
                ApplicationAdoption.Id = Guid.NewGuid();
                //ApplicationAdoption.Statuses.Add new 
                _context.Add(ApplicationAdoption);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(ApplicationAdoption);
        }

        // GET: Adopt/Edit/5
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ApplicationAdoption = await _context.ApplicationAdoption.FirstAsync(m => m.Id == id);
            if (ApplicationAdoption == null)
            {
                return NotFound();
            }
            return View(ApplicationAdoption);
        }

        // POST: Adopt/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Guid id, [Bind("Id,Status,AppAddressCity,AppAddressStateId,AppAddressStreet1,AppAddressZIP,AppCellPhone,AppDateBirth,AppEmail,AppEmployer,AppHomePhone,AppNameFirst,AppNameLast,AppSpouseNameFirst,AppSpouseNameLast,AppTravelFrequency,ApplicantTypeId,ApplicationFeeAmount,ApplicationFeePaymentMethod,ApplicationFeeTransactionId,Comments,DateSubmitted,FilterAppCatsOwnedCount,FilterAppDogsInterestedIn,FilterAppHasOwnedHuskyBefore,FilterAppIsAwareHuskyAttributes,FilterAppIsCatOwner,FilterAppTraitsDesired,IsAllAdultsAgreedOnAdoption,IsAllAdultsAgreedOnAdoptionReason,IsAppOrSpouseStudent,IsAppTravelFrequent,IsCompleted,IsDeleted,IsPetAdoptionReasonCompanionChild,IsPetAdoptionReasonCompanionPet,IsPetAdoptionReasonGift,IsPetAdoptionReasonGuardDog,IsPetAdoptionReasonHousePet,IsPetAdoptionReasonJoggingPartner,IsPetAdoptionReasonOther,IsPetAdoptionReasonWatchDog,IsPetKeptLocationAloneRestrictionBasement,IsPetKeptLocationAloneRestrictionCratedIndoors,IsPetKeptLocationAloneRestrictionCratedOutdoors,IsPetKeptLocationAloneRestrictionGarage,IsPetKeptLocationAloneRestrictionLooseInBackyard,IsPetKeptLocationAloneRestrictionLooseIndoors,IsPetKeptLocationAloneRestrictionOther,IsPetKeptLocationAloneRestrictionOutsIdeKennel,IsPetKeptLocationAloneRestrictionTiedUpOutdoors,IsPetKeptLocationInOutDoorMostlyOutsIdes,IsPetKeptLocationInOutDoorsMostlyInsIde,IsPetKeptLocationInOutDoorsTotallyInsIde,IsPetKeptLocationInOutDoorsTotallyOutsIde,IsPetKeptLocationSleepingRestrictionBasement,IsPetKeptLocationSleepingRestrictionCratedIndoors,IsPetKeptLocationSleepingRestrictionCratedOutdoors,IsPetKeptLocationSleepingRestrictionGarage,IsPetKeptLocationSleepingRestrictionInBedOwner,IsPetKeptLocationSleepingRestrictionLooseInBackyard,IsPetKeptLocationSleepingRestrictionLooseIndoors,IsPetKeptLocationSleepingRestrictionOther,IsPetKeptLocationSleepingRestrictionOutsIdeKennel,IsPetKeptLocationSleepingRestrictionTiedUpOutdoors,LengthPetLeftAloneDaysOfWeek,LengthPetLeftAloneHoursInDay,PetAdoptionReason,PetAdoptionReasonExplain,PetKeptLocationAloneRestriction,PetKeptLocationAloneRestrictionExplain,PetKeptLocationInOutDoors,PetKeptLocationInOutDoorsExplain,PetKeptLocationSleepingRestriction,PetKeptLocationSleepingRestrictionExplain,PetLeftAloneDays,PetLeftAloneHours,ResIdenceIsYardFenced,ResidenceAgesOfChildren,ResidenceFenceHeight,ResidenceFenceType,ResidenceIsPetAllowed,ResidenceIsPetDepositPaid,ResidenceIsPetDepositRequired,ResidenceLandlordName,ResidenceLandlordNumber,ResidenceLengthOfResidence,ResidenceNumberOccupants,ResidenceOwnershipId,ResidencePetDepositAmount,ResidencePetDepositCoverageId,ResidencePetSizeWeightLimit,ResidenceTypeId,StudentTypeId,WhatIfMovingPetPlacement,WhatIfTravelPetPlacement")] ApplicationAdoption ApplicationAdoption)
        {
            if (id != ApplicationAdoption.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(ApplicationAdoption);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ApplicationAdoptionExists(ApplicationAdoption.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index");
            }
            return View(ApplicationAdoption);
        }

        // GET: Adopt/Delete/5
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ApplicationAdoption = await _context.ApplicationAdoption.FirstAsync(m => m.Id == id);
            if (ApplicationAdoption == null)
            {
                return NotFound();
            }

            return View(ApplicationAdoption);
        }

        // POST: Adopt/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(Guid id)
        {
            var ApplicationAdoption = await _context.ApplicationAdoption.FirstAsync(m => m.Id == id);
            _context.ApplicationAdoption.Remove(ApplicationAdoption);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool ApplicationAdoptionExists(Guid id)
        {
            return _context.ApplicationAdoption.Any(e => e.Id == id);
        }
    }
}
