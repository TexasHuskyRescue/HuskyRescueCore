using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HuskyRescueCore.Models.Types;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace HuskyRescueCore.Models
{
    public class Address
    {
        public Address()
        {
            //Person = new Person();
            //Business = new Business();
            //State = new States();
            //AddressType = new AddressType();

            AddressTypeId = 0;
        }

        public Guid Id { get; set; }
        [Display(Name = "Address Type")]
        public int AddressTypeId { get; set; }
        public AddressType AddressType { get; set; }
        [Display(Name = "")]
        public string Address1 { get; set; }
        [Display(Name = "*")]
        public string Address2 { get; set; }
        [Display(Name = "*")]
        public string Address3 { get; set; }
        [Display(Name = "*")]
        public string City { get; set; }
        [Display(Name = "*")]
        public int StatesId { get; set; }
        [Display(Name = "*")]
        public States State { get; set; }
        [Display(Name = "*")]
        public string ZipCode { get; set; }
        [Display(Name = "*")]
        public string CountryId { get; set; }
        [Display(Name = "*")]
        public bool IsBillingAddress { get; set; }
        [Display(Name = "*")]
        public bool IsShippingAddress { get; set; }

        public Person Person { get; set; }
        [HiddenInput]
        public Guid? PersonId { get; set; }

        public Business Business { get; set; }
        [HiddenInput]
        public Guid? BusinessId { get; set; }
    }
}
