using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Patient.Queries
{
    public class GetMyProfileQueryHandler : IRequestHandler<GetMyProfileQuery, PatientsDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;

        public GetMyProfileQueryHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
        }

        public async Task<PatientsDto> Handle(GetMyProfileQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User is not authenticated.");

            var patient = await _unitOfWork.Patients.GetByUserIdAsync(userId);
            if (patient == null)
                throw new NotFoundException("Patient profile not found.");

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
                ImagePath = patient.ImagePath // əgər əlavə etmisinizsə
            };
        }
    }
}
