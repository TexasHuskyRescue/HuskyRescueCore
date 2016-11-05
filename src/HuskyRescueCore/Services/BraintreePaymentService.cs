using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Braintree;
using HuskyRescueCore.Models.BrainTreeViewModels;
using Braintree.Exceptions;
using Microsoft.Extensions.Logging;

namespace HuskyRescueCore.Services
{
    public class BraintreePaymentService : IBraintreePaymentService
    {
        private readonly ISystemSettingService _systemServices;
        private readonly ILogger<BraintreePaymentService> _logger;

        public BraintreePaymentService(ISystemSettingService systemServices, ILogger<BraintreePaymentService> logger)
        {
            _systemServices = systemServices;
            _logger = logger;
        }

        public BraintreeGateway Gateway { get; set; }

        public async Task<string> GetClientTokenAsync(string customerId)
        {
            if(Gateway == null)
            {
                await GetGatewayAsync();
            }

            return string.IsNullOrEmpty(customerId) ? Gateway.ClientToken.generate() : Gateway.ClientToken.generate(new ClientTokenRequest { CustomerId = customerId });
        }

        public string GetClientToken(string customerId)
        {
            if (Gateway == null)
            {
                GetGateway();
            }
            _logger.LogInformation("braintree customerId: {@braintreeCustomerId} {@gateway}", customerId, Gateway);

            var token = string.Empty;

            try
            {
                token = string.IsNullOrEmpty(customerId) ? Gateway.ClientToken.generate() : Gateway.ClientToken.generate(new ClientTokenRequest { CustomerId = customerId });
            }
            catch (Braintree.Exceptions.AuthenticationException ex)
            {
                _logger.LogError(new EventId(10), ex, "error getting braintree token");
            }


            _logger.LogInformation("braintree token: {@token}", customerId);

            return string.IsNullOrEmpty(customerId) ? Gateway.ClientToken.generate() : Gateway.ClientToken.generate(new ClientTokenRequest { CustomerId = customerId });
        }

        public async Task<BraintreeGateway> GetGatewayAsync()
        {
            var merchantId = await _systemServices.GetSettingAsync("BraintreeMerchantId");
            var publicKey = await _systemServices.GetSettingAsync("BraintreePublicKey");
            var privateKey = await _systemServices.GetSettingAsync("BraintreePrivateKey");
            var isProduction = await _systemServices.GetSettingAsync("BraintreeIsProduction");

            Gateway = new BraintreeGateway()
            {
                Environment = isProduction.Value.ToLower().Equals("true") ? Braintree.Environment.PRODUCTION : Braintree.Environment.SANDBOX,
                MerchantId = merchantId.Value,
                PublicKey = publicKey.Value,
                PrivateKey = privateKey.Value
            };

            return Gateway;
        }

        public BraintreeGateway GetGateway()
        {
            var merchantId = _systemServices.GetSetting("BraintreeMerchantId");
            var publicKey = _systemServices.GetSetting("BraintreePublicKey");
            var privateKey = _systemServices.GetSetting("BraintreePrivateKey");
            var isProduction = _systemServices.GetSetting("BraintreeIsProduction");

            Gateway = new BraintreeGateway()
            {
                Environment = isProduction.Value.ToLower().Equals("true") ? Braintree.Environment.PRODUCTION : Braintree.Environment.SANDBOX,
                MerchantId = merchantId.Value,
                PublicKey = publicKey.Value,
                PrivateKey = privateKey.Value
            };

            return Gateway;
        }

