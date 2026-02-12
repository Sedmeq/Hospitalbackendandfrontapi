using Hospital.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Partners.Command
{
    public class UpdatePartnersCommand : IRequest<PartnersDto>
    {
        public int Id { get; set; }
        public IFormFile? ImageUrl { get; set; }
        public bool RemoveImage { get; set; }
    }
}
