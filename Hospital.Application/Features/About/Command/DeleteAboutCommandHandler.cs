using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.About.Command
{
    public class DeleteAboutCommandHandler : IRequestHandler<DeleteAboutCommand, AboutDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public DeleteAboutCommandHandler(IUnitOfWork unitOfWork,IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<AboutDto> Handle(DeleteAboutCommand request, CancellationToken cancellationToken)
        {
            var about = await _unitOfWork.Abouts.GetByIdAsync(request.Id);
            if (about == null)
            {
                throw new NotFoundException("About not found");
            }

            // Şəkli sil
            if (!string.IsNullOrEmpty(about.ImageUrl))
            {
                await _fileService.DeleteAboutImageAsync(about.ImageUrl);
            }

            await _unitOfWork.Abouts.DeleteAsync(about);
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