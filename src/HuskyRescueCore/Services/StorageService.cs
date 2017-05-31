using HuskyRescueCore.Models.SettingsModels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob; // Namespace for Blob storage types
using System;
using System.IO;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    public class StorageService : IStorageService
    {
        private readonly ILogger<StorageService> _logger;
        private AzureSettings AzureSettings { get; set; }
        public IConfiguration Configuration { get; }

        private CloudStorageAccount CloudStorageAccount { get; set; }

        private StorageCredentials StorageCredentials { get; set; }

        private CloudBlobClient CloudBlobClient { get; set; }

        public StorageService(IConfiguration configuration, ILogger<StorageService> logger)
        {
            _logger = logger;
            _logger.LogInformation("StorageService Created");
            try
            {
                Configuration = configuration;
                AzureSettings = new AzureSettings();
                Configuration.GetSection("azureStorage").Bind(AzureSettings);

                StorageCredentials = new StorageCredentials(AzureSettings.AccountName, AzureSettings.AccountKey);
                CloudStorageAccount = new CloudStorageAccount(StorageCredentials, AzureSettings.EndpointSuffix, AzureSettings.IsHttps);

                CloudBlobClient = CloudStorageAccount.CreateCloudBlobClient();

                _logger.LogInformation("StorageService.StorageCredentials: {@StorageCredentials}", StorageCredentials);
                _logger.LogInformation("StorageService.CloudStorageAccount: {@CloudStorageAccount}", CloudStorageAccount);
                _logger.LogInformation("StorageService.CloudBlobClient: {@CloudBlobClient}", CloudBlobClient);
            }
            catch (Exception ex)
            {
                _logger.LogError(new EventId(11), ex, "Error creating StorageService {@ex}", ex);
            }
        }

        private const string TypeFoster = "foster";
        private const string TypeAdopter = "adopter";
        private const string TypeRescueGroupsApi = "rescuegroup";

        private async Task _AddFiletoBlob(MemoryStream inputStream, string fileName, string blobType)
        {
            _logger.LogInformation("Start StorageService._AddFiletoBlob {@fileName} {@blobType}", fileName, blobType);
            CloudBlobContainer container = null;

            CloudBlockBlob blockBlob = null;

            switch (blobType)
            {
                case TypeAdopter:
                    // create the adoption app container
                    container = CloudBlobClient.GetContainerReference(AzureSettings.AdoptionAppsContainer);
                    break;
                case TypeFoster:
                    // create the foster app container
                    container = CloudBlobClient.GetContainerReference(AzureSettings.FosterAppsContainer);
                    break;
                case TypeRescueGroupsApi:
                    // create the rescue group's api app container
                    container = CloudBlobClient.GetContainerReference(AzureSettings.RescueGroupsApiContainer);
                    break;
            }

            blockBlob = container.GetBlockBlobReference(fileName);

            await blockBlob.UploadFromStreamAsync(inputStream);

            _logger.LogInformation("End StorageService._AddFiletoBlob {@blockBlob}", blockBlob);
        }

        public async Task AddAppFoster(MemoryStream inputStream, string fileName)
        {
            _logger.LogInformation("Start StorageService.AddAppFoster {@fileName} {@fileSize}", fileName, inputStream.Length);

            await _AddFiletoBlob(inputStream, fileName, TypeFoster);
        }

        public async Task AddAppAdoption(MemoryStream inputStream, string fileName)
        {
            _logger.LogInformation("Start StorageService.AddAppAdoption {@fileName} {@fileSize}", fileName, inputStream.Length);

            await _AddFiletoBlob(inputStream, fileName, TypeAdopter);
        }

        private async Task _GetFile(string fileName, Stream inputStream, string blobType)
        {
            _logger.LogInformation("Start StorageService._GetFile {@fileName}, {@blobType}", fileName, blobType);

            CloudBlobContainer container = null;

            CloudBlockBlob blockBlob = null;

            switch (blobType)
            {
                case TypeAdopter:
                    // create the adoption app container
                    container = CloudBlobClient.GetContainerReference(AzureSettings.AdoptionAppsContainer);
                    break;
                case TypeFoster:
                    // create the foster app container
                    container = CloudBlobClient.GetContainerReference(AzureSettings.FosterAppsContainer);
                    break;
                case TypeRescueGroupsApi:
                    // create the rescue group's api app container
                    container = CloudBlobClient.GetContainerReference(AzureSettings.RescueGroupsApiContainer);
                    break;
            }

            blockBlob = container.GetBlockBlobReference(fileName);

            await blockBlob.DownloadToStreamAsync(inputStream);

            _logger.LogInformation("Start StorageService._GetFile {@blockBlob}", blockBlob);
        }

        public async Task GetAppFoster(string fileName, Stream stream)
        {
            _logger.LogInformation("Start StorageService.GetAppAdoption {@fileName}", fileName);

            await _GetFile(fileName, stream, TypeFoster);
        }

        public async Task GetAppAdoption(string fileName, Stream stream)
        {
            _logger.LogInformation("Start StorageService.GetAppAdoption {@fileName}", fileName);

            await _GetFile(fileName, stream, TypeAdopter);
        }

        private async Task<bool> _FileExists(string fileName, string blobType)
        {
            _logger.LogInformation("Start StorageService._FileExists {@fileName}, {@blobType}", fileName, blobType);

            CloudBlobContainer container = null;

            CloudBlockBlob blockBlob = null;

            switch (blobType)
            {
                case TypeAdopter:
                    // create the adoption app container
                    container = CloudBlobClient.GetContainerReference(AzureSettings.AdoptionAppsContainer);
                    break;
                case TypeFoster:
                    // create the foster app container
                    container = CloudBlobClient.GetContainerReference(AzureSettings.FosterAppsContainer);
                    break;
                case TypeRescueGroupsApi:
                    // create the rescue group's api app container
                    container = CloudBlobClient.GetContainerReference(AzureSettings.RescueGroupsApiContainer);
                    break;
            }

            blockBlob = container.GetBlockBlobReference(fileName);

            _logger.LogInformation("End StorageService._FileExists {@blockBlob}", blobType);

            return await blockBlob.ExistsAsync();
        }
        
        public async Task<bool> IsAppFosterGenerated(string fileName)
        {
            _logger.LogInformation("Start StorageService.IsAppFosterGenerated {@fileName}", fileName);

            return await _FileExists(fileName, TypeFoster);
        }

        public async Task<bool> IsAppAdoptionGenerated(string fileName)
        {
            _logger.LogInformation("Start StorageService.IsAppAdoptionGenerated {@fileName}", fileName);

            return await _FileExists(fileName, TypeAdopter);
        }

        public async Task<bool> IsRescueGroupApiCachedDataAvailable(string cachedDataName)
        {
            _logger.LogInformation("Start StorageService.IsRescueGroupApiCachedDataAvailable {@cachedDataName}", cachedDataName);
            var container = CloudBlobClient.GetContainerReference(AzureSettings.RescueGroupsApiContainer);
            var blockBlob = container.GetBlockBlobReference(cachedDataName);
            if (!await blockBlob.ExistsAsync())
                return false;

            await blockBlob.FetchAttributesAsync();
            if (HasDataExpired(blockBlob.Properties.LastModified))
            {
                await blockBlob.DeleteIfExistsAsync();
            }

            _logger.LogInformation("End StorageService.IsRescueGroupApiCachedDataAvailable {@blockBlob}", blockBlob);

            return await blockBlob.ExistsAsync();
        }

        public async Task AddRescueGroupApiCachedData(string cachedDataName, Stream storedDataStream)
        {
            _logger.LogInformation("Start StorageService.AddRescueGroupApiCachedData {@cachedDataName} {@cachedDataSize}", cachedDataName, storedDataStream.Length);

            var container = CloudBlobClient.GetContainerReference(AzureSettings.RescueGroupsApiContainer);
            _logger.LogInformation("Cont. StorageService.AddRescueGroupApiCachedData {@container}", container);

            var blockBlob = container.GetBlockBlobReference(cachedDataName);
            _logger.LogInformation("Cont. StorageService.AddRescueGroupApiCachedData {@blockBlob}", blockBlob);

            await blockBlob.UploadFromStreamAsync(storedDataStream);

            _logger.LogInformation("End StorageService.AddRescueGroupApiCachedData {@blockBlob}", blockBlob);
        }

        public async Task GetRescueGroupApiCachedData(string cachedDataName, Stream storedDataStream)
        {
            _logger.LogInformation("Start StorageService.GetRescueGroupApiCachedData {@cachedDataName}", cachedDataName);

            var container = CloudBlobClient.GetContainerReference(AzureSettings.RescueGroupsApiContainer);
            _logger.LogInformation("Cont. StorageService.GetRescueGroupApiCachedData {@container}", container);

            var blockBlob = container.GetBlockBlobReference(cachedDataName);

            await blockBlob.FetchAttributesAsync();

            await blockBlob.DownloadToStreamAsync(storedDataStream);
            _logger.LogInformation("Cont. StorageService.GetRescueGroupApiCachedData {@blockBlob}", blockBlob);

            storedDataStream.Position = 0;

            _logger.LogInformation("End StorageService.GetRescueGroupApiCachedData");
        }

        private bool HasDataExpired(DateTimeOffset? blobsLastModifiedDateTime)
        {
            _logger.LogInformation("Start StorageService.HasDataExpired {@blobsLastModifiedDateTime}", blobsLastModifiedDateTime);

            return (blobsLastModifiedDateTime <= DateTime.Now.AddHours(-12));
            //return (blobsLastModifiedDateTime <= DateTime.Now.AddMinutes(-2));
            //return (blobsLastModifiedDateTime <= DateTime.Now.AddSeconds(-20));
        }
    }


}
