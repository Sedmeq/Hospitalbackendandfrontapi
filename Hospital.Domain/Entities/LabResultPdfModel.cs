using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class LabResultPdfModel
    {
        public int LabResultId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public DateTime ResultDate { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public string DoctorName { get; set; } = string.Empty;
        public string DepartmentName { get; set; } = string.Empty;
        public List<LabResultItemRow> Items { get; set; } = new();
    }

    public class LabResultItemRow
    {
        public string TestName { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string ReferenceRange { get; set; } = string.Empty;
        public string Status { get; set; } = "Normal";
    }
}
