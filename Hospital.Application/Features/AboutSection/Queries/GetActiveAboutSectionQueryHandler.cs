using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.AboutSection.Queries
{
    public class GetActiveAboutSectionQueryHandler : IRequestHandler<GetActiveAboutSectionQuery, AboutSectionDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetActiveAboutSectionQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<AboutSectionDto> Handle(GetActiveAboutSectionQuery request, CancellationToken cancellationToken)
        {
            var aboutSection = await _unitOfWork.AboutSections.GetActiveAboutSectionAsync();

            if (aboutSection == null)
            {
                return null;
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
