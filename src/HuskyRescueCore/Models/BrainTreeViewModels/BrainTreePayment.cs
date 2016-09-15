using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
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
        //[AssertThat("Length(PayeeFirstName) <= 50 && PayeeFirstName != null", ErrorMessage = "first name is required and must be less than 50 characters")]
        public string PayeeFirstName { get; set; }

        [Display(Name = "Billing Last Name")]
        [Required(ErrorMessage = "please provide your name")]
        //[AssertThat("Length(PayeeFirstName) <= 50 && PayeeFirstName != null", ErrorMessage = "first name is required and must be less than 50 characters")]
        public string PayeeLastName { get; set; }

        [Display(Name = "Billing Address")]
        [MaxLength(50, ErrorMessage = "street address must be less than 50 characters")]
        //[RequiredIf("IsNotPaypalPayment(PaymentMethod)", ErrorMessage = "billing street required")]
        public string PayeeAddressStreet1 { get; set; }

        [Display(Name = "Billing Address Cont.")]
        [MaxLength(50, ErrorMessage = "street address 2 must be less than 50 characters")]
        public string PayeeAddressStreet2 { get; set; }

        [Display(Name = "Billing City")]
        [MaxLength(50, ErrorMessage = "city name must be less than 50 characters")]
        //[RequiredIf("IsNotPaypalPayment(PaymentMethod)", ErrorMessage = "billing city required")]
        public string PayeeAddressCity { get; set; }

        [Display(Name = "Billing State")]
        //[RequiredIf("IsNotPaypalPayment(PaymentMethod)", ErrorMessage = "billing state required")]
        public int? PayeeAddressStateId { get; set; }
        public IEnumerable<SelectListItem> States { get; set; }

        [Display(Name = "Billing Postal Code")]
        [MaxLength(10, ErrorMessage = "postal code must be 10 or fewer digits")]
        [DataType(DataType.PostalCode)]
        //[RequiredIf("IsNotPaypalPayment(PaymentMethod)", ErrorMessage = "billing postal code required")]
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

        [Display(Name = "Card Number")]
        [MaxLength(19)]
        public string CardNumber { get; set; }

        [Display(Name = "Month")]
        [MaxLength(2)]
        [MinLength(1)]
        public string CardExpireMonth { get; set; }

        [Display(Name = "Year")]
        [MaxLength(4)]
        [MinLength(4)]
        public string CardExpireYear { get; set; }

        [Display(Name = "CVV")]
        public string CardCvv { get; set; }

        public bool IsNotPaypalPayment(string method)
        {
            if (string.IsNullOrEmpty(method)) return true;
            return !PaymentMethod.ToLower().Equals("paypal");
        }

        public bool IsValidMonth(string month)
        {
            if (string.IsNullOrEmpty(month)) return false;
            int monthInt;
            var result = int.TryParse(month, out monthInt);

            if (result)
            {
                if (monthInt >= 1 && monthInt <= 12) result = true;
            }
            return result;
        }

        public bool IsValidCreditCardYear(string year)
        {
            if (string.IsNullOrEmpty(year)) return false;
            int yearInt;
            var result = int.TryParse(year, out yearInt);

            if (result)
            {
                if (yearInt >= DateTime.Now.Year) result = true;
            }
            return result;
        }
    }
}
