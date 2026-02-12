using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.DoctorSkill.Command
{
    public class AddDoctorSkillCommandValidator : AbstractValidator<AddDoctorSkillCommand>
    {
        public AddDoctorSkillCommandValidator()
        {
            RuleFor(x => x.DoctorId)
                .GreaterThan(0).WithMessage("Valid Doctor ID is required.");

            RuleFor(x => x.SkillName)
                .NotEmpty().WithMessage("Skill name is required.")
                .MaximumLength(200).WithMessage("Skill name must not exceed 200 characters.");

            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required.")
                .MaximumLength(100).WithMessage("Category must not exceed 100 characters.");
        }
    }
}
