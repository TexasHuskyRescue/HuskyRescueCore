using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.Types
{
    public class ApplicationFosterStatusType
    {
        public ApplicationFosterStatusType()
        {
            //ApplicationFosterStatuses = new List<ApplicationFosterStatus>();
        }
        public int Id { get; set; }
        public string Code { get; set; }
        public string Text { get; set; }

        public List<ApplicationFosterStatus> ApplicationFosterStatuses { get; set; }
    }
}
