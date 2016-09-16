using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HuskyRescueCore.Controllers
{
    public class DonateController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Partners()
        {
            return View();
        }

        public IActionResult Sponsors()
        {
            return View();
        }
    }
}