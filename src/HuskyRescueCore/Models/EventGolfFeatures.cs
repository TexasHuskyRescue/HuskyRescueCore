using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class EventGolfFeatures
    {
        public EventGolf EventGolf { get; set; }
        public Guid EventGolfId { get; set; }

        public int Id { get; set; }

        public string Feature { get; set; }
    }
}
