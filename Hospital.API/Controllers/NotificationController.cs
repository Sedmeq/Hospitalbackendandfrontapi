using Hospital.Application.Features.Notification.Command;
using Hospital.Application.Features.Notification.Queries;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hospital.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public NotificationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet("My")]
        public async Task<IActionResult> GetMyNotifications()
        {
            var result = await _mediator.Send(new GetMyNotificationsQuery());
            return Ok(result);
        }

        [HttpPut("Read/{id}")]
        public async Task<IActionResult> MarkRead(int id)
        {
            var result = await _mediator.Send(new MarkNotificationReadCommand { Id = id });
            return Ok(result);
        }

        [HttpPut("ReadAll")]
        public async Task<IActionResult> MarkAllRead()
        {
            var result = await _mediator.Send(new MarkAllNotificationsReadCommand());
            return Ok(result);
        }

        [HttpDelete("ClearAll")]
        public async Task<IActionResult> ClearAll()
        {
            var result = await _mediator.Send(new ClearAllNotificationsCommand());
            return Ok(result);
        }
    }
}
