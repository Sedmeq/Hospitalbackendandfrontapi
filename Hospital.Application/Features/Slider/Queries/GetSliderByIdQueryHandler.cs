using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Slider.Queries
{
    public class GetSliderByIdQueryHandler : IRequestHandler<GetSliderByIdQuery, SliderDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetSliderByIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<SliderDto> Handle(GetSliderByIdQuery request, CancellationToken cancellationToken)
        {
            var slider = await _unitOfWork.Sliders.GetByIdAsync(request.Id);

            if (slider == null)
            {
                throw new NotFoundException("Slider not found");
            }

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
