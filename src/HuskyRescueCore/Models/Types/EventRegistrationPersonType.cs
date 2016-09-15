using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.Types
{
    public class EventRegistrationPersonType
    {
        public EventRegistrationPersonType()
        {
            //EventRegistrationPersons = new List<EventRegistrationPerson>();
        }
        public int Id { get; set; }
        public string Code { get; set; }
        public string Text { get; set; }

        public List<EventRegistrationPerson> EventRegistrationPersons { get; set; }
    }
}
