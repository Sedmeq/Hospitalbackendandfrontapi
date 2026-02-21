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
        private readonly IUserContextService _userContextService;

        public BookAppointmentCommandHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
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
                throw new BadRequestException("Selected doctor does not belong to the selected department");
            }


            // 4. Keçmişdə tarix seçilibmi?
            if (request.Date.Date < DateTime.Now.Date)
            {
                throw new BadRequestException("Cannot book appointments in the past");
            }

            // *** YENİ: 5. Doctor həmin gün işləyirmi? ***
            var dayOfWeek = request.Date.DayOfWeek;
            var doctorSchedule = await _unitOfWork.DoctorSchedules
                .GetScheduleByDoctorAndDayAsync(request.DoctorId, dayOfWeek);

            if (doctorSchedule == null || !doctorSchedule.IsActive)
            {
                throw new BadRequestException(
                    $"Doctor is not available on {dayOfWeek}. Please choose another day.");
            }

            // *** YENİ: 6. Seçilən vaxt doctor-un iş saatları arasındadır? ***
            var requestedTime = TimeSpan.Parse(request.Time);

            if (requestedTime < doctorSchedule.StartTime || requestedTime >= doctorSchedule.EndTime)
            {
                throw new BadRequestException(
                    $"Selected time is outside doctor's working hours. " +
                    $"Doctor works from {doctorSchedule.StartTime:hh\\:mm} to {doctorSchedule.EndTime:hh\\:mm} on {dayOfWeek}.");
            }

            // *** YENİ: 7. Seçilən vaxt slot müddətinə uyğundur? ***
            var slotDuration = TimeSpan.FromMinutes(doctorSchedule.SlotDurationMinutes);
            var scheduleStart = doctorSchedule.StartTime;

            bool isValidSlot = false;
            var currentSlot = scheduleStart;

            while (currentSlot < doctorSchedule.EndTime)
            {
                if (currentSlot == requestedTime)
                {
                    isValidSlot = true;
                    break;
                }
                currentSlot = currentSlot.Add(slotDuration);
            }

            if (!isValidSlot)
            {
                throw new BadRequestException(
                    $"Selected time is not a valid slot. Doctor accepts appointments every {doctorSchedule.SlotDurationMinutes} minutes.");
            }

            // *** YENİ: 8. Bu vaxt artıq məşğuldur? ***
            var existingAppointments = await _unitOfWork.Appointments.GetAllAsync();
            var isTimeSlotTaken = existingAppointments.Any(a =>
                a.DoctorId == request.DoctorId &&
                a.Date.Date == request.Date.Date &&
                a.Time == request.Time &&
                a.Status != "Cancelled");

            if (isTimeSlotTaken)
            {
                throw new BadRequestException(
                    "This time slot is already booked. Please choose another time.");
            }

            // 9. Əgər PatientId göndərilibsə, Patient-i yoxla
            //Domain.Entities.Patient? patient = null;
            //if (request.PatientId.HasValue)
            //{
            //    patient = await _unitOfWork.Patients.GetByIdAsync(request.PatientId.Value);
            //    if (patient == null)
            //    {
            //        throw new NotFoundException("Patient not found");
            //    }
            //}
            // ✅ Login olmuş user-in patient profilini tap
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }

            var patient = await _unitOfWork.Patients.GetByUserIdAsync(userId);
            if (patient == null)
            {
                throw new NotFoundException("Patient profile not found for this user.");
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
                //PatientId = request.PatientId,
                PatientId = patient.Id,

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
                //RegisteredPatientName = patient != null
                //    ? $"{patient.ApplicationUser.FirstName} {patient.ApplicationUser.LastName}"
                //    : null,
                RegisteredPatientName = $"{patient.ApplicationUser.FirstName} {patient.ApplicationUser.LastName}",

                DepartmentId = department.Id,
                DepartmentName = department.Name
            };
        }
    }
}
