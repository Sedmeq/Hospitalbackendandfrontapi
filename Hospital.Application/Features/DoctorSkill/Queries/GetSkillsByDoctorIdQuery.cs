using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorSkill.Queries
{
    public class GetSkillsByDoctorIdQuery : IRequest<IEnumerable<DoctorSkillDto>>
    {
        public int DoctorId { get; set; }
    }
}
