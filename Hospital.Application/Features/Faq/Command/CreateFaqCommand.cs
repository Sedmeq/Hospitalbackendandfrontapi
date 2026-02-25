using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Faq.Command
{
    public class CreateFaqCommand : IRequest<FaqDto>
    {
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public int Order { get; set; }
    }
}
