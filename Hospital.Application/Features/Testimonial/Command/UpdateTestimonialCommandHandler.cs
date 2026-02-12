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
    public class UpdateTestimonialCommandHandler : IRequestHandler<UpdateTestimonialCommand, TestimonialDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public UpdateTestimonialCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }
        public async Task<TestimonialDto> Handle(UpdateTestimonialCommand request, CancellationToken cancellationToken)
        {
            var testimonial = await _unitOfWork.Testimonials.GetByIdAsync(request.Id);
            if (testimonial == null)
            {
                throw new NotFoundException("Testimonial not found");
            }

            testimonial.Title = request.Title;
            testimonial.FullName = request.FullName;
            testimonial.Comment = request.Comment;
            // Şəkil əməliyyatları
            if (request.RemoveImage && !string.IsNullOrEmpty(testimonial.ImageUrl))
            {
                await _fileService.DeleteTestimonialImageAsync(testimonial.ImageUrl);
                testimonial.ImageUrl = string.Empty;
            }
            else if (request.ImageUrl != null)
            {
                // Köhnə şəkli sil
                if (!string.IsNullOrEmpty(testimonial.ImageUrl))
                {
                    await _fileService.DeleteTestimonialImageAsync(testimonial.ImageUrl);
                }

                // Yeni şəkli yüklə
                testimonial.ImageUrl = await _fileService.SaveTestimonialImageAsync(request.ImageUrl, testimonial.Id);
            }

            await _unitOfWork.Testimonials.UpdateAsync(testimonial);
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
