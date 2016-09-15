using HuskyRescueCore.Models.Types;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models
{
    public class Event
    {
        [HiddenInput]
        public Guid Id { get; set; }

        [HiddenInput]
        public Guid BusinessId { get; set; }
        public Business Business { get; set; } // business/organization location

        [Display(Name = "Active?*")]
        public bool IsActive { get; set; }
        [HiddenInput]
        public bool IsDeleted { get; set; }
        [HiddenInput]
        public DateTime? DateDeleted { get; set; }
        [HiddenInput]
        public DateTime DateAdded { get; set; }
        [HiddenInput]
        public DateTime? DateUpdated { get; set; }

        [Display(Name = "Event Name*")]
        [MaxLength(200)]
        [MinLength(5)]
        [Required(ErrorMessage = "event name required")]
        public string Name { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateOfEvent { get; set; }
        [DataType(DataType.Time)]
        public TimeSpan StartTime { get; set; }
        [DataType(DataType.Time)]
        public TimeSpan EndTime { get; set; }


        public int EventTypeId { get; set; }
        public EventType EventType { get; set; }


        public bool AreTicketsSold { get; set; }
        public decimal TicketPriceFull { get; set; }
        public decimal TicketPriceDiscount { get; set; }

        public string BannerImagePath { get; set; }

        public string PublicDescription { get; set; }
        public string Notes { get; set; }

        public List<EventRegistration> EventRegistrations { get; set; }
    }
}
