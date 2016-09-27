using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.AdopterViewModels.Admin
{
    public class AdoptionIndexViewModel
    {
        public List<AdoptionListViewModel> apps;
        public SelectList appStatuses;
        public string appStatus { get; set; }
    }
}
