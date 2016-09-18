using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HuskyRescueCore.Models.BrainTreeViewModels
{
    public class BrainTreePayment
    {
        public BrainTreePayment()
        {
            States = new List<SelectListItem>();
        }

        [Display(Name = "Billing First Name")]
        [Required(ErrorMessage = "please provide your name")]
        public string PayeeFirstName { get; set; }

        [Display(Name = "Billing Last Name")]
        [Required(ErrorMessage = "please provide your name")]
        public string PayeeLastName { get; set; }

        public string PayeeFullName { get { return PayeeFirstName + " " + PayeeLastName; } }

        [Display(Name = "Billing Address")]
        [MaxLength(50, ErrorMessage = "street address must be less than 50 characters")]
        public string PayeeAddressStreet1 { get; set; }

        [Display(Name = "Billing Address Cont.")]
        [MaxLength(50, ErrorMessage = "street address 2 must be less than 50 characters")]
        public string PayeeAddressStreet2 { get; set; }

        [Display(Name = "Billing City")]
        [MaxLength(50, ErrorMessage = "city name must be less than 50 characters")]
        public string PayeeAddressCity { get; set; }

        [Display(Name = "Billing State")]
        public int? PayeeAddressStateId { get; set; }
        public IEnumerable<SelectListItem> States { get; set; }

        [Display(Name = "Billing Postal Code")]
        [MaxLength(10, ErrorMessage = "postal code must be 10 or fewer digits")]
        [DataType(DataType.PostalCode)]
        public string PayeeAddressPostalCode { get; set; }
        
        [HiddenInput]
        public string CountryCodeId { get; set; }

        [HiddenInput]
        public string BraintreeTransactionId { get; set; }

        [HiddenInput]
        public string Nonce { get; set; }

        [HiddenInput]
        public string DeviceData { get; set; }

        [Display(Name = "Payment Method")]
        [Required(ErrorMessage = "payment method is required")]
        public string PaymentMethod { get; set; }
    }
}
