using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Appointment.Queries
{
    public class GetMyAppointmentsQuery : IRequest<IEnumerable<AppointmentDto>>
    {
        // Token-dən UserId götürüləcək, ona görə parametr yoxdur
    }
}
