using Microsoft.Extensions.Logging;
using PostmarkDotNet;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HuskyRescueCore.Services
{
    // This class is used by the application to send Email and SMS
    // when you turn on two-factor authentication in ASP.NET Identity.
    // For more details see this link http://go.microsoft.com/fwlink/?LinkID=532713
    public class AuthMessageSender : IEmailSender, ISmsSender
    {
        private readonly ISystemSettingService _systemServices;
        private readonly ILogger<AuthMessageSender> _logger;

        public AuthMessageSender(ISystemSettingService systemServices, ILogger<AuthMessageSender> logger)
        {
            _systemServices = systemServices;
            _logger = logger;
        }

        public async Task<ServiceResult> SendEmailAsync(PostmarkMessage message)
        {
            //TODO - handle results from sending postmark message
            _logger.LogInformation("Start AuthMessageSender.SendEmailAsync - {@PostmarkMessage}", message);

            var serviceResult = new ServiceResult();

            var postmarkKey = await _systemServices.GetSettingAsync("PostMarkKey");
            var client = new PostmarkClient(postmarkKey.Value);
            var sendResult = await client.SendMessageAsync(message);

            serviceResult.Messages.Add("Postmark Message: " + sendResult.Message);
            serviceResult.Messages.Add("Postmark Status: " + sendResult.Status);
            serviceResult.Messages.Add("Postmark Error Code: " + sendResult.ErrorCode);
            serviceResult.Messages.Add("Postmark To: " + sendResult.To);

            _logger.LogInformation("End AuthMessageSender.SendEmailAsync - {@result}", serviceResult);

            return serviceResult;
        }

        public async Task<ServiceResult> SendEmailAsync(string toEmail, string subject, string message)
        {
            _logger.LogInformation("Start AuthMessageSender.SendEmailAsync - {@toEmail} - {@subject} - {@message}", toEmail, subject, message);

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
            _logger.LogInformation("End AuthMessageSender.SendEmailAsync - {@postmarkMessage}", postmarkMessage);

            return await SendEmailAsync(postmarkMessage);
        }

        public async Task<ServiceResult> SendEmailAsync(string toEmail, string fromEmail, string replyToEmail, string subject, string message, string tag)
        {
            _logger.LogInformation("Start AuthMessageSender.SendEmailAsync - {@toEmail} - {@fromEmail} - {@subject} - {@message} - {@tag}", toEmail, fromEmail, subject, message, tag);

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

            _logger.LogInformation("End AuthMessageSender.SendEmailAsync - {@postmarkMessage}", postmarkMessage);

            return await SendEmailAsync(postmarkMessage);
        }

        public async Task<ServiceResult> SendEmailAsync(string toEmail, string fromEmail, string replyToEmail, string subject, string message, string tag, List<PostmarkMessageAttachment> attachments)
        {
            _logger.LogInformation("Start AuthMessageSender.SendEmailAsync - {@toEmail} - {@fromEmail} - {@replyToEmail} - {@subject} - {@message} - {@tag} - {@attachmentCount} ", toEmail, fromEmail, replyToEmail, subject, message, tag, attachments.Count);

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

            _logger.LogInformation("End AuthMessageSender.SendEmailAsync - {@postmarkMessage}", postmarkMessage);

            return await SendEmailAsync(postmarkMessage);
        }

        public Task SendSmsAsync(string number, string message)
        {
            // Plug in your SMS service here to send a text message.
            return Task.FromResult(0);
        }
    }
}
