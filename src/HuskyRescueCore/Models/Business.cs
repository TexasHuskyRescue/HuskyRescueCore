using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class Business
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool CanEmail { get; set; }
        public bool CanSnailMail { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsBoardingPlace { get; set; }
        public bool IsAnimalClinic { get; set; }
        public bool IsDonor { get; set; }
        public bool IsGrantGiver { get; set; }
        public bool IsSponsor { get; set; }
        
        public bool IsDoNotUse { get; set; }
        public string EIN { get; set; }
        public string Notes { get; set; }

        public List<Person> Employees { get; set; }
        public List<Person> Owners { get; set; }
        public List<Event> Events { get; set; }

        public DateTime CreatedTimestamp { get; set; }
        public DateTime UpdatedTimestamp { get; set; }


        public List<Email> Emails { get; set; }
        public List<Phone> Phones { get; set; }
        public List<Address> Addresses { get; set; }
    }
}
