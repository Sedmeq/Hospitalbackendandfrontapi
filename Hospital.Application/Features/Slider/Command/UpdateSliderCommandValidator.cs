using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Slider.Command
{
    public class UpdateSliderCommandValidator : AbstractValidator<UpdateSliderCommand>
    {
        public UpdateSliderCommandValidator() {
            RuleFor(x => x.Id)
                   .GreaterThan(0).WithMessage("Valid service ID is required.");

            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Slider title is required.")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");
            RuleFor(x => x.Subtitle)
               .NotEmpty().WithMessage("Slider subtitle is required.")
               .MaximumLength(500).WithMessage("Subtitle must not exceed 500 characters.");
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(2000).WithMessage("Description must not exceed 2000 characters.");
        }
    }
}
