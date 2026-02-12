using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorEducation.Command
{
    public class UpdateDoctorEducationCommand : IRequest<DoctorEducationDto>
    {
        public int Id { get; set; }
        public string Year { get; set; } = string.Empty;
        public string Degree { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
