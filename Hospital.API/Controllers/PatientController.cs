using Hospital.Application.Features.Patient.Command;
using Hospital.Application.Features.Patient.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IMediator _mediator;
        public PatientController(IMediator mediator)
        {
            _mediator = mediator;
        }



        [HttpGet("GetAllPatients")]
        public async Task<IActionResult> GetAllPatients()
        {
            var result = await _mediator.Send(new GetAllPatientsQuery());
            return Ok(result);
        }
        [HttpGet("GetPatientById/{id}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            var result = await _mediator.Send(new GetPatientByIdQuery { Id = id });
            return Ok(result);
        }

        [HttpGet("GetPatientByName/{name}")]
        public async Task<IActionResult> GetPatientByName(string name)
        {
            var result = await _mediator.Send(new GetPatientByNameQuery { FullName = name });
            return Ok(result);
        }

        [HttpPost("CreatePatient")]
        public async Task<IActionResult> CreatePatient([FromForm] CreatePatientCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }


        [HttpDelete("DeletePatient/{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var result = await _mediator.Send(new DeletePatientCommand { Id = id });
            return Ok(result);
        }

        [HttpPut("UpdatePatient/{id:int}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromForm] UpdatePatientCommand command)
        {
            if (command.Id != 0 && command.Id != id)
                return BadRequest("Route id and body id do not match.");

            command.Id = id;
            var result = await _mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("Patient-History/{id}")]
        public async Task<IActionResult> PatientHistory(int id)
        {
            var result = await _mediator.Send(new PatientHistoryQuery { PatientId = id });
            return Ok(result);
        }

        [HttpGet("MyProfile")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> GetMyProfile()
        {
            var result = await _mediator.Send(new GetMyProfileQuery());
            return Ok(result);
        }

        [HttpPut("UpdateMyProfile")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> UpdateMyProfile([FromForm] UpdateMyProfileCommand command)
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
    }
}
