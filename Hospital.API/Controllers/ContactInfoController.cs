using Hospital.Application.Features.ContactInfo.Command;
using Hospital.Application.Features.ContactInfo.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactInfoController : Controller
    {
        private readonly IMediator _mediator;

        public ContactInfoController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAllContactInfos")]
        public async Task<IActionResult> GetAllContactInfos()
        {
            var contactInfos = await _mediator.Send(new GetAllContactInfoQuery());
            return Ok(contactInfos);
        }

        [HttpGet("GetContactInfoById/{id}")]
        public async Task<IActionResult> GetContactInfoById(int id)
        {
            var contactInfo = await _mediator.Send(new GetContactInfoByIdQuery { Id = id });
            return Ok(contactInfo);
        }


        [HttpGet("GetActiveContactInfo")]
        public async Task<IActionResult> GetActiveContactInfo()
        {
            var contactInfo = await _mediator.Send(new GetContactInfoQuery());
            if (contactInfo == null)
            {
                return NotFound("No active about section found.");
            }
            return Ok(contactInfo);
        }

        [HttpPost]
        [Route("CreateAbout")]
        public async Task<IActionResult> CreateAbout([FromForm] CreateContactInfoCommand command)
        {
            var newService = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetContactInfoById), new { id = newService.Id }, newService);
        }

        [HttpPut("UpdateContactInfo/{id}")]
        public async Task<IActionResult> UpdateContactInfo(int id, [FromForm] UpdateContactInfoCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL and body do not match.");
            }

            var updateContactInfo = await _mediator.Send(command);
            return Ok(updateContactInfo);
        }

        [HttpDelete("DeleteContactInfo/{id}")]
        public async Task<IActionResult> DeleteContactInfo(int id)
        {
            var deletedContactInfo = await _mediator.Send(new DeleteContactInfoCommand { Id = id });
            return Ok($"Contact info was deleted successfully.");

        }
    }
}
