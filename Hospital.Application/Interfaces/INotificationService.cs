using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.Interfaces
{
    public interface INotificationService
    {
        
        Task SendLowStockAlertAsync(string medicineName, int currentQuantity);
        Task ChangePasswordAlertAsync(string email);
        Task SendreminderBeforeAppiontmentByHour(String email);


        // Hospital.Application/Interfaces/INotificationService.cs
        Task SendAppointmentConfirmedAsync(string patientEmail, string patientName, string doctorName, DateTime appointmentDate, string appointmentTime);
    }
}
