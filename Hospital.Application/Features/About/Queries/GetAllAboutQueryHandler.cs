using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.About.Queries
{
    public class GetAllAboutQueryHandler : IRequestHandler<GetAllAboutQuery, IEnumerable<AboutDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllAboutQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AboutDto>> Handle(GetAllAboutQuery request, CancellationToken cancellationToken)
        {
            var about = await _unitOfWork.Abouts.GetAllAsync();

            return about.Select(about => new AboutDto
            {
                Id = about.Id,
                Title = about.Title,
                Description = about.Description,
                ImageUrl = about.ImageUrl
            }).ToList();    
        }
    }
}
