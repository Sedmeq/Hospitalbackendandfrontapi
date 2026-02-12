using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.AboutSection.Command
{
    public class CreateAboutSectionCommandValidator : AbstractValidator<CreateAboutSectionCommand>
    {
        public CreateAboutSectionCommandValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MinimumLength(50).WithMessage("Description must be at least 50 characters.");
        }
    }
}
