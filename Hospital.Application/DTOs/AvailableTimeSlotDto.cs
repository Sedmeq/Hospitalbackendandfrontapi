using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hospital.Application.DTOs
{
    public class AvailableTimeSlotDto
    {
        public DateTime Date { get; set; }
        public string Time { get; set; } = string.Empty; // "09:00"
        public bool IsAvailable { get; set; }
    }
}
