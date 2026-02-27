using Hospital.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Patient.Command
{
    public class UpdateMyProfileCommand : IRequest<PatientsDto>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string? Address { get; set; }
        public string City { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public IFormFile? Image { get; set; }
        public bool RemoveImage { get; set; }
    }
}
