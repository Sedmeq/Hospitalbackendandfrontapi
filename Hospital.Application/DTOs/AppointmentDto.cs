using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Domain.Entities;

namespace Hospital.Application.DTOs
{
    public class AppointmentDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty; // YENİ
        public string Status { get; set; } = string.Empty;
        public string PatientName { get; set; } = string.Empty; // YENİ
        public string PatientPhone { get; set; } = string.Empty; // YENİ
        public string Message { get; set; } = string.Empty; // YENİ

        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;

        public int? PatientId { get; set; } // YENİ - nullable
        public string? RegisteredPatientName { get; set; } // YENİ - qeydiyyatlı xəstə adı

        public int DepartmentId { get; set; } // YENİ
        public string DepartmentName { get; set; } = string.Empty; // YENİ

    }
}
