using Microsoft.Extensions.Options;
using Hospital.Application.Common.Setting;
using Hospital.Application.Interfaces;
using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Http;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Hospital.Infrastructure.Repositories;


public class EmailService : IEmailService
{
   
    private readonly EmailSettings _emailSettings;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly INotificationService _notificationService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public EmailService(IHttpContextAccessor httpContextAccessor,IOptions<EmailSettings> emailSettings, IAppointmentRepository appointmentRepository, INotificationService notificationService)
    {
        _emailSettings = emailSettings.Value;
        _appointmentRepository = appointmentRepository;
        _notificationService = notificationService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task SendConfirmationEmailAsync(string email, string userId, string token, string baseUrl)
    {

        var encodedToken = UrlEncoder.Default.Encode(token);
        var confirmationLink = $"{baseUrl}/api/Account/confirm-email?userId={userId}&token={encodedToken}";


        using (var smtp = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port))
        {
            smtp.Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.Password);
            smtp.EnableSsl = true;


            var mail = new MailMessage
            {
                From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                Subject = "Confirm your Hospital System Account",
                Body = $"<p>Thank you for registering. Please confirm your email by clicking the link below:</p>" +
                       $"<a href='{confirmationLink}'>Confirm Email</a>",
                IsBodyHtml = true
            };
            mail.To.Add(email);


            await smtp.SendMailAsync(mail);
        }
    }
    public async Task SendRemindersForUpcomingAppointmentsAsync()
    {
        var upcomingAppointments = await _appointmentRepository.GetUpcomingAppointmentsWithinOneHourAsync();

        foreach (var appointment in upcomingAppointments)
        {
            var email = appointment.patient?.Email;

            if (!string.IsNullOrEmpty(email))
            {
                await _notificationService.SendreminderBeforeAppiontmentByHour(email);
            }
        }
    }

    public async Task SendPasswordResetEmailAsync(string email, string userId, string token, string baseUrl)
    {
        var encodedToken = UrlEncoder.Default.Encode(token);

        // React frontend reset password səhifəsinə yönləndir
        var resetLink = $"http://localhost:5173/reset-password?userId={userId}&token={encodedToken}";

        using (var smtp = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.Port))
        {
            smtp.Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.Password);
            smtp.EnableSsl = true;

            var mail = new MailMessage
            {
                From = new MailAddress(_emailSettings.SenderEmail, _emailSettings.SenderName),
                Subject = "Reset Your Password - Hospital System",
                Body = $@"<h2>Password Reset Request</h2>
                     <p>Hello,</p>
                     <p>We received a request to reset your password. Click the button below to reset it:</p>
                     <p style='margin: 20px 0;'>
                         <a href='{resetLink}' 
                            style='background-color:#1d4ed8; color:white; padding:12px 24px; 
                                   text-decoration:none; border-radius:6px; font-weight:bold;'>
                             Reset Password
                         </a>
                     </p>
                     <p>This link will expire in <strong>1 hour</strong>.</p>
                     <p>If you did not request a password reset, please ignore this email.</p>
                     <br/>
                     <p><em>Hospital Management System</em></p>",
                IsBodyHtml = true
            };
            mail.To.Add(email);

            await smtp.SendMailAsync(mail);
        }
    }


}
