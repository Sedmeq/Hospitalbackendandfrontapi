using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorEducation.Command
{
    public class DeleteDoctorEducationCommandHandler : IRequestHandler<DeleteDoctorEducationCommand, bool>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteDoctorEducationCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(DeleteDoctorEducationCommand request, CancellationToken cancellationToken)
        {
            var education = await _unitOfWork.DoctorEducations.GetByIdAsync(request.Id);
            if (education == null)
            {
                throw new NotFoundException("Education record not found");
            }

            await _unitOfWork.DoctorEducations.DeleteAsync(education);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
