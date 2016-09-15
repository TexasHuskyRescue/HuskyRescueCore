using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace HuskyRescueCore.Models.ContactViewModels
{
    public enum ContactTypeEnum
    {
        [Display(Name = "Adoption related")]
        AdoptionRelated,
        [Display(Name = "Surrendering a Dog")]
        SurrenderDog,
        [Display(Name = "Found a stray husky")]
        FoundStrayDog,
        [Display(Name = "Volunteer and/or Foster")]
        Volunteer,
        [Display(Name = "Event Information")]
        EventInfo,
        [Display(Name = "General Question")]
        General,
        [Display(Name = "Website Admin")]
        Admin
    }

    public class Contact
    {
        public Contact()
        {
            //PostedFiles = new List<HttpPostedFileBase>();
        }

        [Display(Name = "First Name*")]
        [DataType(DataType.Text)]
        [MaxLength(100)]
        [Required(ErrorMessage = "first name required")]
        public string NameFirst { get; set; }

        [Display(Name = "Last Name*")]
        [DataType(DataType.Text)]
        [MaxLength(100)]
        [Required(ErrorMessage = "last name required")]
        public string NameLast { get; set; }

        public string FullName
        {
            get { return NameFirst + " " + NameLast; }
        }

        [Display(Name = "Email*")]
        [EmailAddress]
        [MaxLength(200)]
        [Required(ErrorMessage = "your email address is required")]
        public string EmailAddress { get; set; }

        [Display(Name = "Phone")]
        [Phone]
        [MaxLength(16)]
        public string Number { get; set; }

        [Display(Name = "Message*")]
        [DataType(DataType.MultilineText)]
        [MinLength(10)]
        [MaxLength(4000)]
        [Required(ErrorMessage = "message must be provided")]
        public string Message { get; set; }

        [Display(Name = "Would you like to be added to our emailing list?")]
        public bool IsEmailable { get; set; }

        [Display(Name = "Subject*")]
        [Required(ErrorMessage = "reason for contacting is required")]
        public string ContactTypeId { get; set; }
        //public List<HttpPostedFileBase> PostedFiles { get; set; }
    }
}
