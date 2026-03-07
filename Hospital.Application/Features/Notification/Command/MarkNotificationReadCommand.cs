using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Notification.Command
{
    public class MarkNotificationReadCommand : IRequest<bool>
    {
        public int Id { get; set; }
    }
}
