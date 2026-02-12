using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Blog.Command
{
    public class AddCommentToBlogCommandValidator : AbstractValidator<AddCommentToBlogCommand>
    {
        public AddCommentToBlogCommandValidator()
        {
            RuleFor(x => x.BlogId)
                .GreaterThan(0).WithMessage("Valid blog ID is required.");

            RuleFor(x => x.AuthorName)
                .NotEmpty().WithMessage("Author name is required.")
                .MaximumLength(100).WithMessage("Author name must not exceed 100 characters.");

            RuleFor(x => x.Content)
                .NotEmpty().WithMessage("Comment content is required.")
                .MinimumLength(5).WithMessage("Comment must be at least 5 characters.")
                .MaximumLength(500).WithMessage("Comment must not exceed 500 characters.");
        }
    }
}
