using Google.Apis.Auth;
using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.GoogleAuth.Command
{
    public class GoogleSignInCommandHandler : IRequestHandler<GoogleSignInCommand, LoginResponce>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public GoogleSignInCommandHandler(
            UserManager<ApplicationUser> userManager,
            ITokenService tokenService,
            IUnitOfWork unitOfWork,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<LoginResponce> Handle(GoogleSignInCommand request, CancellationToken cancellationToken)
        {
            // 1. Google token-i verify et
            GoogleJsonWebSignature.Payload payload;
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _configuration["Authentication:Google:ClientId"] }
                };
                payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);
            }
            catch (Exception)
            {
                throw new UnauthorizedAccessException("Invalid Google token.");
            }

            // 2. User mövcuddurmu yoxla
            var user = await _userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                // 3. Yeni user yarat
                user = new ApplicationUser
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    FirstName = payload.GivenName ?? payload.Name?.Split(' ').FirstOrDefault() ?? "",
                    LastName = payload.FamilyName ?? payload.Name?.Split(' ').LastOrDefault() ?? "",
                    EmailConfirmed = true // Google artıq verify edib
                };

                var result = await _userManager.CreateAsync(user);
                if (!result.Succeeded)
                {
                    var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                    throw new BadRequestException($"User creation failed: {errors}");
                }

                // 4. Default role ver
                await _userManager.AddToRoleAsync(user, "Patient");

                // 5. Patient profili yarat
                var patientProfile = new Domain.Entities.Patient
                {
                    ApplicationUserId = user.Id,
                    Email = payload.Email,
                    Phone = "Not specified",
                    Gender = "Not specified",
                    City = "Not specified",
                    DateOfBirth = DateTime.MinValue,
                    Address = null
                };

                await _unitOfWork.Patients.AddAsync(patientProfile);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

            // 6. Lockout yoxla
            if (await _userManager.IsLockedOutAsync(user))
                throw new UnauthorizedAccessException("Account is locked. Please contact admin.");

            // 7. Token yarat və qaytar
            var token = await _tokenService.CreateToken(user);
            var roles = await _userManager.GetRolesAsync(user);

            return new LoginResponce
            {
                FullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                Token = token,
                Roles = roles
            };
        }
    }
}
