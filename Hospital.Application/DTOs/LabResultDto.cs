using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.DTOs
{
    public class LabResultDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime ResultDate { get; set; }
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public int? AppointmentId { get; set; }
        public string? DownloadUrl { get; set; }
        public List<LabResultItemDto> Items { get; set; } = new();
    }

    public class LabResultItemDto
    {
        public int Id { get; set; }
        public string TestName { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string ReferenceRange { get; set; } = string.Empty;
        public string Status { get; set; } = "Normal";
    }
}
