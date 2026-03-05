using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.LabResult.Command
{
    public class CreateLabResultCommandValidator : AbstractValidator<CreateLabResultCommand>
    {
        public CreateLabResultCommandValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Lab result title is required.")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");

            RuleFor(x => x.PatientId)
                .GreaterThan(0).WithMessage("A valid patient is required.");

            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("At least one test item is required.");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(i => i.TestName)
                    .NotEmpty().WithMessage("Test name is required.");

                item.RuleFor(i => i.Value)
                    .NotEmpty().WithMessage("Test value is required.");

                item.RuleFor(i => i.Status)
                    .Must(s => s is "Normal" or "High" or "Low" or "Critical")
                    .WithMessage("Status must be Normal, High, Low or Critical.");
            });
        }
    }
}
