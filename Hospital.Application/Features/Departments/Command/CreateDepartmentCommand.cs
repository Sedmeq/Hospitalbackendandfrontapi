using Hospital.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Departments.Command
{
   public class CreateDepartmentCommand :IRequest<DepartmentDto>
    {
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty; // YENİ
        public string ShortDescription { get; set; } = string.Empty; // YENİ
        public List<string> Services { get; set; } = new List<string>(); // YENİ
        public IFormFile? Image { get; set; }
    }
}
