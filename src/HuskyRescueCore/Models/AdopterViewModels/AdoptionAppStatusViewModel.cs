using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.AdopterViewModels
{
    public class AdoptionAppStatusViewModel
    {
        public List<ApplicationAdoption> apps;
        public SelectList appStatuses;
        public string appStatus { get; set; }
    }
}
