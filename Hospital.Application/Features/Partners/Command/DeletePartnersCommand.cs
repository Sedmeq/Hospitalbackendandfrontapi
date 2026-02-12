using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Partners.Command
{
    public class DeletePartnersCommand : IRequest<PartnersDto>
    {
        public int Id { get; set; }
    }
}
