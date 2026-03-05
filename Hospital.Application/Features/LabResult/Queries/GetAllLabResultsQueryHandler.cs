using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.LabResult.Queries
{
    public class GetAllLabResultsQueryHandler : IRequestHandler<GetAllLabResultsQuery, IEnumerable<LabResultDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllLabResultsQueryHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        public async Task<IEnumerable<LabResultDto>> Handle(GetAllLabResultsQuery request, CancellationToken cancellationToken)
        {
            var results = await _unitOfWork.LabResults.GetAllAsync();

            return results.Select(lr => new LabResultDto
            {
                Id = lr.Id,
                Title = lr.Title,
                Notes = lr.Notes,
                ResultDate = lr.ResultDate,
                DoctorId = lr.DoctorId,
                DoctorName = lr.Doctor?.ApplicationUser != null
                    ? $"{lr.Doctor.ApplicationUser.FirstName} {lr.Doctor.ApplicationUser.LastName}"
                    : "",
                PatientId = lr.PatientId,
                PatientName = lr.Patient?.ApplicationUser != null
                    ? $"{lr.Patient.ApplicationUser.FirstName} {lr.Patient.ApplicationUser.LastName}"
                    : "",
                AppointmentId = lr.AppointmentId,
                DownloadUrl = $"/api/LabResult/Download/{lr.Id}",
                Items = lr.Items.Select(i => new LabResultItemDto
                {
                    Id = i.Id,
                    TestName = i.TestName,
                    Value = i.Value,
                    Unit = i.Unit,
                    ReferenceRange = i.ReferenceRange,
                    Status = i.Status
                }).ToList()
            });
        }
    }
}
