using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Doctor.Queries
{
    public class GetDoctorWithDetailsQueryHandler : IRequestHandler<GetDoctorWithDetailsQuery, DoctorDetailDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetDoctorWithDetailsQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<DoctorDetailDto> Handle(GetDoctorWithDetailsQuery request, CancellationToken cancellationToken)
        {
            var doctor = await _unitOfWork.Doctors.GetByIdAsync(request.DoctorId);
            if (doctor == null)
            {
                throw new NotFoundException("Doctor not found");
            }

            var educations = await _unitOfWork.DoctorEducations.GetEducationsByDoctorIdAsync(request.DoctorId);
            var skills = await _unitOfWork.DoctorSkills.GetSkillsByDoctorIdAsync(request.DoctorId);

            return new DoctorDetailDto
            {
                Id = doctor.Id,
                FullName = $"{doctor.ApplicationUser.FirstName} {doctor.ApplicationUser.LastName}",
                Specialty = doctor.Specialty,
                Biography = doctor.Biography,
                ImagePath = doctor.ImagePath,
                Email = doctor.ApplicationUser.Email,
                Phone = doctor.ApplicationUser.PhoneNumber,
                DepartmentId = doctor.DepartmentId,
                DepartmentName = doctor.Department.Name,
                Educations = educations.Select(e => new DoctorEducationDto
                {
                    Id = e.Id,
                    DoctorId = e.DoctorId,
                    Year = e.Year,
                    Degree = e.Degree,
                    Institution = e.Institution,
                    Description = e.Description
                }).ToList(),
                Skills = skills.Select(s => new DoctorSkillDto
                {
                    Id = s.Id,
                    DoctorId = s.DoctorId,
                    SkillName = s.SkillName,
                    Category = s.Category
                }).ToList()
            };
        }
    }
}
