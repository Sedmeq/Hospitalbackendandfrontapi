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
    public class GetActiveAboutQueryHandler : IRequestHandler<GetActiveAboutQuery, AboutDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetActiveAboutQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<AboutDto> Handle(GetActiveAboutQuery request, CancellationToken cancellationToken)
        {
            var about = await _unitOfWork.Abouts.GetActiveAboutAsync();

            if (about == null)
            {
                return null;
            }

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
