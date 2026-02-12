using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.ContactInfo.Queries
{
    public class GetContactInfoQuery : IRequest<ContactInfoDto>
    {
    }
}
