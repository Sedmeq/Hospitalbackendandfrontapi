using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Slider.Command
{
    public class DeleteSliderCommandHandler : IRequestHandler<DeleteSliderCommand, SliderDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;
        public DeleteSliderCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<SliderDto> Handle(DeleteSliderCommand request, CancellationToken cancellationToken)
        {
            var slider = await _unitOfWork.Sliders.GetByIdAsync(request.Id);
            if (slider == null)
            {
                throw new NotFoundException("Slider not found");
            }

            // Şəkli sil
            if (!string.IsNullOrEmpty(slider.ImageUrl))
            {
                await _fileService.DeleteSliderImageAsync(slider.ImageUrl);
            }

            await _unitOfWork.Sliders.DeleteAsync(slider);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new SliderDto
            {
                Id = slider.Id,
                Title = slider.Title,
                Description = slider.Description,
                Subtitle = slider.Subtitle,
                ImageUrl = slider.ImageUrl
            };
        }
    }
}
