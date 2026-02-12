using Hospital.Application.DTOs;
using Hospital.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.ContactInfo.Command
{
    public class DeleteContactInfoCommand : IRequest<ContactInfoDto>
    {
        public int Id { get; set; }
    }
}
