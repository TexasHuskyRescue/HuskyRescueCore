using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PostmarkDotNet;
using PostmarkDotNet.Model;
using System.IO;

namespace HuskyRescueCore.Services
{
    // This class is used by the application to send Email and SMS
    // when you turn on two-factor authentication in ASP.NET Identity.
    // For more details see this link http://go.microsoft.com/fwlink/?LinkID=532713
    public class AuthMessageSender : IEmailSender, ISmsSender
    {
        private readonly ISystemSettingService _systemServices;

        public AuthMessageSender(ISystemSettingService systemServices)
        {
            _systemServices = systemServices;
        }

        public async Task<ServiceResult> SendEmailAsync(PostmarkMessage message)
        {
            //TODO - handle results from sending postmark message

            var serviceResult = new ServiceResult();

            var postmarkKey = await _systemServices.GetSettingAsync("PostMarkKey");
            var client = new PostmarkClient(postmarkKey.Value);
            var sendResult = await client.SendMessageAsync(message);

            return serviceResult;
        }

        public async Task<ServiceResult> SendEmailAsync(string toEmail, string subject, string message)
        {
            var systemEmail = await _systemServices.GetSettingAsync("Email-Admin");

            var postmarkMessage = new PostmarkMessage()
            {
                To = toEmail,
                From = systemEmail.Value,
                TrackOpens = true,
                ReplyTo = systemEmail.Value,
                Tag = "account",
                Subject = subject,
                TextBody = message
            };

            return await SendEmailAsync(postmarkMessage);
        }

        public async Task<ServiceResult> SendEmailAsync(string toEmail, string fromEmail, string replyToEmail, string subject, string message, string tag)
        {
            var postmarkMessage = new PostmarkMessage()
            {
                To = toEmail,
                From = fromEmail,
                TrackOpens = true,
                ReplyTo = replyToEmail,
                Tag = tag,
                Subject = subject,
                TextBody = message
            };

            return await SendEmailAsync(postmarkMessage);
        }

        public async Task<ServiceResult> SendEmailAsync(string toEmail, string fromEmail, string replyToEmail, string subject, string message, string tag, List<PostmarkMessageAttachment> attachments)
        {
            var postmarkMessage = new PostmarkMessage()
            {
                To = toEmail,
                From = fromEmail,
                TrackOpens = true,
                ReplyTo = replyToEmail,
                Tag = tag,
                Subject = subject,
                TextBody = message,
                Attachments = attachments
            };

            return await SendEmailAsync(postmarkMessage);
        }

        public Task SendSmsAsync(string number, string message)
        {
            // Plug in your SMS service here to send a text message.
            return Task.FromResult(0);
        }
    }
}
