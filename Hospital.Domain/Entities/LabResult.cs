using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class LabResult
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;         // e.g. "Blood Test", "Urinalysis"
        public string Notes { get; set; } = string.Empty;         // Doctor's notes
        public DateTime ResultDate { get; set; } = DateTime.UtcNow;
        public string? PdfPath { get; set; }                      // wwwroot-relative path

        public int DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; } = null!;

        public int PatientId { get; set; }
        public virtual Patient Patient { get; set; } = null!;

        public int? AppointmentId { get; set; }
        public virtual Appointment? Appointment { get; set; }

        public virtual ICollection<LabResultItem> Items { get; set; } = new List<LabResultItem>();
    }
}