        public ServiceResult SendPayment(decimal amount, string nonce, bool isTaxExempt, PaymentTypeEnum paymentType, string deviceData, string transactionDescription = "", string customerNotes = "", string firstName = "", string lastName = "", string addressStreet1 = "", string addressStreet2 = "", string addressCity = "", string addressStateId = "", string addressPostalCode = "", string countryCode = "US", string phoneNumber = "", string email = "", string company = "", string website = "", bool isShipping = false)
        {
            var serviceResult = new ServiceResult();

            try
            {
                Gateway = GetGateway();

                var braintreeRequest = new TransactionRequest
                {
                    Amount = amount,
                    PaymentMethodNonce = nonce,
                    TaxExempt = isTaxExempt,
                    Type = TransactionType.SALE,
                    DeviceData = deviceData,
                    Options = new TransactionOptionsRequest
                    {
                        StoreInVaultOnSuccess = true,
                        StoreShippingAddressInVault = isShipping,
                        SubmitForSettlement = true
                    },
                    Customer = new CustomerRequest
                    {
                        FirstName = firstName,
                        LastName = lastName,
                        Email = !string.IsNullOrEmpty(email) ? email : string.Empty,
                        Website = !string.IsNullOrEmpty(website) ? website : string.Empty,
                        Phone = !string.IsNullOrEmpty(phoneNumber) ? phoneNumber : string.Empty,
                        Company = !string.IsNullOrEmpty(company) ? company : string.Empty,
                    }
                };
                if (!string.IsNullOrEmpty(transactionDescription))
                {
                    braintreeRequest.CustomFields.Add("transaction_desc", transactionDescription);
                }
                if (!string.IsNullOrEmpty(customerNotes))
                {
                    braintreeRequest.CustomFields.Add("customer_comments", customerNotes.Length > 255 ? customerNotes.Substring(0, 254) : customerNotes);
                }
                if (paymentType == PaymentTypeEnum.CreditCard)
                {
                    braintreeRequest.Options.AddBillingAddressToPaymentMethod = true;

                    braintreeRequest.BillingAddress = new AddressRequest
                    {
                        Company = !string.IsNullOrEmpty(company) ? company : string.Empty,
                        CountryCodeAlpha2 = countryCode,
                        FirstName = firstName,
                        LastName = lastName,
                        PostalCode = addressPostalCode,
                        StreetAddress = addressStreet1,
                        ExtendedAddress = addressStreet2,
                        Locality = addressCity,
                        Region = addressStateId
                    };
                }
                if (paymentType == PaymentTypeEnum.Paypal)
                {

                    braintreeRequest.Options.PayPal = new TransactionOptionsPayPalRequest
                    {
                        //CustomField = "PayPal custom field",
                        Description = string.IsNullOrEmpty(transactionDescription) ? "TXHR Payment" : transactionDescription
                    };
                }

                var result = Gateway.Transaction.Sale(braintreeRequest);

                // check if success
                if (result.IsSuccess())
                {
                    serviceResult.IsSuccess = true;
                    serviceResult.NewKey = result.Target.Id;
                    var transTarget = result.Target;
                    if (transTarget.PaymentInstrumentType == PaymentInstrumentType.CREDIT_CARD)
                    {////
                    }
                    if (transTarget.PaymentInstrumentType == PaymentInstrumentType.PAYPAL_ACCOUNT)
                    {
                    }
                }
                else
                {
                    serviceResult.IsSuccess = false;
                    serviceResult.Messages = new List<string>(1) { result.Message };
                    if (result.Transaction != null)
                    {
                        if (result.Transaction.Status == TransactionStatus.SETTLEMENT_DECLINED)
                        {

                        }
                        if (result.Transaction.Status == TransactionStatus.FAILED)
                        {

                        }
                        if (result.Transaction.Status == TransactionStatus.GATEWAY_REJECTED)
                        {

                        }
                        if (result.Transaction.Status == TransactionStatus.PROCESSOR_DECLINED)
                        {
                            // https://developers.braintreepayments.com/javascript+dotnet/reference/general/processor-responses/authorization-responses
                            // 1000 >= code < 2000 Success
                            // 2000 >= code < 3000 Decline
                            // 3000 >= code        Failure
                        }
                        if (result.Transaction.Status == TransactionStatus.UNRECOGNIZED)
                        {

                        }

                        if (result.Errors.DeepCount > 0)
                        {
                            _logger.LogInformation("Braintree validation errors: {Message} -- {@BraintreeValidationErrors}", result.Message, result.Errors.DeepAll());
                        }
                        else
                        {
                            _logger.LogInformation("Braintree transaction failure: {@BraintreeResult}", result);
                        }
                    }
                }
            }
            catch (AuthenticationException authenticationException)
            {
                // API keys are incorrect
                // TODO send email to admin
                _logger.LogError(new EventId(3), authenticationException, "Braintree authentication error");
                throw;
            }
            catch (AuthorizationException authorizationException)
            {
                // not authorized to perform the attempted action according to the roles assigned to the user who owns the API key
                // TODO send email to admin
               // _logger.Error(authorizationException, "Braintree authorization error");
                throw;
            }
            catch (ServerException serverException)
            {
                // something went wrong on the braintree server
                // user should try again
                _logger.LogError(new EventId(3), serverException, "Braintree server error");
                throw;
            }
            catch (UpgradeRequiredException upgradeRequiredException)
            {
                // TODO send email to admin
                _logger.LogError(new EventId(3), upgradeRequiredException, "Braintree upgrade required error");
                throw;
            }
            catch (BraintreeException braintreeException)
            {
                // user should try again
                _logger.LogError(new EventId(3), braintreeException, "Braintree general error");
                throw;
            }

            return serviceResult;
        }
    }
}
