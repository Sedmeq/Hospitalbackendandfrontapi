using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Service.Command
{
    public class DeleteServiceCommand : IRequest<ServiceDto>
    {
        public int Id { get; set; }
    }
}
