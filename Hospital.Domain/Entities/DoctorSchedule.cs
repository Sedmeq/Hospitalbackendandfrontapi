using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Domain.Entities
{
    public class DoctorSchedule
    {
        public int Id { get; set; }

        public int DoctorId { get; set; }
        public virtual Doctor Doctor { get; set; }

        // Həftənin günü (0=Sunday, 1=Monday, ..., 6=Saturday)
        public DayOfWeek DayOfWeek { get; set; }

        // Başlama vaxtı (məs: "09:00")
        public TimeSpan StartTime { get; set; }

        // Bitmə vaxtı (məs: "17:00")
        public TimeSpan EndTime { get; set; }

        // Aktiv/deaktiv
        public bool IsActive { get; set; } = true;

        // Müraciət müddəti (dəqiqələrlə, default 30 dəqiqə)
        public int SlotDurationMinutes { get; set; } = 30;
    }
}
