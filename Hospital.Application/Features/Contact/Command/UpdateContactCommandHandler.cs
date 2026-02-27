using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Contact.Command
{
    public class UpdateContactCommandHandler : IRequestHandler<UpdateContactCommand, ContactDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdateContactCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ContactDto> Handle(UpdateContactCommand request, CancellationToken cancellationToken)
        {
            var contact = await _unitOfWork.Contacts.GetByIdAsync(request.Id);
            if (contact == null)
            {
                throw new NotFoundException("Contact not found");
            }

            contact.Name = request.Name;
            contact.Email = request.Email;
            contact.Subject = request.Subject;
            contact.Phone = request.Phone;
            contact.Message = request.Message;


            await _unitOfWork.Contacts.UpdateAsync(contact);
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
