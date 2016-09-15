using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class Donation
    {
        public Donation()
        {
        }
        public Guid Id { get; set; }

        public Guid PersonId { get; set; }

        public Person Person { get; set; }

        public decimal Amount { get; set; }

        public string DonorNote { get; set; }

        public string PaymentType { get; set; }

        public DateTime DateTimeOfDonation { get; set; }
    }
}
