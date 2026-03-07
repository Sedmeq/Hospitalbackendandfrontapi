using Hospital.API.Hubs;
using Hospital.Application.Features.Appointment.Command;
using Hospital.Application.Features.Appointment.Queries;
using Hospital.Application.Features.Doctor.Queries;
using Hospital.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;


namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Ümumi Authorization
    public class AppointmentController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IUnitOfWork _unitOfWork;

        public AppointmentController(IMediator mediator,
            IUnitOfWork unitOfWork)
        {
            _mediator = mediator;
            _unitOfWork = unitOfWork;
        }

        // Hər kəs öz appointment-ini yarada bilər
        [HttpPost("BookAppointment")]
        public async Task<IActionResult> BookAppointment([FromBody] BookAppointmentCommand command)
        {
            var result = await _mediator.Send(command);

            // Doctor-a real-time & persistent notification göndər
            var doctor = await _unitOfWork.Doctors.GetByIdAsync(result.DoctorId);
            if (doctor?.ApplicationUserId != null)
            {
                var patientName = !string.IsNullOrEmpty(result.RegisteredPatientName)
                    ? result.RegisteredPatientName
                    : result.PatientName;

                await _mediator.Send(new Hospital.Application.Features.Notification.Command.CreateNotificationCommand
                {
                    ApplicationUserId = doctor.ApplicationUserId,
                    Type = "appointment",
                    Title = "📅 Yeni Randevu",
                    Message = $"Sizə {patientName} tərəfindən {result.Date:dd MMM yyyy} tarixi üçün yeni randevu yazıldı."
                });
            }

            return Ok(result);
        }

        // Hər kəs öz appointment-ini ləğv edə bilər
        [HttpDelete("CancelAppointment/{id}")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var result = await _mediator.Send(new CancelAppointmentCommand { AppointmentId = id });
            return Ok(result);
        }

        // Yalnız Admin bütün appointment-ləri görə bilər
        [HttpGet("GetAllAppointments")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAppointments()
        {
            var result = await _mediator.Send(new GetAllAppointmentForAllPaitentQuery());
            return Ok(result);
        }

        // Patient öz appointment-lərini görür
        [HttpGet("GetMyAppointments")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var result = await _mediator.Send(new GetMyAppointmentsQuery());
            return Ok(result);
        }

        // Doctor özünə gələn appointment-ləri görür
        [HttpGet("GetMyDoctorAppointments")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetMyDoctorAppointments()
        {
            var result = await _mediator.Send(new GetMyDoctorAppointmentsQuery());
            return Ok(result);
        }

        // Hər kəs öz appointment-inin detallarını görə bilər
        [HttpGet("GetAppointmentById/{id}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            var result = await _mediator.Send(new GetAppointmentByIdQuery { AppointmentId = id });
            return Ok(result);
        }

        // Admin və Doctor üçün - Doktorun patient-lərini görmək
        [HttpGet("GetPatientsByDoctorId/{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> GetAppointmentPatientById(int id)
        {
            var result = await _mediator.Send(new GetPatientsByDoctorIdQuery { DoctorId = id });
            return Ok(result);
        }

        // Department üzrə doktorları görmək (public ola bilər)
        [HttpGet("GetDoctorsByDepartment/{departmentId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDoctorsByDepartment(int departmentId)
        {
            var result = await _mediator.Send(new GetDoctorsByDepartmentQuery { DepartmentId = departmentId });
            return Ok(result);
        }



        [HttpPut("ConfirmAppointment/{id}")]
        [Authorize(Roles = "Doctor,Admin")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var result = await _mediator.Send(new ConfirmAppointmentCommand { AppointmentId = id });

            // Patient-ə real-time & persistent notification
            if (result.PatientId.HasValue)
            {
                var patient = await _unitOfWork.Patients.GetByIdAsync(result.PatientId.Value);
                if (patient?.ApplicationUserId != null)
                {
                    await _mediator.Send(new Hospital.Application.Features.Notification.Command.CreateNotificationCommand
                    {
                        ApplicationUserId = patient.ApplicationUserId,
                        Type = "appointment",
                        Title = "✅ Randevu Təsdiqləndi",
                        Message = $"Sizin {result.Date:dd MMM yyyy} tarixli randevunuz təsdiqləndi."
                    });
                }
            }

            return Ok(result);
        }
    }
}
