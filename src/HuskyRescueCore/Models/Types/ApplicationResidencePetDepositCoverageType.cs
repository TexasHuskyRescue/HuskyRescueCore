﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.Types
{
    public class ApplicationResidencePetDepositCoverageType
    {
        public ApplicationResidencePetDepositCoverageType()
        {
            //Applications = new List<Application>();
        }
        public int Id { get; set; }
        public string Code { get; set; }
        public string Text { get; set; }
        public List<Application> Applications { get; set; }
    }
}
