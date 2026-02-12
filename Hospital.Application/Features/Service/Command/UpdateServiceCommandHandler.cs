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
    public class UpdateServiceCommandHandler : IRequestHandler<UpdateServiceCommand, ServiceDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public UpdateServiceCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<ServiceDto> Handle(UpdateServiceCommand request, CancellationToken cancellationToken)
        {
            var service = await _unitOfWork.Services.GetByIdAsync(request.Id);
            if (service == null)
            {
                throw new NotFoundException("Service not found");   
            }

            service.Title = request.Title;
            service.Description = request.Description;

            // Şəkil əməliyyatları
            if (request.RemoveImage && !string.IsNullOrEmpty(service.ImagePath))
            {
                await _fileService.DeleteServiceImageAsync(service.ImagePath);
                service.ImagePath = string.Empty;
            }
            else if (request.Image != null)
            {
                // Köhnə şəkli sil
                if (!string.IsNullOrEmpty(service.ImagePath))
                {
                    await _fileService.DeleteServiceImageAsync(service.ImagePath);
                }

                // Yeni şəkli yüklə
                service.ImagePath = await _fileService.SaveServiceImageAsync(request.Image, service.Id);
            }

            await _unitOfWork.Services.UpdateAsync(service);
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
