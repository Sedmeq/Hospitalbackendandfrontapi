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
    public class DoctorScheduleRepository : GenericRepository<DoctorSchedule>, IDoctorScheduleRepository
    {
        public DoctorScheduleRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<DoctorSchedule>> GetSchedulesByDoctorIdAsync(int doctorId)
        {
            return await _context.DoctorSchedules
                .Include(ds => ds.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Where(ds => ds.DoctorId == doctorId)
                .OrderBy(ds => ds.DayOfWeek)
                .ThenBy(ds => ds.StartTime)
                .ToListAsync();
        }

        public async Task<DoctorSchedule?> GetScheduleByDoctorAndDayAsync(int doctorId, DayOfWeek dayOfWeek)
        {
            return await _context.DoctorSchedules
                .FirstOrDefaultAsync(ds => ds.DoctorId == doctorId && ds.DayOfWeek == dayOfWeek && ds.IsActive);
        }

        public async Task<IEnumerable<DoctorSchedule>> GetActiveSchedulesByDoctorIdAsync(int doctorId)
        {
            return await _context.DoctorSchedules
                .Include(ds => ds.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Where(ds => ds.DoctorId == doctorId && ds.IsActive)
                .OrderBy(ds => ds.DayOfWeek)
                .ThenBy(ds => ds.StartTime)
                .ToListAsync();
        }
    }
}
