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
    public class GetAllAboutSectionsQueryHandler : IRequestHandler<GetAllAboutSectionsQuery, IEnumerable<AboutSectionDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllAboutSectionsQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AboutSectionDto>> Handle(GetAllAboutSectionsQuery request, CancellationToken cancellationToken)
        {
            var aboutSections = await _unitOfWork.AboutSections.GetAllAsync();

            return aboutSections.Select(a => new AboutSectionDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                Image1 = a.Image1,
                Image2 = a.Image2,
                Image3 = a.Image3
            }).ToList();
        }
    }
}
