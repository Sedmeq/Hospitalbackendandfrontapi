using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Blog.Queries
{
    public class SearchBlogsQueryHandler : IRequestHandler<SearchBlogsQuery, IEnumerable<BlogDto>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchBlogsQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<BlogDto>> Handle(SearchBlogsQuery request, CancellationToken cancellationToken)
        {
            var blogs = await _unitOfWork.Blogs.SearchBlogsAsync(request.SearchTerm);

            return blogs.Select(b => new BlogDto
            {
                Id = b.Id,
                Title = b.Title,
                Content = b.Content,
                Author = b.Author,
                Category = b.Category,
                ImagePath = b.ImagePath,
                CommentCount = b.CommentCount,
                PublishedDate = b.PublishedDate,
                Comments = b.Comments.Select(c => new BlogCommentDto
                {
                    Id = c.Id,
                    BlogId = c.BlogId,
                    AuthorName = c.AuthorName,
                    Content = c.Content,
                    CreatedAt = c.CreatedAt
                }).ToList()
            }).ToList();
        }
    }
}
