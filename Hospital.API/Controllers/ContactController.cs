using Hospital.Application.Features.Contact.Command;
using Hospital.Application.Features.Contact.Queries;
using Hospital.Application.Features.Slider.Command;
using Hospital.Application.Features.Slider.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ContactController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAllConact")]
        public async Task<IActionResult> GetAllContact()
        {
            var contact = await _mediator.Send(new GetAllContactQuery());
            return Ok(contact);
        }


        [HttpGet]
        [Route("GetContactById/{id}")]
        public async Task<IActionResult> GetContactById(int id)
        {
            var contact = await _mediator.Send(new GetContactByIdQuery { Id = id });
            return Ok(contact);
        }

        [HttpPost]
        [Route("CreateContact")]
        public async Task<IActionResult> CreateContact([FromBody] CreateContactCommand command)
        {
            var newContactId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetContactById), new { id = newContactId }, null);
        }

        [HttpDelete("DeleteContact/{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            var deletedContact = await _mediator.Send(new DeleteContactCommand { Id = id });
            return Ok($"Contact '{deletedContact.Name}' was deleted successfully.");
        }
    }
}
