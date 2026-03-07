using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Notification.Command
{
    public class CreateNotificationCommand : IRequest<NotificationDto>
    {
        public required string ApplicationUserId { get; set; }
        public required string Type { get; set; }
        public required string Title { get; set; }
        public required string Message { get; set; }
    }
}
