using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class Department
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public string Description { get; set; } = string.Empty; // YENİ
        public string ShortDescription { get; set; } = string.Empty; // YENİ
        public string ImagePath { get; set; } = string.Empty; // YENİ
        public List<string> Services { get; set; } = new List<string>();

        public virtual ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
    }
}
