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
    public class GetMyPatientsQueryHandler : IRequestHandler<GetMyPatientsQuery, IEnumerable<PatientsDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;

        public GetMyPatientsQueryHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
        }

        public async Task<IEnumerable<PatientsDto>> Handle(GetMyPatientsQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User is not authenticated.");

            // Token-dən doktoru tap
            var doctor = await _unitOfWork.Doctors.GetByUserIdAsync(userId);
            if (doctor == null)
                throw new NotFoundException("Doctor profile not found.");

            // Bu doktora aid bütün appointment-ləri gətir
            var appointments = await _unitOfWork.Appointments
                                                .GetPatientAppointmentsById(doctor.Id);

            // Eyni patienti bir dəfə göstər (distinct) + null yoxlaması
            var patients = appointments
                .Where(a => a.patient != null && a.patient.ApplicationUser != null)
                .GroupBy(a => a.PatientId)
                .Select(g =>
                {
                    var p = g.First().patient;
                    return new PatientsDto
                    {
                        Id = p.Id,
                        FullName = $"{p.ApplicationUser.FirstName} {p.ApplicationUser.LastName}",
                        Email = p.Email,
                        Phone = p.Phone,
                        Gender = p.Gender,
                        City = p.City,
                        Address = p.Address,
                        DateOfBirth = p.DateOfBirth,
                        ImagePath = p.ImagePath
                    };
                })
                .ToList();

            return patients;
        }
    }
}
