using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;

namespace Hospital.Application.Features.Appointment.Queries
{
    public class GetAppointmentByIdQueryHandler : IRequestHandler<GetAppointmentByIdQuery, AppointmentDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAppointmentByIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<AppointmentDto> Handle(GetAppointmentByIdQuery request, CancellationToken cancellationToken)
        {
            var appointment = await _unitOfWork.Appointments.GetByIdAsync(request.AppointmentId);
            if (appointment == null)
            {
                throw new NotFoundException("Appointment not found");
            }

            return new AppointmentDto
            {
                Id = appointment.Id,
                Date = appointment.Date,
                Time = appointment.Time,
                Status = appointment.Status,
                PatientName = appointment.PatientName,
                PatientPhone = appointment.PatientPhone,
                Message = appointment.Message,
                DoctorId = appointment.DoctorId,
                DoctorName = $"{appointment.doctor?.ApplicationUser?.FirstName} {appointment.doctor?.ApplicationUser?.LastName}",
                PatientId = appointment.PatientId,
                RegisteredPatientName = appointment.patient != null
                    ? $"{appointment.patient.ApplicationUser?.FirstName} {appointment.patient.ApplicationUser?.LastName}"
                    : null,
                DepartmentId = appointment.DepartmentId,
                DepartmentName = appointment.Department?.Name ?? string.Empty
            };
        }
    }
}
