using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.Types
{
    public class ApplicationAdoptionStatusType
    {
        public ApplicationAdoptionStatusType()
        {
            //ApplicationAdoptionStatuses = new List<ApplicationAdoptionStatus>();
        }
        public int Id { get; set; }
        public string Code { get; set; }
        public string Text { get; set; }
        public List<ApplicationAdoptionStatus> ApplicationAdoptionStatuses { get; set; }
    }
}
