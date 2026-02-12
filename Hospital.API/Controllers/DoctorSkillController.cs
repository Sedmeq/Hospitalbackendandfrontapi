using Hospital.Application.Features.DoctorSkill.Command;
using Hospital.Application.Features.DoctorSkill.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorSkillController : ControllerBase
    {
        private readonly IMediator _mediator;

        public DoctorSkillController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("GetSkillsByDoctorId/{doctorId}")]
        public async Task<IActionResult> GetSkillsByDoctorId(int doctorId)
        {
            var skills = await _mediator.Send(new GetSkillsByDoctorIdQuery { DoctorId = doctorId });
            return Ok(skills);
        }

        [HttpPost("AddSkill")]
        public async Task<IActionResult> AddSkill([FromBody] AddDoctorSkillCommand command)
        {
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetSkillsByDoctorId), new { doctorId = result.DoctorId }, result);
        }

        [HttpDelete("DeleteSkill/{id}")]
        public async Task<IActionResult> DeleteSkill(int id)
        {
            var result = await _mediator.Send(new DeleteDoctorSkillCommand { Id = id });
            return Ok(new { message = "Skill deleted successfully" });
        }
    }
}
