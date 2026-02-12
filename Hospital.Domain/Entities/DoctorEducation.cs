using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class DoctorEducation
    {
        public int Id { get; set; }
        public string Year { get; set; } = string.Empty; // "2005-2007"
        public string Degree { get; set; } = string.Empty; // "MBBS, M.D"
        public string Institution { get; set; } = string.Empty; // "University of Wyoming"
        public string Description { get; set; } = string.Empty;

        public int DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; }
    }
}
