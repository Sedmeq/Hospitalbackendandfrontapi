using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.ContactInfo.Queries
{
    public class GetContactInfoQueryHandler : IRequestHandler<GetContactInfoQuery, ContactInfoDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetContactInfoQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ContactInfoDto> Handle(GetContactInfoQuery request, CancellationToken cancellationToken)
        {
            var contactInfo = await _unitOfWork.ContactInfos.GetActiveContactInfoAsync();
            if (contactInfo == null)
            {
                return null;
            }

            return new ContactInfoDto
            {
                Id = contactInfo.Id,
                Email = contactInfo.Email,
                Address = contactInfo.Address,
                PhoneNumber = contactInfo.PhoneNumber,
                Time = contactInfo.Time
            };
        }
    }
}