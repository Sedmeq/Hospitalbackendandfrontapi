using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.DTOs
{
    public class DoctorDetailDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string Biography { get; set; } = string.Empty;
        public string ImagePath { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;

        public List<DoctorEducationDto> Educations { get; set; } = new List<DoctorEducationDto>();
        public List<DoctorSkillDto> Skills { get; set; } = new List<DoctorSkillDto>();
    }
}
