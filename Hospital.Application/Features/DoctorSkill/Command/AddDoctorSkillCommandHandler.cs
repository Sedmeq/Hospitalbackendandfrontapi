using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorSkill.Command
{
    public class AddDoctorSkillCommandHandler : IRequestHandler<AddDoctorSkillCommand, DoctorSkillDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public AddDoctorSkillCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DoctorSkillDto> Handle(AddDoctorSkillCommand request, CancellationToken cancellationToken)
        {
            var doctor = await _unitOfWork.Doctors.GetByIdAsync(request.DoctorId);
            if (doctor == null)
            {
                throw new NotFoundException("Doctor not found");
            }

            var skill = new Domain.Entities.DoctorSkill
            {
                DoctorId = request.DoctorId,
                SkillName = request.SkillName,
                Category = request.Category
            };

            await _unitOfWork.DoctorSkills.AddAsync(skill);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new DoctorSkillDto
            {
                Id = skill.Id,
                DoctorId = skill.DoctorId,
                SkillName = skill.SkillName,
                Category = skill.Category
            };
        }
    }
}
