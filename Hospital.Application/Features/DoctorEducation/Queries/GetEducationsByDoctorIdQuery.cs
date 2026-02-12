using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorEducation.Queries
{
    public class GetEducationsByDoctorIdQuery : IRequest<IEnumerable<DoctorEducationDto>>
    {
        public int DoctorId { get; set; }
    }
}
