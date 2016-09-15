using HuskyRescueCore.Models.BrainTreeViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.GolfViewModels
{
    public enum AttendeeTypeEnum
    {
        [Display(Name = "Golfer")]
        Golfer,
        [Display(Name = "Banquet Guest")]
        BanquetGuest
    }

    public class AttendeeTypeRadios
    {
        public string Id { set; get; }
        public string Text { set; get; }

        public static List<AttendeeTypeRadios> List()
        {
            var list = new List<AttendeeTypeRadios>
                {
                    new AttendeeTypeRadios {Id = "0", Text = "Golfer"},
                    new AttendeeTypeRadios {Id = "1", Text = "Banquet Guest"},
                };
            return list;
        }
    }

    public class Register
    {
        public Register()
        {
            BrainTreePayment = new BrainTreePayment();
            Attendee1AddressStateList = new List<SelectListItem>();
            Attendee2AddressStateList = new List<SelectListItem>();
            Attendee3AddressStateList = new List<SelectListItem>();
            Attendee4AddressStateList = new List<SelectListItem>();

            Attendee1TypeOptions = AttendeeTypeRadios.List();
            Attendee2TypeOptions = AttendeeTypeRadios.List();
            Attendee3TypeOptions = AttendeeTypeRadios.List();
            Attendee4TypeOptions = AttendeeTypeRadios.List();
        }

        public BrainTreePayment BrainTreePayment { get; set; }

        #region Attendee1

        public bool Attendee1IsAttending
        {
            get { return !string.IsNullOrEmpty(Attendee1FirstName); }
        }

        [Display(Name = "Will you be golfing or attending the banquet only?")]
        [Required]
        public string Attendee1Type { get; set; }
        public IEnumerable<AttendeeTypeRadios> Attendee1TypeOptions { get; set; }

        [Display(Name = "First Name")]
        [Required(ErrorMessage = "first name required")]
        [MaxLength(100, ErrorMessage = "first name must be less than 100 characters")]
        public string Attendee1FirstName { get; set; }

        [Display(Name = "Last Name")]
        [Required(ErrorMessage = "last name required")]
        [MaxLength(100, ErrorMessage = "last name must be less than 100 characters")]
        public string Attendee1LastName { get; set; }

        public string Attendee1FullName
        {
            get { return Attendee1FirstName + " " + Attendee1LastName; }
        }

        [Display(Name = "Street Address")]
        [Required(ErrorMessage = "address Street 1 of 1st attendee required")]
        [MaxLength(200, ErrorMessage = "street address must be less than 200 characters")]
        public string Attendee1AddressStreet1 { get; set; }

        [Display(Name = "Street Address Cont.")]
        [MaxLength(200, ErrorMessage = "street address must be less than 200 characters")]
        public string Attendee1AddressStreet2 { get; set; }

        [Display(Name = "City")]
        [Required(ErrorMessage = "address City of 1st attendee required")]
        [MaxLength(200, ErrorMessage = "city name must be less than 200 characters")]
        public string Attendee1AddressCity { get; set; }

        [Display(Name = "State")]
        [Required(ErrorMessage = "address State of 1st attendee required")]
        public int Attendee1AddressStateId { get; set; }
        public IEnumerable<SelectListItem> Attendee1AddressStateList { get; set; }

        [Display(Name = "Postal Code")]
        [DataType(DataType.PostalCode)]
        [Required(ErrorMessage = "address ZIP code of 1st attendee required")]
        [MaxLength(5, ErrorMessage = "postal code must be 5 or fewer digits")]
        public string Attendee1AddressPostalCode { get; set; }

        [Display(Name = "Email")]
        [DataType(DataType.EmailAddress)]
        [Required(ErrorMessage = "email of 1st attendee required")]
        [MaxLength(200, ErrorMessage = "email must be less than 200 characters")]
        public string Attendee1EmailAddress { get; set; }

        [Display(Name = "Phone Number")]
        [DataType(DataType.PhoneNumber)]
        [Required(ErrorMessage = "phone number of 1st attendee required")]
        [MaxLength(20, ErrorMessage = "email must be less than 20 characters")]
        public string Attendee1PhoneNumber { get; set; }

        [Display(Name = "May TXHR contact you in the future via email regarding events, donation drives, promotions, or other correspondence?")]
        public bool Attendee1FutureContact { get; set; }

        public decimal Attendee1TicketPrice { get; set; }
        #endregion

        #region Attendee2

        public bool Attendee2IsAttending
        {
            get { return !string.IsNullOrEmpty(Attendee2FirstName); }
        }

        [Display(Name = "Will you be golfing or attending the banquet only?")]
        public string Attendee2Type { get; set; }
        public IEnumerable<AttendeeTypeRadios> Attendee2TypeOptions { get; set; }

        [Display(Name = "First Name")]
        [MaxLength(100, ErrorMessage = "first name must be less than 100 characters")]
        public string Attendee2FirstName { get; set; }

        [Display(Name = "Last Name")]
        [MaxLength(100, ErrorMessage = "last name must be less than 100 characters")]
        public string Attendee2LastName { get; set; }

        public string Attendee2FullName
        {
            get { return Attendee2FirstName + " " + Attendee2LastName; }
        }

        [Display(Name = "Street Address")]
        [MaxLength(200, ErrorMessage = "street address must be less than 200 characters")]
        public string Attendee2AddressStreet1 { get; set; }

        [Display(Name = "Street Address Cont.")]
        [MaxLength(200, ErrorMessage = "street address must be less than 200 characters")]
        public string Attendee2AddressStreet2 { get; set; }

        [Display(Name = "City")]
        [MaxLength(200, ErrorMessage = "city name must be less than 200 characters")]
        public string Attendee2AddressCity { get; set; }

        [Display(Name = "State")]
        public int Attendee2AddressStateId { get; set; }
        public IEnumerable<SelectListItem> Attendee2AddressStateList { get; set; }

        [Display(Name = "Postal Code")]
        [DataType(DataType.PostalCode)]
        [MaxLength(5, ErrorMessage = "postal code must be 5 or fewer digits")]
        public string Attendee2AddressPostalCode { get; set; }

        [Display(Name = "Email")]
        [DataType(DataType.EmailAddress)]
        [MaxLength(200, ErrorMessage = "email must be less than 200 characters")]
        public string Attendee2EmailAddress { get; set; }

        [Display(Name = "Phone Number")]
        [DataType(DataType.PhoneNumber)]
        [MaxLength(20, ErrorMessage = "email must be less than 20 characters")]
        public string Attendee2PhoneNumber { get; set; }

        [Display(Name = "May TXHR contact you in the future via email regarding events, donation drives, promotions, or other correspondence?")]
        public bool Attendee2FutureContact { get; set; }

        public decimal Attendee2TicketPrice { get; set; }
        #endregion

        #region Attendee3
        public bool Attendee3IsAttending
        {
            get { return !string.IsNullOrEmpty(Attendee3FirstName); }
        }

        [Display(Name = "Will you be golfing or attending the banquet only?")]
        public string Attendee3Type { get; set; }
        public IEnumerable<AttendeeTypeRadios> Attendee3TypeOptions { get; set; }

        [Display(Name = "First Name")]
        [MaxLength(100, ErrorMessage = "first name must be less than 100 characters")]
        public string Attendee3FirstName { get; set; }

        [Display(Name = "Last Name")]
        [MaxLength(100, ErrorMessage = "last name must be less than 100 characters")]
        public string Attendee3LastName { get; set; }

        public string Attendee3FullName
        {
            get { return Attendee3FirstName + " " + Attendee3LastName; }
        }

        [Display(Name = "Street Address")]
        [MaxLength(200, ErrorMessage = "street address must be less than 200 characters")]
        public string Attendee3AddressStreet1 { get; set; }

        [Display(Name = "Street Address Cont.")]
        [MaxLength(200, ErrorMessage = "street address must be less than 200 characters")]
        public string Attendee3AddressStreet2 { get; set; }

        [Display(Name = "City")]
        [MaxLength(200, ErrorMessage = "city name must be less than 200 characters")]
        public string Attendee3AddressCity { get; set; }

        [Display(Name = "State")]
        public int Attendee3AddressStateId { get; set; }
        public IEnumerable<SelectListItem> Attendee3AddressStateList { get; set; }

        [Display(Name = "Postal Code")]
        [DataType(DataType.PostalCode)]
        [MaxLength(5, ErrorMessage = "postal code must be 5 or fewer digits")]
        public string Attendee3AddressPostalCode { get; set; }

        [Display(Name = "Email")]
        [DataType(DataType.EmailAddress)]
        [MaxLength(200, ErrorMessage = "email must be less than 200 characters")]
        public string Attendee3EmailAddress { get; set; }

        [Display(Name = "Phone Number")]
        [DataType(DataType.PhoneNumber)]
        [MaxLength(20, ErrorMessage = "email must be less than 20 characters")]
        public string Attendee3PhoneNumber { get; set; }

        [Display(Name = "May TXHR contact you in the future via email regarding events, donation drives, promotions, or other correspondence?")]
        public bool Attendee3FutureContact { get; set; }

        public decimal Attendee3TicketPrice { get; set; }
        #endregion

        #region Attendee4
        public bool Attendee4IsAttending
        {
            get { return !string.IsNullOrEmpty(Attendee4FirstName); }
        }

        [Display(Name = "Will you be golfing or attending the banquet only?")]
        public string Attendee4Type { get; set; }
        public IEnumerable<AttendeeTypeRadios> Attendee4TypeOptions { get; set; }

        [Display(Name = "First Name")]
        [MaxLength(100, ErrorMessage = "first name must be less than 100 characters")]
        public string Attendee4FirstName { get; set; }

        [Display(Name = "Last Name")]
        [MaxLength(100, ErrorMessage = "last name must be less than 100 characters")]
        public string Attendee4LastName { get; set; }

        public string Attendee4FullName
        {
            get { return Attendee4FirstName + " " + Attendee4LastName; }
        }

        [Display(Name = "Street Address")]
        [MaxLength(200, ErrorMessage = "street address must be less than 200 characters")]
        public string Attendee4AddressStreet1 { get; set; }

        [Display(Name = "Street Address Cont.")]
        [MaxLength(200, ErrorMessage = "street address must be less than 200 characters")]
        public string Attendee4AddressStreet2 { get; set; }

        [Display(Name = "City")]
        [MaxLength(200, ErrorMessage = "city name must be less than 200 characters")]
        public string Attendee4AddressCity { get; set; }

        [Display(Name = "State")]
        public int Attendee4AddressStateId { get; set; }
        public IEnumerable<SelectListItem> Attendee4AddressStateList { get; set; }

        [Display(Name = "Postal Code")]
        [DataType(DataType.PostalCode)]
        [MaxLength(5, ErrorMessage = "postal code must be 5 or fewer digits")]
        public string Attendee4AddressPostalCode { get; set; }

        [Display(Name = "Email")]
        [DataType(DataType.EmailAddress)]
        [MaxLength(200, ErrorMessage = "email must be less than 200 characters")]
        public string Attendee4EmailAddress { get; set; }

        [Display(Name = "Phone Number")]
        [DataType(DataType.PhoneNumber)]
        [MaxLength(20, ErrorMessage = "email must be less than 20 characters")]
        public string Attendee4PhoneNumber { get; set; }

        [Display(Name = "May TXHR contact you in the future via email regarding events, donation drives, promotions, or other correspondence?")]
        public bool Attendee4FutureContact { get; set; }

        public decimal Attendee4TicketPrice { get; set; }
        #endregion

        [Display(Name = "Notes / Comments")]
        [MaxLength(4000, ErrorMessage = "notes must be less than 4000 characters")]
        //[AssertThat("Length(CustomerNotes) <= 4000", ErrorMessage = "notes must be less than 4000 characters")]
        public string CustomerNotes { get; set; }

        #region Payment
        /// <summary>
        /// 1-4 to go with Attendee 1 to 4
        /// </summary>
        public int AttendeePayerId { get; set; }

        [HiddenInput]
        public decimal GolfTicketCost { get; set; }

        [HiddenInput]
        public decimal BanquetTicketCost { get; set; }

        [Display(Name = "Amount Due Today")]
        [DataType(DataType.Currency)]
        [HiddenInput]
        public decimal TotalAmountDue { get; set; }

        [Display(Name = "Amount Due Today")]
        [DataType(DataType.Currency)]
        public decimal TotalAmountDueReadOnly
        {
            get; set;
        }

        #endregion
    }
}
