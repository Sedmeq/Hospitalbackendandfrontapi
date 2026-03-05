using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class LabResultItem
    {
        public int Id { get; set; }
        public string TestName { get; set; } = string.Empty;      // e.g. "Hemoglobin"
        public string Value { get; set; } = string.Empty;         // e.g. "14.5"
        public string Unit { get; set; } = string.Empty;          // e.g. "g/dL"
        public string ReferenceRange { get; set; } = string.Empty; // e.g. "13.5 - 17.5"
        public string Status { get; set; } = "Normal";            // Normal | High | Low | Critical

        public int LabResultId { get; set; }
        public virtual LabResult LabResult { get; set; } = null!;
    }
}
