using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace Hospital.Application.Features.DoctorSchedule.Command
{
    public class DeleteDoctorScheduleCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}
