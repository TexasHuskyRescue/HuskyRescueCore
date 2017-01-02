using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.Content.Adopt
{
    public class Process
    {
        public string Title { get; set; }

        public Image LeftTopImage { get; set; }

        public Image RightTopImage { get; set; }

        public string MainContent { get; set; }
    }
}
