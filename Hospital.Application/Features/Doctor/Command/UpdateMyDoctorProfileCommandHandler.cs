using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Doctor.Command
{
    public class UpdateMyDoctorProfileCommandHandler : IRequestHandler<UpdateMyDoctorProfileCommand, DoctorDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;
        private readonly IFileService _fileService;

        public UpdateMyDoctorProfileCommandHandler(
            IUnitOfWork unitOfWork,
            IUserContextService userContextService,
            IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
            _fileService = fileService;
        }

        public async Task<DoctorDto> Handle(UpdateMyDoctorProfileCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User is not authenticated.");

            var doctor = await _unitOfWork.Doctors.GetByUserIdAsync(userId);
            if (doctor == null)
                throw new NotFoundException("Doctor profile not found.");

            doctor.ApplicationUser.FirstName = request.FirstName;
            doctor.ApplicationUser.LastName = request.LastName;
            doctor.ApplicationUser.PhoneNumber = request.Phone;
            doctor.Phone = request.Phone;
            doctor.Specialty = request.Specialty;
            doctor.Biography = request.Biography;

            if (request.RemoveImage && !string.IsNullOrEmpty(doctor.ImagePath))
            {
                await _fileService.DeleteDoctorImageAsync(doctor.ImagePath);
                doctor.ImagePath = null;
            }
            else if (request.Image != null)
            {
                if (!string.IsNullOrEmpty(doctor.ImagePath))
                    await _fileService.DeleteDoctorImageAsync(doctor.ImagePath);

                doctor.ImagePath = await _fileService.SaveDoctorImageAsync(request.Image, doctor.Id);
            }

            await _unitOfWork.Doctors.UpdateAsync(doctor);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new DoctorDto
            {
                Id = doctor.Id,
                FullName = $"{doctor.ApplicationUser.FirstName} {doctor.ApplicationUser.LastName}",
                Email = doctor.ApplicationUser.Email,
                Phone = doctor.Phone,
                Specialty = doctor.Specialty,
                Biography = doctor.Biography,
                ImagePath = doctor.ImagePath,
                DepartmentId = doctor.DepartmentId
            };
        }
    }
}
