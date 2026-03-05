using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.LabResult.Command
{
    public class DeleteLabResultCommandHandler : IRequestHandler<DeleteLabResultCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserContextService _userContextService;
        private readonly ILabPdfService _labPdfService;

        public DeleteLabResultCommandHandler(
            IUnitOfWork unitOfWork,
            IUserContextService userContextService,
            ILabPdfService labPdfService)   // IWebHostEnvironment yerine ILabPdfService inject edirik
        {
            _unitOfWork = unitOfWork;
            _userContextService = userContextService;
            _labPdfService = labPdfService;
        }

        public async Task<Unit> Handle(DeleteLabResultCommand request, CancellationToken cancellationToken)
        {
            var labResult = await _unitOfWork.LabResults.GetWithItemsAsync(request.Id);
            if (labResult == null)
                throw new NotFoundException("Lab result not found.");

            // Yalnız Admin və ya həmin doktor silə bilər
            var userId = _userContextService.GetUserId();
            var role = _userContextService.GetUserRole();

            if (role != "Admin")
            {
                var doctor = await _unitOfWork.Doctors.GetByUserIdAsync(userId!);
                if (doctor == null || doctor.Id != labResult.DoctorId)
                    throw new UnauthorizedAccessException("You can only delete your own lab results.");
            }

            // wwwroot/lab-results/ altındakı PDF-i sil
            // ILabPdfService.DeletePdfFile() path normalizasiyası və mövcudluq yoxlamasını öhdəsinə alır
            if (!string.IsNullOrWhiteSpace(labResult.PdfPath))
                _labPdfService.DeletePdfFile(labResult.PdfPath);

            await _unitOfWork.LabResults.DeleteAsync(labResult);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
