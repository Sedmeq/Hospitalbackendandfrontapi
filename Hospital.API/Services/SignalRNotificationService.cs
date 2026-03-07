using Hospital.API.Hubs;
using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Hospital.API.Services
{
    public class SignalRNotificationService : ISignalRNotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public SignalRNotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendNotificationToUserAsync(string userId, NotificationDto notification)
        {
            await _hubContext.Clients
                .Group($"user:{userId}")
                .SendAsync("ReceiveNotification", notification);
        }

        public async Task SendNotificationToGroupAsync(string groupName, NotificationDto notification)
        {
            await _hubContext.Clients
                .Group(groupName)
                .SendAsync("ReceiveNotification", notification);
        }
    }
}
