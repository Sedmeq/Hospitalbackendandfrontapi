using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.About.Command
{
    public class CreateAboutCommandHandler : IRequestHandler<CreateAboutCommand, AboutDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public CreateAboutCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<AboutDto> Handle(CreateAboutCommand request, CancellationToken cancellationToken)
        {
            var about = new Domain.Entities.About
            {
                Title = request.Title,
                Description = request.Description
            };

            await _unitOfWork.Abouts.AddAsync(about);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            if (request.ImageUrl != null)
            {
                var imagePath = await _fileService.SaveAboutImageAsync(request.ImageUrl, about.Id);
                about.ImageUrl = imagePath;
                await _unitOfWork.Abouts.UpdateAsync(about);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
            return new AboutDto
            {
                Id = about.Id,
                Title = about.Title,
                Description = about.Description,
                ImageUrl = about.ImageUrl
            };
        }
    }
}