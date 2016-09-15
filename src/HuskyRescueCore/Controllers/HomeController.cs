using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HuskyRescueCore.Models.ContactViewModels;
using PaulMiami.AspNetCore.Mvc.Recaptcha;
using HuskyRescueCore.Services;
using HuskyRescueCore.Models;
using HuskyRescueCore.Helpers.PostRequestGet;

namespace HuskyRescueCore.Controllers
{
    public class HomeController : Controller
    {
        private readonly ISystemSettingService _systemServices;
        private readonly IEmailSender _emailService;

        public HomeController(ISystemSettingService systemServices, IEmailSender emailService)
        {
            _systemServices = systemServices;
            _emailService = emailService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            return View();
        }

        [ImportModelState]
        [ValidateRecaptcha]
        public IActionResult Contact()
        {
            //TODO: Add phone number to form
            return View(new Contact());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [ExportModelState]
        [ValidateRecaptcha]
        public async Task<IActionResult> Contact([Bind("NameFirst,NameLast,EmailAddress,Number,Message,IsEmailable,ContactTypeId")] Contact contact)
        {
            // TODO: add logging
            // TODO: add exception handling and display error message to user
            // TODO: add file attachment from website http://plugins.krajee.com/file-input http://stackoverflow.com/questions/29836342/mvc-6-httppostedfilebase http://www.mikesdotnetting.com/article/288/uploading-files-with-asp-net-core-1-0-mvc

            if (ModelState.IsValid)
            {
                var systemEmail = new SystemSetting();
                var subject = string.Empty;
                switch (contact.ContactTypeId)
                {
                    case "0":
                        subject = string.Join(" - ", "[TXHR Web Contact]", "[Adoption Interest]", contact.FullName);
                        systemEmail = await _systemServices.GetSettingAsync("Email-Contact");
                        break;
                    case "1":
                        subject = string.Join(" - ", "[TXHR Web Contact]", "[Surrendering a Dog]", contact.FullName);
                        systemEmail = await _systemServices.GetSettingAsync("Email-Intake");
                        break;
                    case "2":
                        subject = string.Join(" - ", "[TXHR Web Contact]", "[Found a stray husky]", contact.FullName);
                        systemEmail = await _systemServices.GetSettingAsync("Email-Intake");
                        break;
                    case "3":
                        subject = string.Join(" - ", "[TXHR Web Contact]", "[Volunteer and/or Foster]", contact.FullName);
                        systemEmail = await _systemServices.GetSettingAsync("Email-Contact");
                        break;
                    case "4":
                        subject = string.Join(" - ", "[TXHR Web Contact]", "[Event Information]", contact.FullName);
                        systemEmail = await _systemServices.GetSettingAsync("Email-Contact");
                        break;
                    case "5":
                        subject = string.Join(" - ", "[TXHR Web Contact]", "[General Question]", contact.FullName);
                        systemEmail = await _systemServices.GetSettingAsync("Email-Contact");
                        break;
                    case "6":
                        subject = string.Join(" - ", "[TXHR Web Contact]", "[Website Admin]", contact.FullName);
                        systemEmail = await _systemServices.GetSettingAsync("Email-Admin");
                        break;
                }

                var bodyText = string.Empty;

                // Email Intake
                if (contact.ContactTypeId == "1" || contact.ContactTypeId == "2")
                {
                    bodyText = @"
                    Thank you for your email, we will do our best to get back to you as soon as possible but please be patient as we are volunteers with full time jobs and families. If you have not heard from us within 7 days please email us again. Also, feel free to call us at 877-894-8759.

                    Disclaimer: Please be aware that we are unable to take every husky needing help and we are unable to take mix breed Huskies because our adopters are seeking pure bred Huskies. If you are an owner wishing to surrender your Husky, be aware that we give priority to shelter dogs, as we are often their last hope. If we are able to help your dog please be aware that there is a $100 owner surrender fee that goes to help cover the costs we absorb by taking your dog. 
                    ";
                }
                else
                {
                    bodyText = @"Thank you for contacting TXHR. We will respond, if needed, within 48 hours";
                }

                // Send email to the person that submitted the form on the website.
                await _emailService.SendEmailAsync(contact.EmailAddress, systemEmail.Value, systemEmail.Value, subject, bodyText, "contact");

                bodyText = contact.Message + Environment.NewLine + Environment.NewLine + "-----------------------------------------------";

                if (!string.IsNullOrEmpty(contact.EmailAddress))
                {
                    bodyText += Environment.NewLine + contact.EmailAddress;
                }
                if (!string.IsNullOrEmpty(contact.Number))
                {
                    bodyText += Environment.NewLine + contact.Number;
                }
                if (contact.IsEmailable)
                {
                    bodyText += Environment.NewLine + "This person opted in to receive newsletters, promotions, and event information via email in the future";
                }

                // Send email to the TXHR with the contact person's message
                await _emailService.SendEmailAsync(systemEmail.Value, systemEmail.Value, contact.EmailAddress, subject, bodyText, "contact");

                return RedirectToAction("ThankYou");
            }
            return RedirectToAction("Contact");
        }

        public IActionResult Error()
        {
            return View();
        }

        public IActionResult ThankYou()
        {
            return View();
        }

        public IActionResult Reports()
        {
            return View();
        }

        public IActionResult History()
        {
            return View();
        }
    }
}
