using Hospital.Application.Features.About.Command;
using Hospital.Application.Features.About.Queries;
using Hospital.Application.Features.AboutSection.Queries;
using Hospital.Application.Features.Service.Command;
using Hospital.Application.Features.Service.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AboutController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AboutController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAllAbouts")]
        public async Task<IActionResult> GetAllAbouts()
        {
            var abouts = await _mediator.Send(new GetAllAboutQuery());
            return Ok(abouts);
        }

        [HttpGet("GetAboutById/{id}")]
        public async Task<IActionResult> GetAboutById(int id)
        {
            var about = await _mediator.Send(new GetAboutByIdQuery { Id = id });
            return Ok(about);
        }


        [HttpGet("GetActiveAbout")]
        public async Task<IActionResult> GetActiveAbout()
        {
            var about = await _mediator.Send(new GetActiveAboutQuery());
            if (about == null)
            {
                return NotFound("No active about section found.");
            }
            return Ok(about);
        }

        [HttpPost]
        [Route("CreateAbout")]
        public async Task<IActionResult> CreateAbout([FromForm] CreateAboutCommand command)
        {
            var newService = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetAboutById), new { id = newService.Id }, newService);
        }

        [HttpPut("UpdateAbout/{id}")]
        public async Task<IActionResult> UpdateAbout(int id, [FromForm] UpdateAboutCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL and body do not match.");
            }

            var updateAbout = await _mediator.Send(command);
            return Ok(updateAbout);
        }

        [HttpDelete("DeleteAbout/{id}")]
        public async Task<IActionResult> DeleteAbout(int id)
        {
            var deletedAbout = await _mediator.Send(new DeleteAboutCommand { Id = id });
            return Ok($"Service '{deletedAbout.Title}' was deleted successfully.");

        }
    }
}
