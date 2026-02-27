using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Contact.Queries
{
    public class GetAllContactQueryHandler : IRequestHandler<GetAllContactQuery, IEnumerable<ContactDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllContactQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<ContactDto>> Handle(GetAllContactQuery request, CancellationToken cancellationToken)
        {
            var contacts = await _unitOfWork.Contacts.GetAllAsync();
            return contacts.Select(contact => new ContactDto
            {
                Id = contact.Id,
                Name = contact.Name,
                Email = contact.Email,
                Subject = contact.Subject,
                Phone = contact.Phone,
                Message = contact.Message,
                CreatedAt = contact.CreatedAt
            }).ToList();
        }
    }
}
