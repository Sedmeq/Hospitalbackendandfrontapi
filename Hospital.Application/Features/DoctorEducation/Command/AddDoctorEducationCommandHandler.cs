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
    public class AddDoctorEducationCommandHandler : IRequestHandler<AddDoctorEducationCommand, DoctorEducationDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public AddDoctorEducationCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DoctorEducationDto> Handle(AddDoctorEducationCommand request, CancellationToken cancellationToken)
        {
            var doctor = await _unitOfWork.Doctors.GetByIdAsync(request.DoctorId);
            if (doctor == null)
            {
                throw new NotFoundException("Doctor not found");
            }

            var education = new Domain.Entities.DoctorEducation
            {
                DoctorId = request.DoctorId,
                Year = request.Year,
                Degree = request.Degree,
                Institution = request.Institution,
                Description = request.Description
            };

            await _unitOfWork.DoctorEducations.AddAsync(education);
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
