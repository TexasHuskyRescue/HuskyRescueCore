using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class EventGolf : Event
    {
        public string WelcomeMessage { get; set; }

        public TimeSpan RegistrationStartTime { get; set; }

        public string TournamentType { get; set; }

        public TimeSpan GolfingStartTime { get; set; }

        public TimeSpan BanquetStartTime { get; set; }

        public decimal CostFoursome { get; set; }
        public decimal CostSingle { get; set; }
        public decimal CostBanquet { get; set; }

        public List<EventGolfFeatures> WhatGolferGets { get; set; }
    }
}
