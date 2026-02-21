using Hospital.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.ContactInfo.Command
{
    public class UpdateContactInfoCommand : IRequest<ContactInfoDto>
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;

        public IFormFile? Logo { get; set; }
        public bool RemoveLogo { get; set; }
    }
}
