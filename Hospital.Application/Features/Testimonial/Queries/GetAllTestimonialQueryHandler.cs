using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Testimonial.Queries
{
    public class GetAllTestimonialQueryHandler : IRequestHandler<GetAllTestimonialQuery, IEnumerable<TestimonialDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllTestimonialQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<TestimonialDto>> Handle(GetAllTestimonialQuery request, CancellationToken cancellationToken)
        {
            var testimonials = await _unitOfWork.Testimonials.GetAllAsync();
            return testimonials.Select(t => new TestimonialDto
            {
                Id = t.Id,
                Title = t.Title,
                FullName = t.FullName,
                Comment = t.Comment,
                ImageUrl = t.ImageUrl

            }).ToList();
        }
    }
}
