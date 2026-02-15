using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorSchedule.Queries
{
    public class GetAvailableTimeSlotsQuery : IRequest<IEnumerable<AvailableTimeSlotDto>>
    {
        public int DoctorId { get; set; }
        public DateTime Date { get; set; }
    }
}
