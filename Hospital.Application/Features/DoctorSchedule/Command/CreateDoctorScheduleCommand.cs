using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorSchedule.Command
{
    public class CreateDoctorScheduleCommand : IRequest<DoctorScheduleDto>
    {
        public int DoctorId { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public string StartTime { get; set; } = string.Empty; // "09:00"
        public string EndTime { get; set; } = string.Empty;   // "17:00"
        public int SlotDurationMinutes { get; set; } = 30;
    }
}
