namespace HuskyRescueCore.Repositories
{
    using System.IO;
    using System.Net;
    using System.Text;
    using System.Threading.Tasks;

    using Newtonsoft.Json;

    using Services;

    public class RescueGroupApiRepository : IRescueGroupApiRepository
    {
        private readonly IStorageService _storageService;

        public RescueGroupApiRepository(IStorageService storageService)
        {
            this._storageService = storageService;
        }

        public async Task<string> GetAdoptableHuskies(string rescueGroupsApiUri, string rescueGroupsApiKey, string cachedDataName)
        {
            return await Get(rescueGroupsApiUri, rescueGroupsApiKey, cachedDataName, 
                AdoptableHuskiesApiQueryParameters(rescueGroupsApiKey));
        }

        public async Task<string> GetFosterableHuskies(string rescueGroupsApiUri, string rescueGroupsApiKey, string cachedDataName)
        {
            return await Get(rescueGroupsApiUri, rescueGroupsApiKey, cachedDataName, 
                FosterableHuskiesApiQueryParameters(rescueGroupsApiKey));
        }

        public async Task<string> GetHuskyProfile(string huskyId, string rescueGroupsApiUri, string rescueGroupsApiKey, string cachedDataName)
        {
            return await Get(rescueGroupsApiUri, rescueGroupsApiKey, cachedDataName,
                HuskyProfileApiQueryParameters(rescueGroupsApiKey, huskyId));
        }

        private async Task<string> Get(string rescueGroupApiUri, string rescueGroupsApiKey, string cachedDataName, dynamic apiQueryParameters)
        {
            var request = (HttpWebRequest)WebRequest.Create(rescueGroupApiUri);
            request.Method = "POST";
            request.ContentType = "application/json";

            var jsonData = JsonConvert.SerializeObject(AdoptableHuskiesApiQueryParameters(rescueGroupsApiKey));
            var bytes = Encoding.UTF8.GetBytes(jsonData);

            var requestStream = await request.GetRequestStreamAsync();
            requestStream.Write(bytes, 0, bytes.Length);


            var result = string.Empty;

            if (await _storageService.IsRescueGroupApiCachedDataAvailable(cachedDataName))
            {
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
                        await _storageService.AddRescueGroupApiCachedData(cachedDataName, ms);
                    }
                    stream.Dispose();
                    reader.Dispose();
                }
            }

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
                        "animalOthernames",
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
                        "animalOthernames",
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

        private dynamic AdoptableHuskiesApiQueryParameters(string rescueGroupsApiKey)
        {
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
                        "animalOthernames",
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