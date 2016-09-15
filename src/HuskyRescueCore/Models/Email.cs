using HuskyRescueCore.Models.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class Email
    {
        public Guid Id { get; set; }
        public string Address { get; set; }
        public int EmailTypeId { get; set; }
        public EmailType EmailType { get; set; }

        public Person Person { get; set; }
        public Guid? PersonId { get; set; }

        public Business Business { get; set; }
        public Guid? BusinessId { get; set; }
    }
}
