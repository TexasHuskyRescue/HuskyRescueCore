using HuskyRescueCore.Models.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class EventRegistrationPerson
    {
        public int Id { get; set; }
        public Guid EventRegistrationId { get; set; }
        public EventRegistration EventRegistration { get; set; }
        public bool IsPrimaryPerson { get; set; }
        public decimal AmountPaid { get; set; }
        public int EventRegistrationPersonTypeId { get; set; }
        public EventRegistrationPersonType EventRegistrationPersonType { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }

        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string City { get; set; }
        public int StatesId { get; set; }
        public States State { get; set; }
        public string ZipCode { get; set; }

        public string PhoneNumber { get; set; }

        public string EmailAddress { get; set; }
    }
}
