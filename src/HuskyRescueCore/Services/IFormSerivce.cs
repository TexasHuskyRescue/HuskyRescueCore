using HuskyRescueCore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    public interface IFormSerivce
    {
        Task<string> CreateAdoptionApplicationPdf(ApplicationAdoption app);
    }
}
