using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Notification.Command
{
    public class ClearAllNotificationsCommandHandler : IRequestHandler<ClearAllNotificationsCommand, bool>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;

        public ClearAllNotificationsCommandHandler(IUnitOfWork unitOfWork, IUserContextService userContextService)
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
        }

        public async Task<bool> Handle(ClearAllNotificationsCommand request, CancellationToken cancellationToken)
        {
            var userId = _userContextService.GetUserId();
            if (string.IsNullOrEmpty(userId))
                return false;

            var notifications = await _unitOfWork.Notifications.GetByUserIdAsync(userId);

            foreach (var n in notifications)
            {
                await _unitOfWork.Notifications.DeleteAsync(n);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
