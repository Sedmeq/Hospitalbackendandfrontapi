using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Blog.Queries
{
    public class GetBlogsByCategoryQuery : IRequest<IEnumerable<BlogDto>>
    {
        public string Category { get; set; } = string.Empty;
    }
}