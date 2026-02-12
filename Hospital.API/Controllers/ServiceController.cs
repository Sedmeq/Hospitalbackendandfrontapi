using Hospital.Application.Features.Service.Command;
using Hospital.Application.Features.Service.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ServiceController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAllServices")]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _mediator.Send(new GetAllServicesQuery());
            return Ok(services);
        }

        [HttpGet("GetServiceById/{id}")]
        public async Task<IActionResult> GetServiceById(int id)
        {
            var service = await _mediator.Send(new GetServiceByIdQuery { Id = id });
            return Ok(service);
        }

        [HttpPost]
        [Route("CreateService")]
        public async Task<IActionResult> CreateService([FromForm] CreateServiceCommand command)
        {
            var newService = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetServiceById), new { id = newService.Id }, newService);
        }

        [HttpPut("UpdateService/{id}")]
        public async Task<IActionResult> UpdateService(int id, [FromForm] UpdateServiceCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL and body do not match.");
            }

            var updatedService = await _mediator.Send(command);
            return Ok(updatedService);
        }

        [HttpDelete("DeleteService/{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var deletedService = await _mediator.Send(new DeleteServiceCommand { Id = id });
            return Ok($"Service '{deletedService.Title}' was deleted successfully.");

        }
    }
}
