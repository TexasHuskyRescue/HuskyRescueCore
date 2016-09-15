using Braintree;
using HuskyRescueCore.Models.BrainTreeViewModels;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    public interface IBraintreePaymentService
    {
        BraintreeGateway Gateway { get; set; }
        Task<BraintreeGateway> GetGatewayAsync();
        BraintreeGateway GetGateway();
        Task<string> GetClientTokenAsync(string customerId);
        string GetClientToken(string customerId);

        ServiceResult SendPayment(decimal amount, string nonce, bool isTaxExempt, PaymentTypeEnum paymentType, string deviceData,
            string transactionDescription = "", string customerNotes = "",
            string firstName = "", string lastName = "",
            string addressStreet1 = "", string addressStreet2 = "", string addressCity = "", string addressStateId = "", string addressPostalCode = "", string countryCode = "US",
            string phoneNumber = "", string email = "", string company = "", string website = "", bool isShipping = false);
    }
}
