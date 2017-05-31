namespace HuskyRescueCore.Mappers
{
    using System.Collections.Generic;
    using Models.RescueGroupViewModels;
    using Newtonsoft.Json.Linq;
    using Microsoft.Extensions.Logging;
    using System;

    public class RescueGroupAnimalMapper : IMapper<string>
    {
        private readonly ILogger<RescueGroupAnimalMapper> _logger;

        public RescueGroupAnimalMapper(ILogger<RescueGroupAnimalMapper> logger)
        {
            _logger = logger;
        }

        public List<RescueGroupAnimal> Map(string jsonObjectSourceString)
        {
            _logger.LogInformation("Start RescueGroupAnimalMapper.Map {@jsonObjectSourceString}", jsonObjectSourceString);
            var result = new List<RescueGroupAnimal>();

            dynamic source = JObject.Parse(jsonObjectSourceString);

            var status = string.Empty;
            var message = string.Empty;
            status = Convert.ToString(source.status);
            if (status == "error")
            {
                message = Convert.ToString(source.message);
                _logger.LogInformation("End RescueGroupApiRepository.Get {@message}", message);
                return result;
            }

            if (source.data == null)
            {
                _logger.LogInformation("Cont. RescueGroupAnimalMapper.Map source.data is null");
                return result;
            }

            foreach (var animal in source.data)
            {
                if (animal == null)
                    continue;
                var thisAnimal = new RescueGroupAnimal
                {
                    AnimalId = animal.Value.animalID != null ? animal.Value.animalID.Value : string.Empty,
                    AnimalAltered = animal.Value.animalAltered != null ? animal.Value.animalAltered.Value : string.Empty,
                    AnimalBirthdate = animal.Value.animalBirthdate != null ? animal.Value.animalBirthdate.Value : string.Empty,
                    AnimalBreed = animal.Value.animalBreed != null ? animal.Value.animalBreed.Value : string.Empty,
                    AnimalColor = animal.Value.animalColor != null ? animal.Value.animalColor.Value : string.Empty,
                    AnimalCratetrained = animal.Value.animalCratetrained != null ? animal.Value.animalCratetrained.Value : string.Empty,
                    AnimalDescription = animal.Value.animalDescription != null ? animal.Value.animalDescription.Value : string.Empty,
                    AnimalEnergyLevel = animal.Value.animalEnergyLevel != null ? animal.Value.animalEnergyLevel.Value : string.Empty,
                    AnimalExerciseNeeds = animal.Value.animalExerciseNeeds != null ? animal.Value.animalExerciseNeeds.Value : string.Empty,
                    AnimalEyeColor = animal.Value.animalEyeColor != null ? animal.Value.animalEyeColor.Value : string.Empty,
                    AnimalGeneralAge = animal.Value.animalGeneralAge != null ? animal.Value.animalGeneralAge.Value : string.Empty,
                    AnimalHousetrained = animal.Value.animalHousetrained != null ? animal.Value.animalHousetrained.Value : string.Empty,
                    AnimalLeashtrained = animal.Value.animalLeashtrained != null ? animal.Value.animalLeashtrained.Value : string.Empty,
                    AnimalMixedBreed = animal.Value.animalMixedBreed != null ? animal.Value.animalMixedBreed.Value : string.Empty,
                    AnimalName = animal.Value.animalName != null ? animal.Value.animalName.Value : string.Empty,
                    AnimalNeedsFoster =  animal.Value.animalNeedsFoster != null ? animal.Value.animalNeedsFoster.Value : string.Empty,
                    AnimalOkWithAdults = animal.Value.animalOKWithAdults != null ? animal.Value.animalOKWithAdults.Value : string.Empty,
                    AnimalOkWithCats = animal.Value.animalOKWithCats != null ? animal.Value.animalOKWithCats.Value : string.Empty,
                    AnimalOkWithDogs = animal.Value.animalOKWithDogs != null ? animal.Value.animalOKWithDogs.Value : string.Empty,
                    AnimalOkWithKids = animal.Value.animalOKWithKids != null ? animal.Value.animalOKWithKids.Value : string.Empty,
                    AnimalOthernames = animal.Value.animalOthernames != null ? animal.Value.animalOthernames.Value : string.Empty,
                    AnimalOrgId = animal.Value.animalOrgID != null ? animal.Value.animalOrgID.Value : string.Empty,
                    AnimalRescueId = animal.Value.animalRescueID != null ? animal.Value.animalRescueID.Value : string.Empty,
                    AnimalSex = animal.Value.animalSex != null ? animal.Value.animalSex.Value : string.Empty,
                    AnimalSpecialneeds = animal.Value.animalSpecialneeds != null ? animal.Value.animalSpecialneeds.Value : string.Empty,
                    AnimalSpecialneedsDescription = animal.Value.animalSpecialneedsDescription != null
                            ? animal.Value.animalSpecialneedsDescription.Value
                            : string.Empty,
                    AnimalStatus = animal.Value.animalStatus != null ? animal.Value.animalStatus.Value : string.Empty,
                    AnimalSummarypublic = animal.Value.animalSummarypublic != null ? animal.Value.animalSummarypublic.Value : string.Empty,
                    AnimalThumbnailUrl = animal.Value.animalThumbnailUrl != null ? animal.Value.animalThumbnailUrl.Value : string.Empty
                };

                if (!string.IsNullOrEmpty(thisAnimal.AnimalDescription))
                {
                    if(thisAnimal.AnimalDescription.Length > 0)
                    {
                        var startIndex = thisAnimal.AnimalDescription.IndexOf("<p>") + 3;
                        var length = thisAnimal.AnimalDescription.IndexOf("</p>") - startIndex;
                        thisAnimal.AnimalDescriptionText = thisAnimal.AnimalDescription.Substring(startIndex, length).Replace("&nbsp;", " ");
                    }
                }

                foreach (var picture in animal.Value.animalPictures)
                {
                    thisAnimal.AnimalPictures.Add(new RescueGroupPicture
                    {
                        MediaId = picture.mediaID != null ? picture.mediaID.Value : string.Empty,
                        FileSize = picture.fileSize != null ? picture.fileSize.Value : string.Empty,
                        ResolutionX = picture.resolutionX != null ? picture.resolutionX.Value : string.Empty,
                        ResolutionY = picture.resolutionY != null ? picture.resolutionY.Value : string.Empty,
                        MediaOrder = picture.mediaOrder != null ? picture.mediaOrder.Value : string.Empty,
                        FileNameFullsize = picture.fileNameFullsize != null ? picture.fileNameFullsize.Value : string.Empty,
                        FileNameThumbnail = picture.fileNameThumbnail != null ? picture.fileNameThumbnail.Value : string.Empty,
                        UrlSecureFullsize = picture.urlSecureFullsize != null ? picture.urlSecureFullsize.Value : string.Empty,
                        UrlSecureThumbnail = picture.urlSecureThumbnail != null ? picture.urlSecureThumbnail.Value : string.Empty,
                        UrlInsecureFullsize = picture.urlInsecureFullsize != null ? picture.urlInsecureFullsize.Value : string.Empty,
                        UrlInsecureThumbnail = picture.urlInsecureThumbnail != null ? picture.urlInsecureThumbnail.Value : string.Empty
                    });
                }
                //_logger.LogInformation("Cont. RescueGroupAnimalMapper.Map {@thisAnimal}", thisAnimal);
                result.Add(thisAnimal);
            }
            _logger.LogInformation("End RescueGroupAnimalMapper.Map {@jsonObjectSourceString}", result);
            return result;
        }
    }
}