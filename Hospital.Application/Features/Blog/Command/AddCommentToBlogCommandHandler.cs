using Hospital.Application.DTOs;
using Hospital.Application.Exceptions;
using Hospital.Application.Features.Notification.Command;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMediator _mediator;

        public AddCommentToBlogCommandHandler(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager, IMediator mediator)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mediator = mediator;
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
                VisitorEmail = request.VisitorEmail,
                CreatedAt = DateTime.Now
            };

            await _unitOfWork.BlogComments.AddAsync(comment);

            // CommentCount artır
            blog.CommentCount++;
            await _unitOfWork.Blogs.UpdateAsync(blog);

            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Notify Admins
            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            foreach (var admin in admins)
            {
                await _mediator.Send(new CreateNotificationCommand
                {
                    ApplicationUserId = admin.Id,
                    Type = "comment",
                    Title = "💬 Yeni Blog Şərhi",
                    Message = $"{request.AuthorName} adlı istifadəçi '{blog.Title}' bloquna yeni şərh yazdı."
                });
            }

            return new BlogCommentDto
            {
                Id = comment.Id,
                BlogId = comment.BlogId,
                AuthorName = comment.AuthorName,
                Content = comment.Content,
                VisitorEmail = comment.VisitorEmail,
                CreatedAt = comment.CreatedAt
            };
        }
    }
}
