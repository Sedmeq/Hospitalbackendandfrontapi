using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Blog.Command
{
    public class DeleteBlogCommentCommand : IRequest<Unit>
    {
        public int CommentId { get; set; }
    }
}
