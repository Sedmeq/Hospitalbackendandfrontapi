using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Slider.Queries
{
    public class GetAllSliderQueryHandler : IRequestHandler<GetAllSliderQuery, IEnumerable<SliderDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllSliderQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<SliderDto>> Handle(GetAllSliderQuery request, CancellationToken cancellationToken)
        {
            var sliders = await _unitOfWork.Sliders.GetAllAsync();

            return sliders.Select(slider => new SliderDto
            {
                Id = slider.Id,
                Title = slider.Title,
                Description = slider.Description,
                Subtitle = slider.Subtitle,
                ImageUrl = slider.ImageUrl
            }).ToList();
        }
    }
}
