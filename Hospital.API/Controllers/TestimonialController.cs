using Hospital.Application.Features.Slider.Command;
using Hospital.Application.Features.Slider.Queries;
using Hospital.Application.Features.Testimonial.Command;
using Hospital.Application.Features.Testimonial.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestimonialController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TestimonialController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAllTestimonial")]
        public async Task<IActionResult> GetAllTestimonials()
        {
            var testimonials = await _mediator.Send(new GetAllTestimonialQuery());
            return Ok(testimonials);
        }

        [HttpGet]
        [Route("GetTestimonialById/{id}")]
        public async Task<IActionResult> GetTestimonialById(int id)
        {
            var testimonial = await _mediator.Send(new GetTestimonailByIdQuery { Id = id });
            return Ok(testimonial);
        }

        [HttpPost]
        [Route("CreateTestimonial")]
        public async Task<IActionResult> CreateSlider([FromForm] CreateTestimonialCommand command)
        {
            var newsTimonialid = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetTestimonialById), new { id = newsTimonialid }, null);

        }

        [HttpPut("UpdateTestimonial/{id}")]
        public async Task<IActionResult> UpdateTestimonial(int id, [FromForm] UpdateTestimonialCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL and body do not match.");
            }
            var updateTestionialDto = await _mediator.Send(command);
            return Ok(updateTestionialDto);
        }


        [HttpDelete("DeleteTestimonial/{id}")]
        public async Task<IActionResult> DeleteTestimonial(int id)
        {
            var deletedTestimonial = await _mediator.Send(new DeleteTestimonialCommand { Id = id });
            return Ok($"Testimonial '{deletedTestimonial.Title}' was deleted successfully.");
        }
    }
}
