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
    public class FaqRepository : GenericRepository<Faq>, IFaqRepository
    {
        public FaqRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Faq>> GetActiveFaqsAsync()
        {
            return await _context.Faqs
                .Where(f => f.IsActive)
                .OrderBy(f => f.Order)
                .ToListAsync();
        }

        public async Task<IEnumerable<Faq>> GetFaqsOrderedAsync()
        {
            return await _context.Faqs
                .OrderBy(f => f.Order)
                .ToListAsync();
        }
    }
}
