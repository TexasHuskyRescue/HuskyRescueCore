using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.Types
{
    public class EmailType
    {
        public EmailType()
        {
            //Emails = new List<Email>();
        }
        public int Id { get; set; }
        public string Code { get; set; }
        public string Text { get; set; }

        public List<Email> Emails { get; set; }
    }
}
