using HuskyRescueCore.Data;
using HuskyRescueCore.Helpers.PostRequestGet;
using HuskyRescueCore.Models.AdopterViewModels;
using HuskyRescueCore.Models.BrainTreeViewModels;
using HuskyRescueCore.Models.GolfViewModels;
using HuskyRescueCore.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PaulMiami.AspNetCore.Mvc.Recaptcha;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HuskyRescueCore.Controllers
{
    public class GolfController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ISystemSettingService _systemServices;
        private readonly IEmailSender _emailService;
        private readonly IBraintreePaymentService _paymentService;
        private readonly ILogger<GolfController> _logger;

        public GolfController(ApplicationDbContext context,
            ISystemSettingService systemServices, IEmailSender emailService, IBraintreePaymentService paymentService, ILogger<GolfController> logger)
        {
            _systemServices = systemServices;
            _emailService = emailService;
            _context = context;
            _paymentService = paymentService;
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult RaffleAuction()
        {
            var model = new Register();

            return View(model);
        }

        [ImportModelState]
        public IActionResult Register()
        {
            var model = new Register();

            var states = _context.States.ToList();

            model.Attendee1AddressStateList = new List<SelectListItem>();
            model.Attendee1AddressStateList = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();
            model.Attendee2AddressStateList = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();
            model.Attendee3AddressStateList = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();
            model.Attendee4AddressStateList = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();
            model.BrainTreePayment.States = (states.Select(i => new SelectListItem { Text = i.Text, Value = i.Id.ToString() })).AsEnumerable();

            #region Payment
            // Values needed for submitting a payment to BrainTree
            var token = _paymentService.GetClientToken(string.Empty);
            ViewData.Add("clientToken", token);
            ViewData.Add("merchantId", _systemServices.GetSetting("BraintreeMerchantId").Value);
            ViewData.Add("environment", _systemServices.GetSetting("BraintreeIsProduction").Value);
            model.GolfTicketCost = decimal.Parse(_systemServices.GetSetting("GolfTicketCost").Value);
            model.BanquetTicketCost = decimal.Parse(_systemServices.GetSetting("GolfBanquetTicketCost").Value);
            #endregion

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ExportModelState]
        public async Task<IActionResult> Register(Register model)
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
                        var phone = model.Attendee1PhoneNumber;
                        var paymentResult = new ServiceResult();

                        var paymentRequestResult = new ServiceResult();

                        if (paymentMethod == PaymentTypeEnum.Paypal)
                        {
                            paymentResult = _paymentService.SendPayment(model.TotalAmountDue,
                                                    model.BrainTreePayment.Nonce,
                                                    true,
                                                    paymentMethod,
                                                    model.BrainTreePayment.DeviceData,
                                                    "golf reg fee",
                                                    model.CustomerNotes,
                                                    model.BrainTreePayment.PayeeFirstName,
                                                    model.BrainTreePayment.PayeeLastName,
                                                    phone,
                                                    model.Attendee1EmailAddress);
                        }
                        else
                        {
                            var stateCode = _context.States.First(p => p.Id == model.BrainTreePayment.PayeeAddressStateId).Code;

                            paymentRequestResult = _paymentService.SendPayment(model.TotalAmountDue,
                                                    model.BrainTreePayment.Nonce,
                                                    true,
                                                    paymentMethod,
                                                    model.BrainTreePayment.DeviceData,
                                                    "golf reg fee",
                                                    model.CustomerNotes,
                                                    model.BrainTreePayment.PayeeFirstName,
                                                    model.BrainTreePayment.PayeeLastName,
                                                    model.BrainTreePayment.PayeeAddressStreet1,
                                                    model.BrainTreePayment.PayeeAddressStreet2,
                                                    model.BrainTreePayment.PayeeAddressCity,
                                                    stateCode,
                                                    model.BrainTreePayment.PayeeAddressPostalCode,
                                                    "US",
                                                    phone,
                                                    model.Attendee1EmailAddress);
                        }

                        if (!paymentRequestResult.IsSuccess)
                        {
                            // TODO: handle failure to pay
                            result.IsSuccess = false;
                            result.Messages.Add("Payment Failure - see below for details: ");
                            result.Messages.AddRange(paymentRequestResult.Messages);

                            _logger.LogError("Golf Registration Fee Payment Failed {@GolfRegFeePaymentErrors}", result.Messages);
                            ModelState.AddModelError("", "Unable to process your payment. Try again, and if the problem persists see your system administrator.");
                            foreach (var error in paymentRequestResult.Messages)
                            {
                                ModelState.AddModelError("", error);
                            }

                            RedirectToAction("Register");
                        }

                        // payment is a success. capture the transaction id from braintree
                        model.BrainTreePayment.BraintreeTransactionId = paymentRequestResult.NewKey;
                        #endregion

                        #region Database

                        var eventId = new Guid(_systemServices.GetSetting("GolfTournamentId").Value);
                        var registrationId = Guid.NewGuid();

                        var numberOfTickets = 0;
                        if (!string.IsNullOrEmpty(model.Attendee1FirstName)) { numberOfTickets += 1; }
                        if (!string.IsNullOrEmpty(model.Attendee2FirstName)) { numberOfTickets += 1; }
                        if (!string.IsNullOrEmpty(model.Attendee3FirstName)) { numberOfTickets += 1; }
                        if (!string.IsNullOrEmpty(model.Attendee4FirstName)) { numberOfTickets += 1; }


                        #region Copy ViewModel to database Model
                        var dbRegistration = new Models.EventRegistration
                        {
                            Id = registrationId,
                            EventId = eventId,
                            AmountPaid = model.TotalAmountDue,
                            CommentsFromRegistrant = model.CustomerNotes,
                            HasPaid = true,
                            SubmittedTimestamp = DateTime.Now,
                            NumberTicketsBought = numberOfTickets
                        };

                        dbRegistration.EventRegistrationPersons = new List<Models.EventRegistrationPerson>();

                        if (!string.IsNullOrEmpty(model.Attendee1FirstName))
                        {
                            dbRegistration.EventRegistrationPersons.Add(new Models.EventRegistrationPerson
                            {
                                Id = 1,
                                Address1 = model.Attendee1AddressStreet1,
                                Address2 = model.Attendee1AddressStreet2,
                                AmountPaid = model.Attendee1TicketPrice,
                                City = model.Attendee1AddressCity,
                                EmailAddress = model.Attendee1EmailAddress,
                                EventRegistrationId = registrationId,
                                EventRegistrationPersonTypeId = int.Parse(model.Attendee1Type),
                                FirstName = model.Attendee1FirstName,
                                LastName = model.Attendee1LastName,
                                IsPrimaryPerson = true,
                                FullName = model.Attendee1FullName,
                                StatesId = model.Attendee1AddressStateId,
                                PhoneNumber = model.Attendee1PhoneNumber,
                                ZipCode = model.Attendee1AddressPostalCode
                            });
                        }

                        if (!string.IsNullOrEmpty(model.Attendee2FirstName))
                        {
                            dbRegistration.EventRegistrationPersons.Add(new Models.EventRegistrationPerson
                            {
                                Id = 2,
                                Address1 = model.Attendee2AddressStreet1,
                                Address2 = model.Attendee2AddressStreet2,
                                AmountPaid = model.Attendee2TicketPrice,
                                City = model.Attendee2AddressCity,
                                EmailAddress = model.Attendee2EmailAddress,
                                EventRegistrationId = registrationId,
                                EventRegistrationPersonTypeId = int.Parse(model.Attendee2Type),
                                FirstName = model.Attendee2FirstName,
                                LastName = model.Attendee2LastName,
                                IsPrimaryPerson = false,
                                FullName = model.Attendee2FullName,
                                StatesId = model.Attendee2AddressStateId,
                                PhoneNumber = model.Attendee2PhoneNumber,
                                ZipCode = model.Attendee2AddressPostalCode
                            });
                        }

                        if (!string.IsNullOrEmpty(model.Attendee3FirstName))
                        {
                            dbRegistration.EventRegistrationPersons.Add(new Models.EventRegistrationPerson
                            {
                                Id = 3,
                                Address1 = model.Attendee3AddressStreet1,
                                Address2 = model.Attendee3AddressStreet2,
                                AmountPaid = model.Attendee3TicketPrice,
                                City = model.Attendee3AddressCity,
                                EmailAddress = model.Attendee3EmailAddress,
                                EventRegistrationId = registrationId,
                                EventRegistrationPersonTypeId = int.Parse(model.Attendee3Type),
                                FirstName = model.Attendee3FirstName,
                                LastName = model.Attendee3LastName,
                                IsPrimaryPerson = true,
                                FullName = model.Attendee3FullName,
                                StatesId = model.Attendee3AddressStateId,
                                PhoneNumber = model.Attendee3PhoneNumber,
                                ZipCode = model.Attendee3AddressPostalCode
                            });
                        }

                        if (!string.IsNullOrEmpty(model.Attendee4FirstName))
                        {
                            dbRegistration.EventRegistrationPersons.Add(new Models.EventRegistrationPerson
                            {
                                Id = 4,
                                Address1 = model.Attendee4AddressStreet1,
                                Address2 = model.Attendee4AddressStreet2,
                                AmountPaid = model.Attendee4TicketPrice,
                                City = model.Attendee4AddressCity,
                                EmailAddress = model.Attendee4EmailAddress,
                                EventRegistrationId = registrationId,
                                EventRegistrationPersonTypeId = int.Parse(model.Attendee4Type),
                                FirstName = model.Attendee4FirstName,
                                LastName = model.Attendee4LastName,
                                IsPrimaryPerson = true,
                                FullName = model.Attendee4FullName,
                                StatesId = model.Attendee4AddressStateId,
                                PhoneNumber = model.Attendee4PhoneNumber,
                                ZipCode = model.Attendee4AddressPostalCode
                            });
                        }
                        #endregion

                        #region Add to Database
                        _context.Add(dbRegistration);
                        #endregion

                        #region Save to Database and check exceptions
                        try
                        {
                            _logger.LogInformation("Saving golf registration to database: {@dbRegistration}", dbRegistration);
                            var numChanges = _context.SaveChanges();
                            if (numChanges > 0)
                            {
                                result.IsSuccess = true;
                            }
                        }
                        catch (DbUpdateException ex)
                        {
                            _logger.LogError(new EventId(1), ex, "Database Update Exception saving golf registration");
                        }
                        catch (InvalidOperationException ex)
                        {
                            _logger.LogError(new EventId(1), ex, "Invalid Operation Exception saving golf registration");
                        }
                        #endregion

                        #endregion

                        #region Send Emails
                        var groupEmail = _systemServices.GetSetting("Email-Golf").Value;

                        var subject = string.Join(" - ", "[TXHR Web]", "6th Annual Texas Husky Rescue Golf Registration");

                        var bodyText = @" 
Thank you for registering for Texas Husky Rescue's 6th Annual Golf Tournament.  We are very excited for this year's event and we have no doubt you will have a fabulous time.

You will be sent an email closer to the tournament with detailed information.  If you have any questions prior to then, please feel free to email us at golf@texashuskyrescue.org.

Thanks again,
Texas Husky Rescue Golf Committee
1-877-TX-HUSKY (894-8759) (phone/fax)
PO Box 118891, Carrollton, TX 75011
";


                        // Send email to the primary registrant
                        if (model.Attendee1IsAttending)
                        {
                            var emailAppResult = await _emailService.SendEmailAsync(model.Attendee1EmailAddress, groupEmail, groupEmail, subject, bodyText, "golf-registration");
                        }
                        if (model.Attendee2IsAttending)
                        {
                            var emailAppResult = await _emailService.SendEmailAsync(model.Attendee2EmailAddress, groupEmail, groupEmail, subject, bodyText, "golf-registration");
                        }
                        if (model.Attendee3IsAttending)
                        {
                            var emailAppResult = await _emailService.SendEmailAsync(model.Attendee3EmailAddress, groupEmail, groupEmail, subject, bodyText, "golf-registration");
                        }
                        if (model.Attendee4IsAttending)
                        {
                            var emailAppResult = await _emailService.SendEmailAsync(model.Attendee4EmailAddress, groupEmail, groupEmail, subject, bodyText, "golf-registration");
                        }

                        bodyText = "Golf registration for " + numberOfTickets + " attendees.";
                        bodyText += Environment.NewLine;
                        bodyText += Environment.NewLine;
                        bodyText += "Attendee 1: " + Environment.NewLine;
                        bodyText += "Name: " + model.Attendee1FullName + Environment.NewLine;
                        bodyText += "Address: " + model.Attendee1AddressStreet1 + " " + model.Attendee1AddressStreet2 + ", " + model.Attendee1AddressCity + ", " + model.Attendee1AddressPostalCode + Environment.NewLine;
                        bodyText += "Phone: " + (string.IsNullOrEmpty(model.Attendee1PhoneNumber) ? "not provided" : model.Attendee1PhoneNumber) + Environment.NewLine;
                        bodyText += "Email: " + (string.IsNullOrEmpty(model.Attendee1EmailAddress) ? "not provided" : model.Attendee1EmailAddress) + Environment.NewLine;
                        bodyText += "Mailable?: " + model.Attendee1FutureContact + Environment.NewLine;
                        bodyText += "Attendance Type: " + model.Attendee1Type + Environment.NewLine;
                        bodyText += "Ticket Price: " + model.Attendee1TicketPrice + Environment.NewLine;
                        bodyText += "-------------------------------------------------------------" + Environment.NewLine;
                        if (model.Attendee2IsAttending)
                        {
                            bodyText += "Attendee 2: " + Environment.NewLine;
                            bodyText += "Name: " + model.Attendee2FullName + Environment.NewLine;
                            bodyText += "Address: " + model.Attendee2AddressStreet1 + " " + model.Attendee2AddressStreet2 + ", " + model.Attendee2AddressCity + ", " + model.Attendee2AddressPostalCode + Environment.NewLine;
                            bodyText += "Phone: " + (string.IsNullOrEmpty(model.Attendee2PhoneNumber) ? "not provided" : model.Attendee2PhoneNumber) + Environment.NewLine;
                            bodyText += "Email: " + (string.IsNullOrEmpty(model.Attendee2EmailAddress) ? "not provided" : model.Attendee2EmailAddress) + Environment.NewLine;
                            bodyText += "Mailable?: " + model.Attendee2FutureContact + Environment.NewLine;
                            bodyText += "Attendance Type: " + model.Attendee2Type + Environment.NewLine;
                            bodyText += "Ticket Price: " + model.Attendee2TicketPrice + Environment.NewLine;
                            bodyText += "-------------------------------------------------------------" + Environment.NewLine;
                        }
                        if (model.Attendee3IsAttending)
                        {
                            bodyText += "Attendee 3: " + Environment.NewLine;
                            bodyText += "Name: " + model.Attendee3FullName + Environment.NewLine;
                            bodyText += "Address: " + model.Attendee3AddressStreet1 + " " + model.Attendee3AddressStreet2 + ", " + model.Attendee3AddressCity + ", " + model.Attendee3AddressPostalCode + Environment.NewLine;
                            bodyText += "Phone: " + (string.IsNullOrEmpty(model.Attendee3PhoneNumber) ? "not provided" : model.Attendee3PhoneNumber) + Environment.NewLine;
                            bodyText += "Email: " + (string.IsNullOrEmpty(model.Attendee3EmailAddress) ? "not provided" : model.Attendee3EmailAddress) + Environment.NewLine;
                            bodyText += "Mailable?: " + model.Attendee3FutureContact + Environment.NewLine;
                            bodyText += "Attendance Type: " + model.Attendee3Type + Environment.NewLine;
                            bodyText += "Ticket Price: " + model.Attendee3TicketPrice + Environment.NewLine;
                            bodyText += "-------------------------------------------------------------" + Environment.NewLine;
                        }
                        if (model.Attendee4IsAttending)
                        {
                            bodyText += "Attendee 4: " + Environment.NewLine;
                            bodyText += "Name: " + model.Attendee4FullName + Environment.NewLine;
                            bodyText += "Address: " + model.Attendee4AddressStreet1 + " " + model.Attendee4AddressStreet2 + ", " + model.Attendee4AddressCity + ", " + model.Attendee4AddressPostalCode + Environment.NewLine;
                            bodyText += "Phone: " + (string.IsNullOrEmpty(model.Attendee4PhoneNumber) ? "not provided" : model.Attendee4PhoneNumber) + Environment.NewLine;
                            bodyText += "Email: " + (string.IsNullOrEmpty(model.Attendee4EmailAddress) ? "not provided" : model.Attendee4EmailAddress) + Environment.NewLine;
                            bodyText += "Mailable?: " + model.Attendee4FutureContact + Environment.NewLine;
                            bodyText += "Attendance Type: " + model.Attendee4Type + Environment.NewLine;
                            bodyText += "Ticket Price: " + model.Attendee4TicketPrice + Environment.NewLine;
                            bodyText += "-------------------------------------------------------------" + Environment.NewLine;
                        }
                        bodyText += "Notes from the register: " + model.CustomerNotes + Environment.NewLine;
                        bodyText += "-------------------------------------------------------------" + Environment.NewLine;
                        bodyText += "Payee: " + Environment.NewLine;
                        bodyText += "Paid with " + model.BrainTreePayment.PaymentMethod + Environment.NewLine;
                        bodyText += "Name: " + model.BrainTreePayment.PayeeFirstName + " " + model.BrainTreePayment.PayeeLastName + Environment.NewLine;

                        var emailGroupResult = await _emailService.SendEmailAsync(groupEmail, groupEmail, groupEmail, subject, bodyText, "golf-registration");

                        #endregion

                        if (result.IsSuccess)
                        {
                            return RedirectToAction("RegisterThankYou");
                        }
                        else
                        {
                            foreach (var error in result.Messages)
                            {
                                ModelState.AddModelError(error.GetHashCode().ToString(), error);
                                _logger.LogError("Data Exception saving Golf Registration {@modelGolfReg}", model);
                            }

                            return RedirectToAction("Register");
                        }
                    }
                    _logger.LogInformation("Adoption App Model Errors {@errors} {@modelGolfReg}", result.Messages, model);
                }
                catch (Exception dex)
                {
                    //Log the error (uncomment dex variable name and add a line here to write a log.
                    ModelState.AddModelError("", "Unable to save changes. Try again, and if the problem persists see your system administrator.");
                    _logger.LogError(new EventId(6), dex, "Data Exception saving Golf Registration {@modelGolfReg}", model);
                }
            }
            return RedirectToAction("Register");
        }

        public IActionResult RegisterThankyou()
        {
            return View();
        }

        public IActionResult Sponsor()
        {
            return View();
        }

        public IActionResult Sponsors()
        {
            return View();
        }

        public IActionResult Sponsorships()
        {
            return View();
        }

        public IActionResult Support()
        {
            return View();
        }
    }
}