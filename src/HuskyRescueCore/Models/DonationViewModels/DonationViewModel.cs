using HuskyRescueCore.Models.BrainTreeViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Models.DonationViewModels
{
    public class DonationViewModel
    {
        public DonationViewModel()
        {

        }

        [DisplayName("Would you like to receive newsletters and event information from Texas Husky Rescue in the future?")]
        public bool? IsEmailable { get; set; }

        public BrainTreePayment BrainTreePayment { get; set; }

        [DisplayName("Email Address")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "email address is required")]
        [MaxLength(200, ErrorMessage = "email must be less than 20 digits")]
        [DataType(DataType.EmailAddress, ErrorMessage = "valid email required")]
        public string DonorEmail { get; set; }
    }
}
