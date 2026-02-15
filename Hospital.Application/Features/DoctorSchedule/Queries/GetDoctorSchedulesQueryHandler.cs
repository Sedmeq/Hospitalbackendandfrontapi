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
    public class GetDoctorSchedulesQueryHandler : IRequestHandler<GetDoctorSchedulesQuery, IEnumerable<DoctorScheduleDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetDoctorSchedulesQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<DoctorScheduleDto>> Handle(GetDoctorSchedulesQuery request, CancellationToken cancellationToken)
        {
            var schedules = await _unitOfWork.DoctorSchedules.GetSchedulesByDoctorIdAsync(request.DoctorId);

            return schedules.Select(s => new DoctorScheduleDto
            {
                Id = s.Id,
                DoctorId = s.DoctorId,
                DoctorName = $"{s.Doctor.ApplicationUser.FirstName} {s.Doctor.ApplicationUser.LastName}",
                DayOfWeek = s.DayOfWeek,
                DayName = s.DayOfWeek.ToString(),
                StartTime = s.StartTime.ToString(@"hh\:mm"),
                EndTime = s.EndTime.ToString(@"hh\:mm"),
                IsActive = s.IsActive,
                SlotDurationMinutes = s.SlotDurationMinutes
            }).ToList();
        }
    }
}
