using System.IO;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    public interface IStorageService
    {
        Task AddAppAdoption(MemoryStream inputStream, string fileName);

        Task AddAppFoster(MemoryStream inputStream, string fileName);

        Task GetAppAdoption(string fileName, Stream stream);

        Task GetAppFoster(string fileName, Stream stream);

        Task<bool> IsAppAdoptionGenerated(string fileName);

        Task<bool> IsAppFosterGenerated(string fileName);

        Task<bool> IsRescueGroupApiCachedDataAvailable(string cachedDataName);

        Task AddRescueGroupApiCachedData(string cachedDataName, Stream storedDataStream);

        Task GetRescueGroupApiCachedData(string cachedDataName, Stream storedDataStream);

    }
}