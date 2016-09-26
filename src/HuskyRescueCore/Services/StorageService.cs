using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Blob; // Namespace for Blob storage types
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage.Auth;
using System.IO;
using HuskyRescueCore.Models.SettingsModels;
using Microsoft.Extensions.Logging;

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
    }
}
