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
    public class AboutSectionRepository : GenericRepository<AboutSection>, IAboutSectionRepository
    {
        public AboutSectionRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<AboutSection?> GetActiveAboutSectionAsync()
        {
            // Ən son əlavə edilmiş haqqımızda məlumatını qaytarır
            return await _context.AboutSections
                .OrderByDescending(a => a.Id)
                .FirstOrDefaultAsync();
        }
    }
}
