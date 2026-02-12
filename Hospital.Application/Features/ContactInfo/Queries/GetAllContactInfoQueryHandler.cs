using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.ContactInfo.Queries
{
    public class GetAllContactInfoQueryHandler : IRequestHandler<GetAllContactInfoQuery, IEnumerable<ContactInfoDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllContactInfoQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<ContactInfoDto>> Handle(GetAllContactInfoQuery request, CancellationToken cancellationToken)
        {
            var contactInfo = await _unitOfWork.ContactInfos.GetAllAsync();

            return contactInfo.Select(info => new ContactInfoDto
            {
                Id = info.Id,
                Email = info.Email,
                Address = info.Address,
                PhoneNumber = info.PhoneNumber,
                Time = info.Time
            }).ToList();
        }
    }
}
