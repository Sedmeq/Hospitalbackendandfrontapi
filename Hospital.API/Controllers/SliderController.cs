using Hospital.Application.Features.Slider.Command;
using Hospital.Application.Features.Slider.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SliderController : ControllerBase
    {
        private readonly IMediator _mediator;

        public SliderController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [Route("GetAllSliders")]
        public async Task<IActionResult> GetAllSliders()
        {
            var sliders = await _mediator.Send(new GetAllSliderQuery());
            return Ok(sliders);
        }

        [HttpGet]
        [Route("GetSliderById/{id}")]
        public async Task<IActionResult> GetSliderById(int id)
        {
            var slider = await _mediator.Send(new GetSliderByIdQuery { Id = id });
            return Ok(slider);
        }

        [HttpPost]
        [Route("CreateSlider")]
        public async Task<IActionResult> CreateSlider([FromForm] CreateSliderCommand command)
        {
            var newSliderId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetSliderById), new { id = newSliderId }, null);
        }


        [HttpPut("UpdateSlider/{id}")]
        public async Task<IActionResult> UpdateSlider(int id, [FromForm] UpdateSliderCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("ID in URL and body do not match.");
            }
            var updatedSliderDto = await _mediator.Send(command);
            return Ok(updatedSliderDto);
        }


        [HttpDelete("DeleteSlider/{id}")]
        public async Task<IActionResult> DeleteSlider(int id)
        {
            var deletedSlider = await _mediator.Send(new DeleteSliderCommand { Id = id });
            return Ok($"Slider '{deletedSlider.Title}' was deleted successfully.");
        }
    }
}
