using Hospital.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface IBlogRepository : IGenericRepository<Blog>
    {
        Task<IEnumerable<Blog>> GetBlogsByCategoryAsync(string category);
        Task<IEnumerable<Blog>> SearchBlogsAsync(string searchTerm);
        Task<Blog?> GetBlogWithCommentsAsync(int blogId);
        Task<IEnumerable<Blog>> GetRecentBlogsAsync(int count);
    }
}
