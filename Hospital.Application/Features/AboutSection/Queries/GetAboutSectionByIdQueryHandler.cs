using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.AboutSection.Queries
{
    public class GetAboutSectionByIdQueryHandler : IRequestHandler<GetAboutSectionByIdQuery, AboutSectionDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAboutSectionByIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<AboutSectionDto> Handle(GetAboutSectionByIdQuery request, CancellationToken cancellationToken)
        {
            var aboutSection = await _unitOfWork.AboutSections.GetByIdAsync(request.Id);

            if (aboutSection == null)
            {
                throw new NotFoundException("About section not found");
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
