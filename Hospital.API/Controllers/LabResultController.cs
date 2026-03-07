using Hospital.API.Hubs;
using Hospital.Application.Features.LabResult.Command;
using Hospital.Application.Features.LabResult.Queries;
using Hospital.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Hospital.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LabResultController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILabPdfService _labPdfService;

        public LabResultController(
            IMediator mediator,
            IUnitOfWork unitOfWork,
            ILabPdfService labPdfService)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
            _labPdfService = labPdfService;
        }

        // ──────────────────────────────────────────────────
        // POST /api/LabResult/Create
        // ──────────────────────────────────────────────────
        /// <summary>
        /// Doctor yeni lab nəticəsi yaradır. Appointment varsa "Confirmed" olmalıdır.
        /// </summary>
        [HttpPost("Create")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> Create([FromBody] CreateLabResultCommand command)
        {
            var result = await _mediator.Send(command);

            // Patient-ə real-time & persistent notification
            var patient = await _unitOfWork.Patients.GetByIdAsync(result.PatientId);
            if (patient?.ApplicationUserId != null)
            {
                await _mediator.Send(new Hospital.Application.Features.Notification.Command.CreateNotificationCommand
                {
                    ApplicationUserId = patient.ApplicationUserId,
                    Type = "lab",
                    Title = "🧪 Yeni Laboratoriya Nəticəsi",
                    Message = $"'{result.Title}' adlı yeni lab nəticəniz hazırdır."
                });
            }

            return Ok(result);
        }

        // ──────────────────────────────────────────────────
        // GET /api/LabResult/{id}
        // ──────────────────────────────────────────────────
        /// <summary>
        /// Lab nəticəsini ID ilə əldə edir.
        /// Patient yalnız özününkünü, Doctor yalnız özününkünü, Admin hamısını görür.
        /// </summary>
        [HttpGet("{id:int}")]
        [Authorize(Roles = "Patient,Doctor,Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mediator.Send(new GetLabResultByIdQuery { Id = id });
            return Ok(result);
        }

        // ──────────────────────────────────────────────────
        // GET /api/LabResult/My       (Patient)
        // ──────────────────────────────────────────────────
        /// <summary>
        /// Patient token-i ilə özünə aid bütün lab nəticələrini görür.
        /// </summary>
        [HttpGet("My")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMyLabResults()
        {
            var result = await _mediator.Send(new GetMyLabResultsQuery());
            return Ok(result);
        }

        // ──────────────────────────────────────────────────
        // GET /api/LabResult/MyDoctor  (Doctor)
        // ──────────────────────────────────────────────────
        /// <summary>
        /// Doctor token-i ilə özünün yaratdığı bütün lab nəticələrini görür.
        /// </summary>
        [HttpGet("MyDoctor")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetMyDoctorLabResults()
        {
            var result = await _mediator.Send(new GetMyDoctorLabResultsQuery());
            return Ok(result);
        }

        // ──────────────────────────────────────────────────
        // GET /api/LabResult           (Admin)
        // ──────────────────────────────────────────────────
        /// <summary>
        /// Admin bütün lab nəticələrini görür.
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mediator.Send(new GetAllLabResultsQuery());
            return Ok(result);
        }

        // ──────────────────────────────────────────────────
        // GET /api/LabResult/Download/{id}
        // ──────────────────────────────────────────────────
        /// <summary>
        /// Lab nəticəsinin PDF-ini yükləyir.
        /// Patient yalnız özününkünü, Doctor yalnız özününkünü, Admin hamısını yükləyə bilər.
        /// PDF wwwroot/lab-results/ altında saxlanılır; ILabPdfService.GetPdfFullPath() vasitəsilə oxunur.
        /// </summary>
        [HttpGet("Download/{id:int}")]
        [Authorize(Roles = "Patient,Doctor,Admin")]
        public async Task<IActionResult> Download(int id)
        {
            // 1. DB-dən lab nəticəsini tap
            var labResult = await _unitOfWork.LabResults.GetWithItemsAsync(id);
            if (labResult == null)
                return NotFound(new { message = "Lab result not found." });

            // 2. PDF path yoxlanışı
            if (string.IsNullOrWhiteSpace(labResult.PdfPath))
                return NotFound(new { message = "PDF has not been generated for this lab result." });

            // 3. wwwroot altındakı tam fiziki yolu al
            var fullPath = _labPdfService.GetPdfFullPath(labResult.PdfPath);
            if (!System.IO.File.Exists(fullPath))
                return NotFound(new { message = "PDF file could not be found on the server." });

            // 4. Faylı oxu və göndər
            var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            var fileName = Path.GetFileName(fullPath);

            // Content-Disposition: "inline" brauzerdə açır, "attachment" endirir
            Response.Headers.Add("Content-Disposition", $"inline; filename=\"{fileName}\"");
            return File(fileBytes, "application/pdf", fileName);
        }

        // ──────────────────────────────────────────────────
        // DELETE /api/LabResult/{id}
        // ──────────────────────────────────────────────────
        /// <summary>
        /// Lab nəticəsini silir. Həm DB record-u, həm wwwroot/lab-results/ altındakı PDF silinir.
        /// Doctor yalnız özününkünü, Admin hamısını silə bilər.
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Doctor,Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            await _mediator.Send(new DeleteLabResultCommand { Id = id });
            return Ok(new { message = "Lab result and its PDF have been deleted successfully." });
        }
    }
}
