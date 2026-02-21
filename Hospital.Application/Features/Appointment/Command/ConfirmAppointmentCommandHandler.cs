using Hangfire;
using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Appointment.Command
{
    public class ConfirmAppointmentCommandHandler : IRequestHandler<ConfirmAppointmentCommand, AppointmentDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;
        private readonly IBackgroundJobClient _backgroundJobClient;
        private readonly INotificationService _notificationService;

        public ConfirmAppointmentCommandHandler(
            IUnitOfWork unitOfWork,
            IUserContextService userContextService,
            IBackgroundJobClient backgroundJobClient,
            INotificationService notificationService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
            _backgroundJobClient = backgroundJobClient;
            _notificationService = notificationService;
        }

        public async Task<AppointmentDto> Handle(ConfirmAppointmentCommand request, CancellationToken cancellationToken)
        {
            var appointment = await _unitOfWork.Appointments.GetByIdAsync(request.AppointmentId);
            if (appointment == null)
                throw new NotFoundException("Appointment not found");

            if (appointment.Status == "Cancelled")
                throw new BadRequestException("Cannot confirm a cancelled appointment.");

            if (appointment.Status == "Confirmed")
                throw new BadRequestException("Appointment is already confirmed.");

            // Yalnız doktor öz appointment-ini təsdiqləyə bilər
            var userId = _userContextService.GetUserId();
            var userRole = _userContextService.GetUserRole();

            if (userRole == "Doctor" && appointment.doctor?.ApplicationUserId != userId)
                throw new UnauthorizedAccessException("You can only confirm your own appointments.");

            appointment.Status = "Confirmed";
            await _unitOfWork.Appointments.UpdateAsync(appointment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Mail göndər - Hangfire background job ilə
            var patientEmail = appointment.patient?.ApplicationUser?.Email
                               ?? appointment.PatientPhone; // fallback

            var patientName = appointment.patient != null
                ? $"{appointment.patient.ApplicationUser.FirstName} {appointment.patient.ApplicationUser.LastName}"
                : appointment.PatientName;

            var doctorName = $"{appointment.doctor.ApplicationUser.FirstName} {appointment.doctor.ApplicationUser.LastName}";

            if (!string.IsNullOrEmpty(patientEmail))
            {
                _backgroundJobClient.Enqueue(() =>
                    _notificationService.SendAppointmentConfirmedAsync(
                        patientEmail,
                        patientName,
                        doctorName,
                        appointment.Date,
                        appointment.Time));
            }

            return new AppointmentDto
            {
                Id = appointment.Id,
                Date = appointment.Date,
                Time = appointment.Time,
                Status = appointment.Status,
                PatientName = patientName,
                PatientPhone = appointment.PatientPhone,
                Message = appointment.Message,
                DoctorId = appointment.DoctorId,
                DoctorName = doctorName,
                PatientId = appointment.PatientId,
                RegisteredPatientName = patientName,
                DepartmentId = appointment.DepartmentId,
                DepartmentName = appointment.Department?.Name ?? string.Empty
            };
        }
    }
}
