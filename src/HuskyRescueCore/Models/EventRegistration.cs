using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class EventRegistration
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Event Event { get; set; }
        public DateTime SubmittedTimestamp { get; set; }
        public bool HasPaid { get; set; }
        public int NumberTicketsBought { get; set; }
        public decimal AmountPaid { get; set; }
        public string CommentsFromRegistrant { get; set; }
        public string InternalNotes { get; set; }

        public List<EventRegistrationPerson> EventRegistrationPersons { get; set; }
    }
}
