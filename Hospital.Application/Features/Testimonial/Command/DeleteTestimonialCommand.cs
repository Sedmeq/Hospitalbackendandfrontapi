using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Testimonial.Command
{
    public class DeleteTestimonialCommand : IRequest<TestimonialDto>
    {
        public int Id { get; set; }
    }
}
