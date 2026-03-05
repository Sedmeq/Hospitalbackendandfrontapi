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
    public class GetLabResultByIdQueryHandler : IRequestHandler<GetLabResultByIdQuery, LabResultDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;

        public GetLabResultByIdQueryHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
        }

        public async Task<LabResultDto> Handle(GetLabResultByIdQuery request, CancellationToken cancellationToken)
        {
            var lr = await _unitOfWork.LabResults.GetWithItemsAsync(request.Id);
            if (lr == null)
                throw new NotFoundException("Lab result not found.");

            // Yetkiləndirmə: Admin hər şeyi görür; Doctor özünüküü; Patient özünüküü
            var userId = _userContextService.GetUserId();
            var role = _userContextService.GetUserRole();

            if (role == "Doctor")
            {
                var doctor = await _unitOfWork.Doctors.GetByUserIdAsync(userId!);
                if (doctor == null || doctor.Id != lr.DoctorId)
                    throw new UnauthorizedAccessException("Access denied.");
            }
            else if (role == "Patient")
            {
                var patient = await _unitOfWork.Patients.GetByUserIdAsync(userId!);
                if (patient == null || patient.Id != lr.PatientId)
                    throw new UnauthorizedAccessException("Access denied.");
            }

            return ToDto(lr);
        }

        private static LabResultDto ToDto(Domain.Entities.LabResult lr) => new()
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
        };
    }
}
