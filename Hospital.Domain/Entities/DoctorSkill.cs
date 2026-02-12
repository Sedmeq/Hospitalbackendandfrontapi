using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class DoctorSkill
    {
        public int Id { get; set; }
        public string SkillName { get; set; } = string.Empty; // "International Drug Database"
        public string Category { get; set; } = string.Empty; // "Expertise area", "Technical Skills", etc.

        public int DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; }
    }
}
