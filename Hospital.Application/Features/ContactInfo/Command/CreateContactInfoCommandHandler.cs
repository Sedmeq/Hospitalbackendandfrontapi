using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.ContactInfo.Command
{
    public class CreateContactInfoCommandHandler : IRequestHandler<CreateContactInfoCommand, ContactInfoDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateContactInfoCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ContactInfoDto> Handle(CreateContactInfoCommand request, CancellationToken cancellationToken)
        {
            var contadctInfo = new Domain.Entities.ContactInfo
            {
                Email = request.Email,
                Address = request.Address,
                PhoneNumber = request.PhoneNumber,
                Time = request.Time
            };

            await _unitOfWork.ContactInfos.AddAsync(contadctInfo);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new ContactInfoDto
            {
                Id = contadctInfo.Id,
                Email = contadctInfo.Email,
                Address = contadctInfo.Address,
                PhoneNumber = contadctInfo.PhoneNumber,
                Time = contadctInfo.Time
            };
        }
    }
}
