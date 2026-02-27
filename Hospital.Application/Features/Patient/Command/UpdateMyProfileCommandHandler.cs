using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Patient.Command
{

    public class UpdateMyProfileCommandHandler : IRequestHandler<UpdateMyProfileCommand, PatientsDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;
        private readonly IFileService _fileService;

        public UpdateMyProfileCommandHandler(
            IUnitOfWork unitOfWork,
            IUserContextService userContextService,
            IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
            _fileService = fileService;
        }

        public async Task<PatientsDto> Handle(UpdateMyProfileCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User is not authenticated.");

            var patient = await _unitOfWork.Patients.GetByUserIdAsync(userId);
            if (patient == null)
                throw new NotFoundException("Patient profile not found.");

            // Məlumatları yenilə
            patient.ApplicationUser.FirstName = request.FirstName;
            patient.ApplicationUser.LastName = request.LastName;
            patient.ApplicationUser.PhoneNumber = request.Phone;
            patient.Phone = request.Phone;
            patient.Address = request.Address;
            patient.City = request.City;
            patient.Gender = request.Gender;
            patient.DateOfBirth = request.DateOfBirth;

            // Şəkil əməliyyatları
            if (request.RemoveImage && !string.IsNullOrEmpty(patient.ImagePath))
            {
                await _fileService.DeletePatientImageAsync(patient.ImagePath);
                patient.ImagePath = null;
            }
            else if (request.Image != null)
            {
                if (!string.IsNullOrEmpty(patient.ImagePath))
                    await _fileService.DeletePatientImageAsync(patient.ImagePath);

                patient.ImagePath = await _fileService.SavePatientImageAsync(request.Image, patient.Id);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new PatientsDto
            {
                Id = patient.Id,
                FullName = $"{patient.ApplicationUser.FirstName} {patient.ApplicationUser.LastName}",
                Email = patient.Email,
                Phone = patient.Phone,
                Gender = patient.Gender,
                City = patient.City,
                Address = patient.Address,
                DateOfBirth = patient.DateOfBirth,
                ImagePath = patient.ImagePath
            };
        }
    }
}
