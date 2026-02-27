using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Contact.Command
{
    public class CreateContactCommandHandler : IRequestHandler<CreateContactCommand, ContactDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateContactCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ContactDto> Handle(CreateContactCommand request, CancellationToken cancellationToken)
        {
            var contact = new Domain.Entities.Contact
            {
                Name = request.Name,
                Email = request.Email,
                Subject = request.Subject,
                Phone = request.Phone,
                Message = request.Message,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.Contacts.AddAsync(contact);
            await _unitOfWork.SaveChangesAsync(cancellationToken);


            return new ContactDto
            {
                Id = contact.Id,
                Name = contact.Name,
                Email = contact.Email,
                Subject = contact.Subject,
                Phone = contact.Phone,
                Message = contact.Message,
                CreatedAt = contact.CreatedAt
            };
        }
    }
}
