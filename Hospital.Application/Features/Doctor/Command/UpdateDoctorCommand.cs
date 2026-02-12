using Hospital.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Doctor.Command
{
    public class UpdateDoctorCommand : IRequest<DoctorDto>
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Specialty { get; set; }
        public int DepartmentId { get; set; }
        public string? Biography { get; set; } // YENİ

        public IFormFile? Image { get; set; } // YENİ
        public bool RemoveImage { get; set; }
    }
}
