using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Domain.Entities;

namespace Hospital.Application.Interfaces
{
    public interface IPrescriptionRepository
    {
        Task<Prescription> GetByIdAsync(int id);
        Task<IEnumerable<Prescription>> GetByPatientIdAsync(int patientId);
        Task AddAsync(Prescription prescription);
        Task UpdateAsync(Prescription prescription);

        Task<Prescription?> GetByAppointmentIdAsync(int appointmentId);
    }
}
