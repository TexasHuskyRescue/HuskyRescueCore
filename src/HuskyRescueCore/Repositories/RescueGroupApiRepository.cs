namespace HuskyRescueCore.Repositories
{
    using System.IO;
    using System.Net;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Logging;

    using Newtonsoft.Json;

    using Services;
    using Newtonsoft.Json.Linq;
    using System;

    public class RescueGroupApiRepository : IRescueGroupApiRepository
    {
        private readonly IStorageService _storageService;
        private readonly ILogger<RescueGroupApiRepository> _logger;

        public RescueGroupApiRepository(IStorageService storageService, ILogger<RescueGroupApiRepository> logger)
        {
            _storageService = storageService;
            _logger = logger;
        }

        public async Task<string> GetAdoptableHuskies(string rescueGroupsApiUri, string rescueGroupsApiKey, string cachedDataName)
        {
            _logger.LogInformation("Start RescueGroupApiRepository.GetAdoptableHuskies: {@rescueGroupsApiUri}, {@rescueGroupsApiKey}, {@cachedDataName}", rescueGroupsApiUri, rescueGroupsApiKey, cachedDataName);
            return await Get(rescueGroupsApiUri, cachedDataName, AdoptableHuskiesApiQueryParameters(rescueGroupsApiKey));
        }

        public async Task<string> GetFosterableHuskies(string rescueGroupsApiUri, string rescueGroupsApiKey, string cachedDataName)
        {
            return await Get(rescueGroupsApiUri, cachedDataName,
            FosterableHuskiesApiQueryParameters(rescueGroupsApiKey));
        }

        public async Task<string> GetHuskyProfile(string huskyId, string rescueGroupsApiUri, string rescueGroupsApiKey, string cachedDataName)
        {
            return await Get(rescueGroupsApiUri, cachedDataName,
                HuskyProfileApiQueryParameters(rescueGroupsApiKey, huskyId));
        }

        private async Task<string> Get(string rescueGroupApiUri, string cachedDataName, dynamic apiQueryParameters)
        {
            _logger.LogInformation("Start RescueGroupApiRepository.Get: {@rescueGroupApiUri}, {@cachedDataName}", rescueGroupApiUri, cachedDataName);

            var result = string.Empty;

            if (await _storageService.IsRescueGroupApiCachedDataAvailable(cachedDataName))
            {
                _logger.LogInformation("Cont. RescueGroupApiRepository.Get: IsRescueGroupApiCachedDataAvailable returns true");

                using (var cachedStream = new MemoryStream())
                {
                    await _storageService.GetRescueGroupApiCachedData(cachedDataName, cachedStream);
                    using (var cachedReader = new StreamReader(cachedStream))
                    {
                        result = cachedReader.ReadToEnd();
                    }
                }
            }
            else
            {
                _logger.LogInformation("Cont. RescueGroupApiRepository.Get: IsRescueGroupApiCachedDataAvailable returns false");

                var request = (HttpWebRequest)WebRequest.Create(rescueGroupApiUri);
                request.Method = "POST";
                request.ContentType = "application/json";

                var jsonData = JsonConvert.SerializeObject(apiQueryParameters);
                var bytes = Encoding.UTF8.GetBytes(jsonData);

                var requestStream = await request.GetRequestStreamAsync();
                requestStream.Write(bytes, 0, bytes.Length);

                var response = await request.GetResponseAsync();
                var stream = response.GetResponseStream();
                if (stream != null)
                {
                    StreamReader reader;
                    using (var ms = new MemoryStream())
                    {
                        stream.CopyTo(ms);
                        ms.Position = 0;
                        reader = new StreamReader(ms);
                        result = reader.ReadToEnd();
                        
                        ms.Position = 0;

                        dynamic source = JObject.Parse(result);
                        var status = string.Empty;
                        var message = string.Empty;
                        if (source.data == null)
                        {
                            _logger.LogInformation("End RescueGroupApiRepository.Get source.data is null");
                            status = "error";
                            message = "null data retuned";
                        }

                        status = Convert.ToString(source.status);

                        _logger.LogInformation("Cont. RescueGroupApiRepository.Get source.status is {@status}", status);

                        if (status == "error")
                        {
                            message = Convert.ToString(source.message);
                            _logger.LogInformation("End RescueGroupApiRepository.Get {@message}", message);
                        }
                        else
                        {
                            await _storageService.AddRescueGroupApiCachedData(cachedDataName, ms);
                        }
                    }
                    stream.Dispose();
                    reader.Dispose();
                }
            }

            _logger.LogInformation("End RescueGroupApiRepository.Get: {@result}", result);
            return result;
        }

        private dynamic HuskyProfileApiQueryParameters(string rescueGroupsApiKey, string id)
        {
            return new
            {
                apikey = rescueGroupsApiKey,
                objectType = "animals",
                objectAction = "publicSearch",
                search = new
                {
                    resultStart = 0,
                    resultLimit = 1,
                    resultSort = "animalName",
                    resultOrder = "asc",
                    filters = new[]
                    {
                        new
                        {
                            fieldName = "animalID",
                            operation = "equal",
                            criteria = id
                        },
                        new
                        {
                            fieldName = "animalOrgID",
                            operation = "equal",
                            criteria = "3427"
                        },
                        new
                        {
                            fieldName = "animalStatus",
                            operation = "equal",
                            criteria = "Available"
                        }
                    },
                    fields = new[]
                    {
                        "animalID",
                        "animalAltered",
                        "animalBirthdate",
                        "animalBreed",
                        "animalColor",
                        "animalCratetrained",
                        "animalDescription",
                        "animalEnergyLevel",
                        "animalExerciseNeeds",
                        "animalEyeColor",
                        "animalGeneralAge",
                        "animalHousetrained",
                        "animalLeashtrained",
                        "animalMixedBreed",
                        "animalName",
                        "animalNeedsFoster",
                        "animalOKWithAdults",
                        "animalOKWithCats",
                        "animalOKWithDogs",
                        "animalOKWithKids",
                        //"animalOthernames", // requires Volunteer permissions
                        "animalPictures",
                        "animalRescueID",
                        "animalSex",
                        "animalSpecialneeds",
                        "animalSpecialneedsDescription",
                        "animalStatus",
                        "animalSummary"
                    }
                }
            };

        }

        private dynamic FosterableHuskiesApiQueryParameters(string rescueGroupsApiKey)
        {
            // searching 'animalNeedsFoster' requires volunteer permissions. It appears that this key is for public use as I'm not 
            // getting results when I search on that field.

            return new
            {
                apikey = rescueGroupsApiKey,
                objectType = "animals",
                objectAction = "publicSearch",
                search = new
                {
                    resultStart = 0,
                    resultLimit = 100,
                    resultSort = "animalName",
                    resultOrder = "asc",
                    filters = new[]
                    {
                        new
                        {
                            fieldName = "animalStatus",
                            operation = "equal",
                            criteria = "Available"
                        },
                        new
                        {
                            fieldName = "animalOrgID",
                            operation = "equal",
                            criteria = "3427"
                        },
                        new
                        {
                            fieldName = "animalNeedsFoster",
                            operation = "equal",
                            criteria = "Yes"
                        }

                    },
                    fields = new[]
                    {
                        "animalID",
                        "animalAltered",
                        "animalBirthdate",
                        "animalBreed",
                        "animalColor",
                        "animalCratetrained",
                        "animalDescription",
                        "animalEnergyLevel",
                        "animalExerciseNeeds",
                        "animalEyeColor",
                        "animalGeneralAge",
                        "animalHousetrained",
                        "animalLeashtrained",
                        "animalMixedBreed",
                        "animalName",
                        "animalNeedsFoster",
                        "animalOKWithAdults",
                        "animalOKWithCats",
                        "animalOKWithDogs",
                        "animalOKWithKids",
                        //"animalOthernames",  // requires Volunteer permissions
                        "animalPictures",
                        "animalRescueID",
                        "animalSex",
                        "animalSpecialneeds",
                        "animalSpecialneedsDescription",
                        "animalStatus",
                        "animalSummary",
                        "animalThumbnailUrl"
                    }
                }
            };
        //{
        //    apikey = rescueGroupsApiKey,
        //    objectType = "animals",
        //    objectAction = "publicSearch",
        //    search = new
        //    {
        //        resultStart = 0,
        //        resultLimit = 100,
        //        resultSort = "animalName",
        //        resultOrder = "asc",
        //        filters = new[]
        //        {
        //            new
        //            {
        //                fieldName = "animalStatus",
        //                operation = "equal",
        //                criteria = "Available"
        //            },
        //            new
        //            {
        //                fieldName = "animalOrgID",
        //                operation = "equal",
        //                criteria = "3427"
        //            }//,
        //            //new
        //            //{
        //            //    fieldName = "animalNeedsFoster",
        //            //    operation = "equal",
        //            //    criteria = "Yes"
        //            //}

        //        },
        //        fields = new[]
        //        {
        //            "animalID",
        //            "animalAltered",
        //            "animalBirthdate",
        //            "animalBreed",
        //            "animalColor",
        //            "animalCratetrained",
        //            "animalDescription",
        //            "animalEnergyLevel",
        //            "animalExerciseNeeds",
        //            "animalEyeColor",
        //            "animalGeneralAge",
        //            "animalHousetrained",
        //            "animalLeashtrained",
        //            "animalMixedBreed",
        //            "animalName",
        //            "animalNeedsFoster",
        //            "animalOKWithAdults",
        //            "animalOKWithCats",
        //            "animalOKWithDogs",
        //            "animalOKWithKids",
        //            //"animalOtherNames", // requires Volunteer permissions
        //            "animalPictures",
        //            "animalRescueID",
        //            "animalSex",
        //            "animalSpecialneeds",
        //            "animalSpecialneedsDescription",
        //            "animalStatus",
        //            "animalSummary",
        //            "animalThumbnailUrl"
        //        }
        //    }
        //};

    }

        private dynamic AdoptableHuskiesApiQueryParameters(string rescueGroupsApiKey)
        {
            _logger.LogInformation("Start RescueGroupApiRepository.AdoptableHuskiesApiQueryParameters: {@rescueGroupsApiKey}", rescueGroupsApiKey);

            return new
            {
                apikey = rescueGroupsApiKey,
                objectType = "animals",
                objectAction = "publicSearch",
                search = new
                {
                    resultStart = 0,
                    resultLimit = 100,
                    resultSort = "animalName",
                    resultOrder = "asc",
                    filters = new[]
                    {
                        new
                        {
                            fieldName = "animalStatus",
                            operation = "equal",
                            criteria = "Available"
                        },
                        new
                        {
                            fieldName = "animalOrgID",
                            operation = "equal",
                            criteria = "3427"
                        }
                    },
                    fields = new[]
                    {
                        "animalID",
                        "animalAltered",
                        "animalBirthdate",
                        "animalBreed",
                        "animalColor",
                        "animalCratetrained",
                        "animalDescription",
                        "animalEnergyLevel",
                        "animalExerciseNeeds",
                        "animalEyeColor",
                        "animalGeneralAge",
                        "animalHousetrained",
                        "animalLeashtrained",
                        "animalMixedBreed",
                        "animalName",
                        "animalNeedsFoster",
                        "animalOKWithAdults",
                        "animalOKWithCats",
                        "animalOKWithDogs",
                        "animalOKWithKids",
                        //"animalOthernames",  // requires Volunteer permissions
                        "animalPictures",
                        "animalRescueID",
                        "animalSex",
                        "animalSpecialneeds",
                        "animalSpecialneedsDescription",
                        "animalStatus",
                        "animalSummary",
                        "animalThumbnailUrl"
                    }
                }
            };

        }

    }
}