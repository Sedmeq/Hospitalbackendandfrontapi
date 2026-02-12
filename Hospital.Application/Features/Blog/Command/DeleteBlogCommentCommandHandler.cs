using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Blog.Command
{
    public class DeleteBlogCommentCommandHandler : IRequestHandler<DeleteBlogCommentCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeleteBlogCommentCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Unit> Handle(DeleteBlogCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = await _unitOfWork.BlogComments.GetByIdAsync(request.CommentId);
            if (comment == null)
            {
                throw new NotFoundException("Comment not found");
            }

            var blog = await _unitOfWork.Blogs.GetByIdAsync(comment.BlogId);
            if (blog != null)
            {
                blog.CommentCount--;
                await _unitOfWork.Blogs.UpdateAsync(blog);
            }

            await _unitOfWork.BlogComments.DeleteAsync(comment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
