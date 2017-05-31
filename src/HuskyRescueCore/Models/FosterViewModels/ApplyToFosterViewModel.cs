using HuskyRescueCore.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HuskyRescueCore.Models.FosterViewModels
{
    public class ApplyToFosterViewModel
    {
        public ApplyToFosterViewModel()
        {
            States = new List<SelectListItem>();
            ResidenceOwnershipList = new List<SelectListItem>();
            ResidencePetDepositCoverageList = new List<SelectListItem>();
            ResidenceTypeList = new List<SelectListItem>();
            StudentTypeList = new List<SelectListItem>();

            ResidenceIsPetAllowedOptions = YesNoRadios.List();
            ResidencePetSizeWeightLimitOptions = YesNoRadios.List();
            ResidenceIsPetDepositRequiredOptions = YesNoRadios.List();
            ResidenceIsPetDepositPaidOptions = YesNoRadios.List();
            ResidenceIsYardFencedOptions = YesNoRadios.List();
            IsAppOrSpouseStudentOptions = YesNoRadios.List();
            IsAppTravelFrequentOptions = YesNoRadios.List();
            FilterAppIsAwareHuskyAttributesOptions = YesNoRadios.List();
            FilterAppHasOwnedHuskyBeforeOptions = YesNoRadios.List();
            FilterAppIsCatOwnerOptions = YesNoRadios.List();

            IsAltered1Options = YesNoRadios.List();
            IsHwPrevention1Options = YesNoRadios.List();
            IsFullyVaccinated1Options = YesNoRadios.List();
            IsStillOwned1Options = YesNoRadios.List();

            IsAltered2Options = YesNoRadios.List();
            IsHwPrevention2Options = YesNoRadios.List();
            IsFullyVaccinated2Options = YesNoRadios.List();
            IsStillOwned2Options = YesNoRadios.List();

            IsAltered3Options = YesNoRadios.List();
            IsHwPrevention3Options = YesNoRadios.List();
            IsFullyVaccinated3Options = YesNoRadios.List();
            IsStillOwned3Options = YesNoRadios.List();

            IsAltered4Options = YesNoRadios.List();
            IsHwPrevention4Options = YesNoRadios.List();
            IsFullyVaccinated4Options = YesNoRadios.List();
            IsStillOwned4Options = YesNoRadios.List();

            IsAltered5Options = YesNoRadios.List();
            IsHwPrevention5Options = YesNoRadios.List();
            IsFullyVaccinated5Options = YesNoRadios.List();
            IsStillOwned5Options = YesNoRadios.List();
        }

        public IEnumerable<SelectListItem> States { get; set; }

        [Display(Name = "Would you like to receive newsletters and event information from Texas Husky Rescue in the future?")]
        public bool? IsEmailable { get; set; }

        [HiddenInput]
        public Guid Id { get; set; }

        [Display(Name = "Comments")]
        [MaxLength(4000, ErrorMessage = "notes must be less than 4000 characters")]
        [DataType(DataType.MultilineText)]
        public string Comments { get; set; }

        #region Applicant Contact Information
        [Display(Name = "Applicant First Name")]
        [Required(ErrorMessage = "please provide your first name")]
        [MaxLength(100, ErrorMessage = "first name must be less than 100 character")]
        public string AppNameFirst { get; set; }

        [Display(Name = "Last Name")]
        [Required(ErrorMessage = "please provide your full last name")]
        [MaxLength(100, ErrorMessage = "last name must be less than 100 character")]
        public string AppNameLast { get; set; }

        public string AppFullName { get { return AppNameFirst + " " + AppNameLast; } }

        [Display(Name = "Co-applicant First Name")]
        [MaxLength(100, ErrorMessage = "co-app first name must be less than 100 character")]
        public string AppSpouseNameFirst { get; set; }

        [Display(Name = "Last Name")]
        [MaxLength(100, ErrorMessage = "co-app last name must be less than 100 character")]
        public string AppSpouseNameLast { get; set; }

        [Display(Name = "Cell Phone Number")]
        [MaxLength(20, ErrorMessage = "phone number must be less than 20 digits")]
        //[DataType(DataType.PhoneNumber, ErrorMessage = "valid phone number required")]
        [Phone]
        //[RequiredIf("AppHomePhone == null && AppEmail == null", ErrorMessage = "cell phone required if home phone and email not provided")]
        public string AppCellPhone { get; set; }

        [Display(Name = "Home Phone Number")]
        [MaxLength(20, ErrorMessage = "phone number must be less than 20 digits")]
        //[DataType(DataType.PhoneNumber, ErrorMessage = "valid phone number required")]
        [Phone]
        //[RequiredIf("AppCellPhone == null && AppEmail == null", ErrorMessage = "home phone required if cell phone and email not provided")]
        public string AppHomePhone { get; set; }

        [Display(Name = "Email Address")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "email address is required")]
        [MaxLength(200, ErrorMessage = "email must be less than 20 digits")]
        [DataType(DataType.EmailAddress, ErrorMessage = "valid email required")]
        public string AppEmail { get; set; }

        [Display(Name = "Date of Birth")]
        [DataType(DataType.Date, ErrorMessage = "must be valid date")]
        //[AssertThat("AppDateBirth <= AddYears(Today(), -21)", ErrorMessage = "You must be at least 21 years old")]
        public DateTime AppDateBirth { get; set; }

        [Display(Name = "Street Address")]
        [Required(ErrorMessage = "home street address is required")]
        [MaxLength(50, ErrorMessage = "street address must be less than 50 characters")]
        public string AppAddressStreet1 { get; set; }

        [Display(Name = "City")]
        [Required(ErrorMessage = "city of home address is required")]
        [MaxLength(50, ErrorMessage = "city name must be less than 50 characters")]
        public string AppAddressCity { get; set; }

        [Display(Name = "State")]
        [Required(ErrorMessage = "state of home address is required")]
        public int AppAddressStateId { get; set; }
        public IEnumerable<SelectListItem> AppAddressStateList { get; set; }

        [Display(Name = "Postal Code")]
        [DataType(DataType.PostalCode)]
        [Required(ErrorMessage = "postal code of home address is required")]
        [MaxLength(10, ErrorMessage = "postal code must be less than 10 digits")]
        public string AppAddressZip { get; set; }

        [Display(Name = "Employer Name")]
        [MaxLength(100, ErrorMessage = "employer name must be less than 100 characters")]
        public string AppEmployer { get; set; }

        public string AppAddressFull { get { return AppAddressStreet1 + ", " + AppAddressCity + ", " + AppAddressStateId + ", " + AppAddressZip; } }

        public string AppAddressCityStateZip { get { return AppAddressCity + ", " + AppAddressStateId + ", " + AppAddressZip; } }
        #endregion

        #region Residence Information
        [Display(Name = "Do you own or rent?")]
        [Required(ErrorMessage = "owning / renting required")]
        public int ResidenceOwnershipId { get; set; }
        public IEnumerable<SelectListItem> ResidenceOwnershipList { get; set; }

        [Display(Name = "Residence type?")]
        [Required(ErrorMessage = "residence type required")]
        public int ResidenceTypeId { get; set; }
        public IEnumerable<SelectListItem> ResidenceTypeList { get; set; }

        [Display(Name = "Does your landlord allow pets?")]
        //[RequiredIf("ResidenceOwnershipId == 2", ErrorMessage = "if pets are allowed is required")]
        public bool? ResidenceIsPetAllowed { get; set; }
        public IEnumerable<YesNoRadios> ResidenceIsPetAllowedOptions { get; set; }

        [Display(Name = "Is a pet deposit required?")]
        //[RequiredIf("ResidenceOwnershipId == 2", ErrorMessage = "need of a pet deposit must be answered")]
        public bool? ResidenceIsPetDepositRequired { get; set; }
        public IEnumerable<YesNoRadios> ResidenceIsPetDepositRequiredOptions { get; set; }

        [Display(Name = "How much is the deposit?")]
        [DataType(DataType.Currency)]
        //[AssertThat("ResidencePetDepositAmount >= 0", ErrorMessage = "pet deposit amount must be greater than zero")]
        //[RequiredIf("ResidenceOwnershipId == 2 && ResidenceIsPetDepositRequired == true", ErrorMessage = "pet deposit amount required")]
        public decimal? ResidencePetDepositAmount { get; set; }

        [Display(Name = "Has the deposit been paid?")]
        //[RequiredIf("ResidenceOwnershipId == 2 && ResidenceIsPetDepositRequired == true", ErrorMessage = "indicate if the pet deposit has been payed")]
        public bool? ResidenceIsPetDepositPaid { get; set; }
        public IEnumerable<YesNoRadios> ResidenceIsPetDepositPaidOptions { get; set; }

        [Display(Name = "Is the deposit")]
        //[RequiredIf("ResidenceOwnershipId == 2 && ResidenceIsPetDepositRequired == true", ErrorMessage = "indicate if the pet deposit covers all pets or one pet")]
        public int? ResidencePetDepositCoverageId { get; set; }
        public IEnumerable<SelectListItem> ResidencePetDepositCoverageList { get; set; }

        [Display(Name = "Pet size/weight Limit?")]
        //[RequiredIf("ResidenceOwnershipId == 2", ErrorMessage = "indicate if there is a limit on pet size and/or weight")]
        public bool? ResidencePetSizeWeightLimit { get; set; }
        public IEnumerable<YesNoRadios> ResidencePetSizeWeightLimitOptions { get; set; }

        [Display(Name = "Name of Apartment Complex or Landlord")]
        [MaxLength(100, ErrorMessage = "name must be less than 100 characters")]
        //[RequiredIf("ResidenceOwnershipId == 2", ErrorMessage = "landlord or property owner name is required")]
        public string ResidenceLandlordName { get; set; }

        [Display(Name = "Complex/Landlord Phone number")]
        [MaxLength(20, ErrorMessage = "phone number must be less than 20 digits")]
        [DataType(DataType.PhoneNumber, ErrorMessage = "valid phone number required")]
        //[RequiredIf("ResidenceOwnershipId == 2", ErrorMessage = "landlord phone number required")]
        public string ResidenceLandlordNumber { get; set; }

        [Display(Name = "How long have you lived at your current residence?")]
        [Required(ErrorMessage = "length of residence required")]
        [MaxLength(100, ErrorMessage = "length of residence must be less than 100 characters")]
        public string ResidenceLengthOfResidence { get; set; }
        #endregion

        #region Filtering Information
        [Display(Name = "Are you or your spouse a student?")]
        [Required(ErrorMessage = "student status required")]
        public bool? IsAppOrSpouseStudent { get; set; }
        public IEnumerable<YesNoRadios> IsAppOrSpouseStudentOptions { get; set; }

        [Display(Name = "Student Type")]
        //[RequiredIf("IsAppOrSpouseStudent == true", ErrorMessage = "type of student is required")]
        public int? StudentTypeId { get; set; }
        public IEnumerable<SelectListItem> StudentTypeList { get; set; }

        [Display(Name = "Do you or your spouse travel frequently?")]
        [Required(ErrorMessage = "travel frequency is required")]
        public bool? IsAppTravelFrequent { get; set; }
        public IEnumerable<YesNoRadios> IsAppTravelFrequentOptions { get; set; }
        
        [Display(Name = "If yes, how often?"), DataType(DataType.Text)]
        [MaxLength(100, ErrorMessage = "travel frequency must be less than 100 characters")]
        //[RequiredIf("IsAppTravelFrequent == true", ErrorMessage = "travel frequency detail is required")]
        public string AppTravelFrequency { get; set; }

        [Display(Name = "Where would your foster stay while you are out of town?")]
        [Required(ErrorMessage = "your pets care information while you are out of town is required")]
        [MaxLength(4000)]
        [DataType(DataType.MultilineText)]
        public string WhatIfTravelPetPlacement { get; set; }

        [Display(Name = "If you had to move, what would you do with your pets?")]
        [Required(ErrorMessage = "what you do with your pets when moving is required")]
        [MaxLength(4000)]
        [DataType(DataType.MultilineText)]
        public string WhatIfMovingPetPlacement { get; set; }

        [Display(Name = "How many people live in your household")]
        [Required(ErrorMessage = "number of people living in the residence is required")]
        [MaxLength(50, ErrorMessage = "household size must be less than 50 characters")]
        public string ResidenceNumberOccupants { get; set; }

        [Display(Name = "Ages of children")]
        [MaxLength(200, ErrorMessage = "ages of children must be less than 200 characters")]
        public string ResidenceAgesOfChildren { get; set; }

        [Display(Name = "Do you have a fenced yard?")]
        [Required(ErrorMessage = "having a fenced yard is required")]
        public bool? ResidenceIsYardFenced { get; set; }
        public IEnumerable<YesNoRadios> ResidenceIsYardFencedOptions { get; set; }

        [Display(Name = "Type and height of fence?")]
        [MaxLength(50)]
        //[RequiredIf("ResidenceIsYardFenced == true", ErrorMessage = "type of fence is required")]
        public string ResidenceFenceTypeHeight { get; set; }

        [Display(Name = "This foster will be kept...")]
        public string PetKeptLocationInOutDoors { get; set; }

        [Display(Name = "Totally Inside")]
        public bool IsPetKeptLocationInOutDoorsTotallyInside { get; set; }
        [Display(Name = "Mostly Inside")]
        public bool IsPetKeptLocationInOutDoorsMostlyInside { get; set; }
        [Display(Name = "Totally Outside")]
        public bool IsPetKeptLocationInOutDoorsTotallyOutside { get; set; }
        [Display(Name = "Mostly Outside")]
        public bool IsPetKeptLocationInOutDoorMostlyOutsides { get; set; }

        [Display(Name = "Reason")]
        [MaxLength(4000)]
        [DataType(DataType.MultilineText)]
        public string PetKeptLocationInOutDoorsExplain { get; set; }

        [Display(Name = "Number of hours a day")]
        [Required(ErrorMessage = "number of hours a day foster is left alone is required")]
        [MaxLength(50, ErrorMessage = "number of hours foster left alone must be less than 50 characters")]
        public string PetLeftAloneHours { get; set; }

        [Display(Name = "Number of days a week")]
        [Required(ErrorMessage = "number of days a week foster left alone is required")]
        [MaxLength(50, ErrorMessage = "number of days a week foster left alone must be less than 50 characters")]
        public string PetLeftAloneDays { get; set; }

        [Display(Name = "Where will the foster be while you are at work or away from home?")]
        public string PetKeptLocationAloneRestriction { get; set; }
        [Display(Name = "Loose indoors")]
        public bool IsPetKeptLocationAloneRestrictionLooseIndoors { get; set; }
        [Display(Name = "Garage")]
        public bool IsPetKeptLocationAloneRestrictionGarage { get; set; }
        [Display(Name = "Outside kennel or dog run")]
        public bool IsPetKeptLocationAloneRestrictionOutsideKennel { get; set; }
        [Display(Name = "Crated indoors")]
        public bool IsPetKeptLocationAloneRestrictionCratedIndoors { get; set; }
        [Display(Name = "Crated Outdoors")]
        public bool IsPetKeptLocationAloneRestrictionCratedOutdoors { get; set; }
        [Display(Name = "Loose in Backyard")]
        public bool IsPetKeptLocationAloneRestrictionLooseInBackyard { get; set; }
        [Display(Name = "Tied Up Outdoors")]
        public bool IsPetKeptLocationAloneRestrictionTiedUpOutdoors { get; set; }
        [Display(Name = "Basement")]
        public bool IsPetKeptLocationAloneRestrictionBasement { get; set; }
        [Display(Name = "Other")]
        public bool IsPetKeptLocationAloneRestrictionOther { get; set; }

        [Display(Name = "Reason")]
        [MaxLength(4000)]
        [DataType(DataType.MultilineText)]
        public string PetKeptLocationAloneRestrictionExplain { get; set; }

        [Display(Name = "Where will the foster sleep at night?")]
        public string PetKeptLocationSleepingRestriction { get; set; }
        [Display(Name = "Loose indoors")]
        public bool IsPetKeptLocationSleepingRestrictionLooseIndoors { get; set; }
        [Display(Name = "Garage")]
        public bool IsPetKeptLocationSleepingRestrictionGarage { get; set; }
        [Display(Name = "Outside kennel or dog run")]
        public bool IsPetKeptLocationSleepingRestrictionOutsideKennel { get; set; }
        [Display(Name = "Crated indoors")]
        public bool IsPetKeptLocationSleepingRestrictionCratedIndoors { get; set; }
        [Display(Name = "Crated Outdoors")]
        public bool IsPetKeptLocationSleepingRestrictionCratedOutdoors { get; set; }
        [Display(Name = "Loose in Backyard")]
        public bool IsPetKeptLocationSleepingRestrictionLooseInBackyard { get; set; }
        [Display(Name = "Tied Up Outdoors")]
        public bool IsPetKeptLocationSleepingRestrictionTiedUpOutdoors { get; set; }
        [Display(Name = "Basement")]
        public bool IsPetKeptLocationSleepingRestrictionBasement { get; set; }
        [Display(Name = "In bed with owner")]
        public bool IsPetKeptLocationSleepingRestrictionBedWithOwner { get; set; }
        [Display(Name = "Other")]
        public bool IsPetKeptLocationSleepingRestrictionOther { get; set; }

        [Display(Name = "Reason")]
        [MaxLength(4000)]
        [DataType(DataType.MultilineText)]
        public string PetKeptLocationSleepingRestrictionExplain { get; set; }

        [Display(Name = "Why do you want to foster a husky at this time?")]
        [MaxLength(4000)]
        [DataType(DataType.MultilineText)]
        public string PetAdoptionReason { get; set; }

        [Display(Name = "House Pet")]
        public bool IsPetAdoptionReasonHousePet { get; set; }
        [Display(Name = "Guard Dog")]
        public bool IsPetAdoptionReasonGuardDog { get; set; }
        [Display(Name = "Watch Dog")]
        public bool IsPetAdoptionReasonWatchDog { get; set; }
        [Display(Name = "Gift")]
        public bool IsPetAdoptionReasonGift { get; set; }
        [Display(Name = "Companion for Child")]
        public bool IsPetAdoptionReasonCompanionChild { get; set; }
        [Display(Name = "Companion for Pet")]
        public bool IsPetAdoptionReasonCompanionPet { get; set; }
        [Display(Name = "Jogging partner")]
        public bool IsPetAdoptionReasonJoggingPartner { get; set; }
        [Display(Name = "Other")]
        public bool IsPetAdoptionReasonOther { get; set; }

        [Display(Name = "Reason")]
        [MaxLength(4000)]
        [DataType(DataType.MultilineText)]
        public string PetAdoptionReasonExplain { get; set; }

        [Display(Name = "Have you ever owned a husky?")]
        [Required(ErrorMessage = "previous ownership of a husky is required")]
        public bool? FilterAppHasOwnedHuskyBefore { get; set; }
        public IEnumerable<YesNoRadios> FilterAppHasOwnedHuskyBeforeOptions { get; set; }

        [Display(Name = "What traits are you looking for in a Husky (active, lazy, kid friendly, cat friendly agility, etc.)? Be specific so we can find a husky that best fits your lifestyle.")]
        [Required(ErrorMessage = "traits desired in a husky is required")]
        [MaxLength(4000)]
        [DataType(DataType.MultilineText)]
        public string FilterAppTraitsDesired { get; set; }

        [Display(Name = "Do you currently own any cats?")]
        [Required(ErrorMessage = "current ownership of cats is required")]
        public bool? FilterAppIsCatOwner { get; set; }
        public IEnumerable<YesNoRadios> FilterAppIsCatOwnerOptions { get; set; }

        [Display(Name = "If yes, how many?")]
        //[AssertThat("Length(FilterAppCatsOwnedCount) <= 20", ErrorMessage = "number of cats owned must be less than 20 characters")]
        //[RequiredIf("FilterAppIsCatOwner == true", ErrorMessage = "number of cats owned is required")]
        public string FilterAppCatsOwnedCount { get; set; }

        [Display(Name = "Are you aware huskies are diggers, escape artists, heavy shedders, and may not be cat friendly?")]
        //[Required(ErrorMessage = "traits of a husky is required")]
        public bool? FilterAppIsAwareHuskyAttributes { get; set; }
        public IEnumerable<YesNoRadios> FilterAppIsAwareHuskyAttributesOptions { get; set; }

        [Display(Name = "Are all adults in agreement about fostering and volunteering with TXHR?")]
        public bool IsAllAdultsAgreedOnAdoption { get; set; }

        [Display(Name = "If no, why?")]
        //[RequiredIf("IsAllAdultsAgreedOnAdoption == false", ErrorMessage = "reason for all adults not agreeing on adoption is required")]
        //[AssertThat("Length(IsAllAdultsAgreedOnAdoptionReason) <= 4000")]
        [DataType(DataType.MultilineText)]
        [MaxLength(4000)]
        public string IsAllAdultsAgreedOnAdoptionReason { get; set; }

        [Display(Name = "Which of our huskies are you interested in fostering?")]
        [DataType(DataType.MultilineText)]
        [MaxLength(4000)]
        public string FilterAppDogsInterestedIn { get; set; }
        #endregion

        #region vet
        [Display(Name = "Doctor Name")]
        [MaxLength(100, ErrorMessage = "vet doctor name must be less than 100 characters")]
        //[RequiredIf("Name1 != null || Name2 != null || Name3 != null || Name4 != null", ErrorMessage = "Vet required")]
        public string VeterinarianOfficeName { get; set; }

        [Display(Name = "Office Name")]
        [MaxLength(100, ErrorMessage = "vet office name must be less than 100 characters")]
        //[AssertThat("Length(NameOffice) <= 50", ErrorMessage = "vet office name must be less than 50 characters")]
        //[RequiredIf("NameDr != null", ErrorMessage = "vet office name required")]
        public string VeterinarianDoctorName { get; set; }

        [Display(Name = "Phone Number")]
        [MaxLength(20, ErrorMessage = "phone number must be less than 20 digits")]
        //[DataType(DataType.PhoneNumber, ErrorMessage = "valid phone number required")]
        [Phone]
        //[AssertThat("Length(PhoneNumber) > 8 && Length(PhoneNumber) < 15", ErrorMessage = "phone number must be 9 to 14 digits")]
        //[RequiredIf("NameDr != null || NameOffice != null", ErrorMessage = "vet phone number required")]
        public string PhoneNumber { get; set; }
        #endregion

        #region previous animals
        public IEnumerable<SelectListItem> SexList { get; set; }
        public IEnumerable<YesNoRadios> IsAltered1Options { get; set; }
        public IEnumerable<YesNoRadios> IsHwPrevention1Options { get; set; }
        public IEnumerable<YesNoRadios> IsFullyVaccinated1Options { get; set; }
        public IEnumerable<YesNoRadios> IsStillOwned1Options { get; set; }

        public IEnumerable<YesNoRadios> IsAltered2Options { get; set; }
        public IEnumerable<YesNoRadios> IsHwPrevention2Options { get; set; }
        public IEnumerable<YesNoRadios> IsFullyVaccinated2Options { get; set; }
        public IEnumerable<YesNoRadios> IsStillOwned2Options { get; set; }

        public IEnumerable<YesNoRadios> IsAltered3Options { get; set; }
        public IEnumerable<YesNoRadios> IsHwPrevention3Options { get; set; }
        public IEnumerable<YesNoRadios> IsFullyVaccinated3Options { get; set; }
        public IEnumerable<YesNoRadios> IsStillOwned3Options { get; set; }


        public IEnumerable<YesNoRadios> IsAltered4Options { get; set; }
        public IEnumerable<YesNoRadios> IsHwPrevention4Options { get; set; }
        public IEnumerable<YesNoRadios> IsFullyVaccinated4Options { get; set; }
        public IEnumerable<YesNoRadios> IsStillOwned4Options { get; set; }

        public IEnumerable<YesNoRadios> IsAltered5Options { get; set; }
        public IEnumerable<YesNoRadios> IsHwPrevention5Options { get; set; }
        public IEnumerable<YesNoRadios> IsFullyVaccinated5Options { get; set; }
        public IEnumerable<YesNoRadios> IsStillOwned5Options { get; set; }
        #region 4
        [Display(Name = "Name")]
        [MaxLength(50, ErrorMessage = "pet name must be less than 50 characters")]
        public string Name1 { get; set; }

        [Display(Name = "Breed")]
        [MaxLength(50, ErrorMessage = "breed must be less than 50 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "breed is required")]
        public string Breed1 { get; set; }

        [Display(Name = "Sex")]
        [MaxLength(6, ErrorMessage = "sex must be less than 6 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "sex is required")]
        public string Sex1 { get; set; }

        [Display(Name = "Age")]
        [MaxLength(50, ErrorMessage = "age must be less than 50 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "age of pet is required")]
        public string Age1 { get; set; }

        [Display(Name = "Length of ownership")]
        [MaxLength(50, ErrorMessage = "length of ownership must be less than 50 characters")]
        //[AssertThat("Length(OwnershipLengthMonths1) <= 100", ErrorMessage = "length of pet ownership must be less than 100 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "length of pet ownership is required")]
        public string OwnershipLength1 { get; set; }

        [Display(Name = "Altered (spay/neuter)?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "pet alteration required")]
        public bool? IsAltered1 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "altered reason must be less than 500 characters")]
        //[AssertThat("Length(AlteredReason1) <= 200", ErrorMessage = "reason for not altering pet must be less than 200 characters")]
        //[RequiredIf("IsAltered1 == false", ErrorMessage = "reason for not altering pet required")]
        public string AlteredReason1 { get; set; }

        [Display(Name = "On HW Preventative?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "pet heartworm prevention required")]
        public bool? IsHwPrevention1 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "hw reason must be less than 500 characters")]
        //[AssertThat("Length(HwPreventionReason1) <= 200", ErrorMessage = "lack of heartworm prevention reason must be less than 200 characters")]
        //[RequiredIf("IsHwPrevention1 == false", ErrorMessage = "lack of heartworm prevention reason is required")]
        public string HwPreventionReason1 { get; set; }

        [Display(Name = "Fully Vaccinated?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "vaccination is required")]
        public bool? IsFullyVaccinated1 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "vetting reason must be less than 500 characters")]
        //[AssertThat("Length(FullyVaccinatedReason1) <= 200", ErrorMessage = "lack of full vaccination reason must be less than 200 characters")]
        //[RequiredIf("IsFullyVaccinated1 == false", ErrorMessage = "lack of full vaccination reason is required")]
        public string FullyVaccinatedReason1 { get; set; }

        [Display(Name = "Do you still own this animal?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "current ownership of pet is required")]
        public bool? IsStillOwned1 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "ownership reason must be less than 500 characters")]
        //[AssertThat("Length(IsStillOwnedReason1) <= 200", ErrorMessage = "lack of current ownership reason must be less than 200 characters")]
        //[RequiredIf("IsStillOwned1 == false", ErrorMessage = "lack of current ownership reason is required")]
        public string IsStillOwnedReason1 { get; set; }
        #endregion

        #region 2
        [Display(Name = "Name")]
        [MaxLength(50, ErrorMessage = "pet name must be less than 50 characters")]
        public string Name2 { get; set; }

        [Display(Name = "Breed")]
        [MaxLength(50, ErrorMessage = "breed must be less than 50 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "breed is required")]
        public string Breed2 { get; set; }

        [Display(Name = "Sex")]
        [MaxLength(6, ErrorMessage = "sex must be less than 6 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "sex is required")]
        public string Sex2 { get; set; }

        [Display(Name = "Age")]
        [MaxLength(50, ErrorMessage = "age must be less than 50 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "age of pet is required")]
        public string Age2 { get; set; }

        [Display(Name = "Length of ownership")]
        [MaxLength(50, ErrorMessage = "length of ownership must be less than 50 characters")]
        //[AssertThat("Length(OwnershipLengthMonths1) <= 100", ErrorMessage = "length of pet ownership must be less than 100 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "length of pet ownership is required")]
        public string OwnershipLength2 { get; set; }

        [Display(Name = "Altered (spay/neuter)?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "pet alteration required")]
        public bool? IsAltered2 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "altered reason must be less than 500 characters")]
        //[AssertThat("Length(AlteredReason1) <= 200", ErrorMessage = "reason for not altering pet must be less than 200 characters")]
        //[RequiredIf("IsAltered1 == false", ErrorMessage = "reason for not altering pet required")]
        public string AlteredReason2 { get; set; }

        [Display(Name = "On HW Preventative?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "pet heartworm prevention required")]
        public bool? IsHwPrevention2 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "hw reason must be less than 500 characters")]
        //[AssertThat("Length(HwPreventionReason1) <= 200", ErrorMessage = "lack of heartworm prevention reason must be less than 200 characters")]
        //[RequiredIf("IsHwPrevention1 == false", ErrorMessage = "lack of heartworm prevention reason is required")]
        public string HwPreventionReason2 { get; set; }

        [Display(Name = "Fully Vaccinated?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "vaccination is required")]
        public bool? IsFullyVaccinated2 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "vetting reason must be less than 500 characters")]
        //[AssertThat("Length(FullyVaccinatedReason1) <= 200", ErrorMessage = "lack of full vaccination reason must be less than 200 characters")]
        //[RequiredIf("IsFullyVaccinated1 == false", ErrorMessage = "lack of full vaccination reason is required")]
        public string FullyVaccinatedReason2 { get; set; }

        [Display(Name = "Do you still own this animal?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "current ownership of pet is required")]
        public bool? IsStillOwned2 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "ownership reason must be less than 500 characters")]
        //[AssertThat("Length(IsStillOwnedReason1) <= 200", ErrorMessage = "lack of current ownership reason must be less than 200 characters")]
        //[RequiredIf("IsStillOwned1 == false", ErrorMessage = "lack of current ownership reason is required")]
        public string IsStillOwnedReason2 { get; set; }
        #endregion

        #region 3
        [Display(Name = "Name")]
        [MaxLength(50, ErrorMessage = "pet name must be less than 50 characters")]
        public string Name3 { get; set; }

        [Display(Name = "Breed")]
        [MaxLength(50, ErrorMessage = "breed must be less than 50 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "breed is required")]
        public string Breed3 { get; set; }

        [Display(Name = "Sex")]
        [MaxLength(6, ErrorMessage = "sex must be less than 6 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "sex is required")]
        public string Sex3 { get; set; }

        [Display(Name = "Age")]
        [MaxLength(50, ErrorMessage = "age must be less than 50 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "age of pet is required")]
        public string Age3 { get; set; }

        [Display(Name = "Length of ownership")]
        [MaxLength(50, ErrorMessage = "length of ownership must be less than 50 characters")]
        //[AssertThat("Length(OwnershipLengthMonths1) <= 100", ErrorMessage = "length of pet ownership must be less than 100 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "length of pet ownership is required")]
        public string OwnershipLength3 { get; set; }

        [Display(Name = "Altered (spay/neuter)?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "pet alteration required")]
        public bool? IsAltered3 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "altered reason must be less than 500 characters")]
        //[AssertThat("Length(AlteredReason1) <= 200", ErrorMessage = "reason for not altering pet must be less than 200 characters")]
        //[RequiredIf("IsAltered1 == false", ErrorMessage = "reason for not altering pet required")]
        public string AlteredReason3 { get; set; }

        [Display(Name = "On HW Preventative?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "pet heartworm prevention required")]
        public bool? IsHwPrevention3 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "hw reason must be less than 500 characters")]
        //[AssertThat("Length(HwPreventionReason1) <= 200", ErrorMessage = "lack of heartworm prevention reason must be less than 200 characters")]
        //[RequiredIf("IsHwPrevention1 == false", ErrorMessage = "lack of heartworm prevention reason is required")]
        public string HwPreventionReason3 { get; set; }

        [Display(Name = "Fully Vaccinated?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "vaccination is required")]
        public bool? IsFullyVaccinated3 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "vetting reason must be less than 500 characters")]
        //[AssertThat("Length(FullyVaccinatedReason1) <= 200", ErrorMessage = "lack of full vaccination reason must be less than 200 characters")]
        //[RequiredIf("IsFullyVaccinated1 == false", ErrorMessage = "lack of full vaccination reason is required")]
        public string FullyVaccinatedReason3 { get; set; }

        [Display(Name = "Do you still own this animal?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "current ownership of pet is required")]
        public bool? IsStillOwned3 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "ownership reason must be less than 500 characters")]
        //[AssertThat("Length(IsStillOwnedReason1) <= 200", ErrorMessage = "lack of current ownership reason must be less than 200 characters")]
        //[RequiredIf("IsStillOwned1 == false", ErrorMessage = "lack of current ownership reason is required")]
        public string IsStillOwnedReason3 { get; set; }
        #endregion

        #region 4
        [Display(Name = "Name")]
        [MaxLength(50, ErrorMessage = "pet name must be less than 50 characters")]
        public string Name4 { get; set; }

        [Display(Name = "Breed")]
        [MaxLength(50, ErrorMessage = "breed must be less than 50 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "breed is required")]
        public string Breed4 { get; set; }

        [Display(Name = "Sex")]
        [MaxLength(6, ErrorMessage = "sex must be less than 6 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "sex is required")]
        public string Sex4 { get; set; }

        [Display(Name = "Age")]
        [MaxLength(50, ErrorMessage = "age must be less than 50 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "age of pet is required")]
        public string Age4 { get; set; }

        [Display(Name = "Length of ownership")]
        [MaxLength(50, ErrorMessage = "length of ownership must be less than 50 characters")]
        //[AssertThat("Length(OwnershipLengthMonths1) <= 100", ErrorMessage = "length of pet ownership must be less than 100 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "length of pet ownership is required")]
        public string OwnershipLength4 { get; set; }

        [Display(Name = "Altered (spay/neuter)?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "pet alteration required")]
        public bool? IsAltered4 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "altered reason must be less than 500 characters")]
        //[AssertThat("Length(AlteredReason1) <= 200", ErrorMessage = "reason for not altering pet must be less than 200 characters")]
        //[RequiredIf("IsAltered1 == false", ErrorMessage = "reason for not altering pet required")]
        public string AlteredReason4 { get; set; }

        [Display(Name = "On HW Preventative?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "pet heartworm prevention required")]
        public bool? IsHwPrevention4 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "hw reason must be less than 500 characters")]
        //[AssertThat("Length(HwPreventionReason1) <= 200", ErrorMessage = "lack of heartworm prevention reason must be less than 200 characters")]
        //[RequiredIf("IsHwPrevention1 == false", ErrorMessage = "lack of heartworm prevention reason is required")]
        public string HwPreventionReason4 { get; set; }

        [Display(Name = "Fully Vaccinated?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "vaccination is required")]
        public bool? IsFullyVaccinated4 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "vetting reason must be less than 500 characters")]
        //[AssertThat("Length(FullyVaccinatedReason1) <= 200", ErrorMessage = "lack of full vaccination reason must be less than 200 characters")]
        //[RequiredIf("IsFullyVaccinated1 == false", ErrorMessage = "lack of full vaccination reason is required")]
        public string FullyVaccinatedReason4 { get; set; }

        [Display(Name = "Do you still own this animal?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "current ownership of pet is required")]
        public bool? IsStillOwned4 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "ownership reason must be less than 500 characters")]
        //[AssertThat("Length(IsStillOwnedReason1) <= 200", ErrorMessage = "lack of current ownership reason must be less than 200 characters")]
        //[RequiredIf("IsStillOwned1 == false", ErrorMessage = "lack of current ownership reason is required")]
        public string IsStillOwnedReason4 { get; set; }
        #endregion

        #region 5
        [Display(Name = "Name")]
        [MaxLength(50, ErrorMessage = "pet name must be less than 50 characters")]
        public string Name5 { get; set; }

        [Display(Name = "Breed")]
        [MaxLength(50, ErrorMessage = "breed must be less than 50 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "breed is required")]
        public string Breed5 { get; set; }

        [Display(Name = "Sex")]
        [MaxLength(6, ErrorMessage = "sex must be less than 6 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "sex is required")]
        public string Sex5 { get; set; }

        [Display(Name = "Age")]
        [MaxLength(50, ErrorMessage = "age must be less than 50 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "age of pet is required")]
        public string Age5 { get; set; }

        [Display(Name = "Length of ownership")]
        [MaxLength(50, ErrorMessage = "length of ownership must be less than 50 characters")]
        //[AssertThat("Length(OwnershipLengthMonths1) <= 100", ErrorMessage = "length of pet ownership must be less than 100 characters")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "length of pet ownership is required")]
        public string OwnershipLength5 { get; set; }

        [Display(Name = "Altered (spay/neuter)?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "pet alteration required")]
        public bool? IsAltered5 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "altered reason must be less than 500 characters")]
        //[AssertThat("Length(AlteredReason1) <= 200", ErrorMessage = "reason for not altering pet must be less than 200 characters")]
        //[RequiredIf("IsAltered1 == false", ErrorMessage = "reason for not altering pet required")]
        public string AlteredReason5 { get; set; }

        [Display(Name = "On HW Preventative?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "pet heartworm prevention required")]
        public bool? IsHwPrevention5 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "hw reason must be less than 500 characters")]
        //[AssertThat("Length(HwPreventionReason1) <= 200", ErrorMessage = "lack of heartworm prevention reason must be less than 200 characters")]
        //[RequiredIf("IsHwPrevention1 == false", ErrorMessage = "lack of heartworm prevention reason is required")]
        public string HwPreventionReason5 { get; set; }

        [Display(Name = "Fully Vaccinated?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "vaccination is required")]
        public bool? IsFullyVaccinated5 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "vetting reason must be less than 500 characters")]
        //[AssertThat("Length(FullyVaccinatedReason1) <= 200", ErrorMessage = "lack of full vaccination reason must be less than 200 characters")]
        //[RequiredIf("IsFullyVaccinated1 == false", ErrorMessage = "lack of full vaccination reason is required")]
        public string FullyVaccinatedReason5 { get; set; }

        [Display(Name = "Do you still own this animal?")]
        //[RequiredIf("!IsNullOrWhiteSpace(Name1)", ErrorMessage = "current ownership of pet is required")]
        public bool? IsStillOwned5 { get; set; }

        [Display(Name = "If no, please explain why")]
        [MaxLength(500, ErrorMessage = "ownership reason must be less than 500 characters")]
        //[AssertThat("Length(IsStillOwnedReason1) <= 200", ErrorMessage = "lack of current ownership reason must be less than 200 characters")]
        //[RequiredIf("IsStillOwned1 == false", ErrorMessage = "lack of current ownership reason is required")]
        public string IsStillOwnedReason5 { get; set; }
        #endregion
        #endregion
    }
}
