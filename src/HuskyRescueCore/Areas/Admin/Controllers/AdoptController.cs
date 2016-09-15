using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HuskyRescueCore.Data;
using HuskyRescueCore.Models;
using HuskyRescueCore.Models.AdopterViewModels;

namespace HuskyRescueCore.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class AdoptController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdoptController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: Adopt
        public async Task<IActionResult> Index(string appStatus, string appFirstName)
        {
            //IQueryable<string> statusQuery = from apps in _context.ApplicationAdoption
            //                                 orderby apps.Status
            //                                 select apps.Status;
            IQueryable<string> statusQuery = from status in _context.ApplicationAdoptionStatusType select status.Text;

            var resultApps = from apps in _context.ApplicationAdoption
                             select apps;

            if(!string.IsNullOrEmpty(appFirstName))
            {
                resultApps = resultApps.Where(app => app.AppNameFirst.Contains(appFirstName));
            }

            if (!string.IsNullOrEmpty(appStatus))
            {
                //resultApps = resultApps.Where(app => app.Status == appStatus);
            }

            var appStatusVM = new AdoptionAppStatusViewModel();
            appStatusVM.appStatuses = new SelectList(await statusQuery.Distinct().ToListAsync());
            appStatusVM.apps = await resultApps.ToListAsync();

            return View(appStatusVM);
        }

        // GET: Adopt/Details/5
        public async Task<IActionResult> Details(Guid? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ApplicationAdoption = await _context.ApplicationAdoption.SingleOrDefaultAsync(m => m.Id == id);
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

            var ApplicationAdoption = await _context.ApplicationAdoption.SingleOrDefaultAsync(m => m.Id == id);
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

            var ApplicationAdoption = await _context.ApplicationAdoption.SingleOrDefaultAsync(m => m.Id == id);
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
            var ApplicationAdoption = await _context.ApplicationAdoption.SingleOrDefaultAsync(m => m.Id == id);
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
