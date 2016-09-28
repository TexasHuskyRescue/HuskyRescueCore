using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HuskyRescueCore.Models;
using HuskyRescueCore.Data;
using Microsoft.EntityFrameworkCore;

namespace HuskyRescueCore.Services
{
    public class SystemSettingServices : ISystemSettingService
    {
        private readonly ApplicationDbContext _context;

        public SystemSettingServices(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResult> AddSetting(SystemSetting setting)
        {
            var serviceResult = new ServiceResult();

            _context.Add(setting);
            serviceResult.DbChangeCount = await _context.SaveChangesAsync();

            if(serviceResult.DbChangeCount > 0)
            {
                serviceResult.IsSuccess = true;
            }

            return serviceResult;
        }

        public async Task<ServiceResult> AddSetting(string key, string value)
        {
            return await AddSetting(new SystemSetting { Id = key, Value = value });
        }

        public async Task<ServiceResult> DeleteSetting(string key)
        {
            var serviceResult = new ServiceResult();

            var systemSetting = await _context.SystemSetting.FirstAsync(s => s.Id == key);

            _context.Remove(systemSetting);
            serviceResult.DbChangeCount = await _context.SaveChangesAsync();

            if (serviceResult.DbChangeCount > 0)
            {
                serviceResult.IsSuccess = true;
            }

            return serviceResult;
        }

        public async Task<SystemSetting> GetSettingAsync(string key)
        {
            var setting = await _context.SystemSetting.FirstAsync(p => p.Id == key);

            return setting;
        }

        public SystemSetting GetSetting(string key)
        {
            var setting = _context.SystemSetting.First(p => p.Id == key);

            return setting;
        }

        public async Task<List<SystemSetting>> GetSettingsAsync()
        {
            var settings = await _context.SystemSetting.ToListAsync();

            return settings; 
        }
        public List<SystemSetting> GetSettings()
        {
            var settings = _context.SystemSetting.ToList();

            return settings;
        }

        public async Task<ServiceResult> UpdateSetting(SystemSetting setting)
        {
            var serviceResult = new ServiceResult();

            _context.Update(setting);
            serviceResult.DbChangeCount = await _context.SaveChangesAsync();

            if (serviceResult.DbChangeCount > 0)
            {
                serviceResult.IsSuccess = true;
            }

            return serviceResult;
        }

        public async Task<ServiceResult> UpdateSetting(string key, string value)
        {
            return await UpdateSetting(new SystemSetting { Id = key, Value = value });
        }
    }
}
