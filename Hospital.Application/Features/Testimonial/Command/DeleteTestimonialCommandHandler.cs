using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Testimonial.Command
{
    public class DeleteTestimonialCommandHandler : IRequestHandler<DeleteTestimonialCommand, TestimonialDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public DeleteTestimonialCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }
        public async Task<TestimonialDto> Handle(DeleteTestimonialCommand request, CancellationToken cancellationToken)
        {
            var testimonial = await _unitOfWork.Testimonials.GetByIdAsync(request.Id);
            if (testimonial == null)
            {
                throw new NotFoundException("Testimonial not found");
            }

            // Şəkli sil
            if (!string.IsNullOrEmpty(testimonial.ImageUrl))
            {
                await _fileService.DeleteTestimonialImageAsync(testimonial.ImageUrl);
            }

            await _unitOfWork.Testimonials.DeleteAsync(testimonial);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new TestimonialDto
            {
                Id = testimonial.Id,
                Title = testimonial.Title,
                Comment = testimonial.Comment,
                FullName = testimonial.FullName,
                ImageUrl = testimonial.ImageUrl
            };
        }
    }
}
