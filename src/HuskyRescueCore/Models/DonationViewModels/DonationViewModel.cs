using HuskyRescueCore.Models.BrainTreeViewModels;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace HuskyRescueCore.Models.DonationViewModels
{
    public class DonationViewModel
    {
        public DonationViewModel()
        {
            AmountDonation = 25;
            BrainTreePayment = new BrainTreePayment();
        }

        [DisplayName("Would you like to receive newsletters and event information from Texas Husky Rescue in the future?")]
        public bool? IsEmailable { get; set; }

        [Display(Name = "Donation Amount")]
        [DataType(DataType.Currency)]
        [Required]
        public decimal AmountDonation { get; set; }

        [Display(Name = "Comments")]
        [MaxLength(4000, ErrorMessage = "notes must be less than 4000 characters")]
        //[AssertThat("Length(CustomerNotes) <= 4000", ErrorMessage = "notes must be less than 4000 characters")]
        public string Comments { get; set; }

        [Display(Name = "Email Address")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "email address is required")]
        [MaxLength(200, ErrorMessage = "email must be less than 200 characters")]
        [DataType(DataType.EmailAddress, ErrorMessage = "valid email required")]
        public string DonorEmail { get; set; }

        [Display(Name = "Phone Number")]
        [DataType(DataType.PhoneNumber)]
        [MaxLength(20, ErrorMessage = "email must be less than 20 characters")]
        public string DonorPhoneNumber { get; set; }

        public BrainTreePayment BrainTreePayment { get; set; }
    }
}
