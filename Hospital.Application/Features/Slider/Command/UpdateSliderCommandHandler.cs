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
    public class UpdateSliderCommandHandler : IRequestHandler<UpdateSliderCommand, SliderDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;
        public UpdateSliderCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }
        public async Task<SliderDto> Handle(UpdateSliderCommand request, CancellationToken cancellationToken)
        {
            var slider = await _unitOfWork.Sliders.GetByIdAsync(request.Id);
            if (slider == null)
            {
                throw new NotFoundException("Slider not found");
            }

            slider.Title = request.Title;
            slider.Description = request.Description;
            slider.Subtitle = request.Subtitle;
            // Şəkil əməliyyatları
            if (request.RemoveImage && !string.IsNullOrEmpty(slider.ImageUrl))
            {
                await _fileService.DeleteSliderImageAsync(slider.ImageUrl);
                slider.ImageUrl = string.Empty;
            }
            else if (request.ImageUrl != null)
            {
                // Köhnə şəkli sil
                if (!string.IsNullOrEmpty(slider.ImageUrl))
                {
                    await _fileService.DeleteSliderImageAsync(slider.ImageUrl);
                }

                // Yeni şəkli yüklə
                slider.ImageUrl = await _fileService.SaveSliderImageAsync(request.ImageUrl, slider.Id);
            }

            await _unitOfWork.Sliders.UpdateAsync(slider);
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
