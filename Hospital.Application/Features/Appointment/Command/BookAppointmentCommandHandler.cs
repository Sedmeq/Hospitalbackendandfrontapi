using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Hospital.Application.Features.Appointment.Command
{
    public class BookAppointmentCommandHandler : IRequestHandler<BookAppointmentCommand, AppointmentDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public BookAppointmentCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<AppointmentDto> Handle(BookAppointmentCommand request, CancellationToken cancellationToken)
        {
            // Department yoxla
            var department = await _unitOfWork.Departments.GetByIdAsync(request.DepartmentId);
            if (department == null)
            {
                throw new NotFoundException("Department not found");
            }

            // Doctor yoxla
            var doctor = await _unitOfWork.Doctors.GetByIdAsync(request.DoctorId);
            if (doctor == null)
            {
                throw new NotFoundException("Doctor not found");
            }

            // Doctor bu departmentə aiddir?
            if (doctor.DepartmentId != request.DepartmentId)
            {
                throw new InvalidOperationException("Selected doctor does not belong to the selected department");
            }

            // Əgər PatientId göndərilibsə, Patient-i yoxla
            Domain.Entities.Patient? patient = null;
            if (request.PatientId.HasValue)
            {
                patient = await _unitOfWork.Patients.GetByIdAsync(request.PatientId.Value);
                if (patient == null)
                {
                    throw new NotFoundException("Patient not found");
                }
            }

            // Appointment yarat
            var newAppointment = new Domain.Entities.Appointment
            {
                Date = request.Date,
                Time = request.Time,
                Status = "Pending",
                PatientName = request.PatientName,
                PatientPhone = request.PatientPhone,
                Message = request.Message,
                DoctorId = request.DoctorId,
                PatientId = request.PatientId,
                DepartmentId = request.DepartmentId
            };

            await _unitOfWork.Appointments.AddAsync(newAppointment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new AppointmentDto
            {
                Id = newAppointment.Id,
                Date = newAppointment.Date,
                Time = newAppointment.Time,
                Status = newAppointment.Status,
                PatientName = newAppointment.PatientName,
                PatientPhone = newAppointment.PatientPhone,
                Message = newAppointment.Message,
                DoctorId = doctor.Id,
                DoctorName = $"{doctor.ApplicationUser.FirstName} {doctor.ApplicationUser.LastName}",
                PatientId = newAppointment.PatientId,
                RegisteredPatientName = patient != null
                    ? $"{patient.ApplicationUser.FirstName} {patient.ApplicationUser.LastName}"
                    : null,
                DepartmentId = department.Id,
                DepartmentName = department.Name
            };
        }
    }
}
