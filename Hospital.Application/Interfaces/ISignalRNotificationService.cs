using Hospital.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface ISignalRNotificationService
    {
        Task SendNotificationToUserAsync(string userId, NotificationDto notification);
        Task SendNotificationToGroupAsync(string groupName, NotificationDto notification);
    }
}
