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

namespace Hospital.Application.Features.Prescription.Command
{
    //public class CreatePrescriptionCommandHandler : IRequestHandler<CreatePrescriptionCommand, int>
    //{
    //    private readonly IUnitOfWork _unitOfWork;
    //    public CreatePrescriptionCommandHandler(IUnitOfWork unitOfWork)
    //    {
    //        _unitOfWork = unitOfWork;
    //    }
    //    public async Task<int> Handle(CreatePrescriptionCommand request, CancellationToken cancellationToken)
    //    {
    //        var appointment = await _unitOfWork.Appointments.GetByIdAsync(request.AppointmentId);
    //        if (appointment == null)
    //        {
    //            throw new NotFoundException("Appointment not found");
    //        }
    //        if (appointment.Status == "Completed" || appointment.Status == "Cancelled")
    //        {
    //            throw new NotFoundException("This appointment has already been completed or cancelled.");
    //        }
    //        if(appointment.PatientId != request.PatientId || appointment.DoctorId != request.DoctorId)
    //        {
    //            throw new NotFoundException("This appointment is not for this patient or doctor");
    //        }
    //        var newPrescription = new Domain.Entities.Prescription()
    //        {
    //            PrescriptionDate = DateTime.Now,
    //            DoctorId = request.DoctorId,
    //            PatientId = request.PatientId

    //        };
    //      await  _unitOfWork.Prescriptions.AddAsync(newPrescription);

    //        foreach (var medicinesDto in request.PrescribedMedicines)
    //        {

    //            var newPrescribedMedicine = new Domain.Entities.PrescribedMedicine
    //            {

    //                Prescription = newPrescription, 
    //                MedicineName = medicinesDto.MedicineName,
    //                Instructions = medicinesDto.Instructions,
    //                Quantity = medicinesDto.Quantity

    //            };

    //            await _unitOfWork.PrescribedMedicines.AddAsync(newPrescribedMedicine);
    //        }
    //        appointment.Status = "Completed";
    //        await _unitOfWork.SaveChangesAsync();

    //        return newPrescription.PrescriptionId;

    //    }
    //}

    public class CreatePrescriptionCommandHandler
        : IRequestHandler<CreatePrescriptionCommand, CreatePrescriptionResult>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPdfService _pdfService;
        private readonly IUserContextService _userContextService;

        public CreatePrescriptionCommandHandler(
            IUnitOfWork unitOfWork,
            IPdfService pdfService,
            IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _pdfService = pdfService;
            _userContextService = userContextService;
        }

        public async Task<CreatePrescriptionResult> Handle(
            CreatePrescriptionCommand request, CancellationToken cancellationToken)
        {
            // 1. Appointment-i tap
            var appointment = await _unitOfWork.Appointments.GetByIdAsync(request.AppointmentId);
            if (appointment == null)
                throw new NotFoundException("Appointment not found");

            if (appointment.Status != "Confirmed")
                throw new BadRequestException("Prescription can only be written for confirmed appointments.");

            // 2. Yalnız həmin appointmentin doktoru yaza bilər
            var userId = _userContextService.GetUserId();
            if (appointment.doctor?.ApplicationUserId != userId)
                throw new UnauthorizedAccessException("You can only write prescriptions for your own appointments.");

            // 3. Prescription yarat
            var prescription = new Domain.Entities.Prescription
            {
                PrescriptionDate = DateTime.UtcNow,
                DoctorId = appointment.DoctorId,
                PatientId = appointment.PatientId ?? 0,
                AppointmentId = appointment.Id,
                IsSold = false,
                PrescribedMedicines = request.Medicines.Select(m => new PrescribedMedicine
                {
                    MedicineName = m.MedicineName,
                    Instructions = m.Instructions,
                    Quantity = m.Quantity
                }).ToList()
            };

            await _unitOfWork.Prescriptions.AddAsync(prescription);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // 4. PDF üçün adları hazırla
            var patientName = appointment.patient != null
                ? $"{appointment.patient.ApplicationUser.FirstName} {appointment.patient.ApplicationUser.LastName}"
                : appointment.PatientName ?? "Patient";

            var doctorName = appointment.doctor != null
                ? $"{appointment.doctor.ApplicationUser.FirstName} {appointment.doctor.ApplicationUser.LastName}"
                : "Doctor";

            var departmentName = appointment.Department?.Name ?? "";

            // 5. PDF yarat və wwwroot/prescriptions/-a yaz
            var pdfModel = new PrescriptionPdfModel
            {
                PrescriptionId = prescription.PrescriptionId,
                PrescriptionDate = prescription.PrescriptionDate,
                PatientName = patientName,
                DoctorName = doctorName,
                DepartmentName = departmentName,
                Medicines = request.Medicines.Select(m => new PrescribedMedicineItem
                {
                    MedicineName = m.MedicineName,
                    Instructions = m.Instructions,
                    Quantity = m.Quantity
                }).ToList()
            };

            var pdfPath = await _pdfService.GeneratePrescriptionPdfAsync(pdfModel);

            // 6. PdfPath-i DB-yə yaz
            prescription.PdfPath = pdfPath;
            await _unitOfWork.Prescriptions.UpdateAsync(prescription);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new CreatePrescriptionResult
            {
                PrescriptionId = prescription.PrescriptionId,
                DownloadUrl = $"/api/Prescription/Download/{prescription.PrescriptionId}"
            };
        }
    }
}
