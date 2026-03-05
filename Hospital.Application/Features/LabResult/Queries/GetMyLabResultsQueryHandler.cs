using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.LabResult.Queries
{
    public class GetMyLabResultsQueryHandler : IRequestHandler<GetMyLabResultsQuery, IEnumerable<LabResultDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;

        public GetMyLabResultsQueryHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
        }

        public async Task<IEnumerable<LabResultDto>> Handle(GetMyLabResultsQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User is not authenticated.");

            var patient = await _unitOfWork.Patients.GetByUserIdAsync(userId);
            if (patient == null)
                throw new NotFoundException("Patient profile not found.");

            var results = await _unitOfWork.LabResults.GetByPatientIdAsync(patient.Id);

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
                PatientName = $"{patient.ApplicationUser.FirstName} {patient.ApplicationUser.LastName}",
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
