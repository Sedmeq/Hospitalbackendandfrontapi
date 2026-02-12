using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Blog.Queries
{
    public class GetBlogByIdQueryHandler : IRequestHandler<GetBlogByIdQuery, BlogDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetBlogByIdQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BlogDto> Handle(GetBlogByIdQuery request, CancellationToken cancellationToken)
        {
            var blog = await _unitOfWork.Blogs.GetBlogWithCommentsAsync(request.Id);

            if (blog == null)
            {
                throw new NotFoundException("Blog not found");
            }

            return new BlogDto
            {
                Id = blog.Id,
                Title = blog.Title,
                Content = blog.Content,
                Author = blog.Author,
                Category = blog.Category,
                ImagePath = blog.ImagePath,
                CommentCount = blog.CommentCount,
                PublishedDate = blog.PublishedDate,
                Comments = blog.Comments.Select(c => new BlogCommentDto
                {
                    Id = c.Id,
                    BlogId = c.BlogId,
                    AuthorName = c.AuthorName,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt
                }).ToList()
            };
        }
    }
}
