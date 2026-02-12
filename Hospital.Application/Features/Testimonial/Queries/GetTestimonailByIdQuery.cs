using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Testimonial.Queries
{
    public class GetTestimonailByIdQuery : IRequest<TestimonialDto>
    {
        public int Id { get; set; }
    }
}
