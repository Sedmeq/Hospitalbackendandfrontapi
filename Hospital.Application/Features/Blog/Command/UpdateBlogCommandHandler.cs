using Hospital.Application.DTOs;
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
    public class UpdateBlogCommandHandler : IRequestHandler<UpdateBlogCommand, BlogDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public UpdateBlogCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<BlogDto> Handle(UpdateBlogCommand request, CancellationToken cancellationToken)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(request.Id);
            if (blog == null)
            {
                throw new NotFoundException("Blog not found");
            }

            blog.Title = request.Title;
            blog.Content = request.Content;
            blog.Author = request.Author;
            blog.Category = request.Category;

            // Şəkil əməliyyatları
            if (request.RemoveImage && !string.IsNullOrEmpty(blog.ImagePath))
            {
                await _fileService.DeleteBlogImageAsync(blog.ImagePath);
                blog.ImagePath = string.Empty;
            }
            else if (request.Image != null)
            {
                if (!string.IsNullOrEmpty(blog.ImagePath))
                {
                    await _fileService.DeleteBlogImageAsync(blog.ImagePath);
                }

                blog.ImagePath = await _fileService.SaveBlogImageAsync(request.Image, blog.Id);
            }

            await _unitOfWork.Blogs.UpdateAsync(blog);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

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