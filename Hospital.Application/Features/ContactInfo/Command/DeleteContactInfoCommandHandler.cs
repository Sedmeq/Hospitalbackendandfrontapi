using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
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
    public class DeleteContactInfoCommandHandler : IRequestHandler<DeleteContactInfoCommand, ContactInfoDto>
    {
        private readonly IUnitOfWork _unitOfWork;
            private readonly IFileService _fileService;

        public DeleteContactInfoCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<ContactInfoDto> Handle(DeleteContactInfoCommand request, CancellationToken cancellationToken)
        {
            var contactInfo = await _unitOfWork.ContactInfos.GetByIdAsync(request.Id);
            if (contactInfo == null)
            {
                throw new NotFoundException("ContactInfo not found");
            }

            if (!string.IsNullOrEmpty(contactInfo.Logo))
            {
                await _fileService.DeleteContactInfoImageAsync(contactInfo.Logo);
            }

            await _unitOfWork.ContactInfos.DeleteAsync(contactInfo);
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
