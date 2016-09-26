using HuskyRescueCore.Models.AdopterViewModels;
using HuskyRescueCore.Models.RescueGroupViewModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    public interface IRescueGroupsService
    {
        Task<List<RescueGroupAnimal>> GetAdoptableHuskiesAsync();
        Task<List<RescueGroupAnimal>> GetFosterableHuskiesAsync();
        Task<RescueGroupAnimal> GetHuskyProfileAsync(string id);
    }
}
