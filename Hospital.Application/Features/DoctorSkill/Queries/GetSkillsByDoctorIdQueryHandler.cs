using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorSkill.Queries
{
    public class GetSkillsByDoctorIdQueryHandler : IRequestHandler<GetSkillsByDoctorIdQuery, IEnumerable<DoctorSkillDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetSkillsByDoctorIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<DoctorSkillDto>> Handle(GetSkillsByDoctorIdQuery request, CancellationToken cancellationToken)
        {
            var skills = await _unitOfWork.DoctorSkills.GetSkillsByDoctorIdAsync(request.DoctorId);

            return skills.Select(s => new DoctorSkillDto
            {
                Id = s.Id,
                DoctorId = s.DoctorId,
                SkillName = s.SkillName,
                Category = s.Category
            }).ToList();
        }
    }
}
