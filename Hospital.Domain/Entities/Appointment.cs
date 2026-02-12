using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class Appointment
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public string Time { get; set; } = string.Empty; // YENİ - "09:00", "14:30" kimi
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Completed
        public string PatientName { get; set; } = string.Empty; // YENİ
        public string PatientPhone { get; set; } = string.Empty; // YENİ
        public string Message { get; set; } = string.Empty;


        public int DoctorId { get; set; }
        public virtual Doctor doctor { get; set; }

        public int? NurseId { get; set; }
        public virtual Nurse? Nurse { get; set; }
        public int? PatientId { get; set; }
        public virtual Patient? patient { get; set; }

        public int DepartmentId { get; set; } // YENİ
        public virtual Department Department { get; set; } // YENİ
    }
}
