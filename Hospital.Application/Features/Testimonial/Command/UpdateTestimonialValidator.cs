using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Testimonial.Command
{
    public class UpdateTestimonialValidator : AbstractValidator<UpdateTestimonialCommand>
    {
        public UpdateTestimonialValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Valid testimonial ID is required.");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Testimonial title is required.")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Full name is required.")
                .MaximumLength(100).WithMessage("Full name must not exceed 100 characters.");

            RuleFor(x => x.Comment)
                .NotEmpty().WithMessage("Comment is required.")
                .MaximumLength(1000).WithMessage("Comment must not exceed 1000 characters.");
        }
    }
}