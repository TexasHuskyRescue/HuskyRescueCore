using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class ApplicationFoster : Application
    {
        public List<ApplicationFosterStatus> ApplicationFosterStatuses { get; set; }

        public string WhatIfTravelPetPlacement { get; set; }
        public string WhatIfMovingPetPlacement { get; set; }

        public string FilterAppTraitsDesired { get; set; }

        public bool IsAllAdultsAgreedOnAdoption { get; set; }
        public string IsAllAdultsAgreedOnAdoptionReason { get; set; }
        public string FilterAppDogsInterestedIn { get; set; }
    }
}
