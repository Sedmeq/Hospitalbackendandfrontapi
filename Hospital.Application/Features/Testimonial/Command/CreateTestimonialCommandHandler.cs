using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Testimonial.Command
{
    public class CreateTestimonialCommandHandler : IRequestHandler<CreateTestimonialCommand, TestimonialDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;
        public CreateTestimonialCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }
        public async Task<TestimonialDto> Handle(CreateTestimonialCommand request, CancellationToken cancellationToken)
        {
            var testimonial = new Domain.Entities.Testimonial
            {
                FullName = request.FullName,
                Title = request.Title,
                Comment = request.Comment
            };

            await _unitOfWork.Testimonials.AddAsync(testimonial);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            if (request.ImageUrl != null)
            {
                var imagePath = await _fileService.SaveTestimonialImageAsync(request.ImageUrl, testimonial.Id);
                testimonial.ImageUrl = imagePath;
                await _unitOfWork.Testimonials.UpdateAsync(testimonial);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
            }
            return new TestimonialDto
            {
                Id = testimonial.Id,
                FullName = testimonial.FullName,
                Title = testimonial.Title,
                Comment = testimonial.Comment,
                ImageUrl = testimonial.ImageUrl,
            };
        }
    }
}
