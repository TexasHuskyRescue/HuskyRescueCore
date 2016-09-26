using Microsoft.WindowsAzure.Storage;
using System;

namespace HuskyRescueCore.Models.SettingsModels
{
    public class AzureSettings
    {
        public string GoogleDriveAdoptionFormUri { get; set; }
        public string ConnectionString { get; set; }
        public string AdoptionAppsContainer { get; set; }
        public string BlankFormsContainer { get; set; }
        public string AccountName { get; set; }
        public string DefaultEndpointsProtocol { get; set; }
        public bool IsHttps { get
            {
                return DefaultEndpointsProtocol.ToLower().Equals("https") ? true : false;
            }
        } 
        public string AccountKey { get; set; }
        public string EndpointSuffix { get; set; }

        public StorageUri EndpointUri { get
            {
                return new StorageUri(new Uri(DefaultEndpointsProtocol + "://" + AccountName + "." + EndpointSuffix));
            }
        }
    }
}
