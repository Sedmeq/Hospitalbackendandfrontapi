using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Hospital.Domain.Entities
{
    public class Doctor
    {
        public int Id { get; set; }
        public required string Specialty { get; set; }
        public required string Phone { get; set; }
        public required string Email { get; set; }
        public string? ImagePath { get; set; }

        public string? Biography { get; set; }


        // 1. Foreign Key property. the ID of the user.
        // [ForeignKey("ApplicationUser")]
        public required string ApplicationUserId { get; set; }
        public  ApplicationUser ApplicationUser { get; set; }



        //  foreign key property for Department
        public int DepartmentId { get; set; }
        public virtual Department Department { get; set; }

        public virtual ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
        public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

        public virtual ICollection<DoctorEducation> Educations { get; set; } = new List<DoctorEducation>();
        public virtual ICollection<DoctorSkill> Skills { get; set; } = new List<DoctorSkill>();

        // YENİ: Doctor Schedule əlaqəsi
        public virtual ICollection<DoctorSchedule> Schedules { get; set; } = new List<DoctorSchedule>();
    }
}
