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
    public class DeleteDoctorSkillCommandHandler : IRequestHandler<DeleteDoctorSkillCommand, bool>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteDoctorSkillCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(DeleteDoctorSkillCommand request, CancellationToken cancellationToken)
        {
            var skill = await _unitOfWork.DoctorSkills.GetByIdAsync(request.Id);
            if (skill == null)
            {
                throw new NotFoundException("Skill not found");
            }

            await _unitOfWork.DoctorSkills.DeleteAsync(skill);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
