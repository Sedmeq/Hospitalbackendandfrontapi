using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Service.Command
{
    public class CreateServiceCommandHandler : IRequestHandler<CreateServiceCommand, ServiceDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public CreateServiceCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<ServiceDto> Handle(CreateServiceCommand request, CancellationToken cancellationToken)
        {
            var service = new Domain.Entities.Service
            {
                Title = request.Title,
                Description = request.Description
            };

            await _unitOfWork.Services.AddAsync(service);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Şəkil yükləmə
            if (request.Image != null)
            {
                var imagePath = await _fileService.SaveServiceImageAsync(request.Image, service.Id);
                service.ImagePath = imagePath;
                await _unitOfWork.Services.UpdateAsync(service);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

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
