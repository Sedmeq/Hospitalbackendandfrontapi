using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Service.Command
{
    public class DeleteServiceCommandHandler : IRequestHandler<DeleteServiceCommand, ServiceDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public DeleteServiceCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<ServiceDto> Handle(DeleteServiceCommand request, CancellationToken cancellationToken)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(request.Id);
            if (service == null)
            {
                throw new NotFoundException("Service not found");
            }

            // Şəkli sil
            if (!string.IsNullOrEmpty(service.ImagePath))
            {
                await _fileService.DeleteServiceImageAsync(service.ImagePath);
            }

            await _unitOfWork.Services.DeleteAsync(service);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new ServiceDto
            {
                Id = service.Id,
                Title = service.Title,
                Description = service.Description,
                ImagePath = service.ImagePath
            };
        }
    }
}
