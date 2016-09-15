using HuskyRescueCore.Models.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class ApplicationFosterStatus
    {
        public Guid ApplicationFosterId { get; set; }
        public ApplicationFoster ApplicationFoster { get; set; }
        public int Id { get; set; }

        public DateTime Timestamp { get; set; }

        public ApplicationFosterStatusType ApplicationFosterStatusType { get; set; }
        public int ApplicationFosterStatusTypeId { get; set; }
    }
}
