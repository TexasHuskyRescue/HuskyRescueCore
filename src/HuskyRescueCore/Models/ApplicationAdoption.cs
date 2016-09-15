using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class ApplicationAdoption : Application
    {
        //public Guid AdopterPersonId { get; set; }
        //public Person Adopter { get; set; }

        public List<ApplicationAdoptionStatus> ApplicationAdoptionStatuses { get; set; }

        public bool IsPetAdoptionReasonHousePet { get; set; }
        public bool IsPetAdoptionReasonGuardDog { get; set; }
        public bool IsPetAdoptionReasonWatchDog { get; set; }
        public bool IsPetAdoptionReasonGift { get; set; }
        public bool IsPetAdoptionReasonCompanionChild { get; set; }
        public bool IsPetAdoptionReasonCompanionPet { get; set; }
        public bool IsPetAdoptionReasonJoggingPartner { get; set; }
        public bool IsPetAdoptionReasonOther { get; set; }
        public string PetAdoptionReasonExplain { get; set; }

        public string WhatIfTravelPetPlacement { get; set; }
        public string WhatIfMovingPetPlacement { get; set; }

        public string FilterAppTraitsDesired { get; set; }

        public bool IsAllAdultsAgreedOnAdoption { get; set; }
        public string IsAllAdultsAgreedOnAdoptionReason { get; set; }
        public string FilterAppDogsInterestedIn { get; set; }

        public decimal? ApplicationFeeAmount { get; set; }
        public string ApplicationFeePaymentMethod { get; set; }
        public string ApplicationFeeTransactionId { get; set; }
    }
}
