using HuskyRescueCore.Models.Types;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class Application
    {
        public Guid PersonId { get; set; }
        public Person Person { get; set; }

        public List<ApplicationAppAnimal> ApplicationAppAnimals { get; set; }
        public ApplicationResidenceOwnershipType ApplicationResidenceOwnershipType { get; set; }
        public ApplicationResidencePetDepositCoverageType ApplicationResidencePetDepositCoverageType { get; set; }
        public ApplicationResidenceType ApplicationResidenceType { get; set; }
        public ApplicationStudentType ApplicationStudentType { get; set; }

        public Guid Id { get; set; }

        public DateTime DateSubmitted { get; set; }
        public string AppNameFirst { get; set; }
        public string AppNameLast { get; set; }
        public string AppSpouseNameFirst { get; set; }
        public string AppSpouseNameLast { get; set; }
        public string AppCellPhone { get; set; }
        public string AppHomePhone { get; set; }
        public string AppAddressStreet1 { get; set; }
        public string AppAddressCity { get; set; }

        public int AppAddressStateId { get; set; }
        public States State { get; set; }

        public string AppAddressZIP { get; set; }
        public string AppEmail { get; set; }
        public DateTime? AppDateBirth { get; set; }
        public string AppEmployer { get; set; }
        public int ApplicationResidenceOwnershipTypeId { get; set; }
        public int ApplicationResidenceTypeId { get; set; }
        public bool? ResidenceIsPetAllowed { get; set; }
        public bool? ResidenceIsPetDepositRequired { get; set; }
        public decimal? ResidencePetDepositAmount { get; set; }
        public bool? ResidenceIsPetDepositPaid { get; set; }
        public int? ApplicationResidencePetDepositCoverageTypeId { get; set; }
        public bool? ResidencePetSizeWeightLimit { get; set; }
        public string ResidenceLandlordName { get; set; }
        public string ResidenceLandlordNumber { get; set; }
        public string ResidenceLengthOfResidence { get; set; }
        public bool? IsAppOrSpouseStudent { get; set; }
        public int? ApplicationStudentTypeId { get; set; }
        public bool IsAppTravelFrequent { get; set; }
        public string AppTravelFrequency { get; set; }
        public string ResidenceNumberOccupants { get; set; }
        public string ResidenceAgesOfChildren { get; set; }
        public bool ResIdenceIsYardFenced { get; set; }
        public string ResidenceFenceTypeHeight { get; set; }
        public string PetKeptLocationInOutDoors { get; set; }
        public bool IsPetKeptLocationInOutDoorsTotallyInside { get; set; }
        public bool IsPetKeptLocationInOutDoorsMostlyInside { get; set; }
        public bool IsPetKeptLocationInOutDoorsTotallyOutside { get; set; }
        public bool IsPetKeptLocationInOutDoorMostlyOutside { get; set; }
        public string PetKeptLocationInOutDoorsExplain { get; set; }
        public string PetLeftAloneHours { get; set; }
        public string PetLeftAloneDays { get; set; }
        public string PetKeptLocationAloneRestriction { get; set; }
        public bool IsPetKeptLocationAloneRestrictionLooseIndoors { get; set; }
        public bool IsPetKeptLocationAloneRestrictionGarage { get; set; }
        public bool IsPetKeptLocationAloneRestrictionOutsideKennel { get; set; }
        public bool IsPetKeptLocationAloneRestrictionCratedIndoors { get; set; }
        public bool IsPetKeptLocationAloneRestrictionCratedOutdoors { get; set; }
        public bool IsPetKeptLocationAloneRestrictionLooseInBackyard { get; set; }
        public bool IsPetKeptLocationAloneRestrictionTiedUpOutdoors { get; set; }
        public bool IsPetKeptLocationAloneRestrictionBasement { get; set; }
        public bool IsPetKeptLocationAloneRestrictionOther { get; set; }
        public string PetKeptLocationAloneRestrictionExplain { get; set; }
        public string PetKeptLocationSleepingRestriction { get; set; }
        public bool IsPetKeptLocationSleepingRestrictionLooseIndoors { get; set; }
        public bool IsPetKeptLocationSleepingRestrictionGarage { get; set; }
        public bool IsPetKeptLocationSleepingRestrictionOutsideKennel { get; set; }
        public bool IsPetKeptLocationSleepingRestrictionCratedIndoors { get; set; }
        public bool IsPetKeptLocationSleepingRestrictionCratedOutdoors { get; set; }
        public bool IsPetKeptLocationSleepingRestrictionLooseInBackyard { get; set; }
        public bool IsPetKeptLocationSleepingRestrictionTiedUpOutdoors { get; set; }
        public bool IsPetKeptLocationSleepingRestrictionBasement { get; set; }
        public bool IsPetKeptLocationSleepingRestrictionInBedOwner { get; set; }
        public bool IsPetKeptLocationSleepingRestrictionOther { get; set; }
        public string PetKeptLocationSleepingRestrictionExplain { get; set; }
       
        public bool FilterAppHasOwnedHuskyBefore { get; set; }
        public bool FilterAppIsCatOwner { get; set; }
        public string FilterAppCatsOwnedCount { get; set; }
        public bool FilterAppIsAwareHuskyAttributes { get; set; }

        public string VeterinarianOfficeName { get; set; }
        public string VeterinarianDoctorName { get; set; }
        public string VeterinarianPhoneNumber { get; set; }

        public string Comments { get; set; }

    }
}
