using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.AdopterViewModels.Admin
{
    public class AdoptionStatusViewModel
    {
        public int Id { get; set; }
        public Guid AdoptionAppId { get; set; }
        public int StatusTypeId { get; set; }
        public string StatusTypeCode { get; set; }
        public string StatusTypeText { get; set; }
        public DateTime UpdatedTimestamp { get; set; }
    }
}
