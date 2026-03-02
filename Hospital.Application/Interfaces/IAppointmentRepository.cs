using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hospital.Domain.Entities;

namespace Hospital.Application.Interfaces
{
    public interface IAppointmentRepository : IGenericRepository<Appointment>
    {
        Task<IEnumerable<Appointment>> GetAppointmentsByPatientIdAsync(int patientId);
        Task<IEnumerable<Appointment>> GetUpcomingAppointmentsWithinOneHourAsync();
        Task<IEnumerable<Appointment>> GetPatientAppointmentsById(int id);


        //new
        Task<List<string>> GetBookedTimesAsync(int doctorId, DateTime date);
        Task<bool> IsSlotTakenAsync(int doctorId, DateTime date, string time);
    }
}
