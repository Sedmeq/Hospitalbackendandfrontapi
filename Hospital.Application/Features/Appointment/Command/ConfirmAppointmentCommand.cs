using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Appointment.Command
{
    public class ConfirmAppointmentCommand : IRequest<AppointmentDto>
    {
        public int AppointmentId { get; set; }
    }
}
