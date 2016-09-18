using HuskyRescueCore.Data;
using HuskyRescueCore.Helpers.PostRequestGet;
using HuskyRescueCore.Models.BrainTreeViewModels;
using HuskyRescueCore.Models.DonationViewModels;
using HuskyRescueCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
//using PaulMiami.AspNetCore.Mvc.Recaptcha;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Controllers
{
    public class DonateController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ISystemSettingService _systemServices;
        private readonly IEmailSender _emailService;
        private readonly IBraintreePaymentService _paymentService;
        private readonly ILogger<GolfController> _logger;

        public DonateController(ApplicationDbContext context,
            ISystemSettingService systemServices, IEmailSender emailService, IBraintreePaymentService paymentService, ILogger<GolfController> logger)
        {
            _systemServices = systemServices;
            _emailService = emailService;
            _context = context;
            _paymentService = paymentService;
            _logger = logger;
        }

        [ImportModelState]
        //[ValidateRecaptcha]
        public IActionResult Index()
        {
            var model = new DonationViewModel();

            var states = _context.States.ToList();
            model.BrainTreePayment.States = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();

            #region Payment
            // Values needed for submitting a payment to BrainTree
            var token = _paymentService.GetClientToken(string.Empty);
            ViewData.Add("clientToken", token);
            ViewData.Add("merchantId", _systemServices.GetSetting("BraintreeMerchantId").Value);
            ViewData.Add("environment", _systemServices.GetSetting("BraintreeIsProduction").Value);
            #endregion

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ExportModelState]
        //[ValidateRecaptcha]
        public async Task<IActionResult> Donate(DonationViewModel model)
        {
            if (string.IsNullOrEmpty(model.BrainTreePayment.Nonce))
            {
                ModelState.AddModelError("", "incomplete payment information provided");
            }
            else
            {
                try
                {
                    // get model state errors
                    var errors = ModelState.Values.SelectMany(v => v.Errors);

                    // if paying with a credit card the fields for credit card number/cvs/month/year will be invalid because we do not send them to the server
                    // so count the errors on the field validation that do not start with 'card ' (comes from the property attributes in the model class Apply.cs)
                    // TODO validate if this is still needed - all card validation has been removed b/c client side validation requires 'name' properties
                    //      which have been removed for PCI compliance. 
                    var errorCount = errors.Count(m => !m.ErrorMessage.StartsWith("card "));
                    var result = new ServiceResult();
                    if (errorCount == 0)
                    {
                        #region Process Payment
                        var paymentMethod = (PaymentTypeEnum)Enum.Parse(typeof(PaymentTypeEnum), model.BrainTreePayment.PaymentMethod);
                        var phone = model.DonorPhoneNumber;
                        var paymentResult = new ServiceResult();

                        var paymentRequestResult = new ServiceResult();

                        if (paymentMethod == PaymentTypeEnum.Paypal)
                        {
                            paymentResult = _paymentService.SendPayment(model.AmountDonation,
                                                    model.BrainTreePayment.Nonce,
                                                    true,
                                                    paymentMethod,
                                                    model.BrainTreePayment.DeviceData,
                                                    "donation",
                                                    model.Comments,
                                                    model.BrainTreePayment.PayeeFirstName,
                                                    model.BrainTreePayment.PayeeLastName,
                                                    phone,
                                                    model.DonorEmail);
                        }
                        else
                        {
                            var stateCode = _context.States.Single(p => p.Id == model.BrainTreePayment.PayeeAddressStateId).Code;

                            paymentRequestResult = _paymentService.SendPayment(model.AmountDonation,
                                                    model.BrainTreePayment.Nonce,
                                                    true,
                                                    paymentMethod,
                                                    model.BrainTreePayment.DeviceData,
                                                    "donation",
                                                    model.Comments,
                                                    model.BrainTreePayment.PayeeFirstName,
                                                    model.BrainTreePayment.PayeeLastName,
                                                    model.BrainTreePayment.PayeeAddressStreet1,
                                                    model.BrainTreePayment.PayeeAddressStreet2,
                                                    model.BrainTreePayment.PayeeAddressCity,
                                                    stateCode,
                                                    model.BrainTreePayment.PayeeAddressPostalCode,
                                                    "US",
                                                    phone,
                                                    model.DonorEmail);
                        }

                        if (!paymentRequestResult.IsSuccess)
                        {
                            // TODO: handle failure to pay
                            result.IsSuccess = false;
                            result.Messages.Add("Payment Failure - see below for details: ");
                            result.Messages.AddRange(paymentRequestResult.Messages);

                            _logger.LogError("Donation Payment Failed {@DonationPaymentErrors}", result.Messages);
                            ModelState.AddModelError("", "Unable to process your payment. Try again, and if the problem persists see your system administrator.");
                            foreach (var error in paymentRequestResult.Messages)
                            {
                                ModelState.AddModelError("", error);
                            }

                            RedirectToAction("Index");
                        }

                        // payment is a success. capture the transaction id from braintree
                        model.BrainTreePayment.BraintreeTransactionId = paymentRequestResult.NewKey;
                        #endregion

                        #region Database

                        var donationId = Guid.NewGuid();
                        var personId = Guid.NewGuid();

                        #region Copy ViewModel to database Model
                        var dbDonation = new Models.Donation
                        {
                            Id = donationId,
                            Amount = model.AmountDonation,
                            DonorNote = model.Comments,
                            DateTimeOfDonation = DateTime.Now,
                            PersonId = personId,
                            PaymentType = paymentMethod.ToString()
                        };

                        var dbPerson = new Models.Person
                        {
                            Id = personId,
                            CreatedTimestamp = DateTime.Today,
                            FirstName = model.BrainTreePayment.PayeeFirstName,
                            LastName = model.BrainTreePayment.PayeeLastName,
                            IsActive = true,
                            IsDonor = true,
                            FullName = model.BrainTreePayment.PayeeFullName,
                            CanEmail = model.IsEmailable.HasValue ? model.IsEmailable.Value : false
                        };

                        if (paymentMethod == PaymentTypeEnum.CreditCard)
                        {
                            dbPerson.Addresses = new List<Models.Address> {
                            new Models.Address
                            {
                                Id = Guid.NewGuid(),
                                PersonId = personId,
                                Address1 = model.BrainTreePayment.PayeeAddressStreet1,
                                Address2 = model.BrainTreePayment.PayeeAddressStreet2,
                                StatesId = model.BrainTreePayment.PayeeAddressStateId.Value,
                                AddressTypeId = 1, //Primary
                                City = model.BrainTreePayment.PayeeAddressCity,
                                IsBillingAddress = true,
                                ZipCode = model.BrainTreePayment.PayeeAddressPostalCode
                            }};
                        }

                        if (!string.IsNullOrEmpty(model.DonorEmail))
                        {
                            dbPerson.Emails = new List<Models.Email>
                                        {
                                            new Models.Email
                                            {
                                                Id = Guid.NewGuid(),
                                                PersonId = personId,
                                                Address = model.DonorEmail,
                                                EmailTypeId = 0
                                            }
                                        };
                        }

                        if (!string.IsNullOrEmpty(model.DonorPhoneNumber))
                        {
                            dbPerson.Phones = new List<Models.Phone>
                                    {
                                        new Models.Phone
                                        {
                                            Id = Guid.NewGuid(),
                                            PersonId = personId,
                                            Number = model.DonorPhoneNumber,
                                            PhoneTypeId = 1
                                        }
                                    };
                        }
                        #endregion

                        #region Add to Database
                        _context.Add(dbDonation);
                        _context.Add(dbPerson);
                        #endregion

                        #region Save to Database and check exceptions
                        try
                        {
                            _logger.LogInformation("Saving donation information to database: {@dbDonation}", dbDonation);
                            var numChanges = _context.SaveChanges();
                            if (numChanges > 0)
                            {
                                result.IsSuccess = true;
                            }
                        }
                        catch (DbUpdateException ex)
                        {
                            _logger.LogError(new EventId(7), ex, "Database Update Exception saving donation information");
                        }
                        catch (InvalidOperationException ex)
                        {
                            _logger.LogError(new EventId(7), ex, "Invalid Operation Exception saving donation information");
                        }
                        #endregion

                        #endregion

                        #region Send Emails
                        var groupEmail = _systemServices.GetSetting("Email-Contact").Value;

                        var subject = string.Format("[TXHR Web] [Donation] [Amount=${0}] - {1}", model.AmountDonation, model.BrainTreePayment.PayeeFullName);
                        var bodyText = string.Format(@"
Thank you, {0}. Your donation of {1} is greatly appreciated. For your records:
Payment method: {2}
Payment Date: {3}
Payment Confirmation Id: {4}

Thanks again,
Texas Husky Rescue
1-877-TX-HUSKY (894-8759)(phone / fax)
PO Box 118891, Carrollton, TX 75007",
model.BrainTreePayment.PayeeFullName, model.AmountDonation, paymentMethod, DateTime.Now.Date, model.BrainTreePayment.BraintreeTransactionId);


                        var emailAppResult = await _emailService.SendEmailAsync(model.DonorEmail, groupEmail, groupEmail, subject, bodyText, "donation");

                        bodyText = string.Format(@"
Donor Name: {0}
Donor Email: {1}
Donor Phone: {2}
Donation Amount: {3}
Payment method: {4}
Payment Date: {5}
Payment Confirmation Id: {6}
Comments : {7}",
model.BrainTreePayment.PayeeFullName, model.DonorEmail, model.DonorPhoneNumber, model.AmountDonation, paymentMethod, DateTime.Now.Date, model.BrainTreePayment.BraintreeTransactionId, model.Comments);

                        var emailGroupResult = await _emailService.SendEmailAsync(groupEmail, groupEmail, groupEmail, subject, bodyText, "donation");

                        #endregion

                        if (result.IsSuccess)
                        {
                            return RedirectToAction("ThankYou");
                        }
                        else
                        {
                            foreach (var error in result.Messages)
                            {
                                ModelState.AddModelError(error.GetHashCode().ToString(), error);
                                _logger.LogError("Data Exception saving Donation {@modelGolfReg}", model);
                            }

                            return RedirectToAction("ThankYou");
                        }
                    }
                    _logger.LogInformation("Donation Model Errors {@errors} {@modelDonation}", result.Messages, model);
                }
                catch (Exception dex)
                {
                    //Log the error (uncomment dex variable name and add a line here to write a log.
                    ModelState.AddModelError("", "Unable to save changes. Try again, and if the problem persists see your system administrator.");
                    _logger.LogError(new EventId(6), dex, "Data Exception saving Donation {@modelDonation}", model);
                }
            }
            return RedirectToAction("Index");
        }

        [ImportModelState]
        public ActionResult Donate()
        {
            return RedirectToAction("Index");
        }

        public IActionResult Thankyou()
        {
            return View();
        }

        public IActionResult Partners()
        {
            return View();
        }

        public IActionResult Sponsors()
        {
            return View();
        }
    }
}