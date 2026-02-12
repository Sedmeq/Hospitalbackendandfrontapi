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
    public class DoctorEducationRepository : GenericRepository<DoctorEducation>, IDoctorEducationRepository
    {
        public DoctorEducationRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<DoctorEducation>> GetEducationsByDoctorIdAsync(int doctorId)
        {
            return await _context.DoctorEducations
                .Where(e => e.DoctorId == doctorId)
                .OrderBy(e => e.Year)
                .ToListAsync();
        }
    }
}
