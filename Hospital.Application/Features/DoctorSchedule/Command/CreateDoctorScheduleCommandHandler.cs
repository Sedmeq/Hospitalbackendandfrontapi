using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorSchedule.Command
{
    public class CreateDoctorScheduleCommandHandler : IRequestHandler<CreateDoctorScheduleCommand, DoctorScheduleDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateDoctorScheduleCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DoctorScheduleDto> Handle(CreateDoctorScheduleCommand request, CancellationToken cancellationToken)
        {
            var doctor = await _unitOfWork.Doctors.GetByIdAsync(request.DoctorId);
            if (doctor == null)
            {
                throw new NotFoundException("Doctor not found");
            }

            // Eyni gün üçün schedule mövcuddurmu yoxla
            var existing = await _unitOfWork.DoctorSchedules.GetScheduleByDoctorAndDayAsync(request.DoctorId, request.DayOfWeek);
            if (existing != null)
            {
                throw new InvalidOperationException($"Schedule already exists for {request.DayOfWeek}");
            }

            var schedule = new Domain.Entities.DoctorSchedule
            {
                DoctorId = request.DoctorId,
                DayOfWeek = request.DayOfWeek,
                StartTime = TimeSpan.Parse(request.StartTime),
                EndTime = TimeSpan.Parse(request.EndTime),
                SlotDurationMinutes = request.SlotDurationMinutes,
                IsActive = true
            };

            await _unitOfWork.DoctorSchedules.AddAsync(schedule);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new DoctorScheduleDto
            {
                Id = schedule.Id,
                DoctorId = schedule.DoctorId,
                DoctorName = $"{doctor.ApplicationUser.FirstName} {doctor.ApplicationUser.LastName}",
                DayOfWeek = schedule.DayOfWeek,
                DayName = schedule.DayOfWeek.ToString(),
                StartTime = schedule.StartTime.ToString(@"hh\:mm"),
                EndTime = schedule.EndTime.ToString(@"hh\:mm"),
                IsActive = schedule.IsActive,
                SlotDurationMinutes = schedule.SlotDurationMinutes
            };
        }
    }
}
