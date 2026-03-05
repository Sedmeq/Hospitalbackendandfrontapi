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
    public class GetMyDoctorLabResultsQueryHandler : IRequestHandler<GetMyDoctorLabResultsQuery, IEnumerable<LabResultDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;

        public GetMyDoctorLabResultsQueryHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
        }

        public async Task<IEnumerable<LabResultDto>> Handle(GetMyDoctorLabResultsQuery request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User is not authenticated.");

            var doctor = await _unitOfWork.Doctors.GetByUserIdAsync(userId);
            if (doctor == null)
                throw new NotFoundException("Doctor profile not found.");

            var results = await _unitOfWork.LabResults.GetByDoctorIdAsync(doctor.Id);

            return results.Select(lr => new LabResultDto
            {
                Id = lr.Id,
                Title = lr.Title,
                Notes = lr.Notes,
                ResultDate = lr.ResultDate,
                DoctorId = lr.DoctorId,
                DoctorName = $"{doctor.ApplicationUser.FirstName} {doctor.ApplicationUser.LastName}",
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
