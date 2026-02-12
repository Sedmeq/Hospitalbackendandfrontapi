using Hospital.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Testimonial.Command
{
    public class UpdateTestimonialCommand : IRequest<TestimonialDto>
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;        // Amazing service!
        public string Comment { get; set; } = string.Empty;
        public IFormFile? ImageUrl { get; set; }
        public bool RemoveImage { get; set; }
    }
}
