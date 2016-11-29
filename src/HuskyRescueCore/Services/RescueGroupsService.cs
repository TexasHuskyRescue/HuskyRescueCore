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
            var rescueGroupsApiUri = (await _systemServices.GetSettingAsync("RescueGroups-Api-Uri")).Value;
            var apikey = (await _systemServices.GetSettingAsync("RescueGroups-Api-Key")).Value;

            List<RescueGroupAnimal> animals = null;
            try
            {
                var result = await rescueGroupApiRepository.GetAdoptableHuskies(rescueGroupsApiUri, apikey, AdoptableHuskiesCachedData);
                animals = _rescueAnimalMapper.Map(result);
            }
            catch (WebException ex)
            {
                _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
            }
            catch (ProtocolViolationException ex)
            {
                _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
            }
            catch (NotSupportedException ex)
            {
                _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
            }
            catch (Exception ex)
            {
                _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
            }
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
                _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
            }
            catch (ProtocolViolationException ex)
            {
                _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
            }
            catch (NotSupportedException ex)
            {
                _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
            }
            catch (Exception ex)
            {
                _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
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
                    _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
                }
                catch (ProtocolViolationException ex)
                {
                    _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
                }
                catch (InvalidOperationException ex)
                {
                    _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
                }
                catch (NotSupportedException ex)
                {
                    _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
                }
                catch (Exception ex)
                {
                    _logger.LogError(new EventId(4), ex, "Error reading data from RescueGroups");
                }

                return JsonConvert.DeserializeObject<RescueGroupAnimal>(result);
            }
        }
    }
}
