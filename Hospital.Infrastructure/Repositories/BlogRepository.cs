using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using Hospital.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Infrastructure.Repositories
{
    public class BlogRepository : GenericRepository<Blog>, IBlogRepository
    {
        public BlogRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Blog>> GetBlogsByCategoryAsync(string category)
        {
            return await _context.Blogs
                .Include(b => b.Comments)
                .Where(b => b.Category.ToLower() == category.ToLower())
                .OrderByDescending(b => b.PublishedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Blog>> SearchBlogsAsync(string searchTerm)
        {
            return await _context.Blogs
                .Include(b => b.Comments)
                .Where(b => b.Title.Contains(searchTerm) || b.Content.Contains(searchTerm))
                .OrderByDescending(b => b.PublishedDate)
                .ToListAsync();
        }

        public async Task<Blog?> GetBlogWithCommentsAsync(int blogId)
        {
            return await _context.Blogs
                .Include(b => b.Comments)
                .FirstOrDefaultAsync(b => b.Id == blogId);
        }

        public async Task<IEnumerable<Blog>> GetRecentBlogsAsync(int count)
        {
            return await _context.Blogs
                .Include(b => b.Comments)
                .OrderByDescending(b => b.PublishedDate)
                .Take(count)
                .ToListAsync();
        }

        public new async Task<Blog?> GetByIdAsync(int id)
        {
            return await _context.Blogs
                .Include(b => b.Comments)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public new async Task<IEnumerable<Blog>> GetAllAsync()
        {
            return await _context.Blogs
                .Include(b => b.Comments)
                .OrderByDescending(b => b.PublishedDate)
                .ToListAsync();
        }
    }
}
