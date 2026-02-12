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
    public class DoctorSkillRepository : GenericRepository<DoctorSkill>, IDoctorSkillRepository
    {
        public DoctorSkillRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<DoctorSkill>> GetSkillsByDoctorIdAsync(int doctorId)
        {
            return await _context.DoctorSkills
                .Where(s => s.DoctorId == doctorId)
                .OrderBy(s => s.Category)
                .ThenBy(s => s.SkillName)
                .ToListAsync();
        }

        public async Task<IEnumerable<DoctorSkill>> GetSkillsByCategoryAsync(int doctorId, string category)
        {
            return await _context.DoctorSkills
                .Where(s => s.DoctorId == doctorId && s.Category == category)
                .OrderBy(s => s.SkillName)
                .ToListAsync();
        }
    }
}
