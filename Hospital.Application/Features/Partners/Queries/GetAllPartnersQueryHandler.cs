using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Partners.Queries
{
    public class GetAllPartnersQueryHandler : IRequestHandler<GetAllPartnersQuery, IEnumerable<PartnersDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllPartnersQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<PartnersDto>> Handle(GetAllPartnersQuery request, CancellationToken cancellationToken)
        {
            var partners = await _unitOfWork.Partners.GetAllAsync();
            return partners.Select(p => new PartnersDto
            {
                Id = p.Id,
                ImageUrl = p.ImageUrl
            }).ToList();
        }
    }
}
