using Hospital.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface IDoctorScheduleRepository : IGenericRepository<DoctorSchedule>
    {
        Task<IEnumerable<DoctorSchedule>> GetSchedulesByDoctorIdAsync(int doctorId);
        Task<DoctorSchedule?> GetScheduleByDoctorAndDayAsync(int doctorId, DayOfWeek dayOfWeek);
        Task<IEnumerable<DoctorSchedule>> GetActiveSchedulesByDoctorIdAsync(int doctorId);
    }
}
