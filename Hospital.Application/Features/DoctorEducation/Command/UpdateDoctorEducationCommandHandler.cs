using Hospital.Application.DTOs;
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
    public class UpdateDoctorEducationCommandHandler : IRequestHandler<UpdateDoctorEducationCommand, DoctorEducationDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateDoctorEducationCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DoctorEducationDto> Handle(UpdateDoctorEducationCommand request, CancellationToken cancellationToken)
        {
            var education = await _unitOfWork.DoctorEducations.GetByIdAsync(request.Id);
            if (education == null)
            {
                throw new NotFoundException("Education record not found");
            }

            education.Year = request.Year;
            education.Degree = request.Degree;
            education.Institution = request.Institution;
            education.Description = request.Description;

            await _unitOfWork.DoctorEducations.UpdateAsync(education);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new DoctorEducationDto
            {
                Id = education.Id,
                DoctorId = education.DoctorId,
                Year = education.Year,
                Degree = education.Degree,
                Institution = education.Institution,
                Description = education.Description
            };
        }
    }

}
