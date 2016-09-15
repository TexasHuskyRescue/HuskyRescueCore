using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    public class ServiceResult
    {
        public ServiceResult()
        {
            Messages = new List<string>();
            IsSuccess = false;
        }

        public int DbChangeCount { get; set; }

        public bool IsSuccess { get; set; }

        public List<string> Messages { get; set; }

        public string NewKey { get; set; }
    }
}
