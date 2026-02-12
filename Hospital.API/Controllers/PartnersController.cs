using Hospital.Application.Features.Partners.Command;
using Hospital.Application.Features.Partners.Queries;
using Hospital.Application.Features.Slider.Command;
using Hospital.Application.Features.Slider.Queries;
using Hospital.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PartnersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public PartnersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAllPartners")]
        public async Task<IActionResult> GetAllPartners()
        {
            var partners = await _mediator.Send(new GetAllPartnersQuery());
            return Ok(partners);
        }

        [HttpGet]
        [Route("GetPartnerById/{id}")]
        public async Task<IActionResult> GetPartnerById(int id)
        {
            var partner = await _mediator.Send(new GetPartnersByIdQuery { Id = id });
            return Ok(partner);
        }

        [HttpPost]
        [Route("CreatePartner")]
        public async Task<IActionResult> CreatePartner([FromForm] CreatePartnersCommand command)
        {
            var newPartnerId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetPartnerById), new { id = newPartnerId }, null);
        }


        [HttpPut("UpdatePartner/{id}")]
        public async Task<IActionResult> UpdatePartner(int id, [FromForm] UpdatePartnersCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL and body do not match.");
            }
            var updatedSliderDto = await _mediator.Send(command);
            return Ok(updatedSliderDto);
        }


        [HttpDelete("DeletePartners/{id}")]
        public async Task<IActionResult> DeletePartner(int id)
        {
            var deletedPartner = await _mediator.Send(new DeletePartnersCommand { Id = id });
            return Ok($"Partner was deleted successfully.");
        }
    }
}
