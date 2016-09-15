using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PostmarkDotNet;
using PostmarkDotNet.Model;

namespace HuskyRescueCore.Services
{
    public interface IEmailSender
    {
        Task<ServiceResult> SendEmailAsync(PostmarkMessage message);
        Task<ServiceResult> SendEmailAsync(string toEmail, string subject, string message);

        Task<ServiceResult> SendEmailAsync(string toEmail, string fromEmail, string replyToEmail, string subject, string message, string tag);

        Task<ServiceResult> SendEmailAsync(string toEmail, string fromEmail, string replyToEmail, string subject, string message, string tag, List<PostmarkMessageAttachment> attachments);
    }
}
