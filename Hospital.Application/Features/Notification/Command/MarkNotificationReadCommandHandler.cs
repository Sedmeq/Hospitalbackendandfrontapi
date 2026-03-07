using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Notification.Command
{
    public class MarkNotificationReadCommandHandler : IRequestHandler<MarkNotificationReadCommand, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;

        public MarkNotificationReadCommandHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
        }

        public async Task<bool> Handle(MarkNotificationReadCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            var notification = await _unitOfWork.Notifications.GetByIdAsync(request.Id);

            if (notification == null)
                throw new NotFoundException("Notification not found");

            if (notification.ApplicationUserId != userId)
                throw new UnauthorizedAccessException("Not authorized to read this notification");

            notification.IsRead = true;
            await _unitOfWork.Notifications.UpdateAsync(notification);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}

