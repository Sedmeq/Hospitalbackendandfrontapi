using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorEducation.Command
{
    public class AddDoctorEducationCommandValidator : AbstractValidator<AddDoctorEducationCommand>
    {
        public AddDoctorEducationCommandValidator()
        {
            RuleFor(x => x.DoctorId)
                .GreaterThan(0).WithMessage("Valid Doctor ID is required.");

            RuleFor(x => x.Year)
                .NotEmpty().WithMessage("Year is required.")
                .MaximumLength(50).WithMessage("Year must not exceed 50 characters.");

            RuleFor(x => x.Degree)
                .NotEmpty().WithMessage("Degree is required.")
                .MaximumLength(200).WithMessage("Degree must not exceed 200 characters.");

            RuleFor(x => x.Institution)
                .NotEmpty().WithMessage("Institution is required.")
                .MaximumLength(200).WithMessage("Institution must not exceed 200 characters.");

            RuleFor(x => x.Description)
                .MaximumLength(1000).WithMessage("Description must not exceed 1000 characters.");
        }
    }
}
