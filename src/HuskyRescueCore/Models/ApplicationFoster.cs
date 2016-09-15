using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class ApplicationFoster : Application
    {
        //public Guid FosterPersonId { get; set; }
        //public Person Foster { get; set; }

        public List<ApplicationFosterStatus> ApplicationFosterStatuses { get; set; }
    }
}
