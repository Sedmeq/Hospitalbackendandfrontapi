using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.ContactInfo.Command
{
    public class UpdateContactInfoCommandHandler : IRequestHandler<UpdateContactInfoCommand, ContactInfoDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public UpdateContactInfoCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<ContactInfoDto> Handle(UpdateContactInfoCommand request, CancellationToken cancellationToken)
        {
            var contactInfo = await _unitOfWork.ContactInfos.GetByIdAsync(request.Id);
            if (contactInfo == null)
            {
                throw new NotFoundException("ContactInfo not found");
            }

            contactInfo.Email = request.Email;
            contactInfo.Address = request.Address;
            contactInfo.PhoneNumber = request.PhoneNumber;
            contactInfo.Time = request.Time;


            // LOGO MƏNTİQİ
            if (request.RemoveLogo && !string.IsNullOrEmpty(contactInfo.Logo))
            {
                await _fileService.DeleteContactInfoImageAsync(contactInfo.Logo);
                contactInfo.Logo = string.Empty;
            }
            else if (request.Logo != null)
            {
                if (!string.IsNullOrEmpty(contactInfo.Logo))
                {
                    await _fileService.DeleteContactInfoImageAsync(contactInfo.Logo);
                }
                contactInfo.Logo = await _fileService.SaveContactInfoImageAsync(request.Logo, contactInfo.Id);
            }

            await _unitOfWork.ContactInfos.UpdateAsync(contactInfo);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new ContactInfoDto
            {
                Id = contactInfo.Id,
                Email = contactInfo.Email,
                Address = contactInfo.Address,
                PhoneNumber = contactInfo.PhoneNumber,
                Time = contactInfo.Time,
                Logo = contactInfo.Logo
            };
        }
    }
}