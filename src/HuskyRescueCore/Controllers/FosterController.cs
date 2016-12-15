using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HuskyRescueCore.Models.RescueGroupViewModels;

using HuskyRescueCore.Services;

namespace HuskyRescueCore.Controllers
{

    public class FosterController : Controller
    {
        private readonly IRescueGroupsService _rescueGroupsService;

        public FosterController(IRescueGroupsService rescueGroupsService)
        {
            _rescueGroupsService = rescueGroupsService;
        }

        public async Task<IActionResult> Index()
        {
            //var huskies = await _rescueGroupsService.GetFosterableHuskiesAsync();
            var huskies = await _rescueGroupsService.GetAdoptableHuskiesAsync();
            // using a lookup that will work so that the page will load. Not sure we need this view since the adoptable huskies page has a 'filter' to
            // show dogs that need foster. Otherwise, we need to work around 'animalNeedsFoster' being a volunteer level search, not a public search.


            var model = new RescueGroupAnimals { Animals = huskies };
            return View(model);
        }

        public IActionResult Process()
        {
            return View();
        }

        public IActionResult Apply()
        {
            return View();
        }

        public IActionResult ThankYou()
        {
            return View();
        }
    }
}