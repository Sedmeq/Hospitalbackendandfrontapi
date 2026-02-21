using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;

namespace Hospital.Application.Features.DoctorSchedule.Command
{
    public class DeleteDoctorScheduleCommandHandler : IRequestHandler<DeleteDoctorScheduleCommand, bool>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteDoctorScheduleCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(DeleteDoctorScheduleCommand request, CancellationToken cancellationToken)
        {
            var schedule = await _unitOfWork.DoctorSchedules.GetByIdAsync(request.Id);
            if (schedule == null)
            {
                throw new NotFoundException("Doctor schedule not found");
            }

            await _unitOfWork.DoctorSchedules.DeleteAsync(schedule);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
