using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class Person
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public bool CanEmail { get; set; }
        public bool CanSnailMail { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsVolunteer { get; set; }
        public bool IsFoster { get; set; }
        public bool IsAvailableFoster { get; set; }
        public bool IsAdopter { get; set; }
        public bool IsDonor { get; set; }
        public bool IsSponsor { get; set; }
        public bool IsBoardMember { get; set; }
        public bool IsSystemUser { get; set; }
        public bool IsDoNotAdopt { get; set; }
        public string DriverLicenseNumber { get; set; }
        public string Notes { get; set; }

        public DateTime CreatedTimestamp { get; set; }
        public DateTime UpdatedTimestamp { get; set; }


        public List<Email> Emails { get; set; }
        public List<Phone> Phones { get; set; }
        public List<Address> Addresses { get; set; }

        public List<Business> Employers { get; set; }
        public List<Business> Businesses { get; set; }

        public List<Donation> Donations { get; set; }

        //public List<ApplicationAdoption> ApplicationAdoptions { get;set;}
        //public List<ApplicationFoster> ApplicationFosters { get; set; }
        public List<Application> Applications { get; set; }
    }
}
