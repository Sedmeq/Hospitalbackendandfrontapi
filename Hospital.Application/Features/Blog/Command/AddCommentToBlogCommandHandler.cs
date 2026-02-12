using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Blog.Command
{
    public class AddCommentToBlogCommandHandler : IRequestHandler<AddCommentToBlogCommand, BlogCommentDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public AddCommentToBlogCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BlogCommentDto> Handle(AddCommentToBlogCommand request, CancellationToken cancellationToken)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(request.BlogId);
            if (blog == null)
            {
                throw new NotFoundException("Blog not found");
            }

            var comment = new BlogComment
            {
                BlogId = request.BlogId,
                AuthorName = request.AuthorName,
                Content = request.Content,
                CreatedAt = DateTime.Now
            };

            await _unitOfWork.BlogComments.AddAsync(comment);

            // CommentCount artır
            blog.CommentCount++;
            await _unitOfWork.Blogs.UpdateAsync(blog);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new BlogCommentDto
            {
                Id = comment.Id,
                BlogId = comment.BlogId,
                AuthorName = comment.AuthorName,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt
            };
        }
    }
}
