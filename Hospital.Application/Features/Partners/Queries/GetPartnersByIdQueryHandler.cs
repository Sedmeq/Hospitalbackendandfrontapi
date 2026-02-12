using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Partners.Queries
{
    public class GetPartnersByIdQueryHandler : IRequestHandler<GetPartnersByIdQuery, PartnersDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetPartnersByIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<PartnersDto> Handle(GetPartnersByIdQuery request, CancellationToken cancellationToken)
        {
            var partners = await _unitOfWork.Partners.GetByIdAsync(request.Id);
            if (partners == null)
            {
                throw new NotFoundException("Partners not found");
            }

            return new PartnersDto
            {
                Id = partners.Id,
                ImageUrl = partners.ImageUrl
            };
        }
    }
}
