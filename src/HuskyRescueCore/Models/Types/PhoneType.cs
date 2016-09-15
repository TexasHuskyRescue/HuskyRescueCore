using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.Types
{
    public class PhoneType
    {
        public PhoneType()
        {
            //Phones = new List<Phone>();
        }
        public int Id { get; set; }
        public string Code { get; set; }
        public string Text { get; set; }

        public List<Phone> Phones { get; set; }
    }
}
