using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Contact.Command
{
    public class UpdateContactCommandValidator : AbstractValidator<UpdateContactCommand>
    {
        public UpdateContactCommandValidator()
        {
            RuleFor(x => x.Id).GreaterThan(0).WithMessage("Invalid contact ID");

            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required.")
                .MaximumLength(100).WithMessage("Nmae must not exceed 100 characters.");

            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required.").EmailAddress().WithMessage("Invalid email format.");

            RuleFor(x => x.Subject).NotEmpty().WithMessage("Subject is required.")
                .MaximumLength(5000).WithMessage("Subject must not exceed 500 characters.");

            RuleFor(x => x.Phone).NotEmpty().WithMessage("Phone is required.")
                .MaximumLength(50).WithMessage("Phone must not exceed 50 characters.");

            RuleFor(x => x.Message).NotEmpty().WithMessage("Message is required.")
                .MaximumLength(5000).WithMessage("Message must not exceed 5000 characters.");
        }
    }
}