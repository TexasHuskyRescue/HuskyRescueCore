using HuskyRescueCore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    public interface ISystemSettingService
    {
        Task<List<SystemSetting>> GetSettingsAsync();
        List<SystemSetting> GetSettings();

        Task<SystemSetting> GetSettingAsync(string key);
        SystemSetting GetSetting(string key);

        Task<ServiceResult> AddSetting(string key, string value);

        Task<ServiceResult> AddSetting(SystemSetting setting);

        Task<ServiceResult> UpdateSetting(string key, string value);

        Task<ServiceResult> UpdateSetting(SystemSetting setting);

        Task<ServiceResult> DeleteSetting(string key);
    }
}
