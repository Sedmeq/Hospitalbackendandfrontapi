using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Application.Interfaces;
using Hospital.Domain.Entities;
using Hospital.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Hospital.Infrastructure.Repositories
{
    //public class PrescriptionRepository : GenericRepository<Prescription>, IPrescriptionRepository
    //{
    //    public PrescriptionRepository(AppDbContext context) : base(context)
    //    {
    //    }

    //    public new async Task<Prescription?> GetByIdAsync(int id)
    //    {
    //        return await _context.Prescriptions
    //        .Include(p => p.Patient)
    //            .ThenInclude(patient => patient.ApplicationUser)
    //        .Include(p => p.Doctor)
    //            .ThenInclude(doctor => doctor.ApplicationUser)
    //        .Include(p => p.PrescribedMedicines)
    //        .FirstOrDefaultAsync(p => p.PrescriptionId == id);
    //    }
    //}

    public class PrescriptionRepository : IPrescriptionRepository
    {
        private readonly AppDbContext _context;

        public PrescriptionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Prescription> GetByIdAsync(int id)
        {
            return await _context.Prescriptions
                .Include(p => p.PrescribedMedicines)
                .Include(p => p.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Include(p => p.Patient)
                    .ThenInclude(p => p.ApplicationUser)
                .Include(p => p.Appointment)
                    .ThenInclude(a => a.Department)
                .FirstOrDefaultAsync(p => p.PrescriptionId == id);
        }

        public async Task<IEnumerable<Prescription>> GetByPatientIdAsync(int patientId)
        {
            return await _context.Prescriptions
                .Include(p => p.PrescribedMedicines)
                .Include(p => p.Doctor)
                    .ThenInclude(d => d.ApplicationUser)
                .Include(p => p.Appointment)
                    .ThenInclude(a => a.Department)
                .Where(p => p.PatientId == patientId)
                .OrderByDescending(p => p.PrescriptionDate)
                .ToListAsync();
        }

        //new add
        public async Task<Prescription?> GetByAppointmentIdAsync(int appointmentId)
        {
            return await _context.Prescriptions
                .FirstOrDefaultAsync(x => x.AppointmentId == appointmentId);
        }

        public async Task AddAsync(Prescription prescription)
        {
            await _context.Prescriptions.AddAsync(prescription);
        }

        public async Task UpdateAsync(Prescription prescription)
        {
            _context.Prescriptions.Update(prescription);
        }
    }
}
