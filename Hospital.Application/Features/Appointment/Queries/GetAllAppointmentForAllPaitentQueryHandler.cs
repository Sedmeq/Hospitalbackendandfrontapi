using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;

namespace Hospital.Application.Features.Appointment.Queries
{
    public class GetAllAppointmentForAllPaitentQueryHandler : IRequestHandler<GetAllAppointmentForAllPaitentQuery,IEnumerable <AppointmentDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllAppointmentForAllPaitentQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AppointmentDto>> Handle(GetAllAppointmentForAllPaitentQuery request, CancellationToken cancellationToken)
        {
            var appointments = await _unitOfWork.Appointments.GetAllAsync();

            var appointmentDtos = appointments.Select(x => new AppointmentDto
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

            return appointmentDtos;
        }
    }
}
