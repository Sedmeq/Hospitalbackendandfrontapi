using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.About.Command
{
    public class UpdateAboutCommandHandler : IRequestHandler<UpdateAboutCommand, AboutDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public UpdateAboutCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }
        public async Task<AboutDto> Handle(UpdateAboutCommand request, CancellationToken cancellationToken)
        {
            var about = await _unitOfWork.Abouts.GetByIdAsync(request.Id);
            if (about == null)
            {
                throw new NotFoundException("About not found");
            }

            about.Title = request.Title;
            about.Description = request.Description;
            // Şəkil əməliyyatları
            if (request.RemoveImage && !string.IsNullOrEmpty(about.ImageUrl))
            {
                await _fileService.DeleteAboutImageAsync(about.ImageUrl);
                about.ImageUrl = string.Empty;
            }
            else if (request.ImageUrl != null)
            {
                // Köhnə şəkli sil
                if (!string.IsNullOrEmpty(about.ImageUrl))
                {
                    await _fileService.DeleteAboutImageAsync(about.ImageUrl);
                }

                // Yeni şəkli yüklə
                about.ImageUrl = await _fileService.SaveAboutImageAsync(request.ImageUrl, about.Id);
            }

            await _unitOfWork.Abouts.UpdateAsync(about);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

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
