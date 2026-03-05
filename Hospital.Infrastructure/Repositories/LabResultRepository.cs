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
    public class LabResultRepository : GenericRepository<LabResult>, ILabResultRepository
    {
        public LabResultRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<LabResult>> GetByPatientIdAsync(int patientId)
        {
            return await _context.LabResults
                .Include(lr => lr.Items)
                .Include(lr => lr.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Include(lr => lr.Patient)
                    .ThenInclude(p => p.ApplicationUser)
                .Where(lr => lr.PatientId == patientId)
                .OrderByDescending(lr => lr.ResultDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<LabResult>> GetByDoctorIdAsync(int doctorId)
        {
            return await _context.LabResults
                .Include(lr => lr.Items)
                .Include(lr => lr.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Include(lr => lr.Patient)
                    .ThenInclude(p => p.ApplicationUser)
                .Where(lr => lr.DoctorId == doctorId)
                .OrderByDescending(lr => lr.ResultDate)
                .ToListAsync();
        }

        public async Task<LabResult?> GetWithItemsAsync(int id)
        {
            return await _context.LabResults
                .Include(lr => lr.Items)
                .Include(lr => lr.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Include(lr => lr.Patient)
                    .ThenInclude(p => p.ApplicationUser)
                .Include(lr => lr.Appointment)
                .FirstOrDefaultAsync(lr => lr.Id == id);
        }
    }
}
