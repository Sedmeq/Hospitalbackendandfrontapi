using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Notification.Command
{
    public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, NotificationDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRNotificationService _signalRNotificationService;

        public CreateNotificationCommandHandler(IUnitOfWork unitOfWork, ISignalRNotificationService signalRNotificationService)
        {
            _unitOfWork = unitOfWork;
            _signalRNotificationService = signalRNotificationService;
        }

        public async Task<NotificationDto> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
        {
            var notification = new Domain.Entities.Notification
            {
                ApplicationUserId = request.ApplicationUserId,
                Type = request.Type,
                Title = request.Title,
                Message = request.Message,
                IsRead = false,
                CreatedAt = System.DateTime.UtcNow
            };

            await _unitOfWork.Notifications.AddAsync(notification);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            var dto = new NotificationDto
            {
                Id = notification.Id,
                Type = notification.Type,
                Title = notification.Title,
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };

            // Signal R ilə real-time göndərişi
            await _signalRNotificationService.SendNotificationToUserAsync(request.ApplicationUserId, dto);

            return dto;
        }
    }
}
