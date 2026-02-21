using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Appointment.Queries
{
    public class GetMyDoctorAppointmentsQueryHandler : IRequestHandler<GetMyDoctorAppointmentsQuery, IEnumerable<AppointmentDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;

        public GetMyDoctorAppointmentsQueryHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
        }

        public async Task<IEnumerable<AppointmentDto>> Handle(GetMyDoctorAppointmentsQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }

            // User ID-dən Doctor tapırıq
            var doctor = await _unitOfWork.Doctors.GetByUserIdAsync(userId);
            if (doctor == null)
            {
                throw new NotFoundException("Doctor profile not found for this user.");
            }

            // Doctor-a gələn bütün appointment-ləri götürürük
            var appointments = await _unitOfWork.Appointments.GetPatientAppointmentsById(doctor.Id);

            return appointments.Select(x => new AppointmentDto
            {
                Id = x.Id,
                Date = x.Date,
                Time = x.Time,
                Status = x.Status,
                PatientName = x.PatientName,
                PatientPhone = x.PatientPhone,
                Message = x.Message,
                DoctorId = x.DoctorId,
                DoctorName = $"{x.doctor?.ApplicationUser?.FirstName} {x.doctor?.ApplicationUser?.LastName}",
                PatientId = x.PatientId,
                RegisteredPatientName = x.patient != null
                    ? $"{x.patient.ApplicationUser?.FirstName} {x.patient.ApplicationUser?.LastName}"
                    : null,
                DepartmentId = x.DepartmentId,
                DepartmentName = x.Department?.Name ?? string.Empty
            });
        }
    }
}
