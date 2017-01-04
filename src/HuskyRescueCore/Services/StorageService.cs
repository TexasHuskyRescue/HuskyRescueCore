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
        private AzureSettings AzureSettings { get;set;}
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
            catch(Exception ex)
            {
                _logger.LogError(new EventId(11), ex, "Error creating StorageService {@ex}", ex);
            }
        }

        public async Task AddAppAdoption(MemoryStream inputStream, string fileName)
        {
            _logger.LogInformation("StorageService.AddAppAdoption {@fileName} {@fileSize}", fileName, inputStream.Length);
            // create the adoption app container
            CloudBlobContainer container = CloudBlobClient.GetContainerReference(AzureSettings.AdoptionAppsContainer);

            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);

            await blockBlob.UploadFromStreamAsync(inputStream);
        }

        public async Task GetAppAdoption(string fileName, Stream stream)
        {
            _logger.LogInformation("StorageService.GetAppAdoption {@fileName}", fileName);
            // create the adoption app container
            CloudBlobContainer container = CloudBlobClient.GetContainerReference(AzureSettings.AdoptionAppsContainer);

            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);

            await blockBlob.DownloadToStreamAsync(stream);
        }

        public async Task<bool> IsAppAdoptionGenerated(string fileName)
        {
            _logger.LogInformation("StorageService.IsAppAdoptionGenerated {@fileName}", fileName);
            // create the adoption app container
            CloudBlobContainer container = CloudBlobClient.GetContainerReference(AzureSettings.AdoptionAppsContainer);

            CloudBlockBlob blockBlob = container.GetBlockBlobReference(fileName);

            return await blockBlob.ExistsAsync();
        }

        public async Task<bool> IsRescueGroupApiCachedDataAvailable(string cachedDataName)
        {
            _logger.LogInformation("StorageService.IsRescueGroupApiCachedDataAvailable {@cachedDataName}", cachedDataName);
            var container = CloudBlobClient.GetContainerReference(AzureSettings.AdoptionAppsContainer);
            var blockBlob = container.GetBlockBlobReference(cachedDataName);
            if (!await blockBlob.ExistsAsync())
                return false;

            await blockBlob.FetchAttributesAsync();
            if (HasDataExpired(blockBlob.Properties.LastModified))
            {
                await blockBlob.DeleteIfExistsAsync();
            }
            return await blockBlob.ExistsAsync();
        }

        public async Task AddRescueGroupApiCachedData(string cachedDataName, Stream storedDataStream)
        {
            _logger.LogInformation("StorageService.AddRescueGroupApiCachedData {@cachedDataName} {@cachedDataSize}", cachedDataName, storedDataStream.Length);
            var container = CloudBlobClient.GetContainerReference(AzureSettings.AdoptionAppsContainer);

            var blockBlob = container.GetBlockBlobReference(cachedDataName);

            await blockBlob.UploadFromStreamAsync(storedDataStream);
        }

        public async Task GetRescueGroupApiCachedData(string cachedDataName, Stream storedDataStream)
        {
            _logger.LogInformation("StorageService.GetRescueGroupApiCachedData {@cachedDataName}", cachedDataName);

            var container = CloudBlobClient.GetContainerReference(AzureSettings.AdoptionAppsContainer);

            var blockBlob = container.GetBlockBlobReference(cachedDataName);
            await blockBlob.FetchAttributesAsync();
            await blockBlob.DownloadToStreamAsync(storedDataStream);
            storedDataStream.Position = 0;
        }

        private bool HasDataExpired(DateTimeOffset? blobsLastModifiedDateTime)
        {
            return (blobsLastModifiedDateTime <= DateTime.Now.AddHours(-12));
            //return (blobsLastModifiedDateTime <= DateTime.Now.AddMinutes(-2));
            //return (blobsLastModifiedDateTime <= DateTime.Now.AddSeconds(-20));
        }
    }


}
