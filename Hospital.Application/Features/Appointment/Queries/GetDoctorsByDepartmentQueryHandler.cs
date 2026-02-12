using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Appointment.Queries
{
    public class GetDoctorsByDepartmentQueryHandler : IRequestHandler<GetDoctorsByDepartmentQuery, IEnumerable<DoctorDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetDoctorsByDepartmentQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<DoctorDto>> Handle(GetDoctorsByDepartmentQuery request, CancellationToken cancellationToken)
        {
            var doctors = await _unitOfWork.Departments.GetAllDoctorsInSpecificDepartment(request.DepartmentId);

            return doctors.Select(d => new DoctorDto
            {
                Id = d.Id,
                FullName = $"{d.ApplicationUser.FirstName} {d.ApplicationUser.LastName}",
                Specialty = d.Specialty,
                Email = d.ApplicationUser.Email,
                Phone = d.ApplicationUser.PhoneNumber,
                DepartmentId = d.DepartmentId
            }).ToList();
        }
    }
}
