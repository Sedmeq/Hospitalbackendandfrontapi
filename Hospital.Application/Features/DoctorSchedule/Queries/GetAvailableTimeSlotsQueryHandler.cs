using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorSchedule.Queries
{
    public class GetAvailableTimeSlotsQueryHandler : IRequestHandler<GetAvailableTimeSlotsQuery, IEnumerable<AvailableTimeSlotDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAvailableTimeSlotsQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AvailableTimeSlotDto>> Handle(GetAvailableTimeSlotsQuery request, CancellationToken cancellationToken)
        {
            var dayOfWeek = request.Date.DayOfWeek;
            var schedule = await _unitOfWork.DoctorSchedules.GetScheduleByDoctorAndDayAsync(request.DoctorId, dayOfWeek);

            if (schedule == null || !schedule.IsActive)
            {
                return new List<AvailableTimeSlotDto>();
            }

            // Həmin gün üçün mövcud appointmentləri al
            var existingAppointments = (await _unitOfWork.Appointments.GetAllAsync())
                .Where(a => a.DoctorId == request.DoctorId
                            && a.Date.Date == request.Date.Date
                            && a.Status != "Cancelled")
                .Select(a => a.Time)
                .ToList();

            // Bütün mümkün slotları yarat
            var slots = new List<AvailableTimeSlotDto>();
            var currentTime = schedule.StartTime;

            while (currentTime < schedule.EndTime)
            {
                var timeString = currentTime.ToString(@"hh\:mm");

                slots.Add(new AvailableTimeSlotDto
                {
                    Date = request.Date,
                    Time = timeString,
                    IsAvailable = !existingAppointments.Contains(timeString)
                });

                currentTime = currentTime.Add(TimeSpan.FromMinutes(schedule.SlotDurationMinutes));
            }

            return slots;
        }
    }
}
