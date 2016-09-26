using System.IO;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    public interface IStorageService
    {
        Task AddAppAdoption(MemoryStream inputStream, string fileName);

        Task GetAppAdoption(string fileName, Stream stream);
    }
}