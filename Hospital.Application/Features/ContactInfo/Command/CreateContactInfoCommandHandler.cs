using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
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
        private readonly IFileService _fileService;

        public CreateContactInfoCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
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

            if(contadctInfo != null) {
                if (request.Logo != null)
                {
                    var filePath = await _fileService.SaveContactInfoImageAsync(request.Logo, contadctInfo.Id);
                    contadctInfo.Logo = filePath;
                    await _unitOfWork.ContactInfos.UpdateAsync(contadctInfo);
                    await _unitOfWork.SaveChangesAsync(cancellationToken);
                }
            }

            return new ContactInfoDto
            {
                Id = contadctInfo.Id,
                Email = contadctInfo.Email,
                Address = contadctInfo.Address,
                PhoneNumber = contadctInfo.PhoneNumber,
                Time = contadctInfo.Time,
                Logo = contadctInfo.Logo
            };
        }
    }
}
