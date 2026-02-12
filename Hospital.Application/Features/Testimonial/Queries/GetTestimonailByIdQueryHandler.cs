using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Testimonial.Queries
{
    public class GetTestimonailByIdQueryHandler : IRequestHandler<GetTestimonailByIdQuery, TestimonialDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetTestimonailByIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<TestimonialDto> Handle(GetTestimonailByIdQuery request, CancellationToken cancellationToken)
        {
            var testimonial = await _unitOfWork.Testimonials.GetByIdAsync(request.Id);

            if (testimonial == null)
            {
                throw new NotFoundException("Slider not found");
            }

            return new TestimonialDto
            {
                Id = testimonial.Id,
                Title = testimonial.Title,
                FullName = testimonial.FullName,
                Comment = testimonial.Comment,
                ImageUrl = testimonial.ImageUrl,
            };
        }
    }
}
