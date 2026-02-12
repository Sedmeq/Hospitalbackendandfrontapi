using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Slider.Command
{
    public class CreateSliderCommandHandler : IRequestHandler<CreateSliderCommand, SliderDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;
        public CreateSliderCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }
        public async Task<SliderDto> Handle(CreateSliderCommand request, CancellationToken cancellationToken)
        {
            var slider = new Domain.Entities.Slider
            {
                Title = request.Title,
                Description = request.Description,
                Subtitle = request.Subtitle
            };

            await _unitOfWork.Sliders.AddAsync(slider);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            if(request.ImageUrl != null)
            {
                var imagePath = await _fileService.SaveSliderImageAsync(request.ImageUrl,slider.Id);
                slider.ImageUrl = imagePath;
                await _unitOfWork.Sliders.UpdateAsync(slider);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
            return new SliderDto
            {
                Id = slider.Id,
                Title = slider.Title,
                Description = slider.Description,
                Subtitle = slider.Subtitle,
                ImageUrl = slider.ImageUrl,
            };
        }
    }
}
