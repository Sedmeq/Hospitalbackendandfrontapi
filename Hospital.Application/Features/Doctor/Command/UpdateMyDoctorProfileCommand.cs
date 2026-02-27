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
    public class UpdateMyDoctorProfileCommand : IRequest<DoctorDto>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string? Biography { get; set; }
        public IFormFile? Image { get; set; }
        public bool RemoveImage { get; set; }
    }
}
