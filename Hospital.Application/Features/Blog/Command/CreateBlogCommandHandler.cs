using Hospital.Application.DTOs;
using Hospital.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Blog.Command
{
    public class CreateBlogCommandHandler : IRequestHandler<CreateBlogCommand, BlogDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public CreateBlogCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<BlogDto> Handle(CreateBlogCommand request, CancellationToken cancellationToken)
        {
            var blog = new Domain.Entities.Blog
            {
                Title = request.Title,
                Content = request.Content,
                Author = request.Author,
                Category = request.Category,
                PublishedDate = DateTime.Now,
                CommentCount = 0
            };

            await _unitOfWork.Blogs.AddAsync(blog);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Şəkil yükləmə
            if (request.Image != null)
            {
                var imagePath = await _fileService.SaveBlogImageAsync(request.Image, blog.Id);
                blog.ImagePath = imagePath;
                await _unitOfWork.Blogs.UpdateAsync(blog);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
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
                Comments = new List<BlogCommentDto>()
            };
        }
    }
}