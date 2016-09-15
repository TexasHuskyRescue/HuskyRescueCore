using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HuskyRescueCore.Models.Types;

namespace HuskyRescueCore.Models
{
    public class Phone
    {
        public Guid Id { get; set; }
        public string Number { get; set; }
        public int PhoneTypeId { get; set; }
        public PhoneType PhoneType { get; set; }


        public Person Person { get; set; }
        public Guid? PersonId { get; set; }

        public Business Business { get; set; }
        public Guid? BusinessId { get; set; }
    }
}
