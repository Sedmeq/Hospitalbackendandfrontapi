using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Application.DTOs;
using MediatR;

namespace Hospital.Application.Features.Appointment.Command
{
    public class BookAppointmentCommand : IRequest<AppointmentDto>
    {
        public int DepartmentId { get; set; } // YENİ
        public int DoctorId { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty; // YENİ - "09:00", "14:30"
        public string PatientName { get; set; } = string.Empty; // YENİ
        public string PatientPhone { get; set; } = string.Empty; // YENİ
        public string Message { get; set; } = string.Empty; // YENİ
        public int? PatientId { get; set; }
    }
}
