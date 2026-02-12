using Hospital.Application.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Features.Blog.Queries
{
    public class SearchBlogsQuery : IRequest<IEnumerable<BlogDto>>
    {
        public string SearchTerm { get; set; } = string.Empty;
    }
}
