using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Partners.Queries
{
    public class GetPartnersByIdQuery : IRequest<PartnersDto>
    {
        public int Id { get; set; }
    }
}
