using Hospital.Application.Features.Prescription.Command;
using Hospital.Application.Features.Prescription.Queries;
using Hospital.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    //[Route("api/[controller]")]
    //[ApiController]
    //public class PrescriptionController : ControllerBase
    //{
    //    private readonly IMediator _mediator;
    //    public PrescriptionController(IMediator mediator)
    //    {
    //        _mediator = mediator;
    //    }

    //    [HttpPost("Create-Prescription")]
    //    public async Task<IActionResult> CreatePrescription([FromBody] CreatePrescriptionCommand command)
    //    {
    //        var response = await _mediator.Send(command);
    //        return Ok(response);
    //    }

    //    [HttpGet("GetById/{id}")]
    //    public async Task<IActionResult> GetPrescriptionById(int id)
    //    {
    //        var response = await _mediator.Send(new GetPrescriptionByIdQuery { PrescriptionId = id });
    //        return Ok(response);
    //    }

    //    [HttpPost("prescriptions/dispense")]
    //   // [Authorize(Roles = "Pharmacist")]
    //    public async Task<IActionResult> DispensePrescription([FromBody] DispensePrescriptionCommand command)
    //    {
    //        var bill = await _mediator.Send(command);
    //        return Ok(bill);
    //    }


    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PrescriptionController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IWebHostEnvironment _env;

        public PrescriptionController(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            IWebHostEnvironment env)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _env = env;
        }

        /// <summary>
        /// Doctor prescription yazır. Appointment "Confirmed" olmalıdır.
        /// </summary>
        [HttpPost("Create")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Create([FromBody] CreatePrescriptionCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        /// <summary>
        /// PDF-i yükləyir. Patient, Doctor və Admin istifadə edə bilər.
        /// </summary>
        [HttpGet("Download/{id}")]
        [Authorize(Roles = "Patient,Doctor,Admin")]
        public async Task<IActionResult> Download(int id)
        {
            var prescription = await _unitOfWork.Prescriptions.GetByIdAsync(id);
            if (prescription == null)
                return NotFound(new { message = "Prescription not found" });

            if (string.IsNullOrEmpty(prescription.PdfPath))
                return NotFound(new { message = "PDF has not been generated yet" });

            var fullPath = Path.Combine(_env.WebRootPath, prescription.PdfPath);
            if (!System.IO.File.Exists(fullPath))
                return NotFound(new { message = "PDF file not found on server" });

            var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            var fileName = Path.GetFileName(fullPath);

            return File(fileBytes, "application/pdf", fileName);
        }

        /// <summary>
        /// Patient özünə yazılmış bütün prescriptionları görür.
        /// </summary>
        [HttpGet("MyPrescriptions")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> MyPrescriptions()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            // Patient entity-sindən patientId-ni tap
            var patient = await _unitOfWork.Patients.GetByUserIdAsync(userId);
            if (patient == null)
                return NotFound(new { message = "Patient profile not found" });

            var prescriptions = await _unitOfWork.Prescriptions.GetByPatientIdAsync(patient.Id);

            var result = prescriptions.Select(p => new
            {
                p.PrescriptionId,
                p.PrescriptionDate,
                DoctorName = p.Doctor?.ApplicationUser != null
                    ? $"{p.Doctor.ApplicationUser.FirstName} {p.Doctor.ApplicationUser.LastName}"
                    : "",
                DepartmentName = p.Appointment?.Department?.Name ?? "",
                Medicines = p.PrescribedMedicines.Select(m => new
                {
                    m.MedicineName,
                    m.Instructions,
                    m.Quantity
                }),
                DownloadUrl = $"/api/Prescription/Download/{p.PrescriptionId}"
            });

            return Ok(result);
        }


        //new
        [HttpGet("ByAppointment/{appointmentId}")]
        [Authorize(Roles = "Doctor,Admin,Patient")]
        public async Task<IActionResult> ByAppointment(int appointmentId)
        {
            var p = await _unitOfWork.Prescriptions.GetByAppointmentIdAsync(appointmentId);
            if (p == null) return Ok(null);

            return Ok(new
            {
                p.PrescriptionId,
                p.PrescriptionDate,
                DownloadUrl = $"/api/Prescription/Download/{p.PrescriptionId}"
            });
        }
    }

}
