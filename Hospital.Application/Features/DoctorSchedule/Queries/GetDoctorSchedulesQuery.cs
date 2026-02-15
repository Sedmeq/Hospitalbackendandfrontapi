using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorSchedule.Queries
{
    public class GetDoctorSchedulesQuery : IRequest<IEnumerable<DoctorScheduleDto>>
    {
        public int DoctorId { get; set; }
    }
}
