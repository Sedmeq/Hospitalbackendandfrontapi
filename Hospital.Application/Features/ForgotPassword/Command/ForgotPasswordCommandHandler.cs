using Hangfire;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.ForgotPassword.Command
{
    public class ForgotPasswordCommandHandler : IRequestHandler<ForgotPasswordCommand, bool>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ForgotPasswordCommandHandler(
            UserManager<ApplicationUser> userManager,
            IEmailService emailService,
            IBackgroundJobClient backgroundJobClient,
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _emailService = emailService;
            _backgroundJobClient = backgroundJobClient;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);

            // Security: həmişə true qaytar - user mövcud olub-olmadığını bildirmə
            if (user == null || !await _userManager.IsEmailConfirmedAsync(user))
                return true;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var httpRequest = _httpContextAccessor.HttpContext.Request;
            var baseUrl = $"{httpRequest.Scheme}://{httpRequest.Host}";

            _backgroundJobClient.Enqueue(
                () => _emailService.SendPasswordResetEmailAsync(user.Email, user.Id, token, baseUrl));

            return true;
        }
    }
}
