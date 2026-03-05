using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.LabResult.Command
{
    public class CreateLabResultCommandHandler : IRequestHandler<CreateLabResultCommand, LabResultDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILabPdfService _labPdfService;
        private readonly IUserContextService _userContextService;

        public CreateLabResultCommandHandler(
            IUnitOfWork unitOfWork,
            ILabPdfService labPdfService,
            IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _labPdfService = labPdfService;
            _userContextService = userContextService;
        }

        public async Task<LabResultDto> Handle(CreateLabResultCommand request, CancellationToken cancellationToken)
        {
            // 1. Token-dən doktoru tap
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                throw new UnauthorizedAccessException("User is not authenticated.");

            var doctor = await _unitOfWork.Doctors.GetByUserIdAsync(userId);
            if (doctor == null)
                throw new NotFoundException("Doctor profile not found.");

            // 2. Patient-i yoxla
            var patient = await _unitOfWork.Patients.GetByIdAsync(request.PatientId);
            if (patient == null)
                throw new NotFoundException("Patient not found.");

            // 3. Appointment varsa yoxla (optional)
            if (request.AppointmentId.HasValue)
            {
                var appointment = await _unitOfWork.Appointments.GetByIdAsync(request.AppointmentId.Value);
                if (appointment == null)
                    throw new NotFoundException("Appointment not found.");

                if (appointment.Status != "Confirmed")
                    throw new BadRequestException("Lab results can only be added for confirmed appointments.");

                if (appointment.doctor?.ApplicationUserId != userId)
                    throw new UnauthorizedAccessException("You can only add lab results for your own appointments.");
            }

            // 4. LabResult entity-sini yarat
            var labResult = new Domain.Entities.LabResult
            {
                Title = request.Title,
                Notes = request.Notes,
                ResultDate = request.ResultDate,
                DoctorId = doctor.Id,
                PatientId = request.PatientId,
                AppointmentId = request.AppointmentId,
                Items = request.Items.Select(i => new LabResultItem
                {
                    TestName = i.TestName,
                    Value = i.Value,
                    Unit = i.Unit,
                    ReferenceRange = i.ReferenceRange,
                    Status = i.Status
                }).ToList()
            };

            await _unitOfWork.LabResults.AddAsync(labResult);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // 5. PDF yarat
            var patientName = $"{patient.ApplicationUser.FirstName} {patient.ApplicationUser.LastName}";
            var doctorName = $"{doctor.ApplicationUser.FirstName} {doctor.ApplicationUser.LastName}";
            var departmentName = doctor.Department?.Name ?? "";

            var pdfModel = new LabResultPdfModel
            {
                LabResultId = labResult.Id,
                Title = labResult.Title,
                Notes = labResult.Notes,
                ResultDate = labResult.ResultDate,
                PatientName = patientName,
                DoctorName = doctorName,
                DepartmentName = departmentName,
                Items = request.Items.Select(i => new LabResultItemRow
                {
                    TestName = i.TestName,
                    Value = i.Value,
                    Unit = i.Unit,
                    ReferenceRange = i.ReferenceRange,
                    Status = i.Status
                }).ToList()
            };

            var pdfPath = await _labPdfService.GenerateLabResultPdfAsync(pdfModel);

            // 6. PDF yolunu DB-yə yaz
            labResult.PdfPath = pdfPath;
            await _unitOfWork.LabResults.UpdateAsync(labResult);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return MapToDto(labResult, doctorName, patientName);
        }

        private static LabResultDto MapToDto(Domain.Entities.LabResult lr, string doctorName, string patientName)
        {
            return new LabResultDto
            {
                Id = lr.Id,
                Title = lr.Title,
                Notes = lr.Notes,
                ResultDate = lr.ResultDate,
                DoctorId = lr.DoctorId,
                DoctorName = doctorName,
                PatientId = lr.PatientId,
                PatientName = patientName,
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
}
