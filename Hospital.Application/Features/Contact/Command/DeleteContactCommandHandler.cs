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
    public class DeleteContactCommandHandler : IRequestHandler<DeleteContactCommand, ContactDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteContactCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ContactDto> Handle(DeleteContactCommand request, CancellationToken cancellationToken)
        {
            var contact = await _unitOfWork.Contacts.GetByIdAsync(request.Id);
            if (contact == null)
            {
                throw new NotFoundException("Contact not found");
            }

            await _unitOfWork.Contacts.DeleteAsync(contact);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new ContactDto
            {
                Id = contact.Id,
                Name = contact.Name,
                Email = contact.Email,
                Subject = contact.Subject,
                Phone = contact.Phone,
                Message = contact.Message
            };
        }
    }
}
