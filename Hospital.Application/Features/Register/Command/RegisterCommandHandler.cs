using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Hangfire;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Hospital.Application.Exceptions;

namespace Hospital.Application.Features.Register.Command
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, RegisterUserResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly IEmailService _emailService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<RegisterCommandHandler> _logger;
            private readonly IUnitOfWork _unitOfWork;



        public RegisterCommandHandler(
         UserManager<ApplicationUser> userManager,
         IBackgroundJobClient backgroundJobClient,
         IEmailService emailService, IHttpContextAccessor httpContextAccessor,
         ILogger<RegisterCommandHandler> logger, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _backgroundJobClient = backgroundJobClient;
            _emailService = emailService;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _unitOfWork = unitOfWork;
        }


        //public async Task<RegisterUserResponse> Handle(RegisterCommand command, CancellationToken cancellationToken)
        //{




        //    var existingUser = await _userManager.FindByEmailAsync(command.Email);
        //    if (existingUser != null)
        //        throw new InvalidOperationException("User already exists with this email.");


        //    var nameParts = command.FullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
        //    var firstName = nameParts.FirstOrDefault() ?? "";
        //    var lastName = nameParts.Skip(1).FirstOrDefault() ?? "";

        //    var user = new ApplicationUser
        //    {
        //        UserName = command.Email,
        //        Email = command.Email,
        //        PhoneNumber = command.PhoneNumber,
        //        FirstName = firstName,
        //        LastName = lastName
        //    };

        //    var result = await _userManager.CreateAsync(user, command.Password);
        //    if (!result.Succeeded)
        //    {
        //        var errors = string.Join("; ", result.Errors.Select(e => e.Description));
        //        _logger.LogError($"Registration failed: {errors}");
        //        throw new NotFoundException($"Registration failed: {errors}");
        //    }

        //    await _userManager.AddToRoleAsync(user, "Patient");






        //    //  URL HERE 
        //    var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

        //    var request = _httpContextAccessor.HttpContext.Request;
        //    var baseUrl = $"{request.Scheme}://{request.Host}";

        //    // --- PASS THE URL TO THE BACKGROUND JOB ---
        //    _backgroundJobClient.Enqueue(
        //        () => _emailService.SendConfirmationEmailAsync(user.Email, user.Id, token, baseUrl));




        //    return new RegisterUserResponse
        //    {

        //        FullName = $"{user.FirstName} {user.LastName}",
        //        Email = user.Email,
        //        Role = "Patient", //Default role assignment
        //        PhoneNumber =user.PhoneNumber

        //    };
        //}

        public async Task<RegisterUserResponse> Handle(RegisterCommand command, CancellationToken cancellationToken)
        {
            var existingUser = await _userManager.FindByEmailAsync(command.Email);
            if (existingUser != null)
                throw new InvalidOperationException("User already exists with this email.");

            var nameParts = command.FullName.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var firstName = nameParts.FirstOrDefault() ?? "";
            var lastName = nameParts.Skip(1).FirstOrDefault() ?? "";

            var user = new ApplicationUser
            {
                UserName = command.Email,
                Email = command.Email,
                PhoneNumber = command.PhoneNumber,
                FirstName = firstName,
                LastName = lastName
            };

            var result = await _userManager.CreateAsync(user, command.Password);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                _logger.LogError($"Registration failed: {errors}");
                throw new NotFoundException($"Registration failed: {errors}");
            }

            await _userManager.AddToRoleAsync(user, "Patient");

            // 🔴 ÖNƏMLİ: Patient profili yarat
            var newPatientProfile = new Domain.Entities.Patient
            {
                ApplicationUserId = user.Id,
                Email = command.Email,
                Phone = command.PhoneNumber,
                Gender = "Not specified", // və ya RegisterCommand-ə Gender əlavə edin
                City = "Not specified",    // və ya RegisterCommand-ə City əlavə edin
                DateOfBirth = DateTime.MinValue, // və ya RegisterCommand-ə DateOfBirth əlavə edin
                Address = null
            };

            await _unitOfWork.Patients.AddAsync(newPatientProfile);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Email confirmation
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var request = _httpContextAccessor.HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}";

            _backgroundJobClient.Enqueue(
                () => _emailService.SendConfirmationEmailAsync(user.Email, user.Id, token, baseUrl));

            return new RegisterUserResponse
            {
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                Role = "Patient",
                PhoneNumber = user.PhoneNumber
            };
        }
    }
}
