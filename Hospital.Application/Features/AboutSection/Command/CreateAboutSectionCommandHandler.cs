using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.AboutSection.Command
{
    public class CreateAboutSectionCommandHandler : IRequestHandler<CreateAboutSectionCommand, AboutSectionDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public CreateAboutSectionCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<AboutSectionDto> Handle(CreateAboutSectionCommand request, CancellationToken cancellationToken)
        {
            var aboutSection = new Domain.Entities.AboutSection
            {
                Title = request.Title,
                Description = request.Description
            };

            await _unitOfWork.AboutSections.AddAsync(aboutSection);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Şəkilləri yüklə
            if (request.Image1 != null)
            {
                aboutSection.Image1 = await _fileService.SaveAboutSectionImageAsync(request.Image1, aboutSection.Id, "img1");
            }

            if (request.Image2 != null)
            {
                aboutSection.Image2 = await _fileService.SaveAboutSectionImageAsync(request.Image2, aboutSection.Id, "img2");
            }

            if (request.Image3 != null)
            {
                aboutSection.Image3 = await _fileService.SaveAboutSectionImageAsync(request.Image3, aboutSection.Id, "img3");
            }

            // Şəkil yollarını yenilə
            if (request.Image1 != null || request.Image2 != null || request.Image3 != null)
            {
                await _unitOfWork.AboutSections.UpdateAsync(aboutSection);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }

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