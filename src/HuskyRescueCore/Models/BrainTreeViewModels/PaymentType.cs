using System.ComponentModel.DataAnnotations;

namespace HuskyRescueCore.Models.BrainTreeViewModels
{
    public enum PaymentTypeEnum
    {
        [Display(Name = "PayPal")]
        Paypal,
        [Display(Name = "Credit Card")]
        CreditCard
    }
}
