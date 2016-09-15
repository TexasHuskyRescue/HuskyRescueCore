using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class ApplicationAppAnimal
    {
        public Guid Id { get; set; }
        public Guid ApplicantId { get; set; }
        public Application Application { get; set; }
        public string Name { get; set; }
        public string Breed { get; set; }
        public string Sex { get; set; }
        public string Age { get; set; }
        public string OwnershipLength { get; set; }
        public bool IsAltered { get; set; }
        public string AlteredReason { get; set; }
        public bool IsHwPrevention { get; set; }
        public string HwPreventionReason { get; set; }
        public bool IsFullyVaccinated { get; set; }
        public string FullyVaccinatedReason { get; set; }
        public bool IsStillOwned { get; set; }
        public string IsStillOwnedReason { get; set; }
    }
}
