using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Doctor.Queries
{
    public class GetMyDoctorProfileQueryHandler : IRequestHandler<GetMyDoctorProfileQuery, DoctorDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;

        public GetMyDoctorProfileQueryHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
        }

        public async Task<DoctorDto> Handle(GetMyDoctorProfileQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User is not authenticated.");

            var doctor = await _unitOfWork.Doctors.GetByUserIdAsync(userId);
            if (doctor == null)
                throw new NotFoundException("Doctor profile not found.");

            return new DoctorDto
            {
                Id = doctor.Id,
                FullName = $"{doctor.ApplicationUser.FirstName} {doctor.ApplicationUser.LastName}",
                Email = doctor.Email,
                Phone = doctor.Phone,
                Specialty = doctor.Specialty,
                Biography = doctor.Biography,
                ImagePath = doctor.ImagePath,
                DepartmentId = doctor.DepartmentId
            };
        }
    }
}
