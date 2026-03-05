using Hospital.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface ILabResultRepository : IGenericRepository<LabResult>
    {
        Task<IEnumerable<LabResult>> GetByPatientIdAsync(int patientId);
        Task<IEnumerable<LabResult>> GetByDoctorIdAsync(int doctorId);
        Task<LabResult?> GetWithItemsAsync(int id);
    }
}
