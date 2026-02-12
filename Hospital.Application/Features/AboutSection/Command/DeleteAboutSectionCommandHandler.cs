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
    public class DeleteAboutSectionCommandHandler : IRequestHandler<DeleteAboutSectionCommand, AboutSectionDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public DeleteAboutSectionCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<AboutSectionDto> Handle(DeleteAboutSectionCommand request, CancellationToken cancellationToken)
        {
            var aboutSection = await _unitOfWork.AboutSections.GetByIdAsync(request.Id);
            if (aboutSection == null)
            {
                throw new NotFoundException("About section not found");
            }

            // Bütün şəkilləri sil
            if (!string.IsNullOrEmpty(aboutSection.Image1))
            {
                await _fileService.DeleteAboutSectionImageAsync(aboutSection.Image1);
            }

            if (!string.IsNullOrEmpty(aboutSection.Image2))
            {
                await _fileService.DeleteAboutSectionImageAsync(aboutSection.Image2);
            }

            if (!string.IsNullOrEmpty(aboutSection.Image3))
            {
                await _fileService.DeleteAboutSectionImageAsync(aboutSection.Image3);
            }

            await _unitOfWork.AboutSections.DeleteAsync(aboutSection);
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
