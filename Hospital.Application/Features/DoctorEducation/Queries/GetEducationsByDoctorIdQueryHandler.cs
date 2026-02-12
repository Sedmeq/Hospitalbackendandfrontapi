using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorEducation.Queries
{
    public class GetEducationsByDoctorIdQueryHandler : IRequestHandler<GetEducationsByDoctorIdQuery, IEnumerable<DoctorEducationDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetEducationsByDoctorIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<DoctorEducationDto>> Handle(GetEducationsByDoctorIdQuery request, CancellationToken cancellationToken)
        {
            var educations = await _unitOfWork.DoctorEducations.GetEducationsByDoctorIdAsync(request.DoctorId);

            return educations.Select(e => new DoctorEducationDto
            {
                Id = e.Id,
                DoctorId = e.DoctorId,
                Year = e.Year,
                Degree = e.Degree,
                Institution = e.Institution,
                Description = e.Description
            }).ToList();
        }
    }
}
