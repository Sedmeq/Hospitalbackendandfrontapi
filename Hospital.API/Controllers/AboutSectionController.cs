using Hospital.Application.Features.AboutSection.Command;
using Hospital.Application.Features.AboutSection.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AboutSectionController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AboutSectionController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAllAboutSections")]
        public async Task<IActionResult> GetAllAboutSections()
        {
            var aboutSections = await _mediator.Send(new GetAllAboutSectionsQuery());
            return Ok(aboutSections);
        }

        [HttpGet("GetAboutSectionById/{id}")]
        public async Task<IActionResult> GetAboutSectionById(int id)
        {
            var aboutSection = await _mediator.Send(new GetAboutSectionByIdQuery { Id = id });
            return Ok(aboutSection);
        }

        [HttpGet("GetActiveAboutSection")]
        public async Task<IActionResult> GetActiveAboutSection()
        {
            var aboutSection = await _mediator.Send(new GetActiveAboutSectionQuery());
            if (aboutSection == null)
            {
                return NotFound("No active about section found.");
            }
            return Ok(aboutSection);
        }

        [HttpPost]
        [Route("CreateAboutSection")]
        public async Task<IActionResult> CreateAboutSection([FromForm] CreateAboutSectionCommand command)
        {
            var newAboutSection = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetAboutSectionById), new { id = newAboutSection.Id }, newAboutSection);
        }

        [HttpPut("UpdateAboutSection/{id}")]
        public async Task<IActionResult> UpdateAboutSection(int id, [FromForm] UpdateAboutSectionCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL and body do not match.");
            }

            var updatedAboutSection = await _mediator.Send(command);
            return Ok(updatedAboutSection);
        }

        [HttpDelete("DeleteAboutSection/{id}")]
        public async Task<IActionResult> DeleteAboutSection(int id)
        {
            var deletedAboutSection = await _mediator.Send(new DeleteAboutSectionCommand { Id = id });
            return Ok($"About section '{deletedAboutSection.Title}' was deleted successfully.");
        }
    }
}
