using HuskyRescueCore.Models.RescueGroupViewModels;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    using Mappers;

    using Repositories;

    public class RescueGroupsService : IRescueGroupsService
    {
        public const string AdoptableHuskiesCachedData = "AdoptableHuskiesCachedData";
        public const string FosterableHuskiesCachedData = "FosterableHuskiesCachedData";
        public const string HuskyProfileCachedData = "HuskyProfileCachedData";

        private readonly ISystemSettingService _systemServices;
        private readonly ILogger<RescueGroupsService> _logger;
        private readonly IMapper<string> _rescueAnimalMapper;
        private readonly IRescueGroupApiRepository rescueGroupApiRepository;

        public RescueGroupsService(ISystemSettingService systemServices, ILogger<RescueGroupsService> logger,
            IMapper<string> rescueAnimalMapper, IRescueGroupApiRepository rescueGroupApiRepository)
        {
            _systemServices = systemServices;
            _logger = logger;
            _rescueAnimalMapper = rescueAnimalMapper;
            this.rescueGroupApiRepository = rescueGroupApiRepository;
        }

        public async Task<List<RescueGroupAnimal>> GetAdoptableHuskiesAsync()
        {
            _logger.LogInformation("Start GetAdoptableHuskiesAsync");
            var rescueGroupsApiUri = (await _systemServices.GetSettingAsync("RescueGroups-Api-Uri")).Value;
            _logger.LogInformation("Cont. GetAdoptableHuskiesAsync: {@rescueGroupsApiUri}", rescueGroupsApiUri);
            var apikey = (await _systemServices.GetSettingAsync("RescueGroups-Api-Key")).Value;
            _logger.LogInformation("Cont. GetAdoptableHuskiesAsync: {@rescueGroupsApiUri}", rescueGroupsApiUri);

            List<RescueGroupAnimal> animals = null;
            try
            {
                var result = await rescueGroupApiRepository.GetAdoptableHuskies(rescueGroupsApiUri, apikey, AdoptableHuskiesCachedData);
                _logger.LogInformation("Cont. GetAdoptableHuskiesAsync: {@result}", result);
                animals = _rescueAnimalMapper.Map(result);
            }
            catch (WebException ex)
            {
                _logger.LogError("Web: Error reading data from RescueGroups {@WebException}", ex);
            }
            catch (ProtocolViolationException ex)
            {
                _logger.LogError("Protocol Violation: Error reading data from RescueGroups {@ProtocolViolationException}", ex);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError("Invalid Operation: Error reading data from RescueGroups {@InvalidOperationException}", ex);
            }
            catch (NotSupportedException ex)
            {
                _logger.LogError("Not Supported: Error reading data from RescueGroups {@NotSupportedException}", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Exception: Error reading data from RescueGroups {@Exception}", ex);
            }
            _logger.LogInformation("End GetAdoptableHuskiesAsync: {@animals}", animals);

            return animals;
        }

        public async Task<List<RescueGroupAnimal>> GetFosterableHuskiesAsync()
        {
            List<RescueGroupAnimal> animals = null;

            var rescueGroupsApiUri = (await _systemServices.GetSettingAsync("RescueGroups-Api-Uri")).Value;
            var apikey = (await _systemServices.GetSettingAsync("RescueGroups-Api-Key")).Value;

            try
            {
                var result = await rescueGroupApiRepository.GetFosterableHuskies(rescueGroupsApiUri, apikey, FosterableHuskiesCachedData);
                animals = _rescueAnimalMapper.Map(result);
            }
            catch (WebException ex)
            {
                _logger.LogError("Error reading data from RescueGroups {@WebException}", ex);
            }
            catch (ProtocolViolationException ex)
            {
                _logger.LogError("Error reading data from RescueGroups {@ProtocolViolationException}", ex);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError("Error reading data from RescueGroups {@InvalidOperationException}", ex);
            }
            catch (NotSupportedException ex)
            {
                _logger.LogError("Error reading data from RescueGroups {@NotSupportedException}", ex);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error reading data from RescueGroups {@Exception}", ex);
            }

            return animals;
        }

        public async Task<RescueGroupAnimal> GetHuskyProfileAsync(string id)
        {
            var rescueGroupsApiUri = (await _systemServices.GetSettingAsync("RescueGroups-Api-Uri")).Value;
            var apikey = (await _systemServices.GetSettingAsync("RescueGroups-Api-Key")).Value;
            var result = string.Empty;
            {
                try
                {
                    result = await rescueGroupApiRepository.GetHuskyProfile(id, rescueGroupsApiUri, apikey, HuskyProfileCachedData);
                }
                catch (WebException ex)
                {
                    _logger.LogError("Error reading data from RescueGroups {@ {@}}", ex);
                }
                catch (ProtocolViolationException ex)
                {
                    _logger.LogError("Error reading data from RescueGroups {@ProtocolViolationException}", ex);
                }
                catch (InvalidOperationException ex)
                {
                    _logger.LogError("Error reading data from RescueGroups {@InvalidOperationException}", ex);
                }
                catch (NotSupportedException ex)
                {
                    _logger.LogError("Error reading data from RescueGroups {@NotSupportedException}", ex);
                }
                catch (Exception ex)
                {
                    _logger.LogError("Error reading data from RescueGroups {@Exception}", ex);
                }

                return JsonConvert.DeserializeObject<RescueGroupAnimal>(result);
            }
        }
    }
}
