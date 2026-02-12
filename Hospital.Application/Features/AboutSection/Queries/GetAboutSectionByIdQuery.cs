using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.AboutSection.Queries
{
    public class GetAboutSectionByIdQuery : IRequest<AboutSectionDto>
    {
        public int Id { get; set; }
    }
}
