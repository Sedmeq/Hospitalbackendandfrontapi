using Hospital.Application.Features.DoctorSchedule.Command;
using Hospital.Application.Features.DoctorSchedule.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class DoctorScheduleController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DoctorScheduleController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("CreateSchedule")]
        public async Task<IActionResult> CreateSchedule([FromBody] CreateDoctorScheduleCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("GetSchedules/{doctorId}")]
        public async Task<IActionResult> GetSchedules(int doctorId)
        {
            var result = await _mediator.Send(new GetDoctorSchedulesQuery { DoctorId = doctorId });
            return Ok(result);
        }

        [HttpGet("GetAvailableSlots")]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] int doctorId, [FromQuery] DateTime date)
        {
            var result = await _mediator.Send(new GetAvailableTimeSlotsQuery
            {
                DoctorId = doctorId,
                Date = date
            });
            return Ok(result);
        }
    }
}
