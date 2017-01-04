namespace HuskyRescueCore.Repositories
{
    using System.Threading.Tasks;

    public interface IRescueGroupApiRepository
    {
        Task<string> GetAdoptableHuskies(string rescueGroupsApiUri, string rescueGroupsApiKey, string cachedDataName);
        Task<string> GetFosterableHuskies(string rescueGroupsApiUri, string rescueGroupsApiKey, string cachedDataName);
        Task<string> GetHuskyProfile(string huskyId, string rescueGroupsApiUri, string rescueGroupsApiKey, string cachedDataName);
    }
}