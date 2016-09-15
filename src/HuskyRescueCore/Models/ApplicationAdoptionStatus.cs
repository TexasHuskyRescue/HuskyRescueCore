using HuskyRescueCore.Models.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class ApplicationAdoptionStatus
    {
        public int Id { get; set; }
        public Guid ApplicationAdoptionId { get; set; }
        public ApplicationAdoption ApplicationAdoption { get; set; }

        public DateTime Timestamp { get; set; }

        public ApplicationAdoptionStatusType ApplicationAdoptionStatusType { get; set; }
        public int ApplicationAdoptionStatusTypeId { get; set; }
    }
}
