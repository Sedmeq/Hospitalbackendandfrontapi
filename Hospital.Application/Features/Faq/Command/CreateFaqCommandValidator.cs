using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Faq.Command
{
    public class CreateFaqCommandValidator : AbstractValidator<CreateFaqCommand>
    {
        public CreateFaqCommandValidator()
        {
            RuleFor(x => x.Question)
                .NotEmpty().WithMessage("Question is required.")
                .MaximumLength(500).WithMessage("Question must not exceed 500 characters.");

            RuleFor(x => x.Answer)
                .NotEmpty().WithMessage("Answer is required.")
                .MaximumLength(2000).WithMessage("Answer must not exceed 2000 characters.");

            RuleFor(x => x.Order)
                .GreaterThanOrEqualTo(0).WithMessage("Order must be a non-negative number.");
        }
    }
}
