using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.About.Queries
{
    public class GetAboutByIdQueryHandler : IRequestHandler<GetAboutByIdQuery, AboutDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAboutByIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<AboutDto> Handle(GetAboutByIdQuery request, CancellationToken cancellationToken)
        {
            var about = await _unitOfWork.Abouts.GetByIdAsync(request.Id);

            if (about == null)
            {
                throw new NotFoundException("About not found");
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
