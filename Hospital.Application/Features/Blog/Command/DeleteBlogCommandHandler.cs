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
    public class DeleteBlogCommandHandler : IRequestHandler<DeleteBlogCommand, BlogDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public DeleteBlogCommandHandler(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<BlogDto> Handle(DeleteBlogCommand request, CancellationToken cancellationToken)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(request.Id);
            if (blog == null)
            {
                throw new NotFoundException("Blog not found");
            }

            // Şəkli sil
            if (!string.IsNullOrEmpty(blog.ImagePath))
            {
                await _fileService.DeleteBlogImageAsync(blog.ImagePath);
            }

            await _unitOfWork.Blogs.DeleteAsync(blog);
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
                PublishedDate = blog.PublishedDate
            };
        }
    }
}
