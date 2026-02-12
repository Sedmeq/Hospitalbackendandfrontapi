using Hospital.Application.Features.DoctorEducation.Command;
using Hospital.Application.Features.DoctorEducation.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorEducationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DoctorEducationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("GetEducationsByDoctorId/{doctorId}")]
        public async Task<IActionResult> GetEducationsByDoctorId(int doctorId)
        {
            var educations = await _mediator.Send(new GetEducationsByDoctorIdQuery { DoctorId = doctorId });
            return Ok(educations);
        }

        [HttpPost("AddEducation")]
        public async Task<IActionResult> AddEducation([FromBody] AddDoctorEducationCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetEducationsByDoctorId), new { doctorId = result.DoctorId }, result);
        }

        [HttpPut("UpdateEducation/{id}")]
        public async Task<IActionResult> UpdateEducation(int id, [FromBody] UpdateDoctorEducationCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID mismatch");
            }

            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("DeleteEducation/{id}")]
        public async Task<IActionResult> DeleteEducation(int id)
        {
            var result = await _mediator.Send(new DeleteDoctorEducationCommand { Id = id });
            return Ok(new { message = "Education deleted successfully" });
        }
    }
}
