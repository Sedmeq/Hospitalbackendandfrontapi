using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.AboutSection.Command
{
    public class UpdateAboutSectionCommandHandler : IRequestHandler<UpdateAboutSectionCommand, AboutSectionDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public UpdateAboutSectionCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<AboutSectionDto> Handle(UpdateAboutSectionCommand request, CancellationToken cancellationToken)
        {
            var aboutSection = await _unitOfWork.AboutSections.GetByIdAsync(request.Id);
            if (aboutSection == null)
            {
                throw new NotFoundException("About section not found");
            }

            aboutSection.Title = request.Title;
            aboutSection.Description = request.Description;

            // Image1 əməliyyatları
            if (request.RemoveImage1 && !string.IsNullOrEmpty(aboutSection.Image1))
            {
                await _fileService.DeleteAboutSectionImageAsync(aboutSection.Image1);
                aboutSection.Image1 = string.Empty;
            }
            else if (request.Image1 != null)
            {
                if (!string.IsNullOrEmpty(aboutSection.Image1))
                {
                    await _fileService.DeleteAboutSectionImageAsync(aboutSection.Image1);
                }
                aboutSection.Image1 = await _fileService.SaveAboutSectionImageAsync(request.Image1, aboutSection.Id, "img1");
            }

            // Image2 əməliyyatları
            if (request.RemoveImage2 && !string.IsNullOrEmpty(aboutSection.Image2))
            {
                await _fileService.DeleteAboutSectionImageAsync(aboutSection.Image2);
                aboutSection.Image2 = string.Empty;
            }
            else if (request.Image2 != null)
            {
                if (!string.IsNullOrEmpty(aboutSection.Image2))
                {
                    await _fileService.DeleteAboutSectionImageAsync(aboutSection.Image2);
                }
                aboutSection.Image2 = await _fileService.SaveAboutSectionImageAsync(request.Image2, aboutSection.Id, "img2");
            }

            // Image3 əməliyyatları
            if (request.RemoveImage3 && !string.IsNullOrEmpty(aboutSection.Image3))
            {
                await _fileService.DeleteAboutSectionImageAsync(aboutSection.Image3);
                aboutSection.Image3 = string.Empty;
            }
            else if (request.Image3 != null)
            {
                if (!string.IsNullOrEmpty(aboutSection.Image3))
                {
                    await _fileService.DeleteAboutSectionImageAsync(aboutSection.Image3);
                }
                aboutSection.Image3 = await _fileService.SaveAboutSectionImageAsync(request.Image3, aboutSection.Id, "img3");
            }

            await _unitOfWork.AboutSections.UpdateAsync(aboutSection);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new AboutSectionDto
            {
                Id = aboutSection.Id,
                Title = aboutSection.Title,
                Description = aboutSection.Description,
                Image1 = aboutSection.Image1,
                Image2 = aboutSection.Image2,
                Image3 = aboutSection.Image3
            };
        }
    }
}
