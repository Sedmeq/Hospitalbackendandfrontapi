using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Testimonial.Command
{
    internal class CreateTestimonialCommandValidator : AbstractValidator<CreateTestimonialCommand>
    {
        public CreateTestimonialCommandValidator()
        {
            RuleFor(x => x.FullName).NotEmpty().WithMessage("Full name is required.")
                .MaximumLength(60).WithMessage("Fullname must not exceed 60 characters.");;
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required.")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters."); ;
            RuleFor(x => x.Comment).NotEmpty().WithMessage("Comment is required.")
                .MaximumLength(500).WithMessage("Comment must not exceed 500 characters."); ;
        }
    }
}
